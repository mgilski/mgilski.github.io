const version = '20200112001126';
const cacheName = `static::${version}`;

const buildContentBlob = () => {
  return ["/2019/09/19/peru.html","/2019/09/18/peru.html","/2019/09/17/peru.html","/2019/09/16/peru.html","/2019/09/15/peru.html","/2019/09/14/peru.html","/2019/09/13/peru.html","/2016/08/29/example-post-three.html","/2016/08/29/example-post-four.html","/2016/08/28/example-post-two.html","/about-us","/manifest.json","/map","/assets/search.json","/search","/assets/styles.css","/redirects.json","/sitemap.xml","/robots.txt","/category/Afryka/index.html","/category/Ameryka Południowa/index.html","/category/Ameryka Południowa/page/2/index.html","/category/Artykuły/index.html","/category/Brazylia/index.html","/category/Egipt/index.html","/category/Peru/index.html","/category/Praktycznie/index.html","/category/Przemyślenia/index.html","/category/Urugwaj/index.html","/index.html","/page/2/index.html","/feed.xml","/assets/logos/logo.svg", "/assets/default-offline-image.png", "/assets/scripts/fetch.js"
  ]
}

const updateStaticCache = () => {
  return caches.open(cacheName).then(cache => {
    return cache.addAll(buildContentBlob());
  });
};

const clearOldCache = () => {
  return caches.keys().then(keys => {
    // Remove caches whose name is no longer valid.
    return Promise.all(
      keys
        .filter(key => {
          return key !== cacheName;
        })
        .map(key => {
          console.log(`Service Worker: removing cache ${key}`);
          return caches.delete(key);
        })
    );
  });
};

self.addEventListener("install", event => {
  event.waitUntil(
    updateStaticCache().then(() => {
      console.log(`Service Worker: cache updated to version: ${cacheName}`);
    })
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(clearOldCache());
});

self.addEventListener("fetch", event => {
  let request = event.request;
  let url = new URL(request.url);

  // Only deal with requests from the same domain.
  if (url.origin !== location.origin) {
    return;
  }

  // Always fetch non-GET requests from the network.
  if (request.method !== "GET") {
    event.respondWith(fetch(request));
    return;
  }

  // Default url returned if page isn't cached
  let offlineAsset = "/offline/";

  if (request.url.match(/\.(jpe?g|png|gif|svg)$/)) {
    // If url requested is an image and isn't cached, return default offline image
    offlineAsset = "/assets/default-offline-image.png";
  }

  // For all urls request image from network, then fallback to cache, then fallback to offline page
  event.respondWith(
    fetch(request).catch(async () => {
      return (await caches.match(request)) || caches.match(offlineAsset);
    })
  );
  return;
});
