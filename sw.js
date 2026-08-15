const CACHE_NAME = 'notlar-pwa-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-196.png',
  './icon-512.png'
];

// Service Worker Yükleme ve Önbellekleme
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Eski Önbellekleri Temizleme
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Ağ/Önbellek Yakalama
self.addEventListener('fetch', (event) => {
  // Firestore ve Auth isteklerini doğrudan ağa yönlendir
  if (event.request.url.includes('firestore.googleapis.com') || 
      event.request.url.includes('identitytoolkit.googleapis.com')) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});
