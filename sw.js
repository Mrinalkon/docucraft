// DocuCraft Pro — Offline Service Worker
// After ONE successful load, the entire app (login, PDF tools, editor,
// camera, vault) is stored on the phone and opens with no server at all.
const CACHE_NAME = 'docucraft-v99';
const APP_SHELL = [
  'index.html?v=49',
  'app.js?v=49',
  'styles.css?v=49',
  'manifest.json',
  'icon-192.png',
  'icon-512.png',
  'icon-192-maskable.png',
  'icon-512-maskable.png',
  'apple-touch-icon.png',
  // CDN libraries needed by the offline PDF tools
  'https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      // addAll fails whole-batch if one URL is down; add individually
      Promise.all(APP_SHELL.map(url =>
        cache.add(new Request(url, { cache: 'reload' })).catch(() => {})
      ))
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // AI API calls (Gemini / cloud LLM) must always go to the network —
  // never serve a cached AI response.
  if (url.hostname.includes('generativelanguage.googleapis.com') ||
      url.hostname.includes('text.pollinations.ai') ||
      url.hostname.includes('accounts.google.com')) {
    return;
  }

  // Page navigations & scripts/styles: NETWORK-FIRST so the user always
  // gets the latest app while online; cache is only the offline fallback.
  if (req.mode === 'navigate' || req.destination === 'script' || req.destination === 'style') {
    event.respondWith(
      fetch(req).then(res => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(req, copy));
        }
        return res;
      }).catch(() =>
        caches.match(req, { ignoreSearch: true }).then(cached =>
          cached || caches.match('index.html', { ignoreSearch: true })
        )
      )
    );
    return;
  }

  // Everything else: cache-first for speed, then network.
  event.respondWith(
    caches.match(req, { ignoreSearch: true }).then(cached => {
      if (cached) return cached;
      return fetch(req).then(res => {
        if (res && res.ok && (url.protocol === 'https:' || url.hostname === 'localhost')) {
          const copy = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(req, copy));
        }
        return res;
      });
    })
  );
});
