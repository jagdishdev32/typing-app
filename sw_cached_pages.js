const cacheName = "v3.1";

// let cacheAssets = ["index.html", "about.html", "/css/style.css", "/js/main.js"];
// let cacheAssets = ["index.html"];

// Call Install Event
self.addEventListener("install", (e) => {
  console.log("Service Worker: Installed");

  //   e.waitUntil(
  //     caches
  //       .open(cacheName)
  //       .then((cache) => {
  //         console.log("Service Worker: Caching Files");
  //         cache.addAll(cacheAssets);
  //         //   .then(() => console.log("done"))
  //         //   .catch((err) => console.log("adding files error"));
  //       })
  //       .then(() => self.skipWaiting())
  //   );
});

// Call Activate Event
self.addEventListener("activate", (e) => {
  console.log("Service Worker: Activated");

  // Remove unwanted caches
  e.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== cacheName) {
            console.log("Service Worker: Clearing Old Cache");
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Call Fetch Event
self.addEventListener("fetch", (e) => {
  console.log("Service Worker: Fetching");

  //   e.respondWith(
  //     fetch(e.request).catch(
  //       () => caches.match(e.request) // Loading files if in cache
  //     )
  //   );

  e.respondWith(
    fetch(e.request)
      .then((res) => {
        // Make copy/clone of response
        const resClone = res.clone();
        // Open cache
        caches.open(cacheName).then((cache) => {
          // Add response to cache
          cache.put(e.request, resClone);
        });
        return res;
      })
      .catch((err) => caches.match(e.request).then((res) => res))
  );
});
