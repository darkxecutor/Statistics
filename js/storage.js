const AppStorage = (() => {
    const KEYS = {
        session: 'stats_session',
        dailyData: 'stats_daily_data',
        settings: 'stats_settings',
    };
    const get = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch { return fallback; } };
    const set = (key, val) => localStorage.setItem(key, JSON.stringify(val));

    return {
        saveUser: (user) => set(KEYS.session, user),
        getUser: () => get(KEYS.session, null),
        clearSession: () => localStorage.removeItem(KEYS.session),
        
        saveDay: (dayObj) => {
            const data = get(KEYS.dailyData, []);
            const idx = data.findIndex(d => d.date === dayObj.date);
            if (idx >= 0) data[idx] = dayObj;
            else data.push(dayObj);
            set(KEYS.dailyData, data);
        },
        getDays: () => get(KEYS.dailyData, []),
        getDay: (date) => get(KEYS.dailyData, []).find(d => d.date === date),
        
        getSettings: () => get(KEYS.settings, { monthlyReward: 'اذهب لرحلة أو اشترِ شيئاً تحبه!' }),
        saveSettings: (s) => set(KEYS.settings, s),
    };
})();

// دالة التنبيهات (Toast) للاستخدام العام
function showToast(msg, type = 'success') {
    const el = document.getElementById('toast');
    if (!el) return;
    el.textContent = msg;
    el.className = `toast show ${type}`;
    clearTimeout(el._t);
    el._t = setTimeout(() => { el.className = `toast ${type}`; }, 2500);
}
