# 📊 موقع الإحصائيات

موقع ويب ثابت (Static) لعرض الإحصائيات والمهام الأسبوعية، مع:
- 🔐 تسجيل دخول عبر Google + وضع تجريبي
- 📋 منشئ جداول مخصص (أعمدة/صفوف ديناميكية)
- 📈 مخطط عمودي + 🥧 مخطط دائري
- 💾 حفظ تلقائي في المتصفح
- 🌓 وضع فاتح/داكن
- 📱 تصميم متجاوب RTL

---

## 🚀 النشر على GitHub Pages

1. أنشئ مستودعًا جديدًا على GitHub.
2. ارفع جميع الملفات (مع احترام هيكل المجلدات).
3. من `Settings → Pages` اختر: **Branch: main / root**.
4. سيصبح رابطك: `https://USERNAME.github.io/REPO/`

---

## 🔑 تفعيل Google Sign-In (اختياري)

الموقع يعمل فورًا **بالوضع التجريبي**. لتفعيل Google الحقيقي:

1. افتح [Google Cloud Console](https://console.cloud.google.com/).
2. أنشئ مشروعًا جديدًا.
3. من **APIs & Services → OAuth consent screen** أعدّ الشاشة (External).
4. من **Credentials → Create Credentials → OAuth Client ID**:
   - Type: **Web application**
   - **Authorized JavaScript origins**:
     - `https://USERNAME.github.io`
     - `http://localhost:8000` (للتجربة المحلية)
5. انسخ **Client ID** وضعه في `js/auth.js`:
   ```js
   const GOOGLE_CLIENT_ID = 'ضع Client ID هنا.apps.googleusercontent.com';