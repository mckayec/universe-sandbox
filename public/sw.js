const CACHE='gravity-lab-shell-v3';
const SHELL=['./','./index.html','./manifest.webmanifest','./icon.svg'];
const scopePath=new URL(self.registration.scope).pathname;
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(SHELL)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
function remember(request,response){if(response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(request,copy))}return response}
function networkFirst(request,fallback){return fetch(request).then(response=>remember(request,response)).catch(()=>caches.match(request).then(cached=>cached||(fallback?caches.match(fallback):undefined)))}
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  const url=new URL(event.request.url);if(url.origin!==self.location.origin)return;
  const isSimulatorShell=url.pathname===scopePath||url.pathname===`${scopePath}index.html`;
  if(event.request.mode==='navigate'){
    // Only the simulator page stands in for itself offline; atlas pages are cached under their own URLs.
    event.respondWith(isSimulatorShell?networkFirst(event.request,'./index.html'):networkFirst(event.request));
    return;
  }
  // Vite's hashed bundles never change, so they can be served from cache; everything else (atlas engines, packs, data) stays fresh.
  if(url.pathname.startsWith(`${scopePath}assets/`)){event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request).then(response=>remember(event.request,response))));return}
  event.respondWith(networkFirst(event.request));
});
