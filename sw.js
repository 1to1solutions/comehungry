/* comehungry.org — works without a signal.
   The shell is cached on install. Documents are cached the first time
   somebody opens them, so a host who prepped a story on Sunday still has it
   at the table on Thursday with no bars. */

// Bumped on every build. A new build gets fresh caches and the old ones are
// deleted on activate, so nobody is ever served yesterday's page.
var BUILD = 'ca11f9';
var SHELL = 'ch-shell-' + BUILD;
var DOCS  = 'ch-docs-' + BUILD;

// The page itself. If this cannot be cached there is nothing to do offline
// anyway, so it is the only thing the install waits on.
var CORE = ['./', './index.html'];

// Worth having offline, but never worth failing an install over. Any of these
// may be absent on a partially uploaded site, and a missing file must not be
// able to take the whole worker down.
var EXTRA = [
  './manifest.webmanifest', './icon.svg', './icon-192.png', './icon-512.png',
  './f/type.css', './f/literata-300.woff2', './f/literata-400.woff2', './f/ibm-400.woff2',
  './read/hosts-guide', './read/keeping-people-safe', './read/why-this-exists', './read/invited', './read/the-table-card'
];


// Safari refuses a redirected response handed back by a service worker.
// Cloudflare Pages redirects /x.html to /x, so rebuild those cleanly.
function clean(res) {
  if (!res || !res.redirected) return res;
  return new Response(res.body, {
    status: res.status,
    statusText: res.statusText,
    headers: res.headers
  });
}

self.addEventListener('install', function(e){
  e.waitUntil(
    caches.open(SHELL).then(function(c){
      // each item on its own, so one 404 cannot reject the whole install
      var core = CORE.map(function(u){
        return c.add(u).catch(function(){ /* the page will still load from the network */ });
      });
      return Promise.all(core).then(function(){
        // these fill in quietly afterwards and are never waited on
        EXTRA.forEach(function(u){ c.add(u).catch(function(){}); });
      });
    }).then(function(){ return self.skipWaiting(); })
      .catch(function(){ return self.skipWaiting(); })
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
  if(url.pathname.indexOf('/downloads/') !== -1 || url.pathname.indexOf('/read/') !== -1 || url.pathname.indexOf('/f/') !== -1){
    e.respondWith(
      caches.match(req).then(function(hit){
        if(hit) return hit;
        return fetch(req).then(function(res){
          res = clean(res);
          if(res && res.ok && !res.redirected){
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
      res = clean(res);
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
