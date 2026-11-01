/* إدارة التخزين المحلي */
const Storage = (() => {
  const KEYS = {
    session: 'stats_session',
    tables: 'stats_tables',
    theme: 'stats_theme',
  };

  return {
    set(key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); return true; }
      catch (e) { console.error('Storage set error:', e); return false; }
    },
    get(key, fallback = null) {
      try {
        const v = localStorage.getItem(key);
        return v ? JSON.parse(v) : fallback;
      } catch (e) { return fallback; }
    },
    remove(key) { localStorage.removeItem(key); },
    clearAll() { localStorage.removeItem(KEYS.session); localStorage.removeItem(KEYS.tables); },

    // Session
    saveSession(user) {
      this.set(KEYS.session, { user, loginAt: Date.now() });
    },
    getSession() { return this.get(KEYS.session); },
    clearSession() { this.remove(KEYS.session); },

    // Tables
    getTables() { return this.get(KEYS.tables, []); },
    saveTable(table) {
      const tables = this.getTables();
      const idx = tables.findIndex(t => t.id === table.id);
      if (idx >= 0) tables[idx] = table;
      else tables.push(table);
      this.set(KEYS.tables, tables);
      return table;
    },
    deleteTable(id) {
      const tables = this.getTables().filter(t => t.id !== id);
      this.set(KEYS.tables, tables);
    },
    getTable(id) { return this.getTables().find(t => t.id === id); },

    // Theme
    getTheme() { return this.get(KEYS.theme, 'light'); },
    setTheme(theme) { this.set(KEYS.theme, theme); },

    // Helpers
    generateId() { return 't_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8); },
  };
})();

/* تطبيق الثيم فور تحميل الصفحة */
(function applyTheme() {
  const theme = Storage.getTheme();
  if (theme === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
})();

/* Toast */
function showToast(msg, type = 'success') {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = msg;
  el.className = 'toast show ' + type;
  clearTimeout(el._t);
  el._t = setTimeout(() => { el.className = 'toast ' + type; }, 2500);
}

/* Theme toggle مشترك */
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('themeToggle');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    if (next === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
    else document.documentElement.removeAttribute('data-theme');
    Storage.setTheme(next);
  });
});