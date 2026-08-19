# The assistant

Answers practical questions about how a table works, at any hour, from the
project's own documents. It is not counseling, it does not settle questions of
belief, and crises never reach it.

---

## How it is built

`worker.js` is a Cloudflare Worker. Your Anthropic key lives there as a secret
and never reaches a browser — the same rule that keeps the ActiveCampaign key
out of the site.

The entire project is inside the worker: the founding document, the Host's
Guide, keeping people safe, all five church documents, shepherding, the Commons,
and how the fifty were chosen. About 29,000 tokens, sent as a cached prompt, so
it costs a fraction of a cent per question after the first one. All fifty story
preps are in there too and load only when a question names one.

There is no database and no search index. The corpus is small enough to hand it
the whole thing, so it can never fail to find something.

**Nothing is logged and nothing is stored.** No transcripts, no questions, no
addresses. The site tells people nothing is tracked, and this is part of what
makes that true. Do not add logging.

## Deploying it

```
npm install -g wrangler
wrangler login
wrangler secret put ANTHROPIC_API_KEY      # paste the key when prompted
wrangler deploy
```

Wrangler prints a URL like `https://comehungry-ask.YOURNAME.workers.dev`.
In `index.html`, find `var ASK_URL = '';` and paste it in.

Until you do, the Ask page says plainly that it is not switched on and points at
hello@comehungry.org. Nothing breaks.

## What it will not do

**Crises never reach the model.** The worker reads every question first. Anything
about harm, abuse, danger, a child at risk, or somebody in crisis is answered by
rule, in code, with the human path: local emergency number, crisis line, the
people on the host's own list. The model is never called. Addendum §1 says
crises never terminate in the AI — this is that, enforced rather than requested.

Thirty phrasings were tested in both directions: thirteen crisis wordings all
caught, seventeen ordinary hosting questions all passed through.

**It does not settle doctrine.** Your whole premise is that doctrinal agreement
is not the price of admission. An assistant answering "is this true" would make
the project take positions it has refused to take. It says the project does not
settle that, and the table is where those conversations happen.

**It does not counsel.** No grief, marriage, mental health, addiction, or faith
crises. It answers how the practice works.

**It does not invent.** If something is not in the documents it says so and
points at a person.

## The voice

It writes like one host talking to another. Short. No pleasantries, no "great
question," no bullet lists unless the question is about steps in order, no
exclamation marks. Two or three sentences is a normal answer.

It never pretends to be a person. It has no name and never says "when I hosted."
Asked what it is, it says: something that has read all the documents and can find
things in them fast.

## When you update a document

The corpus is baked into the worker so the assistant is pinned to a known
version. After changing a published document, rebuild and redeploy the worker,
or it will answer from the old text.

## Cost

Roughly a cent per question at most, less with caching. A hundred questions a day
is about a dollar. Cloudflare's free tier covers 100,000 requests a day. If you
want it cheaper, change `MODEL` at the top of `worker.js` to a smaller model.
