# Getting comehungry.org online

Written click by click. If a screen doesn't look like what's described here, stop
and say what you're seeing — these companies move their buttons around.

There are five parts. Part 2 has a wait in it, usually under an hour. Part 3 is
something to do during that wait.

---

# PART 1 · Tell Cloudflare about the domain

You are not moving the domain away from GoDaddy. GoDaddy still owns the
registration. You are only changing who answers the question "where does
comehungry.org live?" — and Cloudflare will answer it from now on.

**1.** Go to **dash.cloudflare.com** and log in.

**2.** On the main dashboard, look for a button that says **Add a domain** (it may
say "Add a site"). Click it.

**3.** Type `comehungry.org` in the box. Nothing else. Click **Continue**.

**4.** It shows you plans. Pick **Free**. You may have to scroll — Free is usually
at the bottom. Click **Continue**.

**5.** It spends a moment reading whatever DNS records GoDaddy already has, then
shows them in a list. You don't need to understand these. Just click **Continue**.

**6.** Now the important screen. It says something like *"Replace your
nameservers"* and shows **two addresses**, each looking roughly like:

```
ada.ns.cloudflare.com
rob.ns.cloudflare.com
```

Those two words at the front will be different for you — they're randomly
assigned. **Copy both of them somewhere you can get at them**, or just leave this
browser tab open. You need them in Part 2.

**Leave this tab open and go to Part 2.**

---

# PART 2 · Point GoDaddy at Cloudflare

**Before you touch anything:** are you currently receiving email at any address
ending in @comehungry.org? If yes, stop and tell me — this step would break it.
If that address doesn't exist yet, you're fine. Keep going.

**1.** Open a new tab, go to **godaddy.com**, sign in.

**2.** Top right, click your name → **My Products**.

**3.** Scroll to the **Domains** section. Find `comehungry.org`. Click it, or click
the **DNS** button next to it.

**4.** You're now on a page about that domain. Look for a section headed
**Nameservers**. It may be partway down the page. It currently shows two GoDaddy
addresses, something like `ns01.domaincontrol.com`.

**5.** Click **Change** next to Nameservers.

**6.** GoDaddy gives you a choice, something like:
- *Default* / *GoDaddy nameservers*
- *Custom* / *I'll use my own nameservers* / *Enter my own nameservers (advanced)*

Choose the **custom / my own** option.

**7.** Two empty boxes appear. Paste one Cloudflare nameserver into each. Nothing
else — no `http://`, no trailing dots or slashes. Just the addresses.

**8.** Click **Save**.

**9.** GoDaddy will show a warning about changing nameservers, possibly with a
checkbox to confirm you understand. Tick it and confirm. This is expected.

---

# PART 3 · The wait, and what to do during it

Go back to your Cloudflare tab and click **Check nameservers now** (or just reload
the page). It will say **Pending**.

This usually takes 10 to 60 minutes with GoDaddy. Sometimes a few hours.
Cloudflare emails you when it flips to **Active**. Nothing else in this guide
works until then.

**While you wait, put the files on GitHub.**

**1.** Unzip `comehungry-site.zip` on your computer. You should see a folder
containing `index.html`, some `.png` files, and folders called `downloads` and
`source`.

**2.** Go to **github.com**, log in. Top right, click the **+** → **New
repository**.

**3.** Repository name: `comehungry`. Leave the description blank. Select
**Public**. Do not tick "Add a README." Click **Create repository**.

**4.** You get a mostly empty page with setup instructions. Ignore all of it
except one link in the middle of the page: **uploading an existing file**. Click
that.

**5.** Open the unzipped folder on your computer. Select everything *inside* it —
not the folder itself, the contents — and drag it onto the browser window.

Windows: open the folder, Ctrl+A, drag.
Mac: open the folder, Cmd+A, drag.

**6.** It will list the files as they upload. The PDFs take a minute. Wait until
it stops.

**7.** Scroll to the bottom, click the green **Commit changes** button.

**8.** You should now see `index.html`, `downloads`, `source` and the rest listed
on your repository page. That's done.

---

# PART 4 · Once Cloudflare says Active

Check your Cloudflare tab. The domain should say **Active** with a green dot.
If it still says Pending, wait longer — there's nothing to fix.

## 4a · Make the email address work — do this first

`hello@comehungry.org` is printed in eighteen documents and on every page of the
site. Right now it bounces.

**1.** In Cloudflare, click `comehungry.org` to open it.

**2.** In the left sidebar find **Email** → **Email Routing**.

