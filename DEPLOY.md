# Putting comehungry.org on the web

The site is static: one HTML file, eighteen PDFs, some icons. No server, no build
step, no database required. It can be hosted free, permanently.

---

## The shape of it

**GitHub** holds the source, publicly. That is not housekeeping — it is the
anti-capture commitment made real. Anyone can fork the whole thing without
asking anyone's permission, which is what the founding document promises.

**Cloudflare Pages** watches that repository and republishes the site every time
you push. Same dashboard handles the domain and the email.

**Supabase** stays out until the form's volume justifies a database. Until then
the form hands each request to the sender's own email app, and nothing is lost.

---

## 1. The repository

Create a repo named `comehungry` and put the contents of `comehungry-site.zip`
at its root — `index.html`, `sw.js`, `manifest.webmanifest`, the icons, and the
`downloads/` folder. Public.

**Publish these:** the site, all eighteen documents, and the source markdown for
every published document.

**Do not publish these:** the Decisions Amendment, the Decisions Addendum, the
build decisions record, the corpus manifest, and the journey map. They are
governance, not publication, and they discuss things not yet ruled.

## 2. The domain

Point `comehungry.org`'s nameservers at Cloudflare. Your registrar shows you two
nameserver addresses to paste; propagation is usually under an hour.

Then in Cloudflare: **Workers & Pages → Create → Pages → Connect to Git**, choose
the repo. There is no build command and no build directory — it is already static.
Add `comehungry.org` and `www.comehungry.org` as custom domains.

HTTPS is automatic, which the offline layer requires.

## 3. Email — do this first, it is the most overdue thing

**Cloudflare → Email → Email Routing → Enable.** It adds the DNS records itself.

Create one address: `hello@comehungry.org`, forwarding to an inbox you actually
read every day. Send yourself a test.

That address is printed in eighteen documents and on every page of the site.
Until it exists, every promise of a reply is false.

Later, if you want the professional side separated, `contact@timothyeldred.com`
stays where it is — do not route it here. The firewall depends on those being
different places.

## 4. Updating

Push to GitHub; Cloudflare republishes in about a minute.

The service worker's cache is keyed to the build ID, so a new deploy replaces the
old cached files instead of serving yesterday's page. **When you replace
`index.html`, replace `sw.js` too** — its build ID is what triggers the refresh.

To confirm which version is live: open the menu and read the build stamp at the
bottom of the fine print.

## 5. If and when you add Supabase

`SETUP-the-form.md` has the table, the row-level-security policy, and the two
values to paste. The policy allows anonymous inserts and no reads, so even a
leaked public key cannot pull the list.

Two commitments come with it, both printed on the page: the list is never sold,
rented, mailed at, or handed on; and deletion on request means deleting from
Supabase *and* from ActiveCampaign. One without the other is a broken promise.

## 6. What not to install

Cloudflare will offer Web Analytics. ActiveCampaign will offer site tracking.
Decline both.

The site currently makes zero third-party requests — the typefaces are embedded
in the file for exactly this reason — and it tells people nothing is tracked.
Adding either makes that false, and it would mean handing a third party the
browsing of people reading a page about leaving church.

If you ever need to know whether anyone is out there, Cloudflare's server-side
request counts tell you that without a script in anyone's browser. 
