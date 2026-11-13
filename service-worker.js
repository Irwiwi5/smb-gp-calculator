/* Your Wireless — SMB GP Calculator: service worker
   Bump CACHE_NAME any time you change index.html / styles.css / app.js
   so returning phones pick up the new app shell instead of a stale cache.
   catalog.json is handled separately below (network-first) so price
   updates don't need a cache-name bump at all. */
const CACHE_NAME = "ywgpcalc-shell-v1";
const APP_SHELL = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
  "./icons/apple-touch-icon.png",
  "./icons/favicon-32.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // catalog.json: always try the network first so price updates show up
  // right away when online; fall back to the last cached copy offline.
  if (url.pathname.endsWith("catalog.json")) {
    event.respondWith(
      fetch(event.request, { cache: "no-store" })
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          return res;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // everything else (app shell): cache-first, network fallback
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
