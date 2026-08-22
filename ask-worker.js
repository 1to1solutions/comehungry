/**
 * comehungry-ask-form — takes a submission and emails it to you.
 *
 * Nothing is stored. The Worker receives the form, sends one email, and
 * forgets. There is no database to check, no list anybody is added to, and no
 * third-party script on the page — the form posts to your own domain.
 *
 * Needs three secrets: RESEND_KEY, TO_ADDRESS, FROM_ADDRESS.
 */

const MAX_BODY = 8000;

function clean(x, max) {
  return String(x == null ? '' : x).replace(/[\u0000-\u001F\u007F]/g, ' ').trim().slice(0, max);
}

function esc(x) {
  return String(x).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function looksLikeEmail(x) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(x);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin') || '';
    const allowed = /^https:\/\/(www\.)?comehungry\.org$/.test(origin);
    const cors = {
      'Access-Control-Allow-Origin': allowed ? origin : 'https://comehungry.org',
      'Access-Control-Allow-Methods': 'POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    };

    if (request.method === 'OPTIONS') return new Response(null, { headers: cors });
    if (request.method !== 'POST' || url.pathname !== '/ask') {
      return new Response('Not found', { status: 404 });
    }
    if (!allowed) return new Response('no', { status: 403, headers: cors });

    const raw = await request.text();
    if (raw.length > MAX_BODY) {
      return new Response(JSON.stringify({ ok: false }), { status: 413, headers: cors });
    }

    let f;
    try { f = JSON.parse(raw); } catch (e) {
      return new Response(JSON.stringify({ ok: false }), { status: 400, headers: cors });
    }

    // the honeypot: a real person never fills this in
    if (clean(f.website, 40)) {
      return new Response(JSON.stringify({ ok: true }), { headers: cors });
    }

    const need  = clean(f.need, 120);
    const name  = clean(f.name, 120);
    const email = clean(f.email, 200);
    const phone = clean(f.phone, 60);
    const place = clean(f.place, 160);
    const note  = clean(f.note, 4000);

    if (!name || !looksLikeEmail(email) || !place) {
      return new Response(JSON.stringify({ ok: false, why: 'incomplete' }), { status: 400, headers: cors });
    }

    const country = (request.cf && request.cf.country) || '';
    const subject = 'come hungry — ' + (need || 'someone asked for help') + ' — ' + name;

    const text =
      (need ? 'ASKING ABOUT\n' + need + '\n\n' : '') +
      'NAME\n' + name + '\n\n' +
      'EMAIL\n' + email + '\n\n' +
      (phone ? 'PHONE\n' + phone + '\n\n' : '') +
      'WHERE\n' + place + (country ? '  (' + country + ')' : '') + '\n\n' +
      (note ? 'WHAT THEY SAID\n' + note + '\n\n' : '') +
      '—\nReply straight to this message; it goes back to them.\n' +
      'Sent from the form at comehungry.org. Nothing was stored.';

    const html =
      '<div style="font:15px/1.65 -apple-system,BlinkMacSystemFont,Segoe UI,system-ui,sans-serif;color:#17130F;max-width:34rem">' +
      (need ? '<p style="margin:0 0 1.2rem;font-size:13px;letter-spacing:.12em;text-transform:uppercase;color:#A8721F">' + esc(need) + '</p>' : '') +
      '<p style="margin:0 0 .3rem;font-size:20px"><b>' + esc(name) + '</b></p>' +
      '<p style="margin:0 0 1.2rem;color:#6E6355">' +
        '<a href="mailto:' + esc(email) + '">' + esc(email) + '</a>' +
        (phone ? ' &nbsp;·&nbsp; ' + esc(phone) : '') +
        '<br>' + esc(place) + (country ? ' (' + esc(country) + ')' : '') +
      '</p>' +
      (note ? '<div style="border-left:2px solid #E8A951;padding:.2rem 0 .2rem 1rem;margin:0 0 1.4rem;white-space:pre-wrap">' + esc(note) + '</div>' : '') +
      '<p style="margin:0;font-size:12px;color:#9C8F7F">Reply straight to this message; it goes back to them.<br>' +
      'Sent from the form at comehungry.org. Nothing was stored.</p></div>';

    try {
      const r = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + env.RESEND_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: env.FROM_ADDRESS,          // e.g. come hungry <hello@comehungry.org>
          to: [env.TO_ADDRESS],
          reply_to: email,                 // hitting reply answers the person
          subject: subject,
          text: text,
          html: html
        })
      });
      if (!r.ok) {
        return new Response(JSON.stringify({ ok: false, why: 'send' }), { status: 502, headers: cors });
      }
    } catch (e) {
      return new Response(JSON.stringify({ ok: false, why: 'send' }), { status: 502, headers: cors });
    }

    return new Response(JSON.stringify({ ok: true }), { headers: cors });
  }
};
