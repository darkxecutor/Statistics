/* ============================================================
   app.js — منطق التطبيق والواجهات
   ============================================================ */
'use strict';

(function () {

  /* ============================================================
     الحالة المؤقتة للواجهة
     ============================================================ */
  const UI = {
    currentDay: new Date(),
    currentWeek: Store.startOfWeek(new Date()),
    currentMonth: Store.startOfMonth(new Date()),
    activeView: 'dashboard',
    chartTimer: null
  };

  /* ============================================================
     أدوات مساعدة
     ============================================================ */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.from((root || document).querySelectorAll(sel)); }

  function escapeHtml(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function showToast(msg, type) {
    const cont = document.getElementById('toast-container');
    if (!cont) return;
    const t = document.createElement('div');
    t.className = 'toast ' + (type || '');
    t.textContent = msg;
    cont.appendChild(t);
    setTimeout(() => {
      t.classList.add('out');
      setTimeout(() => t.remove(), 320);
    }, 2600);
  }

  function debounce(fn, wait) {
    let timer = null;
    return function () {
      const args = arguments, ctx = this;
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(ctx, args), wait);
    };
  }

  function pctClass(p) {
    if (p >= 85) return 'ok';
    if (p >= 50) return 'mid';
    return 'low';
  }

  /* ============================================================
     التهيئة العامة
     ============================================================ */
  function boot() {
    initTypingEffects();
    initButtonSounds();
    bindLoginEvents();

    const session = Store.readSession();
    if (session) {
      startApp(session);
    } else {
      showLogin();
    }

    Auth.init((user) => {
      Store.saveSession(user);
      startApp(user);
    });
  }

  /* ============================================================
     شاشة الدخول
     ============================================================ */
  function bindLoginEvents() {
    const demoBtn = document.getElementById('demo-login');
    const demoInput = document.getElementById('demo-name');

    if (demoBtn) {
      demoBtn.addEventListener('click', () => {
        const name = (demoInput && demoInput.value.trim()) || 'مستخدم محلي';
        const user = {
          sub: 'local_' + name.replace(/\s+/g, '_'),
          name: name,
          email: '',
          picture: ''
        };
        Store.saveSession(user);
        startApp(user);
      });
    }

    if (demoInput) {
      demoInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          if (demoBtn) demoBtn.click();
        }
      });
    }
  }

  function showLogin() {
    const login = document.getElementById('login-screen');
    const app = document.getElementById('app');
    if (login) login.classList.remove('hidden');
    if (app) app.classList.add('hidden');
  }

  function showApp() {
    const login = document.getElementById('login-screen');
    const app = document.getElementById('app');
    if (login) login.classList.add('hidden');
    if (app) app.classList.remove('hidden');
  }

  /* ============================================================
     بدء التطبيق بعد الدخول
     ============================================================ */
  function startApp(user) {
    Store.loadFor(user);
    showApp();
    renderUserChip(user);
    bindAppEvents();
    renderAll();
    showToast('مرحبًا ' + (user.name || '') + ' 👋', 'ok');
  }

  function renderUserChip(user) {
    const nameEl = document.getElementById('user-name');
    const avatarEl = document.getElementById('user-avatar');
    if (nameEl) nameEl.textContent = user.name || 'مستخدم';
    if (avatarEl && user.picture) avatarEl.src = user.picture;
  }

  /* ============================================================
     ربط أحداث التطبيق (مرة واحدة)
     ============================================================ */
  let appEventsBound = false;

  function bindAppEvents() {
    if (appEventsBound) return;
    appEventsBound = true;

    /* التبويبات */
    const tabs = document.getElementById('main-tabs');
    if (tabs) {
      tabs.addEventListener('click', (e) => {
        const btn = e.target.closest('.tab');
        if (!btn) return;
        switchView(btn.dataset.view);
      });
    }

    /* تسجيل الخروج */
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        Auth.logout();
        location.reload();
      });
    }

    /* التنقل بين الأيام */
    const dayPrev = document.getElementById('day-prev');
    const dayNext = document.getElementById('day-next');
    const dayToday = document.getElementById('day-today');
    if (dayPrev) dayPrev.addEventListener('click', () => {
      UI.currentDay = Store.addDays(UI.currentDay, -1);
      renderDaily();
    });
    if (dayNext) dayNext.addEventListener('click', () => {
      UI.currentDay = Store.addDays(UI.currentDay, 1);
      renderDaily();
    });
    if (dayToday) dayToday.addEventListener('click', () => {
      UI.currentDay = new Date();
      renderDaily();
    });

    /* التنقل بين الأسابيع */
    const weekPrev = document.getElementById('week-prev');
    const weekNext = document.getElementById('week-next');
    if (weekPrev) weekPrev.addEventListener('click', () => {
      UI.currentWeek = Store.addDays(UI.currentWeek, -7);
      renderWeekly();
    });
    if (weekNext) weekNext.addEventListener('click', () => {
      UI.currentWeek = Store.addDays(UI.currentWeek, 7);
      renderWeekly();
    });

    /* التنقل بين الأشهر */
    const monthPrev = document.getElementById('month-prev');
    const monthNext = document.getElementById('month-next');
    if (monthPrev) monthPrev.addEventListener('click', () => {
      UI.currentMonth = Store.addMonths(UI.currentMonth, -1);
      renderMonthly();
    });
    if (monthNext) monthNext.addEventListener('click', () => {
      UI.currentMonth = Store.addMonths(UI.currentMonth, 1);
      renderMonthly();
    });

    /* الجدول اليومي — تفويض الأحداث */
    const periods = document.getElementById('daily-periods');
    if (periods) {
      periods.addEventListener('input', handleDailyInput);
      periods.addEventListener('click', handleDailyClick);
    }

    /* إنشاء جدول مخصص */
    const toggleNew = document.getElementById('toggle-new-table');
    const newForm = document.getElementById('new-table-form');
    if (toggleNew && newForm) {
      toggleNew.addEventListener('click', () => newForm.classList.toggle('hidden'));
    }

    if (newForm) {
      newForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const nameEl = document.getElementById('new-table-name');
        const colsEl = document.getElementById('new-table-cols');
        const name = (nameEl.value || '').trim();
        const cols = (colsEl.value || '').split(',').map(s => s.trim()).filter(Boolean);

        if (!name) { showToast('أدخل اسم الجدول.', 'err'); return; }
        if (!cols.length) { showToast('أدخل عمودًا واحدًا على الأقل.', 'err'); return; }

        Store.state.customTables.push({
          id: Store.uid('tbl'),
          name: name,
          columns: cols,
          rows: []
        });
        Store.save();

        nameEl.value = '';
        colsEl.value = '';
        newForm.classList.add('hidden');

        renderCustomTables();
        showToast('تم إنشاء الجدول ✅', 'ok');
      });
    }

    /* الجداول المخصصة — تفويض */
    const ctContainer = document.getElementById('custom-tables');
    if (ctContainer) {
      ctContainer.addEventListener('click', handleCustomTableClick);
      ctContainer.addEventListener('input', handleCustomTableInput);
    }

    /* الإعدادات */
    const saveSettings = document.getElementById('save-settings');
    if (saveSettings) saveSettings.addEventListener('click', saveSettingsHandler);

    const exportBtn = document.getElementById('export-data');
    if (exportBtn) exportBtn.addEventListener('click', exportData);

    const importInput = document.getElementById('import-data');
    if (importInput) importInput.addEventListener('change', importData);

    const resetBtn = document.getElementById('reset-data');
    if (resetBtn) resetBtn.addEventListener('click', resetData);
  }

  /* ============================================================
     تبديل العرض
     ============================================================ */
  function switchView(view) {
    UI.activeView = view;

    $$('.tab').forEach(t => {
      t.classList.toggle('active', t.dataset.view === view);
    });

    ['dashboard', 'daily', 'weekly', 'monthly', 'settings'].forEach(v => {
      const el = document.getElementById('view-' + v);
      if (el) el.classList.toggle('hidden', v !== view);
    });

    if (view === 'dashboard') renderDashboard();
    if (view === 'daily') renderDaily();
    if (view === 'weekly') renderWeekly();
    if (view === 'monthly') renderMonthly();
    if (view === 'settings') renderSettings();
  }

  /* ============================================================
     عرض شامل
     ============================================================ */
  function renderAll() {
    renderDashboard();
    renderDaily();
    renderWeekly();
    renderMonthly();
    renderSettings();
    renderCustomTables();
  }

  /* ============================================================
     لوحة التحكم
     ============================================================ */
  function renderDashboard() {
    const st = Store.state;
    if (!st) return;

    const g = Store.globalStats();
    const today = Store.dayStats(st.days[Store.dateKey(new Date())]);
    const week = Store.rangeStats(Store.startOfWeek(new Date()), 7);
    const month = Store.monthStats(new Date());

    setText('c-done', g.done);
    setText('c-total', g.total);
    setText('c-today', today.pct + '%');
    setText('c-week', week.pct + '%');
    setText('c-month', month.pct + '%');
    setText('c-active', Store.activeDaysCount());

    const sub = document.getElementById('dashboard-subtitle');
    if (sub) sub.textContent = 'اليوم: ' + Store.formatArabicDate(new Date());

    updateCounters();

    /* مخطط آخر 7 أيام */
    const labels = [], values = [];
    const start = Store.addDays(new Date(), -6);
    for (let i = 0; i < 7; i++) {
      const d = Store.addDays(start, i);
      const s = Store.dayStats(st.days[Store.dateKey(d)]);
      labels.push(Store.AR_DAYS[d.getDay()]);
      values.push(s.pct);
    }
    Charts.bar('chart-dash-bar', labels, values, 'نسبة الإنجاز', { maxY: 100 });

    /* دائري: توزيع مهام الشهر الحالي */
    const mStats = Store.monthStats(new Date());
    Charts.pie('chart-dash-pie',
      ['منجز', 'غير منجز', 'معلّق'],
      [mStats.done, mStats.failed, mStats.pending],
      ['#3fbf7f', '#a52a4e', '#c99a1e']
    );
  }

  function updateCounters() {
    const st = Store.state;
    if (!st) return;
    const g = Store.globalStats();
    const today = Store.dayStats(st.days[Store.dateKey(new Date())]);
    const week = Store.rangeStats(Store.startOfWeek(new Date()), 7);
    const month = Store.monthStats(new Date());

    setText('c-done', g.done);
    setText('c-total', g.total);
    setText('c-today', today.pct + '%');
    setText('c-week', week.pct + '%');
    setText('c-month', month.pct + '%');
    setText('c-active', Store.activeDaysCount());
  }

  function setText(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  }

  /* ============================================================
     الجدول اليومي
     ============================================================ */
  function renderDaily() {
    const st = Store.state;
    if (!st) return;

    const key = Store.dateKey(UI.currentDay);
    const day = Store.ensureDay(key);

    const label = document.getElementById('day-label');
    if (label) label.textContent = Store.formatArabicDate(UI.currentDay);

    const stats = Store.dayStats(day);

    /* بطاقات صغيرة */
    const statsEl = document.getElementById('day-stats');
    if (statsEl) {
      statsEl.innerHTML =
        miniStat(stats.total, 'إجمالي المهام') +
        miniStat(stats.done, 'منجزة') +
        miniStat(stats.failed, 'غير منجزة') +
        miniStat(stats.pending, 'معلّقة') +
        miniStat(stats.pct + '%', 'نسبة الإنجاز');
    }

    /* الفترتان */
    const periods = document.getElementById('daily-periods');
    if (periods) {
      periods.innerHTML =
        renderPeriod('morning', 'الفترة الصباحية', '🌅', day.morning) +
        renderPeriod('evening', 'الفترة المسائية', '🌙', day.evening);
    }

    renderDailyCharts(day);
  }

  function miniStat(value, label) {
    return '<div class="mini-stat"><strong>' + value + '</strong><span>' + label + '</span></div>';
  }

  function renderPeriod(periodKey, title, icon, tasks) {
    let rows = '';
    tasks.forEach((t, i) => {
      rows += renderTaskRow(periodKey, t, i);
    });

    return `
      <div class="card period">
        <div class="period-head">
          <h3><span class="period-icon">${icon}</span> ${title}</h3>
          <span class="period-count">${tasks.length} مهمة</span>
        </div>
        <div class="task-list" data-period="${periodKey}">
          ${rows}
          <button class="btn btn-ghost" data-action="add" data-period="${periodKey}" type="button">
            + إضافة مهمة
          </button>
        </div>
      </div>
    `;
  }

  function renderTaskRow(periodKey, task, index) {
    const cls = task.done === 1 ? 'done-1' : (task.done === 0 ? 'done-0' : '');
    const okActive = task.done === 1 ? 'active' : '';
    const noActive = task.done === 0 ? 'active' : '';

    return `
      <div class="task-row ${cls}" data-id="${task.id}" data-period="${periodKey}">
        <input class="input task-title type-crack" type="text"
               placeholder="عنوان المهمة ${index + 1}"
               value="${escapeHtml(task.title)}"
               data-field="title" autocomplete="off">
        <input class="input task-start" type="time"
               value="${escapeHtml(task.start || '')}"
               data-field="start">
        <input class="input task-duration" type="number" min="0" step="5"
               placeholder="دقيقة"
               value="${task.duration || ''}"
               data-field="duration">
        <div class="task-status">
          <button class="status-btn ok ${okActive}" data-action="status" data-value="1" type="button" title="منجز">✅</button>
          <button class="status-btn no ${noActive}" data-action="status" data-value="0" type="button" title="غير منجز">❌</button>
        </div>
        <button class="task-del" data-action="delete" type="button" title="حذف">🗑</button>
      </div>
    `;
  }

  /* ---------- أحداث الجدول اليومي ---------- */
  function handleDailyInput(e) {
    const field = e.target.dataset.field;
    if (!field) return;

    const row = e.target.closest('.task-row');
    if (!row) return;

    const id = row.dataset.id;
    const period = row.dataset.period;
    const key = Store.dateKey(UI.currentDay);
    const day = Store.ensureDay(key);
    const task = (day[period] || []).find(t => t.id === id);
    if (!task) return;

    if (field === 'title') task.title = e.target.value;
    if (field === 'start') task.start = e.target.value;
    if (field === 'duration') task.duration = parseInt(e.target.value, 10) || 0;

    Store.save();
    updateCounters();
    scheduleCharts(() => renderDailyCharts(day));
  }

  function handleDailyClick(e) {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;

    const action = btn.dataset.action;
    const key = Store.dateKey(UI.currentDay);
    const day = Store.ensureDay(key);

    /* إضافة مهمة */
    if (action === 'add') {
      const period = btn.dataset.period;
      day[period].push(Store.makeTask());
      Store.save();
      renderDaily();
      return;
    }

    const row = btn.closest('.task-row');
    if (!row) return;

    const id = row.dataset.id;
    const period = row.dataset.period;
    const list = day[period] || [];
    const idx = list.findIndex(t => t.id === id);
    if (idx === -1) return;

    if (action === 'status') {
      const val = parseInt(btn.dataset.value, 10);
      list[idx].done = (list[idx].done === val) ? null : val;
      if (list[idx].done === 1) playSuccess();
      Store.save();
      renderDaily();
      return;
    }

    if (action === 'delete') {
      list.splice(idx, 1);
      Store.save();
      renderDaily();
      showToast('تم حذف المهمة');
      return;
    }
  }

  function scheduleCharts(fn) {
    clearTimeout(UI.chartTimer);
    UI.chartTimer = setTimeout(fn, 350);
  }

  /* ---------- مخططات اليوم ---------- */
  function renderDailyCharts(day) {
    const tasks = Store.titledTasks(day);

    /* عمودي: أعلى 7 مهام من حيث المدة */
    const withDuration = tasks
      .filter(t => (t.duration || 0) > 0)
      .sort((a, b) => b.duration - a.duration)
      .slice(0, 7);

    if (withDuration.length) {
      Charts.bar(
        'chart-daily-bar',
        withDuration.map((t, i) => t.title || ('مهمة ' + (i + 1))),
        withDuration.map(t => t.duration),
        'المدة (دقيقة)'
      );
    } else {
      Charts.bar('chart-daily-bar', [], [], 'المدة (دقيقة)');
    }

    /* دائري: توزيع المدة على المهام */
    const pieItems = Charts.preparePie(
      tasks.filter(t => (t.duration || 0) > 0)
           .map(t => ({ label: t.title, value: t.duration })),
      10
    );

    Charts.pie(
      'chart-daily-pie',
      pieItems.map(i => i.label),
      pieItems.map(i => i.value)
    );
  }

  /* ============================================================
     الجدول الأسبوعي
     ============================================================ */
  function renderWeekly() {
    const st = Store.state;
    if (!st) return;

    const start = UI.currentWeek;
    const end = Store.addDays(start, 6);

    const label = document.getElementById('week-label');
    if (label) {
      label.textContent = 'من ' + Store.formatArabicDate(start) + ' إلى ' + Store.formatArabicDate(end);
    }

    const stats = Store.rangeStats(start, 7);

    const statsEl = document.getElementById('week-stats');
    if (statsEl) {
      statsEl.innerHTML =
        miniStat(stats.total, 'إجمالي المهام') +
        miniStat(stats.done, 'منجزة') +
        miniStat(stats.failed, 'غير منجزة') +
        miniStat(stats.pending, 'معلّقة') +
        miniStat(stats.pct + '%', 'نسبة الأسبوع');
    }

    /* المخطط العمودي */
    const labels = [], values = [];
    for (let i = 0; i < 7; i++) {
      const d = Store.addDays(start, i);
      const s = Store.dayStats(st.days[Store.dateKey(d)]);
      labels.push(Store.AR_DAYS[d.getDay()]);
      values.push(s.pct);
    }
    Charts.bar('chart-week-bar', labels, values, 'نسبة الإنجاز', { maxY: 100 });

    /* المخطط الدائري */
    Charts.pie('chart-week-pie',
      ['منجز', 'غير منجز', 'معلّق'],
      [stats.done, stats.failed, stats.pending],
      ['#3fbf7f', '#a52a4e', '#c99a1e']
    );

    /* جدول التفصيل */
    const tbody = document.getElementById('week-table-body');
    if (tbody) {
      let html = '';
      for (let i = 0; i < 7; i++) {
        const d = Store.addDays(start, i);
        const s = Store.dayStats(st.days[Store.dateKey(d)]);
        html += `
          <tr>
            <td>${Store.formatArabicDate(d)}</td>
            <td>${s.total}</td>
            <td>${s.done}</td>
            <td>${s.failed}</td>
            <td>${s.pending}</td>
            <td><span class="pct-pill">${s.pct}%</span></td>
          </tr>
        `;
      }
      tbody.innerHTML = html;
    }
  }

  /* ============================================================
     الجدول الشهري
     ============================================================ */
  function renderMonthly() {
    const st = Store.state;
    if (!st) return;

    const monthStart = UI.currentMonth;
    const label = document.getElementById('month-label');
    if (label) label.textContent = Store.formatArabicMonth(monthStart);

    const stats = Store.monthStats(monthStart);

    /* المكافأة */
    renderRewardBanner(stats, monthStart);

    const statsEl = document.getElementById('month-stats');
    if (statsEl) {
      statsEl.innerHTML =
        miniStat(stats.total, 'إجمالي المهام') +
        miniStat(stats.done, 'منجزة') +
        miniStat(stats.failed, 'غير منجزة') +
        miniStat(stats.pending, 'معلّقة') +
        miniStat(stats.pct + '%', 'نسبة الشهر');
    }

    /* أسابيع الشهر */
    const weeks = weeksOfMonth(monthStart);

    const labels = [], values = [], rowsHtml = [];
    weeks.forEach((w, i) => {
      const s = Store.rangeStats(w.start, w.days);
      labels.push('أسبوع ' + (i + 1));
      values.push(s.pct);

      rowsHtml.push(`
        <tr>
          <td>أسبوع ${i + 1}<br><span class="muted" style="font-size:.72rem">
            ${Store.formatArabicDate(w.start)}
          </span></td>
          <td>${s.total}</td>
          <td>${s.done}</td>
          <td>${s.failed}</td>
          <td>${s.pending}</td>
          <td><span class="pct-pill">${s.pct}%</span></td>
        </tr>
      `);
    });

    Charts.bar('chart-month-bar', labels, values, 'نسبة الإنجاز', { maxY: 100 });

    Charts.pie('chart-month-pie',
      ['منجز', 'غير منجز', 'معلّق'],
      [stats.done, stats.failed, stats.pending],
      ['#3fbf7f', '#a52a4e', '#c99a1e']
    );

    const tbody = document.getElementById('month-table-body');
    if (tbody) tbody.innerHTML = rowsHtml.join('');
  }

  /** تقسيم الشهر إلى أسابيع (بداية السبت) */
  function weeksOfMonth(monthStart) {
    const first = Store.startOfMonth(monthStart);
    const next = Store.addMonths(first, 1);
    const out = [];
    let cursor = Store.startOfWeek(first);

    while (cursor < next) {
      const weekStart = new Date(cursor);
      let days = 0;
      for (let i = 0; i < 7; i++) {
        const d = Store.addDays(weekStart, i);
        if (d >= first && d < next) days++;
      }
      if (days > 0) out.push({ start: weekStart, days: days });
      cursor = Store.addDays(cursor, 7);
    }
    return out;
  }

  /** شارة المكافأة */
  function renderRewardBanner(stats, monthDate) {
    const holder = document.getElementById('monthly-reward');
    if (!holder) return;

    const target = Store.state.settings.target || 85;
    const reward = Store.state.settings.reward || '';
    const rewardValue = Store.state.settings.rewardValue || '';

    if (stats.pct >= target && stats.total > 0) {
      holder.innerHTML = `
        <div class="reward-banner">
          <div class="rb-icon">🏆</div>
          <div>
            <h4>تهانينا! تجاوزت هدف الشهر</h4>
            <p>
              وصلت نسبة إنجاز ${Store.formatArabicMonth(monthDate)} إلى
              <strong>${stats.pct}%</strong> — حان وقت مكافأة نفسك.
              ${reward ? 'مكافأتك: <strong>' + escapeHtml(reward) + '</strong>' : ''}
              ${rewardValue ? ' (' + escapeHtml(rewardValue) + ')' : ''}
            </p>
          </div>
        </div>
      `;
    } else {
      holder.innerHTML = '';
    }
  }

  /* ============================================================
     الإعدادات
     ============================================================ */
  function renderSettings() {
    const st = Store.state;
    if (!st) return;

    const user = st.user || {};
    const info = document.getElementById('account-info');
    if (info) {
      const pic = user.picture ||
        "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 56 56'><rect width='56' height='56' fill='%231f1f1f'/><circle cx='28' cy='21' r='10' fill='%23f4c430'/><path d='M8 50c3-10 13-15 20-15s17 5 20 15z' fill='%23f4c430'/></svg>";
      info.innerHTML = `
        <img src="${pic}" alt="صورة الحساب">
        <div class="ai-text">
          <strong>${escapeHtml(user.name || 'مستخدم')}</strong>
          <span>${escapeHtml(user.email || 'حساب محلي على هذا الجهاز')}</span>
        </div>
      `;
    }

    const reward = document.getElementById('set-reward');
    const rewardValue = document.getElementById('set-reward-value');
    const target = document.getElementById('set-target');
    const minTasks = document.getElementById('set-min');

    if (reward) reward.value = st.settings.reward || '';
    if (rewardValue) rewardValue.value = st.settings.rewardValue || '';
    if (target) target.value = st.settings.target || 85;
    if (minTasks) minTasks.value = st.settings.minTasks || 20;
  }

  function saveSettingsHandler() {
    const st = Store.state;
    if (!st) return;

    const reward = document.getElementById('set-reward');
    const rewardValue = document.getElementById('set-reward-value');
    const target = document.getElementById('set-target');
    const minTasks = document.getElementById('set-min');

    st.settings.reward = reward ? reward.value.trim() : '';
    st.settings.rewardValue = rewardValue ? rewardValue.value.trim() : '';

    let t = target ? parseInt(target.value, 10) : 85;
    if (isNaN(t) || t < 1) t = 85;
    if (t > 100) t = 100;
    st.settings.target = t;

    let m = minTasks ? parseInt(minTasks.value, 10) : 20;
    if (isNaN(m) || m < 1) m = 20;
    if (m > 200) m = 200;
    st.settings.minTasks = m;

    Store.save();
    showToast('تم حفظ الإعدادات ✅', 'ok');
    renderDashboard();
  }

  /* ---------- تصدير / استيراد / حذف ---------- */
  function exportData() {
    try {
      const data = JSON.stringify(Store.state, null, 2);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'statistics-backup-' + Store.dateKey(new Date()) + '.json';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      showToast('تم تصدير النسخة الاحتياطية ✅', 'ok');
    } catch (e) {
      showToast('تعذّر التصدير.', 'err');
    }
  }

  function importData(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        if (!parsed || typeof parsed !== 'object') throw new Error('bad');

        const user = Store.state.user;
        Store.replaceState(parsed, user);
        renderAll();
        showToast('تم استيراد البيانات ✅', 'ok');
      } catch (err) {
        showToast('ملف غير صالح.', 'err');
      }
      e.target.value = '';
    };
    reader.readAsText(file);
  }

  function resetData() {
    if (!confirm('هل تريد حذف كل البيانات نهائيًا؟ لا يمكن التراجع.')) return;
    Store.wipe();
    location.reload();
  }

  /* ============================================================
     الجداول المخصصة
     ============================================================ */
  function renderCustomTables() {
    const holder = document.getElementById('custom-tables');
    if (!holder) return;

    const tables = Store.state.customTables || [];

    if (!tables.length) {
      holder.innerHTML = '<p class="muted">لا توجد جداول مخصصة بعد. أنشئ جدولك الأول.</p>';
      return;
    }

    holder.innerHTML = tables.map(tbl => {
      const head = tbl.columns.map(c => '<th>' + escapeHtml(c) + '</th>').join('');

      const rows = tbl.rows.map(row => {
        const cells = tbl.columns.map((c, ci) => `
          <td>
            <input class="input type-crack" type="text"
                   value="${escapeHtml(row.cells[ci] || '')}"
                   data-table="${tbl.id}" data-row="${row.id}" data-col="${ci}"
                   placeholder="—" autocomplete="off">
          </td>
        `).join('');
        return `<tr>${cells}<td>
          <button class="task-del" data-ct-action="del-row"
                  data-table="${tbl.id}" data-row="${row.id}" type="button">🗑</button>
        </td></tr>`;
      }).join('');

      return `
        <div class="custom-table-block" data-table-block="${tbl.id}">
          <div class="custom-table-head">
            <strong>${escapeHtml(tbl.name)}</strong>
            <div>
              <button class="btn btn-ghost" data-ct-action="add-row" data-table="${tbl.id}" type="button">+ صف</button>
              <button class="btn btn-danger" data-ct-action="del-table" data-table="${tbl.id}" type="button">حذف الجدول</button>
            </div>
          </div>
          <div class="custom-table-body">
            <table class="ctable">
              <thead><tr>${head}<th></th></tr></thead>
              <tbody>${rows || '<tr><td colspan="' + (tbl.columns.length + 1) + '" class="muted">لا توجد صفوف — أضف صفًا.</td></tr>'}</tbody>
            </table>
          </div>
        </div>
      `;
    }).join('');
  }

  function handleCustomTableClick(e) {
    const btn = e.target.closest('[data-ct-action]');
    if (!btn) return;

    const action = btn.dataset.ctAction;
    const tableId = btn.dataset.table;
    const rowId = btn.dataset.row;
    const tables = Store.state.customTables || [];
    const tbl = tables.find(t => t.id === tableId);
    if (!tbl) return;

    if (action === 'add-row') {
      const cells = {};
      tbl.columns.forEach((_, i) => cells[i] = '');
      tbl.rows.push({ id: Store.uid('row'), cells: cells });
      Store.save();
      renderCustomTables();
      return;
    }

    if (action === 'del-row') {
      tbl.rows = tbl.rows.filter(r => r.id !== rowId);
      Store.save();
      renderCustomTables();
      return;
    }

    if (action === 'del-table') {
      if (!confirm('حذف الجدول "' + tbl.name + '"؟')) return;
      Store.state.customTables = tables.filter(t => t.id !== tableId);
      Store.save();
      renderCustomTables();
      showToast('تم حذف الجدول');
    }
  }

  function handleCustomTableInput(e) {
    const target = e.target;
    if (!target.dataset.table || !target.dataset.row) return;

    const tableId = target.dataset.table;
    const rowId = target.dataset.row;
    const col = parseInt(target.dataset.col, 10);

    const tbl = (Store.state.customTables || []).find(t => t.id === tableId);
    if (!tbl) return;

    const row = tbl.rows.find(r => r.id === rowId);
    if (!row) return;

    row.cells[col] = target.value;
    Store.save();
  }

  /* ============================================================
     التشغيل
     ============================================================ */
  document.addEventListener('DOMContentLoaded', boot);

})();
