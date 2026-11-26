// JointSense - Service Worker: App-Dateien zwischenspeichern, damit die App ohne Internet startet.
// Bei einer neuen App-Version CACHE hochzaehlen. Die KneeAngle-App liegt auf derselben Adresse
// (akuenz1.github.io): nur eigene Zwischenspeicher ("jointsense-...") anfassen.
const CACHE = 'jointsense-v4.1.0-5';
const FILES = ['./', 'index.html', 'style.css', 'protocol.js', 'device.js', 'knee.js', 'app.js', 'manifest.webmanifest',
  'icons/icon-192.png', 'icons/icon-512.png',
  'fonts/barlow-latin-400-normal.woff2', 'fonts/barlow-latin-600-normal.woff2', 'fonts/barlow-condensed-latin-600-normal.woff2'];
// cache: 'reload' umgeht den HTTP-Zwischenspeicher des Browsers (GitHub Pages: 10 min). Sonst landen nach
// einem Update die alten Dateien im neuen Zwischenspeicher, und die App zeigt weiter die alte Fassung.
self.addEventListener('install', (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES.map((f) => new Request(f, { cache: 'reload' })))).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k.startsWith('jointsense-') && k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.open(CACHE).then((c) => c.match(e.request, { ignoreSearch: true })).then((hit) => hit || fetch(e.request)));
});
