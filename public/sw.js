const CACHE_NAME = 'elder-voice-link-v3';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon512_maskable.png',
  '/icon512_rounded.png',
  '/favicon.ico',
  '/poster.png',
  // Android icons
  '/android/android-launchericon-512-512.png',
  '/android/android-launchericon-192-192.png',
  '/android/android-launchericon-144-144.png',
  '/android/android-launchericon-96-96.png',
  '/android/android-launchericon-72-72.png',
  '/android/android-launchericon-48-48.png',
  // iOS icons
  '/ios/1024.png',
  '/ios/180.png',
  '/ios/167.png',
  '/ios/152.png',
  '/ios/120.png',
  // Windows 11 icons
  '/windows11/SmallTile.scale-100.png',
  '/windows11/SmallTile.scale-125.png',
  '/windows11/SmallTile.scale-150.png',
  '/windows11/SmallTile.scale-200.png',
  '/windows11/Square150x150Logo.scale-100.png',
  '/windows11/Square150x150Logo.scale-125.png',
  '/windows11/Square150x150Logo.scale-150.png',
  '/windows11/Square150x150Logo.scale-200.png',
  '/windows11/Wide310x150Logo.scale-100.png',
  '/windows11/Wide310x150Logo.scale-125.png',
  '/windows11/Wide310x150Logo.scale-150.png',
  '/windows11/Wide310x150Logo.scale-200.png',
  '/windows11/LargeTile.scale-100.png',
  '/windows11/LargeTile.scale-125.png',
  '/windows11/LargeTile.scale-150.png',
  '/windows11/LargeTile.scale-200.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }

        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }

        return fetch(event.request).then(response => {
          if (response && response.status === 200) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
          }
          return response;
        });
      })
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
}); 