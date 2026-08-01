// ==========================================
// HAMS - Service Worker
// Makes the app installable and lets already-visited
// pages keep working with no internet connection.
// ==========================================

const CACHE_NAME = "hams-cache-v1";

const CORE_FILES = [
    "./index.html",
    "./dashboard.html",
    "./css/theme.css",
    "./css/login.css",
    "./css/dashboard.css",
    "./images/logo.svg",
    "./images/icon-192.png",
    "./images/icon-512.png",
    "./images/no-image.png"
];

// -----------------------------
// Install: cache the core app shell
// -----------------------------
self.addEventListener("install", function(event){

    event.waitUntil(

        caches.open(CACHE_NAME).then(function(cache){
            return cache.addAll(CORE_FILES);
        })

    );

    self.skipWaiting();

});

// -----------------------------
// Activate: clean up old cache versions
// -----------------------------
self.addEventListener("activate", function(event){

    event.waitUntil(

        caches.keys().then(function(keys){

            return Promise.all(

                keys.map(function(key){
                    if(key !== CACHE_NAME){
                        return caches.delete(key);
                    }
                })

            );

        })

    );

    self.clients.claim();

});

// -----------------------------
// Fetch: try the network first (so you always get the latest
// version when online), fall back to cache when offline.
// Successful responses are also saved to cache automatically,
// so pages you've visited before keep working offline.
// -----------------------------
self.addEventListener("fetch", function(event){

    // Only handle GET requests from our own origin
    if(event.request.method !== "GET"){
        return;
    }

    event.respondWith(

        fetch(event.request)
            .then(function(response){

                const responseClone = response.clone();

                caches.open(CACHE_NAME).then(function(cache){
                    cache.put(event.request, responseClone);
                });

                return response;

            })
            .catch(function(){

                return caches.match(event.request);

            })

    );

});
