// sw.js - خدمة التخزين المؤقت للتشغيل دون اتصال
const CACHE_NAME = 'dictionary-grammar-v1';
const FILES_TO_CACHE = [
  'index.html',
  'manifest.json',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Markazi+Text:wght@500;700&family=Tajawal:wght@400;500;700;900&family=JetBrains+Mono:wght@400;600&family=Amiri:wght@400;700&family=Cairo:wght@400;700&display=swap'
  // يمكنك إضافة أي ملفات إضافية (صور، خطوط، إلخ) هنا
];

// عند تثبيت الـ Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(FILES_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

// عند تنشيطه، حذف المخابئ القديمة
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(keyList.map(key => {
        if (key !== CACHE_NAME) return caches.delete(key);
      }));
    })
  );
  self.clients.claim();
});

// استراتيجية "Cache First" مع طلب الشبكة كبديل
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // إذا وجد في الكاش، أعدّه
        if (response) return response;
        // وإلا، حاول من الشبكة
        return fetch(event.request)
          .then(networkResponse => {
            // إذا نجح الطلب، خزّن نسخة منه
            if (networkResponse && networkResponse.status === 200) {
              const responseClone = networkResponse.clone();
              caches.open(CACHE_NAME).then(cache => {
                cache.put(event.request, responseClone);
              });
            }
            return networkResponse;
          })
          .catch(() => {
            // يمكنك عرض صفحة "أوفلاين" بديلة هنا إن أردت
            // ولكن سيكون لدينا المحتوى الأساسي مخزناً بالفعل
          });
      })
  );
});