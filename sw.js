/* ============================================================
   Service Worker — STATISTICS
   يجعل الموقع يعمل بدون إنترنت بعد أول زيارة
   ============================================================ */
'use strict';

const CACHE_NAME = 'statistics-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './css/style.css',
  './js/storage.js',
  './js/audio.js',
  './js/effects.js',
  './js/charts.js',
  './js/auth.js',
  './js/app.js',
  './img/logo.jpeg',
  './img/jj.jpeg'
];

/* التثبيت: تخزين الملفات الأساسية */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.all(
        ASSETS.map(url =>
          cache.add(url).catch(err => console.warn('[SW] تعذّر تخزين', url, err))
        )
      );
    })
  );
  self.skipWaiting();
});

/* التنشيط: إزالة النسخ القديمة */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

/* الجلب: من الكاش أولاً، ثم الشبكة (مع تحديث الكاش) */
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;

      return fetch(req)
        .then((res) => {
          // نخزّن فقط استجابات ناجحة من نفس الأصل
          try {
            const u = new URL(req.url);
            if (res.ok && u.origin === location.origin) {
              const clone = res.clone();
              caches.open(CACHE_NAME).then(c => c.put(req, clone));
            }
          } catch (e) {}
          return res;
        })
        .catch(() => cached);
    })
  );
});
