const CACHE_NAME = "weather-app-cache-v2";
const ASSETS_TO_PRECACHE = ["/", "/index.html", "/manifest.json", "/icon.svg", "/weather.svg"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.allSettled(
        ASSETS_TO_PRECACHE.map((url) =>
          cache.add(url).catch((err) => {
            console.warn("SW precache failed for " + url, err);
          })
        )
      );
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => (key !== CACHE_NAME ? caches.delete(key) : Promise.resolve()))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET" || req.url.startsWith("chrome-extension:") || req.url.startsWith("https://api.openweathermap.org")) {
    return;
  }
  event.respondWith(
    caches.match(req).then((cached) => {
      const fetchPromise = fetch(req)
        .then((res) => {
          if (res && res.status === 200 && res.type === "basic") {
            const resClone = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
          }
          return res;
        })
        .catch(() => cached || new Response("Offline", { status: 503, statusText: "Service Unavailable" }));
      return cached || fetchPromise;
    })
  );
});

self.addEventListener("push", (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || "Weather update";
  const options = {
    body: data.body || "Stay tuned for more weather info.",
    icon: data.icon || "/icon.svg",
  };
  event.waitUntil(self.registration.showNotification(title, options));
});
