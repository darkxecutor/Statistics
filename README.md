<div align="center">

<img src="img/icon-512.png" alt="STATISTICS Logo" width="120" height="120" />

# STATISTICS

**لوحة إنجاز شخصية عربية — تتبّع. قِس. اربح.**

منصّة ويب متكاملة لمتابعة المهام والأهداف اليومية والأسبوعية والشهرية، مع إحصائيات فورية، مخططات بصرية، ونظام مكافآت يحفّزك على الاستمرار.

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)](https://developer.mozilla.org/ar/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)](https://developer.mozilla.org/ar/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/ar/docs/Web/JavaScript)
[![PWA](https://img.shields.io/badge/PWA-5A0FC8?style=flat&logo=progressive-web-apps&logoColor=white)](https://web.dev/progressive-web-apps/)
[![License](https://img.shields.io/badge/License-MIT-f4c430?style=flat)](LICENSE)

[المميزات](#-المميزات) · [التثبيت](#-التثبيت-والتشغيل) · [النشر](#-النشر-على-github-pages) · [التخصيص](#-التخصيص) · [APK](#-بناء-ملف-apk)

</div>

---

## 📑 جدول المحتويات

- [نظرة عامة](#-نظرة-عامة)
- [المميزات](#-المميزات)
- [التقنيات المستخدمة](#-التقنيات-المستخدمة)
- [هيكل المشروع](#-هيكل-المشروع)
- [التثبيت والتشغيل](#-التثبيت-والتشغيل)
- [النشر على GitHub Pages](#-النشر-على-github-pages)
- [إعداد Google Sign-In](#-إعداد-google-sign-in)
- [العمل بدون إنترنت (PWA)](#-العمل-بدون-إنترنت-pwa)
- [بناء ملف APK](#-بناء-ملف-apk)
- [التخصيص](#-التخصيص)
- [إدارة البيانات](#-إدارة-البيانات)
- [الألوان والهوية البصرية](#-الألوان-والهوية-البصرية)
- [استكشاف الأخطاء](#-استكشاف-الأخطاء)
- [المساهمة](#-المساهمة)
- [الترخيص](#-الترخيص)

---

## 🎯 نظرة عامة

**STATISTICS** تطبيق ويب عربي (RTL) مبني بالكامل بـ **HTML + CSS + JavaScript** دون أي أدوات بناء، يعمل مباشرة عند رفعه على **GitHub Pages**. صُمّم ليكون رفيقك اليومي في بناء الانضباط: تضع أهدافك، تتابع إنجازك، وترى تقدّمك يتحوّل إلى أرقام ومخططات تُحفّزك.

الموقع يعمل **بالكامل على جهاز المستخدم** — لا خوادم، لا قاعدة بيانات خارجية، لا تتبّع. كل بياناتك تبقى معك، ومرتبطة بحساب Google الذي تسجّل به الدخول لتجِدها كما تركتها حتى بعد سنوات.

---

## ✨ المميزات

### 📊 متابعة وتتبّع
- ✅ **جدول يومي مقسّم** إلى فترتين (صباحية / مسائية) بعدد مهام غير محدود.
- ✅ **علامات إنجاز واضحة** لكل مهمة: ✅ منجزة، ❌ غير منجزة، ⏳ معلّقة.
- ✅ **تسجيل وقت البدء والمدة** لكل مهمة لتحليل إنتاجيتك لاحقًا.
- ✅ **تجميع تلقائي أسبوعي وشهري** دون أي خطوة يدوية.
- ✅ **جداول مخصصة** بأعمدة يحددها المستخدم بحرية.

### 📈 إحصائيات ومخططات
- ✅ **عدادات حية** بألوان مميزة لكل مؤشر: الإنجاز اليومي/الأسبوعي/الشهري، الأيام النشطة، الإجمالي.
- ✅ **مخططات عمودية** (حتى 7 أعمدة، تبدأ من الصفر، بلون مميز لكل عنصر).
- ✅ **مخططات دائرية** (مع دمج الشرائح الصغيرة تحت "أخرى" تلقائيًا).
- ✅ **توليد تلقائي** للإحصائيات بمجرد تسجيل إنجاز المهام.

### 🏆 تحفيز ومكافآت
- ✅ **نظام مكافآت شهري** يحدده المستخدم (وصف + قيمة).
- ✅ **إشعار تهنئة** عند تجاوز نسبة الإنجاز المطلوبة (افتراضيًا 85%).
- ✅ **تأثيرات بصرية وصوتية** خفيفة تُحفّز عند كل إنجاز.

### 💾 حفظ وأمان
- ✅ **حفظ تلقائي فوري** لكل تغيير في `localStorage`.
- ✅ **ربط البيانات بحساب Google** — عد بعد سنوات وستجد كل شيء.
- ✅ **تصدير/استيراد** نسخة احتياطية بصيغة JSON.
- ✅ **حذف كامل للبيانات** بضغطة واحدة.

### 📱 الوصول والاستجابة
- ✅ **متجاوب كليًا**: جوال، لوحي، حاسوب.
- ✅ **PWA**: قابل للتثبيت كتطبيق ويُعمل **بدون إنترنت**.
- ✅ **ملف APK**: للتحميل المباشر عبر رابط الموقع.
- ✅ **عربي RTL** بالكامل بخط **Cairo**.

### 🎨 تجربة استخدام فريدة
- ✅ **صوت كسر مُولَّد برمجيًا** عند كل حرف تكتبه (Web Audio API).
- ✅ **شظايا ذهبية متطايرة** + موجة (Ripple) تنطلق من موضع المؤشر.
- ✅ **تجاهل تلقائي** للحذف واللصق (لا أصوات مزعجة).
- ✅ **تأثيرات Hover** أنيقة على كل الأزرار والبطاقات.

---

## 🛠 التقنيات المستخدمة

| التقنية | الاستخدام |
|---|---|
| **HTML5** | هيكل الصفحات، الدلالات (semantics) |
| **CSS3** | التصميم، RTL، الاستجابة، التأثيرات |
| **JavaScript (ES6+)** | منطق التطبيق، الحفظ، الصوت، الجداول |
| **[Chart.js 4](https://www.chartjs.org/)** | المخططات العمودية والدائرية (CDN) |
| **[Google Identity Services](https://developers.google.com/identity/gsi/web)** | تسجيل الدخول |
| **[Web Audio API](https://developer.mozilla.org/ar/docs/Web/API/Web_Audio_API)** | الأصوات المُولَّدة برمجيًا |
| **[Web Animations API](https://developer.mozilla.org/ar/docs/Web/API/Web_Animations_API)** | الشظايا والموجات |
| **[Service Worker](https://developer.mozilla.org/ar/docs/Web/API/Service_Worker_API)** | العمل بدون إنترنت |
| **[Google Fonts](https://fonts.google.com/)** | خط Cairo |

> **ملاحظة:** لا يوجد `package.json`، لا `node_modules`، لا خطوات بناء. فقط ارفع الملفات وسيعمل.

---

## 📂 هيكل المشروع

```
statistics/
│
├── index.html              ← الصفحة الرئيسية (الدخول + التطبيق)
├── manifest.json           ← بيانات PWA (الأيقونات، الألوان، الاسم)
├── sw.js                   ← Service Worker (العمل دون إنترنت)
├── statistics.apk          ← (اختياري) ملف APK المبني
├── README.md               ← هذا الملف
│
├── css/
│   └── style.css           ← كل التنسيقات والهوية البصرية
│
├── js/
│   ├── storage.js          ← إدارة البيانات + الحفظ التلقائي
│   ├── audio.js            ← محرك الصوت المُولَّد
│   ├── effects.js          ← الشظايا + الموجة + ربط الحقول
│   ├── charts.js           ← تغليف Chart.js
│   ├── auth.js             ← Google Sign-In + الجلسة
│   └── app.js              ← منطق التطبيق والواجهات
│
└── img/
    ├── icon-192.png        ← أيقونة PWA (192×192)
    ├── icon-512.png        ← أيقونة PWA (512×512)
    ├── icon-maskable-192.png   ← أيقونة maskable (بهامش أمان)
    ├── icon-maskable-512.png   ← أيقونة maskable (بهامش أمان)
    ├── apple-touch-icon.png    ← أيقونة iOS (180×180)
    ├── logo.jpeg           ← الشعار الأصلي
    └── jj.jpeg             ← صورة زر الخروج
```

### 🧩 وظيفة كل ملف

| الملف | الوظيفة |
|---|---|
| `storage.js` | يدير كل البيانات: الأيام، المهام، الجداول المخصصة، الإعدادات. يوفر حسابات جاهزة (يوم/أسبوع/شهر) ويكتب تلقائيًا في `localStorage` بعد كل تغيير. |
| `audio.js` | يولّد صوت "كسر" عند الكتابة وصوت نقر ناعم عند الضغط — كل ذلك بدون ملفات صوتية. |
| `effects.js` | يحسب موقع المؤشر بدقة (RTL) ويُطلق الشظايا والموجة. |
| `charts.js` | يغلّف Chart.js ويوفر دوال `bar()` و `pie()` جاهزة بألوان الموقع. |
| `auth.js` | يهيّئ Google Sign-In، يقرأ بيانات المستخدم، ويحفظ الجلسة. |
| `app.js` | يربط كل شيء: التبويبات، الجداول، الإعدادات، PWA، APK. |

---

## 🚀 التثبيت والتشغيل

### 1. استنساخ المشروع

```bash
git clone https://github.com/<username>/<repo>.git
cd <repo>
```

### 2. تشغيل خادم محلي

> ⚠️ **مهم:** Google Sign-In و Service Worker لا يعملان عند فتح `index.html` مباشرة عبر `file://`. يجب استخدام خادم HTTP محلي.

**الطريقة الأسهل** (Python):

```bash
python3 -m http.server 8000
```

**أو باستخدام Node.js:**

```bash
npx serve .
```

**أو VS Code:** استخدم إضافة **Live Server** (زر Go Live).

ثم افتح المتصفح على:

```
http://localhost:8000
```

### 3. الدخول

- **Google:** اضغط زر Google (يتطلب ضبط Client ID كما في [الأقسام التالية](#-إعداد-google-sign-in)).
- **دخول محلي سريع:** أدخل اسمك واضغط "دخول سريع" — للاختبار دون إعداد Google.

---

## 🌐 النشر على GitHub Pages

### الطريقة 1: عبر الواجهة الرسومية

1. أنشئ مستودعًا جديدًا على GitHub.
2. ارفع كل الملفات إلى الفرع `main`.
3. ادخل إلى **Settings → Pages**.
4. في **Source** اختر **Deploy from a branch**.
5. في **Branch** اختر `main` والمجلد `/ (root)`، ثم **Save**.
6. انتظر دقيقة، سيكون موقعك متاحًا على:
   ```
   https://<username>.github.io/<repo-name>/
   ```

### الطريقة 2: عبر سطر الأوامر

```bash
git init
git add .
git commit -m "Initial commit — STATISTICS"
git branch -M main
git remote add origin https://github.com/<username>/<repo>.git
git push -u origin main
```

ثم فعّل Pages من **Settings → Pages** كما في الطريقة 1.

> 💡 **نصيحة:** إن أردت رابطًا على شكل `https://<username>.github.io` مباشرة، سمِّ المستودع باسم `<username>.github.io`.

---

## 🔐 إعداد Google Sign-In

### 1. إنشاء مشروع في Google Cloud

1. افتح [Google Cloud Console](https://console.cloud.google.com/).
2. أنشئ مشروعًا جديدًا (New Project) وسمّه `Statistics`.

### 2. إعداد شاشة الموافقة (OAuth Consent Screen)

1. **APIs & Services → OAuth consent screen**.
2. اختر **External** ← **Create**.
3. املأ:
   - **App name:** `STATISTICS`
   - **User support email:** بريدك
   - **Developer contact:** بريدك
4. في **Scopes** أضف: `.../auth/userinfo.email` و `.../auth/userinfo.profile`.
5. احفظ.

### 3. إنشاء OAuth Client ID

1. **APIs & Services → Credentials → + Create Credentials → OAuth client ID**.
2. **Application type:** `Web application`.
3. **Name:** `STATISTICS Web`.
4. في **Authorized JavaScript origins** أضف:
   ```
   https://<username>.github.io
   http://localhost:8000
   ```
5. في **Authorized redirect URIs** أضف:
   ```
   https://<username>.github.io/<repo-name>/
   http://localhost:8000/
   ```
6. اضغط **Create** وانسخ **Client ID**.

### 4. وضع Client ID في المشروع

افتح `js/auth.js` واستبدل السطر:

```javascript
const GOOGLE_CLIENT_ID = 'YOUR_CLIENT_ID.apps.googleusercontent.com';
```

بـ Client ID الخاص بك:

```javascript
const GOOGLE_CLIENT_ID = '721594580974-xxxxxxxxxxxxxxxx.apps.googleusercontent.com';
```

### 5. التحقق

أعد تحميل الموقع — سيظهر زر Google الرسمي في شاشة الدخول. اضغطه واختر حسابك.

> ⚠️ **ملاحظة:** إن ظهرت رسالة `origin_mismatch`، فهذا يعني أن النطاق الذي تفتح منه الموقع غير مسجّل في Google Cloud Console. أضفه في **Authorized JavaScript origins**.

---

## 📲 العمل بدون إنترنت (PWA)

الموقع مجهّز **تلقائيًا** للعمل بدون إنترنت بعد أول زيارة، بفضل `sw.js` الذي يخزّن كل الملفات في الكاش.

### التثبيت كتطبيق على الجهاز

| المتصفح | طريقة التثبيت |
|---|---|
| **Chrome / Edge (Android)** | سيظهر زر "📲 تثبيت كتطبيق" تلقائيًا، أو من قائمة المتصفح → "إضافة إلى الشاشة الرئيسية" |
| **Safari (iOS)** | زر المشاركة ← "إضافة إلى الشاشة الرئيسية" |
| **Chrome (Desktop)** | أيقونة التثبيت ⊕ في شريط العناوين |

### كيف يعمل Service Worker

1. عند أول زيارة، يخزّن كل ملفات الموقع في الكاش.
2. عند الزيارات اللاحقة، يستعمل الكاش أولًا، ثم يحاول الشبكة.
3. إن كنت غير متصل، يعمل الموقع كليًا من الكاش.

### تحديث النسخة

عند تحديث كود الموقع، ارفع نسخة جديدة على GitHub Pages. سيُحدَّث الكاش تلقائيًا في زيارة المستخدم التالية بفضل آلية `skipWaiting()`.

---

## 📦 بناء ملف APK

> ⚠️ **ملاحظة مهمة:** الموقع يُبنى كـ **PWA** أولًا، ثم يُغلّف في APK عبر أدوات Google الرسمية. هذا يتطلب أن يكون الموقع منشورًا على **HTTPS** (وهو الحال مع GitHub Pages).

### الطريقة 1: PWABuilder (الأسهل — بدون ترميز)

1. تأكد أن الموقع يعمل على GitHub Pages.
2. ادخل إلى <https://www.pwabuilder.com/>.
3. أدخل رابط موقعك:
   ```
   https://<username>.github.io/<repo-name>/
   ```
4. اضغط **Start**.
5. اختر **Android** ← **Generate Package**.
6. املأ البيانات:
   - **Package ID:** `com.yourname.statistics`
   - **App name:** `STATISTICS`
   - **Short name:** `STATISTICS`
   - **Version:** `1.0.0`
7. نزّل ملف `*.apk` + `assetlinks.json`.
8. أعد تسمية الملف إلى `statistics.apk` وضعه في **جذر المشروع** (بجانب `index.html`).
9. ارفع التغييرات إلى GitHub Pages — سيصبح زر "⬇ تنزيل APK" يعمل مباشرة من الموقع.

> 💡 **مهم:** PWABuilder سيزوّدك بملف `assetlinks.json` ضعه في:
> ```
> .well-known/assetlinks.json
> ```
> حتى لا يظهر شريط العناوين في التطبيق المبني.

### الطريقة 2: Bubblewrap (عبر سطر الأوامر)

```bash
npm i -g @bubblewrap/cli
bubblewrap init --manifest https://<username>.github.io/<repo>/manifest.json
bubblewrap build
```

سينتج لك ملف APK في نفس المجلد. أعد تسميته إلى `statistics.apk`.

### الطريقة 3: Capacitor (لتحكم كامل)

مناسب إن أردت لاحقًا إضافة ميزات أصلية (Android-specific).

---

## 🎨 التخصيص

### 🖼 استبدال الشعار

1. ضع شعارك في `img/logo.jpeg`.
2. استخدم `img/icon-generator.html` لتوليد الأيقونات (افتحه في المتصفح، اختر الشعار، نزّل الأيقونات الخمس).
3. ضع الأيقونات في `img/`.
4. حدّث `index.html` إن أردت مسارًا مختلفًا:
   ```html
   <link rel="icon" href="img/icon-192.png">
   ```

### 🎨 تغيير الألوان

كل الألوان معرّفة كمتغيرات في أعلى `css/style.css`:

```css
:root{
  --bg:#0f0f0f;              /* الخلفية السوداء */
  --gold:#f4c430;            /* الذهبي الأساسي */
  --gold-light:#ffd75e;
  --gold-dark:#a67c00;
  --text:#f2efe6;
  --muted:#9a948a;
  /* ... */
}
```

غيّر قيمة أي متغير ليُطبّق تلقائيًا على كل الموقع.

### 🖼 استبدال صورة زر الخروج

ضع صورتك في `img/jj.jpeg` بنفس الاسم، وستُستعمل تلقائيًا.

### 📝 تغيير الخط

في `index.html` عدّل رابط Google Fonts، وفي `css/style.css`:

```css
body{
  font-family:'Cairo', system-ui, sans-serif;
}
```

### 🔢 تغيير الحد الأدنى للمهام اليومية

من **الإعدادات → الحد الأدنى لمهام اليوم** (افتراضي 20)، أو مباشرة في `js/storage.js`:

```javascript
minTasks: 20  // ← غيّرها
```

---

## 💾 إدارة البيانات

### أين تُحفظ البيانات؟

- **محليًا** في `localStorage` باسم `statistics_v1::<user_id>`.
- **مرتبطة** بحساب Google (`sub` ID) عند تسجيل الدخول عبر Google.
- عند العودة بنفس الحساب، تُحمَّل بياناتك تلقائيًا.

### نسخ احتياطي واستيراد

من **الإعدادات → البيانات**:

| الزر | الوظيفة |
|---|---|
| **تصدير JSON** | ينزّل نسخة كاملة من بياناتك |
| **استيراد** | يقرأ ملف JSON ويستبدل البيانات الحالية |
| **حذف كل البيانات** | يحذف نهائيًا كل شيء (لا رجعة) |

> 💡 **نصيحة:** صدّر نسخة احتياطية شهريًا واحفظها في Google Drive أو أي مكان آمن.

### نقل البيانات بين الأجهزة

1. صدّر JSON من الجهاز الأول.
2. سجّل الدخول بنفس حساب Google على الجهاز الثاني.
3. استورد الملف.

---

## 🎨 الألوان والهوية البصرية

| العنصر | اللون | Hex |
|---|---|---|
| الخلفية الأساسية | أسود عميق | `#0f0f0f` |
| الذهبي الأساسي | ذهبي | `#f4c430` |
| ذهبي فاتح | توهّج | `#ffd75e` |
| ذهبي داكن | لمسات | `#a67c00` |
| النص | أبيض عاجي | `#f2efe6` |
| النص الثانوي | رمادي دافئ | `#9a948a` |
| النجاح / المنجز | أخضر | `#3fbf7f` |
| الخطأ / غير منجز | أحمر | `#e63946` |
| التحذير / معلّق | برتقالي | `#f9a826` |
| معلومات / اليوم | أزرق | `#4a90e2` |
| الأسبوع | بنفسجي | `#c77dff` |
| الشهر | وردي | `#ff6b9d` |

---

## 🔧 استكشاف الأخطاء

### ❌ زر Google لا يظهر

- **السبب:** Client ID غير صحيح أو النطاق غير مسجّل.
- **الحل:** تحقق من `js/auth.js` ومن **Authorized JavaScript origins** في Google Cloud Console.
- **بديل:** استخدم "الدخول السريع" المحلي.

### ❌ الموقع لا يعمل بدون إنترنت

- **السبب:** لم يُسجَّل Service Worker بعد.
- **الحل:** افتح الموقع مرة واحدة، افتح DevTools → Application → Service Workers، وتأكد من التسجيل.

### ❌ الأيقونة تبدو مكبّرة أو مقطوعة

- **السبب:** استخدام `logo.jpeg` بدقة منخفضة، أو عدم فصل أيقونات maskable.
- **الحل:** استخدم `img/icon-generator.html` لتوليد أيقونات PNG صحيحة، وحدّث `manifest.json`.

### ❌ الشريط العلوي يخرج عن الشاشة على الجوال

- **السبب:** قديم CSS لا يحتوي على `overflow-x:hidden`.
- **الحل:** تأكد من أن `css/style.css` يحتوي على:
  ```css
  html, body{ overflow-x:hidden; max-width:100%; }
  .app-header{ flex-wrap:wrap; }
  .tabs{ min-width:0; overflow-x:auto; }
  ```

### ❌ صوت الكتابة لا يعمل

- **السبب:** بعض المتصفحات تمنع تشغيل AudioContext قبل تفاعل المستخدم.
- **الحل:** اضغط أي زر في الصفحة أولًا (تفعيل الصوت).

### ❌ زر "تنزيل APK" لا يعمل

- **السبب:** ملف `statistics.apk` غير موجود في المشروع.
- **الحل:** ابنِ الملف عبر [PWABuilder](#-بناء-ملف-apk) وضعه في جذر المشروع.

### ❌ البيانات لا تظهر بعد العودة

- **السبب:** تغيير الحساب أو مسح `localStorage`.
- **الحل:** تأكد من تسجيل الدخول بنفس حساب Google، أو استورد نسخة احتياطية.

---

## 🤝 المساهمة

المساهمات مرحّب بها! إن أردت تحسين الموقع:

1. Fork المستودع.
2. أنشئ فرعًا: `git checkout -b feature/ميزتك`.
3. التزم بالتغييرات: `git commit -m "إضافة ميزة X"`.
4. ارفع الفرع: `git push origin feature/ميزتك`.
5. افتح Pull Request.

### أفكار للمساهمة

- 🌍 إضافة لغات (إنجليزية، فرنسية).
- 📤 مزامنة اختيارية مع Google Drive.
- 🔔 إشعارات Push (عبر Web Push API).
- 🎯 إضافة جداول حسب نوع المهمة (رياضة، عمل، دراسة).
- 📊 مخططات خطية لإظهار التطور على مدار السنة.
- 🏅 شارات (badges) عند تحقيق إنجازات معينة.

---

## 📄 الترخيص

هذا المشروع مرخّص تحت **MIT License** — استخدمه، عدّله، ووزّعه بحرية.

```
MIT License

Copyright (c) 2026 STATISTICS

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

<div align="center">

**صُنع بشغف 💛 لمساعدتك على بناء انضباطك**

[⬆ العودة إلى الأعلى](#-statistics)

</div>
