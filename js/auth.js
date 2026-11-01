/* ============ المصادقة ============ */
/* ⚠️ ضع Client ID الخاص بك من Google Cloud Console هنا */
const GOOGLE_CLIENT_ID = '721594580974-6lcbjft23dgqgmfunmiroju68ifvbjb2.apps.googleusercontent.com';

const Auth = (() => {

  /* فك تشفير JWT من Google */
  function parseJwt(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const json = decodeURIComponent(atob(base64).split('').map(c =>
        '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      ).join(''));
      return JSON.parse(json);
    } catch (e) { return null; }
  }

  /* معالجة استجابة Google */
  window.handleCredentialResponse = (response) => {
    const payload = parseJwt(response.credential);
    if (!payload) { showToast('تعذر قراءة بيانات Google', 'error'); return; }

    const user = {
      name: payload.name,
      email: payload.email,
      picture: payload.picture,
      mode: 'google',
    };
    Storage.saveSession(user);
    showToast('تم تسجيل الدخول بنجاح ✅');
    setTimeout(() => window.location.href = 'dashboard.html', 600);
  };

  /* تهيئة زر Google */
  function initGoogle() {
    const container = document.getElementById('g_id_signin');
    if (!container) return;

    const tryInit = (attempts = 30) => {
      if (window.google && google.accounts && google.accounts.id) {
        try {
          google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: window.handleCredentialResponse,
          });
          google.accounts.id.renderButton(container, {
            theme: 'outline',
            size: 'large',
            width: 320,
            text: 'signin_with',
            shape: 'rectangular',
            locale: 'ar',
          });
        } catch (e) {
          console.warn('Google init failed', e);
          container.innerHTML = '<p style="color:var(--text-muted);font-size:13px;">تعذر تهيئة Google — استخدم الوضع التجريبي</p>';
        }
      } else if (attempts > 0) {
        setTimeout(() => tryInit(attempts - 1), 200);
      } else {
        container.innerHTML = '<p style="color:var(--text-muted);font-size:13px;">تعذر تحميل Google — استخدم الوضع التجريبي</p>';
      }
    };
    tryInit();
  }

  /* الدخول بوضع تجريبي */
  function loginDemo() {
    const user = {
      name: 'مستخدم تجريبي',
      email: 'demo@stats.local',
      picture: 'assets/images/avatar.svg',
      mode: 'demo',
    };
    Storage.saveSession(user);
    showToast('تم الدخول بالوضع التجريبي ✅');
    setTimeout(() => window.location.href = 'dashboard.html', 500);
  }

  /* التحقق من الجلسة */
  function isLoggedIn() {
    return !!Storage.getSession();
  }

  function getCurrentUser() {
    const s = Storage.getSession();
    return s ? s.user : null;
  }

  /* إعادة التوجيه */
  function redirectIfLoggedIn() {
    if (isLoggedIn()) window.location.replace('dashboard.html');
  }

  /* حماية الصفحات */
  function requireAuth() {
    if (!isLoggedIn()) {
      window.location.replace('index.html');
      return false;
    }
    return true;
  }

  function logout() {
    Storage.clearSession();
    window.location.replace('index.html');
  }

  /* ربط الأحداث بعد التحميل */
  document.addEventListener('DOMContentLoaded', () => {
    // زر الدخول التجريبي
    const demoBtn = document.getElementById('demoBtn');
    if (demoBtn) demoBtn.addEventListener('click', loginDemo);

    // تهيئة Google
    if (document.getElementById('g_id_signin')) initGoogle();

    // زر الخروج
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) logoutBtn.addEventListener('click', () => {
      if (confirm('هل تريد تسجيل الخروج؟')) logout();
    });
  });

  return { isLoggedIn, getCurrentUser, requireAuth, logout, redirectIfLoggedIn };
})();