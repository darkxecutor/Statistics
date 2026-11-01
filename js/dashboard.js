/* ============ منطق لوحة التحكم ============ */
(function () {
  if (!Auth.requireAuth()) return;

  /* تعبئة بيانات المستخدم */
  function fillUser() {
    const user = Auth.getCurrentUser();
    if (!user) return;
    document.getElementById('userName').textContent = user.name || 'مستخدم';
    document.getElementById('welcomeName').textContent = (user.name || '').split(' ')[0] || 'صديقي';
    const avatar = document.getElementById('userAvatar');
    if (avatar && user.picture) avatar.src = user.picture;
  }

  /* حساب العدادات */
  function computeStats(table) {
    if (!table || !table.rows) return { total: 0, done: 0, pending: 0, percent: 0 };

    const rows = table.rows.filter(r => r.some(c => (c || '').toString().trim() !== ''));
    const total = rows.length;

    // ابحث عن عمود "الحالة"
    let statusIdx = table.columns.findIndex(c => (c || '').includes('الحالة'));
    let done = 0;
    if (statusIdx === -1) {
      // بديل: عدّ الصفوف ذات نسبة 100
      rows.forEach(r => {
        const last = parseFloat(r[r.length - 1]);
        if (last === 100) done++;
      });
    } else {
      rows.forEach(r => {
        const v = (r[statusIdx] || '').toString().trim();
        if (/مكتمل|تم|done|complete/i.test(v)) done++;
      });
    }

    const pending = Math.max(total - done, 0);
    const percent = total > 0 ? Math.round((done / total) * 100) : 0;
    return { total, done, pending, percent };
  }

  /* تحديث العدادات */
  function updateStats(table) {
    const s = computeStats(table);
    const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
    set('statTotal', s.total);
    set('statDone', s.done);
    set('statPending', s.pending);
    set('statPercent', s.percent + '%');
  }

  /* قائمة التقدم */
  function updateProgressList(table) {
    const box = document.getElementById('progressList');
    if (!box) return;
    if (!table || !table.rows.length) {
      box.innerHTML = '<p class="empty-state">لا توجد بيانات بعد.</p>';
      return;
    }
    // استخدم عمود النسبة إن وُجد، وإلا احسب نسبة ثابتة
    const numIdx = (() => {
      for (let i = table.columns.length - 1; i >= 0; i--) {
        if (table.rows.some(r => !isNaN(parseFloat(r[i])))) return i;
      }
      return -1;
    })();

    box.innerHTML = '';
    table.rows.forEach(row => {
      const label = (row[0] || '').toString().trim();
      if (!label) return;
      let pct = 0;
      if (numIdx >= 0) {
        const v = parseFloat(row[numIdx]);
        if (!isNaN(v)) pct = Math.min(100, Math.max(0, v));
      }
      const item = document.createElement('div');
      item.className = 'progress-item';
      item.innerHTML = `
        <div class="progress-head"><span>${label}</span><span>${pct}%</span></div>
        <div class="progress-bar-bg"><div class="progress-bar-fill" style="width:${pct}%"></div></div>
      `;
      box.appendChild(item);
    });
  }

  /* التحديث الشامل */
  window.updateLiveViews = function () {
    const table = TableBuilder.getCurrent();
    updateStats(table);
    updateProgressList(table);
    Charts.render(table);
  };

  /* التهيئة */
  document.addEventListener('DOMContentLoaded', () => {
    fillUser();
    TableBuilder.init();
    // بعد بناء الجدول → حدّث كل شيء
    setTimeout(() => {
      if (typeof window.updateLiveViews === 'function') window.updateLiveViews();
    }, 50);
  });
})();