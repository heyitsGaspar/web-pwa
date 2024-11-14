/* eslint-disable no-restricted-globals */

const CACHE_NAME = 'courses-cache-v2';

const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/logo192.png',
  '/logo512.png',
  'https://pwa-api-production-f5fc.up.railway.app/api/courses',
  // Agrega cualquier otro recurso que necesites cachear aquí
];

// Evento de instalación: almacena en caché los recursos especificados
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching app shell');
      return cache.addAll(urlsToCache);
    })
  );
});

// Evento de activación: elimina cachés antiguas que ya no son necesarias
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        // eslint-disable-next-line array-callback-return
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Deleting old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Evento de fetch: maneja las solicitudes y excluye URLs no necesarias
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Excluir rutas de Vercel y otras URLs no relevantes
  if (url.origin === 'https://vercel.live' || url.pathname.startsWith('/.well-known/vercel')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      return (
        response ||
        fetch(event.request)
          .then((networkResponse) => {
            // Solo almacena en caché respuestas JavaScript y HTML exitosas
            if (
              networkResponse &&
              networkResponse.status === 200 &&
              (networkResponse.headers.get('Content-Type').includes('application/javascript') ||
               networkResponse.headers.get('Content-Type').includes('text/html'))
            ) {
              const responseClone = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, responseClone);
              });
            }
            return networkResponse;
          })
          .catch((error) => {
            console.error('Error fetching resource:', error);
            // Devuelve la página de inicio en caso de error
            return caches.match('/index.html');
          })
      );
    })
  );
});
