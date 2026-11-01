/* ============================================================
   storage.js — إدارة البيانات والحفظ التلقائي
   ============================================================ */
'use strict';

const Store = (function () {

  const NAMESPACE = 'statistics_v1';
  const SESSION_KEY = NAMESPACE + '::session';

  /* ---------- الحالة الافتراضية ---------- */
  function defaultState(user) {
    return {
      version: 1,
      user: user || null,
      settings: {
        reward: '',
        rewardValue: '',
        target: 85,
        minTasks: 20
      },
      days: {},
      customTables: [],
      awardsShown: {},
      createdAt: new Date().toISOString()
    };
  }

  let state = null;
  let dataKey = null;

  /* ---------- مساعدات ---------- */
  function uid(prefix) {
    return (prefix || 'id') + '_' +
      Date.now().toString(36) + '_' +
      Math.random().toString(36).slice(2, 8);
  }

  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  /** مفتاح اليوم YYYY-MM-DD بالتوقيت المحلي */
  function dateKey(d) {
    const x = d instanceof Date ? d : new Date(d);
    return x.getFullYear() + '-' + pad(x.getMonth() + 1) + '-' + pad(x.getDate());
  }

  function monthKey(d) {
    const x = d instanceof Date ? d : new Date(d);
    return x.getFullYear() + '-' + pad(x.getMonth() + 1);
  }

  /** بداية الأسبوع = السبت */
  function startOfWeek(d) {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    const diff = (x.getDay() + 1) % 7; // السبت = 0
    x.setDate(x.getDate() - diff);
    return x;
  }

  function startOfMonth(d) {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    x.setDate(1);
    return x;
  }

  function addDays(d, n) {
    const x = new Date(d);
    x.setDate(x.getDate() + n);
    return x;
  }

  function addMonths(d, n) {
    const x = new Date(d);
    x.setDate(1);
    x.setMonth(x.getMonth() + n);
    return x;
  }

  /* ---------- أسماء عربية ---------- */
  const AR_DAYS = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  const AR_MONTHS = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
                     'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];

  function formatArabicDate(d) {
    return AR_DAYS[d.getDay()] + ' ' + d.getDate() + ' ' +
           AR_MONTHS[d.getMonth()] + ' ' + d.getFullYear();
  }

  function formatArabicMonth(d) {
    return AR_MONTHS[d.getMonth()] + ' ' + d.getFullYear();
  }

  /* ---------- المهام ---------- */
  function makeTask() {
    return { id: uid('t'), title: '', start: '', duration: 0, done: null };
  }

  function makeTasks(n) {
    const arr = [];
    for (let i = 0; i < n; i++) arr.push(makeTask());
    return arr;
  }

  /** إنشاء يوم جديد إذا لم يوجد (بالحد الأدنى من المهام) */
  function ensureDay(key) {
    if (!state.days[key]) {
      const min = Math.max(2, state.settings.minTasks || 20);
      const per = Math.ceil(min / 2);
      state.days[key] = { morning: makeTasks(per), evening: makeTasks(per) };
      save();
    }
    return state.days[key];
  }

  function tasksOf(day) {
    if (!day) return [];
    return [].concat(day.morning || [], day.evening || []);
  }

  function titledTasks(day) {
    return tasksOf(day).filter(t => (t.title || '').trim().length > 0);
  }

  /* ---------- الحسابات ---------- */
  function dayStats(day) {
    const ts = titledTasks(day);
    const done = ts.filter(t => t.done === 1).length;
    const failed = ts.filter(t => t.done === 0).length;
    const pending = ts.length - done - failed;
    const pct = ts.length ? Math.round((done / ts.length) * 100) : 0;
    return { total: ts.length, done, failed, pending, pct };
  }

  function rangeStats(fromDate, daysCount) {
    const acc = { total: 0, done: 0, failed: 0, pending: 0, pct: 0 };
    for (let i = 0; i < daysCount; i++) {
      const k = dateKey(addDays(fromDate, i));
      const s = dayStats(state.days[k]);
      acc.total += s.total;
      acc.done += s.done;
      acc.failed += s.failed;
      acc.pending += s.pending;
    }
    acc.pct = acc.total ? Math.round((acc.done / acc.total) * 100) : 0;
    return acc;
  }

  function monthDays(d) {
    const first = startOfMonth(d);
    const next = addMonths(first, 1);
    const out = [];
    let cur = new Date(first);
    while (cur < next) {
      out.push(new Date(cur));
      cur = addDays(cur, 1);
    }
    return out;
  }

  function monthStats(d) {
    const acc = { total: 0, done: 0, failed: 0, pending: 0, pct: 0 };
    monthDays(d).forEach(day => {
      const s = dayStats(state.days[dateKey(day)]);
      acc.total += s.total;
      acc.done += s.done;
      acc.failed += s.failed;
      acc.pending += s.pending;
    });
    acc.pct = acc.total ? Math.round((acc.done / acc.total) * 100) : 0;
    return acc;
  }

  function activeDaysCount() {
    return Object.keys(state.days).filter(k => dayStats(state.days[k]).total > 0).length;
  }

  function globalStats() {
    let total = 0, done = 0;
    Object.keys(state.days).forEach(k => {
      const s = dayStats(state.days[k]);
      total += s.total;
      done += s.done;
    });
    return { total, done, pct: total ? Math.round((done / total) * 100) : 0 };
  }

  /* ---------- الجلسة ---------- */
  function saveSession(user) {
    try { localStorage.setItem(SESSION_KEY, JSON.stringify(user)); } catch (e) {}
  }

  function readSession() {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }

  function clearSession() {
    try { localStorage.removeItem(SESSION_KEY); } catch (e) {}
  }

  /* ---------- تحميل / حفظ ---------- */
  function userKey(user) {
    return (user && (user.sub || user.email)) || 'local_guest';
  }

  function loadFor(user) {
    dataKey = NAMESPACE + '::' + userKey(user);
    let loaded = null;
    try {
      const raw = localStorage.getItem(dataKey);
      if (raw) loaded = JSON.parse(raw);
    } catch (e) { loaded = null; }

    if (!loaded || typeof loaded !== 'object') {
      state = defaultState(user);
    } else {
      state = Object.assign(defaultState(user), loaded);
      state.user = user;
      state.settings = Object.assign(defaultState(user).settings, loaded.settings || {});
      if (!state.days) state.days = {};
      if (!Array.isArray(state.customTables)) state.customTables = [];
      if (!state.awardsShown) state.awardsShown = {};
    }
    saveSession(user);
    save();
    return state;
  }

  function save() {
    if (!dataKey || !state) return;
    try {
      localStorage.setItem(dataKey, JSON.stringify(state));
    } catch (e) {
      console.warn('تعذّر حفظ البيانات', e);
    }
  }

  function replaceState(newState, user) {
    state = Object.assign(defaultState(user), newState);
    state.user = user;
    save();
  }

  function wipe() {
    if (dataKey) {
      try { localStorage.removeItem(dataKey); } catch (e) {}
    }
  }

  /* ---------- واجهة عامة ---------- */
  return {
    get state() { return state; },
    uid, dateKey, monthKey, startOfWeek, startOfMonth, addDays, addMonths,
    formatArabicDate, formatArabicMonth, AR_DAYS, AR_MONTHS,
    makeTask, makeTasks, ensureDay, tasksOf, titledTasks,
    dayStats, rangeStats, monthStats, monthDays, activeDaysCount, globalStats,
    loadFor, save, replaceState, wipe,
    saveSession, readSession, clearSession,
    defaultState
  };
})();
