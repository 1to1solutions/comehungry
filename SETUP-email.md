# Email and ActiveCampaign

## The rule that governs this

The form page and all nineteen documents say the same thing:

> Your name and email are used to write back to you and to send the safety guide.
> They are never sold, never rented, never added to a mailing list, and never given
> to anyone else. Ask us to delete them and we will.

That is a commitment in nineteen published places. It is not marketing copy and it
cannot be quietly outgrown. Everything below exists to keep it true.

---

## What may be automated

**Two sends, and no more.**

1. **An immediate acknowledgment**, which carries *Keeping people safe* as an
   attachment or link. Say plainly that it is automatic, that a person is coming,
   and roughly when. Never write an automated email in a voice pretending to be a
   person — the page promised a human, and a machine wearing a name is the exact
   betrayal this audience left churches over.
2. **Nothing else.**

**What breaks the promise:** nurture sequences, newsletters, drip campaigns,
re-engagement mail, event promotion, donation appeals, anything from the coaching
practice. If any of those are wanted later, the promise has to change first — on
the site and in nineteen PDFs — and people already on the list have to opt in
again. Cheaper to decide now than to unwind later.

---

## Never put an API key in the site

An ActiveCampaign API key is a full-access secret: read every contact, send
campaigns, delete data. `index.html` is public — view-source shows everything.
There is no safe way to put an AC key in it.

Supabase's anon key is different and is safe to publish, because the policy on the
table allows insert and nothing else.

---

## Wiring it (no secrets required)

The site posts to ActiveCampaign's **hosted form endpoint**, which needs no key.

1. In AC: **Site → Forms → Create**, an inline form with **Full name**, **Email**,
   and a custom field for **City and country**.
2. Publish it and choose **Integrate → Custom HTML**. From that markup take:
   - the `action` URL — `https://YOURACCOUNT.activehosted.com/proc.php`
   - the form `id` value
   - the custom field's tag, which looks like `field[3,0]` or `%CITY_COUNTRY%`
3. In `index.html`, find `===== CONFIG` and fill in:

```js
var AC_ACTION = 'https://YOURACCOUNT.activehosted.com/proc.php';
var AC_FORM   = '3';
var AC_FIELD_PLACE = 'field[3,0]';
```

The submission is fire-and-forget by design. Supabase remains the record of truth
and the thing that confirms to the person; if AC is down, nobody is lost and
nobody sees an error.

## Do NOT install AC's site tracking script

ActiveCampaign will offer a site-tracking snippet. Do not add it.

The site currently makes **zero third-party requests** — the typefaces are embedded
in the file for exactly this reason — and the pages say nothing is tracked. That
snippet would make that false and would hand a visitor's browsing to a third party,
including the browsing of people reading a page about leaving church.

## Deleting someone

The page promises deletion on request. That means both places: the AC contact and
the Supabase row. One without the other is a broken promise.
