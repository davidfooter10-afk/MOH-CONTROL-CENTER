const CACHE_NAME = 'moh-control-v1';

// Add the files you want to save to the user's device for fast loading
const urlsToCache = [
    './',
    './index.html',
    './manifest.json',
    './bg-control.jpg',
    './icon-192.png',
    './icon-512.png'
    // Note: I left out the video file so it doesn't use up too much of the user's storage.
];

// Install Event - Caches the files
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

// Activate Event - Cleans up old caches if you update the app
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
});

// Fetch Event - Serves cached files when offline, otherwise uses the network
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Return the cached file if found
                if (response) {
                    return response;
                }
                // Otherwise fetch from the internet
                return fetch(event.request);
            })
    );
});