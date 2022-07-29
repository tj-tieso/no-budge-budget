const APP_PREFIX = "Budget-";
const VERSION = "version_01";
const CACHE_NAME = APP_PREFIX + VERSION;
const FILES_TO_CACHE = [
  "./index.html",
  "./css/styles.css",
  "./js/index.js",
  "./js/idb.js",
  // bootstrap
  // "./icons",
];

// Cache resources
self.addEventListener("install", function (e) {
  e.waitUntil(
    // find CACHE_NAME with caches.open()
    caches.open(CACHE_NAME).then(function (cache) {
      console.log(CACHE_NAME + " installed");
      // add all files in the FILES_TO_CACHE [] to the cache
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

// Intercept Fetch Requests
self.addEventListener("fetch", function (e) {
  console.log("fetch request : " + e.request.url);
  e.respondWith(
    // use .match() to determine if the resource already exists in caches
    caches.match(e.request).then(function (request) {
      if (request) {
        // if cache is available, respond with cache
        console.log("responding with cache : " + e.request.url);
        return request;
      } else {
        // if there are no cache, try fetching request
        console.log("file is not cached, fetching : " + e.request.url);
        return fetch(e.request);
      }
    })
  );
});

// Clear out old versions of cache
self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keyList) {
      let cacheKeeplist = keyList.filter(function (key) {
        return key.indexOf(APP_PREFIX);
      });

      cacheKeeplist.push(CACHE_NAME);

      // resolves once all old versions of the cache have been deleted
      return Promise.all(
        keyList.map(function (key, i) {
          if (cacheKeeplist.indexOf(key) === -1) {
            console.log("deleting cache : " + keyList[i]);
            return caches.delete(keyList[i]);
          }
        })
      );
    })
  );
});
