const CACHE_NAME = 'planten-kennis-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/assets/data/plants-core.json',
  '/assets/data/plants-detail.json',
  '/assets/data/search-index.json',
];

self.addEventListener('install', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache: Cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.keys().then((cacheNames: string[]) => {
      return Promise.all(
        cacheNames.filter((name: string) => name !== CACHE_NAME).map((name: string) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event: FetchEvent) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Skip cross-origin requests except for API calls
  if (url.origin !== self.location.origin && !url.hostname.includes('wikipedia.org') && !url.hostname.includes('gbif.org') && !url.hostname.includes('wikimedia.org')) {
    return;
  }

  // API calls: network first, cache fallback
  if (url.hostname.includes('wikipedia.org') || url.hostname.includes('gbif.org')) {
    event.respondWith(
      fetch(event.request)
        .then((response: Response) => {
          if (response.ok) {
            const cloned = response.clone();
            caches.open(CACHE_NAME).then((cache: Cache) => {
              cache.put(event.request, cloned);
            });
          }
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Static assets: cache first, network fallback
  event.respondWith(
    caches.match(event.request).then((cached: Response | undefined) => {
      if (cached) return cached;
      return fetch(event.request).then((response: Response) => {
        if (response.ok && url.origin === self.location.origin) {
          const cloned = response.clone();
          caches.open(CACHE_NAME).then((cache: Cache) => {
            cache.put(event.request, cloned);
          });
        }
        return response;
      });
    })
  );
});