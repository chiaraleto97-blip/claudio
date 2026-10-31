const CACHE="claudio-9f2032729a";
const FILES=["./","index.html","manifest.webmanifest","qr.html","icone/icona-192.png","icone/icona-512.png","icone/icona-maskable-512.png","icone/apple-touch-icon.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET")return;
  const url=new URL(e.request.url);
  if(url.origin===location.origin){
    /* prima la rete, così si vede sempre l'ultima versione; senza rete, la copia salvata */
    e.respondWith(fetch(e.request).then(r=>{const c=r.clone();caches.open(CACHE).then(k=>k.put(e.request,c));return r}).catch(()=>caches.match(e.request,{ignoreSearch:true}).then(r=>r||caches.match("index.html"))));
  }else{
    /* caratteri e libreria del QR: la copia salvata subito, aggiornata in sottofondo */
    e.respondWith(caches.open(CACHE).then(k=>k.match(e.request).then(hit=>{const net=fetch(e.request).then(r=>{if(r.ok||r.type==="opaque")k.put(e.request,r.clone());return r}).catch(()=>hit);return hit||net})));
  }
});
