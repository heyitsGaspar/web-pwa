/* eslint-disable no-restricted-globals */

const CACHE_NAME = "courses-cache-v5";

const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  "/favicon.ico",
  "/logo192.png",
  "/logo512.png",
  "/static", // Agrega cualquier otro recurso que necesites cachear aquí
];

// Evento de instalación: almacena en caché los recursos especificados
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Caching app shell");
      return cache.addAll(urlsToCache);
    })
  );
});

// Evento de activación: elimina cachés antiguas que ya no son necesarias
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        // eslint-disable-next-line array-callback-return
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log("Deleting old cache:", cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});


self.addEventListener("fetch", (event) => {
  if (event.request.method === "GET") {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return (
          response ||
          fetch(event.request)
            .then((fetchResponse) => {
              return caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, fetchResponse.clone());
                return fetchResponse;
              });
            })
            .catch(() => {
              // Manejar offline o errores
              if (event.request.url.endsWith(".html")) {
                return caches.match("/index.html");
              }
            })
        );
      })
    );
  }
});


// self.addEventListener("fetch", (event) => {
//   // Asegúrate de que la solicitud es 'GET', está en la carpeta 'static', y usa 'http' o 'https'
//   const isValidRoute =
//     event.request.url.includes("/static/") ||
//     event.request.url.startsWith("http://") ||
//     event.request.url.startsWith("https://");
//   if (event.request.method === "GET" && isValidRoute) {
//     event.respondWith(
//       caches.match(event.request).then((response) => {
//         // Si el recurso está en caché, lo devuelve, de lo contrario, realiza la solicitud de red
//         return (
//           response ||
//           fetch(event.request).then((fetchResponse) => {
//             // Clona la respuesta y almacénala en caché
//             return caches.open(CACHE_NAME).then((cache) => {
//               cache.put(event.request, fetchResponse.clone());
//               return fetchResponse;
//             });
//           })
//         );
//       })
//     );
//   }
// });
