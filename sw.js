/* comehungry.org — works without a signal.
   The shell is cached on install. Documents are cached the first time
   somebody opens them, so a host who prepped a story on Sunday still has it
   at the table on Thursday with no bars. */

// Bumped on every build. A new build gets fresh caches and the old ones are
// deleted on activate, so nobody is ever served yesterday's page.
var BUILD = '1307a2';
var SHELL = 'ch-shell-' + BUILD;
var DOCS  = 'ch-docs-' + BUILD;

var CORE = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon.svg',
  './icon-192.png',
  './icon-512.png',
  './read/hosts-guide.html',
  './read/keeping-people-safe.html',
  './read/why-this-exists.html'
];

self.addEventListener('install', function(e){
  e.waitUntil(
    caches.open(SHELL).then(function(c){ return c.addAll(CORE); })
      .then(function(){ return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.filter(function(k){
        return k !== SHELL && k !== DOCS;
      }).map(function(k){ return caches.delete(k); }));
    }).then(function(){ return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function(e){
  var req = e.request;
  if(req.method !== 'GET') return;

  var url = new URL(req.url);
  if(url.origin !== location.origin) return;   // never touch anything third-party

  // documents: serve from cache if we have it, otherwise fetch and keep a copy
  if(url.pathname.indexOf('/downloads/') !== -1 || url.pathname.indexOf('/read/') !== -1){
    e.respondWith(
      caches.match(req).then(function(hit){
        if(hit) return hit;
        return fetch(req).then(function(res){
          if(res && res.ok){
            var copy = res.clone();
            caches.open(DOCS).then(function(c){ c.put(req, copy); });
          }
          return res;
        });
      })
    );
    return;
  }

  // the page itself: network first so edits appear, cache as the fallback
  e.respondWith(
    fetch(req).then(function(res){
      if(res && res.ok){
        var copy = res.clone();
        caches.open(SHELL).then(function(c){ c.put(req, copy); });
      }
      return res;
    }).catch(function(){
      return caches.match(req).then(function(hit){
        return hit || caches.match('./index.html');
      });
    })
  );
});
