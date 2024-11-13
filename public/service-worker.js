/* eslint-disable no-restricted-globals */

const CACHE_NAME = 'courses-cache-v1';
const API_URL = 'https://pwa-api-production.up.railway.app/api/courses';
const OFFLINE_URL = '/offline.html';

// Archivos a almacenar en caché para el funcionamiento offline
const ASSETS_TO_CACHE = [
  OFFLINE_URL,
  '/',
  '/index.html',
  '/styles.css',
  '/index.js',
];

// Evento de instalación
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Evento de activación
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName))
      );
    })
  );
  self.clients.claim();
});

// Evento de fetch para manejar las solicitudes de la API y las páginas offline
self.addEventListener('fetch', (event) => {
  const request = event.request;

  if (request.url === API_URL) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
          return response;
        })
        .catch(() => {
          return caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            } else {
              return caches.match(OFFLINE_URL);
            }
          });
        })
    );
  } else {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        return cachedResponse || fetch(request).catch(() => caches.match(OFFLINE_URL));
      })
    );
  }
});