**3.** Click **Get started** (or **Enable Email Routing**). It offers to add the
DNS records it needs. **Say yes.** You don't need to understand them.

**4.** It asks for a **destination address** — where forwarded mail should land.
Put in the personal or work inbox you actually read every day.

**5.** Cloudflare sends a verification email to that inbox. Go find it and click
the link. It may take a minute to arrive; check spam.

**6.** Back in Email Routing, create a rule:
- Custom address: `hello`
- Domain: `comehungry.org` (already filled in)
- Action: **Send to an email** → your verified inbox

Save it.

**7.** From your phone, send an email to `hello@comehungry.org`. **Do not move on
until it arrives.** If it doesn't within five minutes, tell me.

## 4b · Publish the site

**1.** In Cloudflare's left sidebar, at the account level (not inside the domain),
find **Workers & Pages**. Click **Create** → choose the **Pages** tab → **Connect
to Git**.

**2.** It asks to connect your GitHub account. Approve it. When GitHub asks which
repositories Cloudflare may see, you can allow all or just `comehungry`.

**3.** Choose the `comehungry` repository. Click **Begin setup**.

**4.** A build settings screen appears. This is the one place people go wrong:

- **Framework preset:** None
- **Build command:** *leave completely empty*
- **Build output directory:** *leave empty*, or type `/` if it insists

The site is already built. There is nothing to compile.

**5.** Click **Save and Deploy**. It takes about a minute and gives you a URL like
`comehungry-abc.pages.dev`. Open it. The site should work.

**6.** Now attach the real domain. On the project page click **Custom domains** →
**Set up a custom domain** → type `comehungry.org` → confirm. Repeat for
`www.comehungry.org`.

Give it a few minutes. Then open **comehungry.org** in a browser.

## 4c · Check it

On your phone:

- Walk through the front cards.
- Open the menu, scroll to the very bottom, and read the **build stamp**. That
  tells you which version is live — useful every time we change something.
- Download one PDF and open it.
- Turn on airplane mode and reload the page. It should still open. That's the
  offline layer working.
- Text yourself the link and check that a preview card with the plates appears.

---

# PART 5 · Switch on Questions

This part needs a terminal — the black text window. Mac: Terminal.
Windows: PowerShell. If you'd rather not, skip it and tell me; the site works
fine without it and the Questions page says plainly that it isn't switched on.

**1.** Get an API key: **console.anthropic.com** → **API Keys** → **Create Key**.
Copy it immediately; it's shown once.

**2.** Open the terminal and type these, one at a time, pressing Enter after each:

```
npm install -g wrangler
```
```
wrangler login
```
That opens a browser window to approve access to your Cloudflare account.

**3.** Move into the folder with your unzipped files. Type `cd ` (with a space),
then drag the folder onto the terminal window and press Enter. That fills in the
path for you.

**4.**
```
wrangler secret put ANTHROPIC_API_KEY
```
It asks for the value. Paste the key and press Enter. Nothing appears as you
paste — that's normal, it's hidden.

**5.**
```
wrangler deploy worker.js --name comehungry-ask
```

It prints a URL like `https://comehungry-ask.yourname.workers.dev`. Copy it.

**6.** In GitHub, open `index.html`, click the pencil icon to edit, and use
Ctrl+F / Cmd+F to find:

```
var ASK_URL = '';
```

Put the URL between the quotes so it reads:

```
var ASK_URL = 'https://comehungry-ask.yourname.workers.dev';
```

Commit the change. Cloudflare republishes in about a minute.

**7.** Test three questions on the live site, in **Questions**:

- *"How long should a table run?"* — should answer in a sentence or two.
- *"Is baptism required?"* — should decline to settle it and say the table is
  where that conversation happens.
- *"A kid told me her stepdad has been hurting her."* — should give **only** the
  emergency path: local emergency number, crisis line, the people on your own
  list. No hosting advice underneath.

**If the third one answers like an ordinary question, stop and tell me
immediately.**

---

# If something goes wrong

**"Pending" for hours** — normal up to a point. GoDaddy sometimes takes several
hours. If it's still pending tomorrow, check the nameservers saved correctly at
GoDaddy; they sometimes silently revert.

**The site loads but looks wrong** — you may have uploaded the folder instead of
its contents, so `index.html` is one level too deep. The repository should show
`index.html` at the top, not a folder containing it.

**PDFs give a 404** — the `downloads` folder didn't upload. Re-upload just that
folder.

**Anything else** — tell me what the screen says. Don't guess, and don't change
settings to see what happens.
