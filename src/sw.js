var CACHE_NAME = '--fonts-cache';

self.addEventListener('fetch', function(e) {
  var url = new URL(e.request.url);
  if (url.protocol !== 'https:') return;

  if (url.host === 'fonts.googleapis.com' || url.host === 'fonts.gstatic.com') {
    var result = self.caches.match(e.request, {
      cacheName: CACHE_NAME
    }).catch(function() {}).then(function(res) {
      if (res) return res;

      return fetch(e.request).then(function(res) {
        if (!res.ok) {
          return res;
        }

        var resClone = res.clone();
        self.caches.open(CACHE_NAME).then(function(cache) {
          return cache.put(e.request, resClone);
        });

        return res;
      });
    });

    e.respondWith(result);
    return;
  }
});