/* ============================================================
   auth.js — المصادقة عبر Google Sign-In
   ============================================================ */
'use strict';

/* ⚠️ ضع Client ID الخاص بك من Google Cloud Console هنا */
const GOOGLE_CLIENT_ID = '721594580974-6lcbjft23dgqgmfunmiroju68ifvbjb2.apps.googleusercontent.com';

const Auth = (function () {

  let initialized = false;
  let onLoginCallback = null;

  /* ---------- فك تشفير JWT (بدون تحقق — للقراءة فقط) ---------- */
  function decodeJwt(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const pad = base64.length % 4;
      const padded = pad ? base64 + '='.repeat(4 - pad) : base64;
      const json = decodeURIComponent(
        atob(padded).split('').map(c =>
          '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        ).join('')
      );
      return JSON.parse(json);
    } catch (e) {
      return null;
    }
  }

  /* ---------- معالجة استجابة Google ---------- */
  function handleCredential(response) {
    const payload = decodeJwt(response.credential);
    if (!payload) {
      showToast('تعذّر قراءة بيانات الحساب.', 'err');
      return;
    }
    const user = {
      sub: payload.sub,
      name: payload.name || payload.given_name || 'مستخدم',
      email: payload.email || '',
      picture: payload.picture || ''
    };
    if (onLoginCallback) onLoginCallback(user);
  }

  /* ---------- عرض ملاحظة الاحتياط ---------- */
  function showFallbackNote() {
    const note = document.getElementById('gsi-fallback-note');
    if (note) note.classList.remove('hidden');
  }

  /* ---------- التهيئة ---------- */
  function init(callback) {
    onLoginCallback = callback;
    if (initialized) return;

    let tries = 0;
    const timer = setInterval(() => {
      tries++;

      if (window.google && window.google.accounts && window.google.accounts.id) {
        clearInterval(timer);
        try {
          google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleCredential,
            auto_select: false,
            cancel_on_tap_outside: true
          });

          const holder = document.getElementById('gsi-button');
          if (holder) {
            google.accounts.id.renderButton(holder, {
              theme: 'filled_black',
              size: 'large',
              shape: 'pill',
              text: 'signin_with',
              locale: 'ar',
              logo_alignment: 'right',
              width: 320
            });
          }
          initialized = true;
        } catch (e) {
          console.warn('خطأ في تهيئة Google', e);
          showFallbackNote();
        }
      } else if (tries > 20) {
        clearInterval(timer);
        showFallbackNote();
      }
    }, 300);
  }

  /* ---------- تسجيل الخروج ---------- */
  function logout() {
    try {
      if (window.google && google.accounts && google.accounts.id) {
        google.accounts.id.disableAutoSelect();
      }
    } catch (e) {}
    Store.clearSession();
  }

  return { init, logout, decodeJwt };
})();
