# The ask form — setup

Two jobs. The first makes the form arrive in your inbox. The second makes your
reply come from the project rather than from you.

---

# Part one · the Worker that sends the mail

The form posts to your own Worker, which sends you one email and stores
nothing. There is no database to check and nobody is added to a list.

Cloudflare Email Routing can *receive* mail but cannot *send* it, so the Worker
needs a sending service. Resend is free for 3,000 emails a month, which at your
volume is effectively forever.

### 1 · Resend

Go to **resend.com** and sign up.

**Add your domain.** Resend gives you three DNS records to add. Because
comehungry.org is already on Cloudflare, this is quick:

- Cloudflare → comehungry.org → **DNS** → **Add record**, once per record
- Resend shows the exact type, name, and value — copy them across
- **Set the proxy status to DNS only** (grey cloud, not orange) on all three
- Back in Resend, click **Verify**. Usually a few minutes.

Then **API Keys** → **Create API Key**. Copy it now; you cannot see it again.

⚠️ Adding a domain to Resend touches your DKIM and SPF records. If mail to
hello@comehungry.org ever misbehaves afterwards, that is where to look first.

### 2 · The Worker

Cloudflare → **Workers & Pages** → **Create** → **Start with Hello World!**

Name it `comehungry-ask-form`. Deploy, then **Edit code**, delete everything,
paste in all of `ask-worker.js`, and Deploy again.

### 3 · Three secrets

Worker → **Settings** → **Variables and Secrets** → **Add**, three times. Set
the type to **Secret** for the first one; the others can be Text.

| Name | Value |
|---|---|
| `RESEND_KEY` | the key you copied from Resend |
| `TO_ADDRESS` | where you want it to land, e.g. `timothyeldred@1to1solutions.com` |
| `FROM_ADDRESS` | `come hungry <hello@comehungry.org>` |

Deploy.

### 4 · Check the address matches

The site posts to:

    https://comehungry-ask-form.timothyeldred.workers.dev/ask

If your Worker landed on a different name, say so and the site can be pointed
at the real one. It is a single line.

---

# Part two · replying as hello@comehungry.org

Right now hello@comehungry.org forwards to you, but when you reply it goes out
from your own address. The person sees your personal email. This fixes that.

You need an app password first, because Gmail will not accept your normal one.

### 1 · An app password

- **myaccount.google.com** → **Security**
- Two-step verification must be on. If it is not, turn it on first.
- Search the page for **App passwords**
- Name it `comehungry` and create it
- Copy the sixteen characters. Ignore the spaces.

### 2 · Add the send-as address

In Gmail (on a computer — this cannot be done in the mobile app):

- **Settings** (gear) → **See all settings** → **Accounts and Import**
- **Send mail as** → **Add another email address**
- Name: `come hungry` — Email: `hello@comehungry.org`
- **Untick "Treat as an alias."** This matters. Ticked, replies still look like
  they came from you.
- Next → SMTP settings:

| Field | Value |
|---|---|
| SMTP Server | `smtp.gmail.com` |
| Port | `587` |
| Username | your full Gmail address |
| Password | the sixteen-character app password |
| Security | **TLS** |

- **Add Account.** Google sends a confirmation code to hello@comehungry.org,
  which forwards to you. Paste the code in.

### 3 · Make it the default for replies

Same settings page, under **Send mail as**:

- Click **make default** next to hello@comehungry.org
- Choose **Reply from the same address the message was sent to**

That second setting is the one that does the work. Anything arriving at
hello@ is answered from hello@, automatically, without you thinking about it.

### 4 · Test it

Send yourself a message from another address to hello@comehungry.org. Reply.
Check what the From line says on the copy you receive. It should read
**come hungry <hello@comehungry.org>**.

---

## What the person on the other end sees

They fill in the form. You get an email titled with what they asked about and
their name. Hitting reply answers them directly, from hello@comehungry.org.

Your name and your personal address appear nowhere — not in the documents, not
on the site, and not in the reply.
