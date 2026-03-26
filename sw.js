const CACHE = 'geldstromen-v2';
const ASSETS = [
  './',
  './index.html',
  './manifest.json'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  // Never intercept GitHub API calls or external resources
  const url = e.request.url;
  if(url.includes('api.github.com') || 
     url.includes('cdnjs.cloudflare.com') || 
     url.includes('fonts.googleapis.com') ||
     url.includes('fonts.gstatic.com') ||
     e.request.method !== 'GET') {
    return;
  }
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
