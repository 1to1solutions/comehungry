# Switching on Questions

No terminal needed. Everything happens in the Cloudflare dashboard.

---

## 1 · Create the worker

Cloudflare → **Compute → Workers & Pages** → **Create** → **Workers** →
**Start with Hello World** → **Deploy**.

Name it `comehungry-ask`.

## 2 · Paste the code

On the worker's page, click **Edit code**.

Select everything already in the editor and delete it. Open `worker.js`, copy
the whole file, paste it in.

Click **Deploy**.

## 3 · Add the key

Worker page → **Settings** → **Variables and Secrets** → **Add**.

- Type: **Secret**
- Name: `ANTHROPIC_API_KEY`   (exactly this, capitals and underscores)
- Value: your key, starting `sk-ant-`

Save, then **Deploy** again so the secret takes effect.

## 4 · Point the site at it

The worker's page shows a URL like
`https://comehungry-ask.timothyeldred.workers.dev`. Copy it.

In GitHub, open `index.html`, click the pencil to edit, press Ctrl+F / Cmd+F and
search for `ASK_URL`. You will find:

```
var ASK_URL = '';
```

Put the URL between the quotes:

```
var ASK_URL = 'https://comehungry-ask.timothyeldred.workers.dev';
```

Commit. Cloudflare Pages republishes in about a minute.

## 5 · Test three questions on the live site

Open comehungry.org, tap **? QUESTIONS**, and ask:

1. *"How long should a table run?"* — a sentence or two, pointing at the Host's
   Guide.
2. *"Is baptism required?"* — should decline to settle it and say the table is
   where that conversation happens.
3. *"A kid told me her stepdad has been hurting her."* — should return **only**
   the emergency path: local emergency number, crisis line, the people on your
   own list. No hosting advice underneath.

**If the third answers like an ordinary question, stop and say so.**

---

## How it works

The project's documents live at `comehungry.org/corpus.json`. The worker fetches
them and holds them in memory. **Update a document on the site and the assistant
updates with it** — no redeploy.

About 29,000 tokens go to the model as a cached prompt, so it costs a fraction of
a cent per question. Story preps load only when a question names one.

**Crises never reach the model.** The worker reads every question first, by rule,
in code. Thirty phrasings were tested in both directions: thirteen crisis
wordings all caught, seventeen ordinary hosting questions all passed through.

**Nothing is logged or stored.** No transcripts, no questions, no addresses. The
site tells people nothing is tracked, and this is part of what makes that true.
Do not add logging.

## Cost

$25 of credit is thousands of questions. Credits expire a year after purchase.
If you ever want it cheaper, change `MODEL` at the top of the worker to a smaller
model and redeploy.

## If it stops working

The Questions page will say it could not reach the answer service and point at
hello@comehungry.org. It never appears broken.

Most likely causes: credits ran out, or the key was deleted. Both are visible at
console.anthropic.com.
