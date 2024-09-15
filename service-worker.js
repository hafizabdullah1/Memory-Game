const CACHE_NAME = 'memory-game-cache-v1';
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/images/favicon.ico',
  '/images/icon-192x192.png',
  '/images/icon-512x512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(URLS_TO_CACHE).catch((error) => {
        console.error('Failed to cache assets:', error);
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
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(event.request).catch((error) => {
        console.error('Fetch failed:', error);
        // Optionally, return a fallback response for offline scenarios.
        return new Response('You are offline and this resource is not cached.', {
          status: 503,
          statusText: 'Service Unavailable'
        });
      });
    })
  );
});
