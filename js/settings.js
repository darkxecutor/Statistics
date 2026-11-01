/* ============ منطق صفحة الإعدادات ============ */
(function () {
  if (!Auth.requireAuth()) return;

  document.addEventListener('DOMContentLoaded', () => {
    const user = Auth.getCurrentUser();
    if (user) {
      document.getElementById('settingsAvatar').src = user.picture || 'assets/images/avatar.svg';
      document.getElementById('settingsName').textContent = user.name || '—';
      document.getElementById('settingsEmail').textContent = user.email || '—';
      document.getElementById('settingsMode').textContent =
        user.mode === 'google' ? '✅ حساب Google موثّق' : '⚡ وضع تجريبي';
    }

    /* تصدير */
    document.getElementById('exportBtn')?.addEventListener('click', () => {
      const data = {
        user: Auth.getCurrentUser(),
        tables: Storage.getTables(),
        exportedAt: new Date().toISOString(),
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `stats-backup-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('تم تصدير البيانات ✅');
    });

    /* استيراد */
    document.getElementById('importInput')?.addEventListener('change', e => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = ev => {
        try {
          const data = JSON.parse(ev.target.result);
          if (Array.isArray(data.tables)) {
            data.tables.forEach(t => Storage.saveTable(t));
            showToast('تم استيراد الجداول ✅');
          } else {
            showToast('ملف غير صالح', 'error');
          }
        } catch { showToast('تعذر قراءة الملف', 'error'); }
      };
      reader.readAsText(file);
      e.target.value = '';
    });

    /* حذف الكل */
    document.getElementById('clearDataBtn')?.addEventListener('click', () => {
      if (!confirm('سيتم حذف جميع الجداول نهائيًا. متابعة؟')) return;
      Storage.clearAll();
      showToast('تم حذف البيانات');
      setTimeout(() => window.location.href = 'index.html', 800);
    });
  });
})();