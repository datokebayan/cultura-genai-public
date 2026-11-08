const CACHE='mdoai-adaptengine-v1';
const FILES=['./','./index.html','./src/main.js','./src/model.js','./src/view.js','./src/controller.js','./src/adaptive-engine.js','./src/adaptive-data.js','./src/data.js','./src/styles.css','./assets/icon.svg','./assets/icon-192.png','./assets/icon-512.png','./manifest.webmanifest'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET'||new URL(e.request.url).origin!==location.origin)return;e.respondWith(fetch(e.request).then(r=>{if(r.ok){const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy))}return r}).catch(()=>caches.match(e.request).then(r=>r||caches.match('./index.html'))))});
