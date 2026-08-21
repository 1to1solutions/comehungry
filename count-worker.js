/**
 * comehungry-count — first-party, aggregate-only.
 *
 * What it stores: counters. Nothing else.
 *   visits, seconds, route views, document opens, country totals.
 *
 * What it never stores: IP addresses, user agents, identifiers, cookies,
 * per-session records, or anything that could distinguish one person from
 * another. Two people in Michigan on the same day are one number here, and
 * there is no way to pull them apart afterwards because the detail is never
 * written down in the first place.
 *
 * Country comes from Cloudflare's edge (request.cf.country), server-side.
 * The browser is never asked where it is.
 *
 * One KV key per day, read-modify-write. At low volume that is fine; if this
 * ever sees thousands of visits a day, move to Analytics Engine.
 */

const DAYS_KEPT = 400;      // a bit over a year, then it ages out
const MAX_BODY  = 2048;     // a beacon is a few hundred bytes; anything larger is junk

function today() {
  return new Date().toISOString().slice(0, 10);
}

function blank() {
  return { v: 0, s: 0, n: 0, r: {}, d: {}, c: {}, p: {} };
}

function clampInt(x, lo, hi) {
  x = parseInt(x, 10);
  if (!isFinite(x)) return 0;
  return Math.max(lo, Math.min(hi, x));
}

function safeKey(x, max) {
  return String(x || '').replace(/[^\w\-./]/g, '').slice(0, max);
}

async function record(env, beacon, country) {
  const key = 'd:' + today();
  let day;
  try { day = JSON.parse(await env.COUNTS.get(key)) || blank(); }
  catch (e) { day = blank(); }

  // a visit, and how long it lasted
  if (beacon.v) {
    day.v += 1;
    const secs = clampInt(beacon.s, 0, 60 * 60 * 4);   // cap at four hours
    if (secs > 0) { day.s += secs; day.n += 1; }
  }

  // which sections were reached
  if (Array.isArray(beacon.r)) {
    beacon.r.slice(0, 40).forEach(function (r) {
      const k = safeKey(r, 24);
      if (k) day.r[k] = (day.r[k] || 0) + 1;
    });
  }

  // which documents were opened
  if (Array.isArray(beacon.d)) {
    beacon.d.slice(0, 40).forEach(function (d) {
      const k = safeKey(d, 48);
      if (k) day.d[k] = (day.d[k] || 0) + 1;
    });
  }

  // how deep into the front deck people got, bucketed
  if (beacon.p != null) {
    const k = String(clampInt(beacon.p, 0, 20));
    day.p[k] = (day.p[k] || 0) + 1;
  }

  const c = safeKey(country, 4) || 'ZZ';
  day.c[c] = (day.c[c] || 0) + 1;

  await env.COUNTS.put(key, JSON.stringify(day), {
    expirationTtl: DAYS_KEPT * 24 * 60 * 60
  });
}

async function readDays(env, n) {
  const out = [];
  const now = new Date();
  for (let i = 0; i < n; i++) {
    const d = new Date(now.getTime() - i * 86400000).toISOString().slice(0, 10);
    let day = null;
    try { day = JSON.parse(await env.COUNTS.get('d:' + d)); } catch (e) {}
    if (day) out.push(Object.assign({ date: d }, day));
  }
  return out;
}

function totals(days) {
  const t = { visits: 0, seconds: 0, sessions: 0, routes: {}, docs: {}, countries: {}, depth: {} };
  days.forEach(function (d) {
    t.visits += d.v || 0; t.seconds += d.s || 0; t.sessions += d.n || 0;
    ['r:routes', 'd:docs', 'c:countries', 'p:depth'].forEach(function (pair) {
      const from = pair.split(':')[0], to = pair.split(':')[1];
      Object.keys(d[from] || {}).forEach(function (k) {
        t[to][k] = (t[to][k] || 0) + d[from][k];
      });
    });
  });
  return t;
}

const NAMES = {
  home: 'The front deck', why: 'Why this exists', table: 'Start a table',
  stories: 'The fifty stories', tonight: "Run tonight's table", church: 'For churches',
  library: 'The library', hand: 'Ask for a hand', ask: 'Questions',
  pass: 'Not the one to lead it', install: 'Put it on your phone'
};

