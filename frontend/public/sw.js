self.addEventListener("install", (e) => {
  self.skipWaiting(); // Force the old worker to stop running immediately
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) => {
        // Loop through and delete all old site caches
        return Promise.all(keys.map((key) => caches.delete(key)));
      })
      .then(() => {
        return self.clients.claim();
      })
      .then(() => {
        // Force all open browser tabs to reload with the new site
        return self.clients.matchAll().then((clients) => {
          clients.forEach((client) => client.navigate(client.url));
        });
      }),
  );
});
