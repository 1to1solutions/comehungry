# Counting use — setup and how to read it

Five minutes, once. Then you never touch it again.

---

## What it collects

Counters. That is the whole list:

- how many visits, each day
- how long a visit lasted, added up (so an average can be worked out)
- which sections were reached
- which documents were opened
- which country the request came from
- how far into the front deck people got

## What it never collects

No IP addresses. No user agents. No cookies. No identifiers of any kind.
No per-session records — the individual visits are added into a daily total
and the detail is never written down, so there is nothing to go back to.

Country comes from Cloudflare's edge, server-side. The browser is never asked
where it is, and no location permission is ever requested.

Everything is on your own domain and your own Worker. The site still makes
zero third-party requests.

---

## Setting it up

### 1 · Make a place to keep the counters

Cloudflare dashboard → **Storage & Databases** → **KV** → **Create a namespace**

Name it `comehungry-counts`. That is all.

### 2 · Make the Worker

Cloudflare dashboard → **Workers & Pages** → **Create** → **Create Worker**

Name it `comehungry-count`. Take the hello-world it offers, click **Deploy**,
then **Edit code**. Delete what is there, paste in all of `count-worker.js`,
and click **Deploy** again.

### 3 · Connect the two

On the Worker → **Settings** → **Bindings** → **Add** → **KV namespace**

- Variable name: `COUNTS`
- KV namespace: `comehungry-counts`

Save.

### 4 · Set your viewing key

Same Settings page → **Variables and Secrets** → **Add**

- Type: **Secret**
- Name: `VIEW_KEY`
- Value: any long string you invent. Treat it like a password — anyone with it
  can see the numbers. Write it down somewhere you will find it again.

Deploy.

### 5 · Check the address matches

The site sends to:

    https://comehungry-count.timothyeldred.workers.dev/e

If your Worker ended up on a different subdomain, tell me the real one and I
will change the site to match. It is one line.

---

## Reading it

Open this, with your key where `YOURKEY` is:

    https://comehungry-count.timothyeldred.workers.dev/s?k=YOURKEY

You get a page in the same colours as the site: visits, average time, how many
countries, documents opened, a bar for each day, and lists of where people are,
which sections they reached, which documents they opened, and how far into the
front deck they got.

Bookmark it. Without the key it returns "Not found" — there is no login page to
find and nothing to guess at.

**Other views:**

    ...?k=YOURKEY&days=90     three months instead of thirty
    ...?k=YOURKEY&json=1      the raw numbers, if you ever want them elsewhere

---

## Things worth knowing

**Nothing appears until someone visits.** The first day will look empty.

**A visit is counted when the person leaves**, not when they arrive — that is
how the duration is measured. Someone who is still reading has not been counted
yet.

**Counters are kept 400 days**, then delete themselves. You do not have to
prune anything.

**It is capped at roughly a thousand visits a day** by Cloudflare's free
storage limits. If comehungry.org ever passes that, tell me and I will move it
to Analytics Engine — it is a small change.

**If the Worker is down, nothing breaks.** The beacon fails silently and the
site never notices.

**It only runs on comehungry.org.** Open the file locally or on a preview
domain and it sends nothing.
