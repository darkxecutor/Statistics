/* ============================================================
   auth.js — المصادقة عبر Google Sign-In والربط مع Firebase
   ============================================================ */
'use strict';

/* ⚠️ ضع Client ID الخاص بك من Google Cloud Console هنا */
const GOOGLE_CLIENT_ID = '721594580974-6lcbjft23dgqgmfunmiroju68ifvbjb2.apps.googleusercontent.com';

const Auth = (function () {

  let initialized = false;
  let onLoginCallback = null;

  /* ---------- فك تشفير JWT ---------- */
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

  /* ---------- تسجيل المستخدم في Firebase ---------- */
  async function logToFirebase(user) {
    if (!window.db) {
      console.warn('Firebase غير متصل، تم تخطي تسجيل البيانات.');
      return;
    }
    try {
      // استدعاء دوال Firebase ديناميكياً
      const { doc, getDoc, setDoc, updateDoc, increment, serverTimestamp } = 
        await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");

      const userRef = doc(window.db, "users", user.sub);
      const userSnap = await getDoc(userRef);
      const platformStatsRef = doc(window.db, "stats", "platform");

      if (!userSnap.exists()) {
        // مستخدم جديد: إنشاء ملفه وزيادة عدد المسجلين
        await setDoc(userRef, {
          name: user.name,
          email: user.email,
          picture: user.picture,
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp(),
          loginCount: 1
        });
        
        await setDoc(platformStatsRef, {
          totalUsers: increment(1),
          totalLogins: increment(1)
        }, { merge: true });

      } else {
        // مستخدم موجود: تحديث آخر دخول وزيادة عداد الدخولات
        await updateDoc(userRef, {
          lastLogin: serverTimestamp(),
          loginCount: increment(1)
        });
        
        await setDoc(platformStatsRef, {
          totalLogins: increment(1)
        }, { merge: true });
      }
    } catch (e) {
      console.warn("فشل الاتصال بقاعدة بيانات Firebase", e);
    }
  }

  /* ---------- معالجة استجابة Google ---------- */
  async function handleCredential(response) {
    const payload = decodeJwt(response.credential);
    if (!payload) {
      if (typeof showToast === 'function') showToast('تعذّر قراءة بيانات الحساب.', 'err');
      return;
    }
    const user = {
      sub: payload.sub,
      name: payload.name || payload.given_name || 'مستخدم',
      email: payload.email || '',
      picture: payload.picture || ''
    };

    // ✅ تسجيل الدخول في Firebase
    await logToFirebase(user);

    if (onLoginCallback) onLoginCallback(user);
  }

  function showFallbackNote() {
    const note = document.getElementById('gsi-fallback-note');
    if (note) note.classList.remove('hidden');
  }

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

  function logout() {
    try {
      if (window.google && google.accounts && google.accounts.id) {
        google.accounts.id.disableAutoSelect();
      }
    } catch (e) {}
    Store.clearSession();
  }

  return { init, logout, decodeJwt, logToFirebase };
})();