function page(days) {
  const t = totals(days);
  const avg = t.sessions ? Math.round(t.seconds / t.sessions) : 0;
  const mins = Math.floor(avg / 60), secs = avg % 60;
  const rows = function (obj, label, namer) {
    const ks = Object.keys(obj).sort(function (a, b) { return obj[b] - obj[a]; }).slice(0, 25);
    if (!ks.length) return '<p class="none">Nothing yet.</p>';
    const max = obj[ks[0]] || 1;
    return '<table>' + ks.map(function (k) {
      const pct = Math.round(100 * obj[k] / max);
      return '<tr><td>' + (namer ? (namer[k] || k) : k) + '</td>' +
             '<td class="bar"><i style="width:' + pct + '%"></i></td>' +
             '<td class="n">' + obj[k] + '</td></tr>';
    }).join('') + '</table>';
  };
  const spark = days.slice().reverse().map(function (d) {
    return '<span title="' + d.date + ': ' + (d.v || 0) + '"><i style="height:' +
      Math.max(2, Math.round(40 * (d.v || 0) / Math.max(1, Math.max.apply(null, days.map(function (x) { return x.v || 0; }))))) +
      'px"></i></span>';
  }).join('');

  return `<!doctype html><html><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>come hungry — use</title>
<style>
:root{--night:#17130F;--lamp:#F2EADC;--dim:#9C8F7F;--gold:#E8A951;--rule:#3A3129}
*{box-sizing:border-box}
body{margin:0;padding:2rem 1.2rem 4rem;background:var(--night);color:var(--lamp);
  font:15px/1.6 -apple-system,BlinkMacSystemFont,"Segoe UI",system-ui,sans-serif;
  max-width:46rem;margin-inline:auto}
h1{font-size:1.5rem;font-weight:600;margin:0 0 .3rem}
.sub{color:var(--dim);font-size:.86rem;margin:0 0 2.4rem}
h2{font-size:.72rem;letter-spacing:.18em;text-transform:uppercase;color:var(--gold);
  margin:2.6rem 0 .8rem;font-weight:600}
.big{display:flex;gap:2.4rem;flex-wrap:wrap;margin-bottom:.5rem}
.big div b{display:block;font-size:2rem;font-weight:600;line-height:1.1}
.big div span{font-size:.76rem;color:var(--dim)}
table{width:100%;border-collapse:collapse}
td{padding:.42rem 0;border-bottom:1px solid var(--rule);font-size:.9rem;vertical-align:middle}
td.bar{width:55%;padding-left:1rem}
td.bar i{display:block;height:6px;background:var(--gold);opacity:.55;border-radius:2px}
td.n{text-align:right;color:var(--dim);width:3.5rem;font-variant-numeric:tabular-nums}
.spark{display:flex;align-items:flex-end;gap:2px;height:42px;margin:.4rem 0 0}
.spark span{flex:1;display:flex;align-items:flex-end}
.spark i{display:block;width:100%;background:var(--gold);opacity:.5;border-radius:1px}
.none{color:var(--dim);font-size:.86rem}
footer{margin-top:3.5rem;padding-top:1.2rem;border-top:1px solid var(--rule);
  color:var(--dim);font-size:.76rem;line-height:1.7}
</style></head><body>
<h1>Use</h1>
<p class="sub">Counters only. No identifiers are collected, so there is nothing here to trace back to a person.</p>

<div class="big">
  <div><b>${t.visits}</b><span>visits</span></div>
  <div><b>${mins}m ${secs}s</b><span>average time</span></div>
  <div><b>${Object.keys(t.countries).length}</b><span>countries</span></div>
  <div><b>${Object.values(t.docs).reduce(function(a,b){return a+b;},0)}</b><span>documents opened</span></div>
</div>
<div class="spark">${spark}</div>

<h2>Where people are</h2>
${rows(t.countries)}

<h2>Sections reached</h2>
${rows(t.routes, 'route', NAMES)}

<h2>Documents opened</h2>
${rows(t.docs)}

<h2>How far into the front deck</h2>
${rows(t.depth)}

<footer>
Aggregate counters, kept ${DAYS_KEPT} days, then deleted automatically.<br>
No IP addresses, user agents, cookies, or per-session records are written down at any point.<br>
Country comes from Cloudflare's edge, not from the browser.
</footer>
</body></html>`;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.pathname ? request.url : request.url);
    const origin = request.headers.get('Origin') || '';
    const ok = /^https:\/\/(www\.)?comehungry\.org$/.test(origin) || origin === '';
    const cors = {
      'Access-Control-Allow-Origin': ok && origin ? origin : 'https://comehungry.org',
      'Access-Control-Allow-Methods': 'POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    };

    if (request.method === 'OPTIONS') return new Response(null, { headers: cors });

    // ---- the beacon ----
    if (request.method === 'POST' && url.pathname === '/e') {
      if (!ok) return new Response('no', { status: 403, headers: cors });
      const raw = await request.text();
      if (raw.length > MAX_BODY) return new Response('', { status: 204, headers: cors });
      let beacon;
      try { beacon = JSON.parse(raw); } catch (e) { return new Response('', { status: 204, headers: cors }); }
      try { await record(env, beacon, request.cf && request.cf.country); } catch (e) {}
      return new Response('', { status: 204, headers: cors });
    }

    // ---- the dashboard ----
    if (url.pathname === '/s') {
      const key = url.searchParams.get('k') || '';
      if (!env.VIEW_KEY || key !== env.VIEW_KEY) {
        return new Response('Not found', { status: 404 });
      }
      const n = Math.max(1, Math.min(120, parseInt(url.searchParams.get('days') || '30', 10)));
      const days = await readDays(env, n);
      if (url.searchParams.get('json') === '1') {
        return new Response(JSON.stringify({ days: days, totals: totals(days) }, null, 2),
          { headers: { 'Content-Type': 'application/json' } });
      }
      return new Response(page(days), {
        headers: { 'Content-Type': 'text/html;charset=utf-8', 'Cache-Control': 'no-store' }
      });
    }

    return new Response('Not found', { status: 404 });
  }
};
