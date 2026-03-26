const CACHE_NAME = 'moh-admin-v2'; // Updated version
const ASSETS_TO_CACHE = [
  '/',
  'index.html',
  'manifest.json',
  'bg-control.jpg',
  'icon.png',
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// Install Event: Saves all files to the phone
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('MOH Cache: Warming up assets');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Activate Event: Deletes the old 'moh-cache-v1' so the new code works
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
});

// Fetch Event: Served from cache first, then network
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});