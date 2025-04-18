// Cache name - incrementar la versión para forzar actualización
const CACHE_NAME = 'elderlink-v3';

// Files to cache
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon512_maskable.png',
  '/icon512_rounded.png',
  '/android/android-launchericon-512-512.png',
  '/android/android-launchericon-192-192.png',
  '/assets/index.css',
  '/assets/index.js'
];

// Install service worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
  // Forzar la activación inmediata del nuevo Service Worker
  self.skipWaiting();
});

// Fetch event - implementar estrategia "network first"
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Clonar la respuesta para poder usarla dos veces
        const responseClone = response.clone();
        
        // Actualizar el caché con la nueva respuesta
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseClone);
        });
        
        return response;
      })
      .catch(() => {
        // Si falla la red, intentar usar el caché
        return caches.match(event.request);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  // Tomar control inmediatamente
  self.clients.claim();
});

// Escuchar mensajes para limpiar caché
self.addEventListener('message', event => {
  if (event.data && event.data.action === 'CLEAR_CACHE') {
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          return caches.delete(cacheName);
        })
      );
    }).then(() => {
      // Notificar a los clientes que el caché se ha limpiado
      self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({ action: 'CACHE_CLEARED' });
        });
      });
    });
  }
}); 