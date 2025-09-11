// Este es el service worker de Movimiento Training 💪
console.log("This is the 'Offline page' service worker");

// 🔥 Cambiado a una nueva versión para forzar actualización
const CACHE_NAME = 'movimiento-training-v20';

const STATIC_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/img/logo-movimiento.png',
  '/img/logo-jlm-ihp.png',
  '/img/fondo-gimnasio5.jpg',
  '/img/icon-192.png',
  '/img/icon-512.png',
  '/img/screenshot-wide.png',
  '/img/screenshot-mobile.png',
  'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&display=swap',
  'https://fonts.gstatic.com/s/montserrat/v25/JTUSjIg1_i6t8kCHKm459Wlhyw.woff2'
];

self.addEventListener('install', event => {
  console.log('✅ SW instalando…');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_CACHE))
      .then(() => self.skipWaiting())
      .catch(err => console.error('❌ Error en install:', err))
  );
});

self.addEventListener('activate', event => {
  console.log('🔄 SW activando…');
  event.waitUntil(
    caches.keys()
      .then(names => Promise.all(
        names.map(name => (name !== CACHE_NAME ? caches.delete(name) : undefined))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const { request } = event;

  // Solo respondemos a solicitudes GET
  if (request.method !== 'GET') return;

  // Ignoramos solicitudes de extensiones de navegador, etc.
  if (request.url.startsWith('chrome-extension://')) return;

  event.respondWith(
    caches.match(request.url).then(cachedResponse => {
      // Si la respuesta está en el caché, la devolvemos inmediatamente
      if (cachedResponse) {
        return cachedResponse;
      }

      // Si no está en el caché, intentamos obtenerla de la red
      return fetch(request).then(networkResponse => {
        // Verificamos que la respuesta sea válida antes de cachearla
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }

        // Clonamos la respuesta porque una respuesta solo se puede usar una vez
        const responseToCache = networkResponse.clone();

        // Abrimos el caché y guardamos la respuesta
        caches.open(CACHE_NAME).then(cache => {
          cache.put(request.url, responseToCache);
        });

        // Devolvemos la respuesta de la red
        return networkResponse;
      }).catch(() => {
        // En caso de fallo de red, ofrecemos una página de fallback si es una navegación
        if (request.mode === 'navigate') {
          return caches.match('/index.html');
        }
        // Si es una imagen, ofrecemos un fallback de imagen
        if (request.destination === 'image') {
          return caches.match('/img/logo-movimiento.png');
        }
        // Para cualquier otro recurso, damos una respuesta de error
        return new Response('Contenido no disponible sin conexión', { status: 503 });
      });
    })
  );
});