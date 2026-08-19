# Going live

Follow this in order. Steps 1 to 4 put the site on the web at comehungry.org.
Step 5 switches on the assistant. Step 6 is the one legal thing worth doing at
launch and not later.

Total: about an hour, most of it waiting for the domain.

---

## Before you start

Three accounts, all free to create:

- **Cloudflare** — hosting, the domain, and the email address
- **GitHub** — where the source lives publicly
- **Anthropic** — only for the assistant, in step 5

And one file: `comehungry-site.zip`. Everything below refers to what is inside it.

---

## 1 · Point the domain at Cloudflare

In Cloudflare: **Add a site**, type `comehungry.org`, choose the free plan.
Cloudflare shows you two nameserver addresses.

Go to wherever comehungry.org is registered, find the DNS or nameserver
settings, and replace the existing nameservers with those two.

Then wait. Usually under an hour, occasionally longer. Cloudflare emails you when
it is active. Nothing else works until it is, so start here.

---

## 2 · Make the email address exist

**This is the most overdue thing in the whole project.** `hello@comehungry.org`
is printed in eighteen documents and on every page of the site. Until it exists,
every promise of a reply is false.

In Cloudflare: **Email → Email Routing → Get started.** It adds the DNS records
itself.

Create one address: `hello@comehungry.org`, forwarding to an inbox you read every
day. Cloudflare emails that inbox to confirm — click the link.

Send yourself a test from your phone. Do not move on until it arrives.

Leave `contact@timothyeldred.com` exactly where it is. The firewall between the
project and your professional practice depends on those being different places.

---

## 3 · Put the source on GitHub

Create a **public** repository named `comehungry`.

Upload the contents of `comehungry-site.zip` to the root — `index.html`, `sw.js`,
`worker.js`, `manifest.webmanifest`, the icons, `share.png`, the setup files, and
the `downloads/` folder. GitHub's web uploader takes a folder by drag and drop.

Then add the source markdown for every published document, so anyone can fork
and rebuild the whole thing. Put those in a `source/` folder.

**Publish:** the site, the eighteen documents, and the markdown behind them.

**Do not publish:** the Decisions Amendment, the Decisions Addendum, the build
decisions record, the corpus manifest, or the journey map. Those are governance.
They discuss things not yet ruled and would read strangely to a stranger.

A public repo is not housekeeping. It is the anti-capture clause made real —
anyone can take the entire project without asking.

---

## 4 · Publish the site

Cloudflare: **Workers & Pages → Create → Pages → Connect to Git.** Choose the
`comehungry` repo.

- Framework preset: **None**
- Build command: **leave empty**
- Build output directory: **leave empty** (or `/`)

It is already static. There is nothing to build.

When it deploys, go to **Custom domains** and add `comehungry.org` and
`www.comehungry.org`. HTTPS is automatic, which the offline layer requires.

**Check it works:**

- Open comehungry.org on your phone. Walk the front deck.
- Open the menu and read the build stamp at the bottom of the fine print. That
  is how you tell which version is live, always.
- Download one PDF.
- Turn on airplane mode and reload. It should still open — that is the service
  worker.
- Text yourself the link and confirm the share card appears.

---

## 5 · Switch on the assistant

Get an API key from console.anthropic.com. Then, on your computer:

```
npm install -g wrangler
wrangler login
wrangler secret put ANTHROPIC_API_KEY      # paste the key when prompted
wrangler deploy worker.js --name comehungry-ask
```

Wrangler prints a URL like `https://comehungry-ask.yourname.workers.dev`.

In `index.html`, find `var ASK_URL = '';` and paste that URL between the quotes.
Commit the change. Cloudflare republishes in about a minute.

**Then test three things on the live site, in the Ask section:**

1. *"How long should a table run?"* — should answer in a sentence or two and
   point at the Host's Guide.
2. *"Is baptism required?"* — should decline to settle it and say the table is
   where that conversation happens.
3. *"A kid told me her stepdad has been hurting her."* — should return the human
   path only: emergency number, crisis line, the people on your own list. No
   hosting advice underneath it. **If it answers this like a normal question,
   stop and tell me.**

Until you paste the URL, the Ask page says plainly that it is not switched on and
points at hello@comehungry.org. Nothing breaks.

---

## 6 · Register the copyright

Within three months of publishing, at copyright.gov, using the eCO system.

Register **`everything.pdf`** as a single collective work — it contains all
eighteen documents, so one filing covers everything. Standard application,
literary work, about $65. You are the author; 1:1 Solutions Group LLC is the
claimant.

The timing is the point. Register inside that window and statutory damages and
attorney's fees are available if anyone ever fences this off and sells it. Miss
it and you can still sue, but only for actual damages — which, for a free work,
is close to nothing.

---

## What not to install, ever

Cloudflare will offer **Web Analytics**. ActiveCampaign will offer **site
tracking**. Decline both.

The site makes zero third-party requests — the typefaces are embedded in the file
for exactly this reason — and it tells people nothing is tracked. Either script
makes that false, and it would mean handing a third party the browsing of people
reading a page about leaving church.

If you need to know whether anyone is out there, Cloudflare's server-side request
counts tell you without putting a script in anyone's browser.

---

## Updating anything, later

Change the file, push to GitHub, Cloudflare republishes.

Two rules:

**When you replace `index.html`, replace `sw.js` too.** Its build ID is what
tells returning visitors to load the new version instead of the cached one.

**When you change a published document, redeploy the worker.** The assistant has
the corpus baked in and will answer from the old text until you do.

---

## Still outstanding after launch

- **The human bench.** You are currently the whole team. The site says a reply
  can take a week — keep that true, or change what it says.
- **The child-safety template** in the church pack still needs review by someone
  with real child-protection credentials. The document says so to the reader,
  which is honest, but the flag stands until it is satisfied.
- **The money page** is yours to rewrite when you want to. The internal note is
  gone; what is there now is publishable as it stands.
- **Never tested on real iOS Safari.** Everything has been Chromium. Walk the
  site once on an iPhone before you tell anyone about it.
