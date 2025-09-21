// sw.js - Service Worker for PWA
const CACHE_NAME = 'swap-n-stay-v1';
const urlsToCache = ['/', '/index.html', '/admin.html'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});
