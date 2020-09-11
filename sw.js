const staticCacheName = 'site-static-v1';
const dynamicCacheName = 'site-dynamic-v1';
const assets = [
  '/',
  '/index.html',
  '/js/app.js',
  '/js/main.js',
  '/css/style.css',
  '/img/bg.jpg',
  '/img/icons/icon-96x96.png',
  '/img/icons/icon-192x192.png',
  '/img/icons/icon-512x512.png',
  'fallback.html'
];
//Install Service worker
//cahe size limit function
const limitCacheSize = (name, size) => {
  caches.open(name).then(cache => {
    cache.keys().then(keys => {
      if(keys.length > size){
        cache.delete(keys[0]).then(limitCacheSize(name, size));
      }
    })
  })
}

//The install event
self.addEventListener('install', evt => {
  //console.log('service worker has been installed');
  //Pre-Caching Assets
  evt.waitUntil(
    caches.open(staticCacheName).then(cache => {
      console.log('caching shell assets');
      cache.addAll(assets);
    })
  );
  
});

//Activate event
self.addEventListener('activate', evt => {
  //console.log('Service worker has been activated');
  //cahe versioning
  evt.waitUntil(
    caches.keys().then(keys => {
      //console.log(keys);
      //Delete old caches
      return Promise.all(keys
        .filter(key => key !== staticCacheName && key !== dynamicCacheName)
        .map(key => caches.delete(key))
        )
    })
  );
});

//Fetch event
self.addEventListener('fetch', evt => {
  //console.log('fetch event', evt);
  //Getting Cached Assets
  evt.respondWith(
    caches.match(evt.request).then(cacheRes => {
      return cacheRes || fetch(evt.request).then(fetchRes => {
        //Dynamic caching
        return caches.open(dynamicCacheName).then(cache => {
          cache.put(evt.request.url, fetchRes.clone());
          //check size limit
          limitCacheSize(dynamicCacheName, 15);
          return fetchRes;
        })
      });
    }).catch(() => {
      //Default error page
      if(evt.request.url.indexOf('.html') > -1){
        return caches.match('fallback.html');
      }
    })
  );
});
