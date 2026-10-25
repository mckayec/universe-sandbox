/* Gravity Lab service worker.
   BUILD_ID is replaced with a hash of the build by scripts/stamp-sw.mjs (run after `vite build`), so every deploy
   gets its own cache and activate deletes the caches of older builds. In `vite dev` it stays "dev". */
const BUILD_ID = '__BUILD_ID__';
const CACHE = `gravity-lab-${BUILD_ID}`;
const SHELL = ['./', './index.html', './manifest.webmanifest', './icon.svg'];
// How long a navigation waits for the network before falling back to the cached page.
const NAV_TIMEOUT_MS = 3500;
const scopePath = new URL(self.registration.scope).pathname;

self.addEventListener('install', event => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then(cache => cache.addAll(SHELL))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches
      .keys()
      .then(keys => Promise.all(keys.filter(key => key.startsWith('gravity-lab-') && key !== CACHE).map(key => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

function remember(request, response) {
  if (response.ok && response.type === 'basic') {
    const copy = response.clone();
    caches.open(CACHE).then(cache => cache.put(request, copy));
  }
  return response;
}

function fromCache(request, fallback) {
  return caches.match(request).then(cached => cached || (fallback ? caches.match(fallback) : undefined));
}

function networkFirst(request, fallback, timeoutMs) {
  const network = fetch(request).then(response => remember(request, response));
  if (!timeoutMs) return network.catch(() => fromCache(request, fallback));
  // Race the network against a timer: on a slow connection show the cached copy instead of a blank wait,
  // but only if there is one; otherwise keep waiting for the network.
  return new Promise(resolve => {
    let settled = false;
    const timer = setTimeout(() => {
      fromCache(request, fallback).then(cached => {
        if (cached && !settled) {
          settled = true;
          resolve(cached);
        }
      });
    }, timeoutMs);
    network
      .then(response => {
        clearTimeout(timer);
        if (!settled) {
          settled = true;
          resolve(response);
        }
      })
      .catch(() => {
        clearTimeout(timer);
        fromCache(request, fallback).then(cached => {
          if (!settled) {
            settled = true;
            resolve(cached || Response.error());
          }
        });
      });
  });
}

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  const isSimulatorShell = url.pathname === scopePath || url.pathname === `${scopePath}index.html`;
  if (event.request.mode === 'navigate') {
    // Only the simulator page stands in for itself offline; atlas pages are cached under their own URLs.
    event.respondWith(networkFirst(event.request, isSimulatorShell ? './index.html' : null, NAV_TIMEOUT_MS));
    return;
  }
  // Hashed bundles and the pinned three.js copy never change, so they are served from cache first.
  const immutable = url.pathname.startsWith(`${scopePath}assets/`) || url.pathname.startsWith(`${scopePath}vendor/three-r128/`);
  if (immutable) {
    event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).then(response => remember(event.request, response))));
    return;
  }
  // Everything else (atlas engines, packs, data) stays fresh.
  event.respondWith(networkFirst(event.request));
});
