/**
 * comehungry.org — the assistant
 *
 * Paste this whole file into the Cloudflare dashboard worker editor.
 * The Anthropic key is stored as a secret in the dashboard and never reaches
 * a browser. Nothing is logged and nothing is stored: no transcripts, no
 * questions, no addresses.
 *
 * The project's documents live at comehungry.org/corpus.json, so updating a
 * document on the site updates what the assistant knows. No redeploy needed.
 */

const MODEL = 'claude-sonnet-4-6';
const MAX_TOKENS = 700;        // answers are short by design
const MAX_QUESTION = 1500;     // characters
const MAX_TURNS = 12;
const CORPUS_URL = 'https://comehungry.org/corpus.json';

let CORPUS = null;             // held in memory between requests

/* -----------------------------------------------------------------
   Anything that sounds like somebody is in trouble never reaches the
   model. It is answered here, by rule, with the human path.
   ----------------------------------------------------------------- */
const ALARM = new RegExp([
  // self-harm
  'suicid', 'kill (my|her|him|them)self', 'want(s|ed)? to die', 'end (my|it all|her|his) life',
  'self.?harm', 'hurt(ing)? (myself|himself|herself|themsel)', 'cutting (myself|herself|himself)',
  'take (my|her|his) own life', 'not want to be here',
  // harm by another
  'abus', 'molest', 'assault', 'rape', 'incest', 'groom(ed|ing)',
  'beaten', 'beating (her|him|them|me)', '(hit|hitting|hurt|hurting|harmed|harming) (her|him|them|me|my)',
  'touch(ed|ing) (her|him|them|me|a kid|a child)', 'inappropriate(ly)? touch',
  'domestic violence', 'traffick', 'threat(en|ened|ening)', 'stalk(ed|ing)',
  // a child, in any sentence that also carries harm or fear
  '(kid|child|children|daughter|son|teen|minor|girl|boy)[^.?!]{0,60}(hurt|harm|abus|touch|unsafe|not safe|afraid|scared|scary|molest|assault)',
  '(hurt|harm|abus|touch|unsafe|afraid|scared)[^.?!]{0,60}(kid|child|children|daughter|son|teen|minor)',
  // disclosure and danger
  'disclos', 'told me (about|that|what|something)', 'something happened to (her|him|them|a kid|a child)',
  '(hit|struck|beat|choked|shoved) (his|her|their|the) (wife|husband|partner|girlfriend|boyfriend|kid|child|son|daughter)',
  'not safe', 'in danger', 'afraid (of|for)', 'emergency', 'crisis line', 'in crisis',
  'overdose', 'using again', 'relaps'
].join('|'), 'i');

const HUMAN_PATH =
"This one goes to people, not to a tool, and it goes now.\n\n" +
"If anyone is in immediate danger, call your local emergency number. " +
"In the US you can also call or text 988 for the Suicide and Crisis Lifeline; " +
"other countries have their own line.\n\n" +
"Then the people on your own list — the counselor, the pastor, the friend you " +
"named when you started your table. If a child may have been harmed, reporting " +
"to the authorities is the law, not our policy.\n\n" +
"When the urgent part is handled and you want a person from the project, " +
"write hello@comehungry.org. It can take a week; there are only a few of us. " +
"Do not wait on us for anything that cannot wait.";

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

function reply(obj, status) {
  return new Response(JSON.stringify(obj), {
    status: status || 200,
    headers: Object.assign({ 'content-type': 'application/json' }, CORS)
  });
}

async function corpus() {
  if (CORPUS) return CORPUS;
  const r = await fetch(CORPUS_URL, { cf: { cacheTtl: 3600, cacheEverything: true } });
  if (!r.ok) throw new Error('corpus unavailable');
  CORPUS = await r.json();
  return CORPUS;
}

/* A question naming a story pulls that story's prep in with it. */
function storiesFor(text, stories) {
  const t = text.toLowerCase();
  const hits = [];
  for (const n in stories) {
    const title = stories[n].t.toLowerCase();
    const bare = title.replace(/^the |^a /, '');
    if (t.includes(title) || t.includes(bare) ||
        new RegExp('\\bstory\\s*' + n + '\\b').test(t)) {
      hits.push(stories[n].text);
      if (hits.length >= 3) break;
    }
  }
  return hits;
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') return new Response(null, { headers: CORS });
    if (request.method !== 'POST') return new Response('POST only', { status: 405, headers: CORS });

    let body;
    try { body = await request.json(); }
    catch (e) { return reply({ error: 'bad request' }, 400); }

    const turns = Array.isArray(body.messages) ? body.messages.slice(-MAX_TURNS) : [];
    const last = turns.length ? String(turns[turns.length - 1].content || '') : '';
    if (!last.trim()) return reply({ error: 'no question' }, 400);
    if (last.length > MAX_QUESTION) return reply({ error: 'too long' }, 400);

    // the rule that does not move
    if (ALARM.test(last)) return reply({ reply: HUMAN_PATH, routed: 'human' });

    if (!env.ANTHROPIC_API_KEY) {
      return reply({ reply: "The assistant isn't switched on yet. Write hello@comehungry.org and a person will answer." });
    }

    let c;
    try { c = await corpus(); }
    catch (e) {
      return reply({ reply: "I couldn't reach the documents just now. Write hello@comehungry.org and a person will answer." });
    }

    const system = [{ type: 'text', text: c.system, cache_control: { type: 'ephemeral' } }];
    const extra = storiesFor(last, c.stories);
    if (extra.length) {
      system.push({ type: 'text', text: "The story prep the person is asking about:\n\n" + extra.join("\n\n") });
    }

    let res;
    try {
      res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-api-key': env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: MODEL,
          max_tokens: MAX_TOKENS,
          system: system,
          messages: turns.map(m => ({
            role: m.role === 'assistant' ? 'assistant' : 'user',
            content: String(m.content || '').slice(0, MAX_QUESTION)
          }))
        })
      });
    } catch (e) {
      return reply({ reply: "I couldn't reach the answer service. Write hello@comehungry.org and a person will answer." });
    }

    if (!res.ok) {
      return reply({ reply: "Something went wrong on our end. Write hello@comehungry.org and a person will answer." });
    }

    const data = await res.json();
    const text = (data.content || []).filter(b => b.type === 'text').map(b => b.text).join('').trim();
    return reply({ reply: text || "I don't know. Write hello@comehungry.org and a person will answer." });
  }
};
