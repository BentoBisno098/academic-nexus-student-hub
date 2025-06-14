
const CACHE_NAME = 'sistema-academico-v1';
const OFFLINE_URL = '/';

// Recursos essenciais para funcionar offline
const CACHE_RESOURCES = [
  '/',
  '/login',
  '/student-dashboard',
  '/admin-dashboard',
  '/manifest.json',
  '/placeholder.svg'
];

// Instalar o service worker
self.addEventListener('install', event => {
  console.log('[SW] Install');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Caching app shell');
        return cache.addAll(CACHE_RESOURCES);
      })
      .then(() => {
        console.log('[SW] Skip waiting');
        return self.skipWaiting();
      })
  );
});

// Ativar o service worker
self.addEventListener('activate', event => {
  console.log('[SW] Activate');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Removing old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[SW] Claiming clients');
      return self.clients.claim();
    })
  );
});

// Interceptar requisições
self.addEventListener('fetch', event => {
  console.log('[SW] Fetch:', event.request.url);
  
  // Estratégia: Network First para navegação, Cache First para recursos
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Se a requisição foi bem-sucedida, cache a resposta
          const responseClone = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseClone);
            });
          return response;
        })
        .catch(() => {
          // Se falhou, tenta do cache
          return caches.match(event.request)
            .then(response => {
              return response || caches.match(OFFLINE_URL);
            });
        })
    );
  } else {
    // Para outros recursos, tenta cache primeiro
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          if (response) {
            return response;
          }
          return fetch(event.request)
            .then(response => {
              // Cache recursos importantes
              if (response.status === 200) {
                const responseClone = response.clone();
                caches.open(CACHE_NAME)
                  .then(cache => {
                    cache.put(event.request, responseClone);
                  });
              }
              return response;
            });
        })
    );
  }
});

// Mensagens do cliente
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
