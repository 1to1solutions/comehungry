# Decisions — the build, August 19, 2026
### Records what was decided while building the site and the document library. Reads under the Decisions Addendum, which reads under the Decisions Amendment, which reads under the Founding Document. Where anything here conflicts with the founding document, the founding document wins.

---

## 1. The site is a card deck, not a page

One thought per screen. Tap or press Continue to advance; swipe works; the whole screen is a tap target. Long reference material — the fifty story pages — is a single scrolling page instead, because a host preparing a story needs it all at once.

**Why:** a wall of text on the front door failed the thirty-second test. The founding document is the soul of the project and made a terrible doormat. Depth lives in the library, not the lobby.

## 2. One file

The entire site is a single `index.html` with hash routing (`#table`, `#s14`). No build step, no framework, no dependencies. State lives in memory; the address bar is updated when the browser allows it and ignored when it doesn't.

**Why:** it works identically in a preview pane, on a local disk, on tiiny.site, and on GitHub Pages. An earlier version navigated by changing the address, which reloaded the page inside sandboxed frames and threw the reader back to the first card.

## 3. Navigation: three controls, three jobs

- **Back** (bottom left) — one card at a time, walking the trail of where you actually went. If the trail is empty, it goes up a level, so a shared link is never a dead end.
- **The return line** (top of the card) — one tap back to the section you jumped in from, landing on the exact card you left. Appears only when there is somewhere to return to.
- **Next** (end of every section) — the forward step in the reading order.

**Why:** "previous screen" and "get me out of here" are different intentions. One control for both meant eleven taps to leave a section.

## 4. The reading order

why → people who tried it → start a table → the fifty stories → run tonight's table → ask for a hand.

Downloads and the church section both point onward. The chain ends at the form, because after asking for help the next move is a person writing back.

## 5. Menu, not nav bar

A single word in the header opens a full-screen overlay in three groups: **for anyone**, **if you're hosting**, **for churches**. No persistent navigation on the cards.

**Why:** a nav bar competes with the one thing each screen says. But the earlier no-menu position was wrong: reaching anything required nine taps through the home deck.

## 6. Look

- **Ground:** warm dark, `#17130F`. A kitchen at night, not a tech black. Evening is when tables happen and when someone opens their phone alone.
- **Text:** `#F2EADC`; secondary `#9C8F7F`; one accent, lamplight gold `#E8A951`; a second, coal `#C4623A`, for acts and hard notes.
- **Type:** Literata for everything a person reads, IBM Plex Sans for labels and controls. Both embedded in the file.
- **Motion:** two soft lights drift behind the type; cards arrive staggered; the room brightens for a second when you tap. All of it off under reduced-motion.
- **Gold headlines: exactly one on the site** — "You're not." Gold is for a single short reversal, and it appears once.
- Capitalization is **sentence case** everywhere except real names.

## 7. The mark

Five plates along a table edge; four set, the fifth a dashed outline set slightly apart — an open seat, room for one more.

- **Large use** (front card, document covers, share card): five plates.
- **Small use** (favicon, app icon): one plate.

Dashed, not solid: a brighter fifth plate read as *the important one*, which is the head-of-the-table hierarchy the model rejects.

**Why a mark at all,** given that the founding document refuses branding: this is a diagram of the practice, not a mark of ownership. It says what happens, not who owns it, and anyone can draw it.

## 8. Documents

Eighteen PDFs, 5.5 × 8.5in — exactly half a letter sheet, so they impose as booklets with no scaling.

- Light covers. Dark covers were killed: they photograph well and drink a cartridge on a twenty-copy run.
- Story preps set labels above text at full measure, not in a squeezed side column.
- Contents pages with live page numbers; PDF bookmarks (207 in the canon volume).
- Running heads name the section; the document name and page sit at the foot.
- The first heading in any document is the title and is dropped, because the cover carries it. Only real sections get divider pages, numbered ONE, TWO, THREE.
- Every paragraph, list item, quote and heading has its last two words welded so a single word cannot hang alone.

**A document has to earn being a download.** The Commons PDF was cut — seven quotes nobody prints. Its voices moved into the leadership team guide and the pastor's letter, where they persuade a board.

## 9. Nothing is gated; support is asked for

Everything is free to take without telling us anything. Separately, a host who wants a person can say so: name, email, city and country.

**This is not a reversal of the founding commitment.** The commitment was against registration as the price of admission, not against people being able to reach a human. The bench had no doorbell until now.

**The promise, printed in eighteen documents and on the site:** used to write back and to send the safety guide; never sold, never rented, never added to a mailing list, never given to anyone; deleted on request.

**Wording:** never "join." The founding document rejects membership by name. A list of people who asked for help stays that.

## 10. Email

Two automated sends are consistent with the promise: an immediate acknowledgment carrying the safety guide, plainly labeled automatic, and nothing else. Nurture sequences, newsletters, event promotion, donation appeals and anything from the professional practice would contradict what is printed, and would require changing the promise everywhere first and re-asking everyone already on the list.

Never send an automated email written in a voice pretending to be a person. The page promised a human.

**Do not install ActiveCampaign's site-tracking script.** The site makes zero third-party requests, which is why "nothing tracked" is true.

## 11. Licensing, copyright, the mark

- No licence name appears anywhere a person reads. The terms are stated plainly: **copy it, translate it, adapt it, print it, give it away, whole or in part, with credit or without; you may not sell it, and neither may we.**
- Copyright is held by **1:1 Solutions Group LLC**, asserted quietly in the back matter of each document, never on the front.
- **come hungry™** — unregistered, used defensively.
- **Register the copyright** on `everything.pdf` as a single collective work, standard application, US Copyright Office eCO, before or within three months of publication. That window is what makes statutory damages and attorney's fees available.

## 12. Churches

- **Plant became Reproduce.** Renew, Rebirth, Reproduce — the set now shares a family, and the old name spent its first paragraph disowning itself.
- Attribution is not requested and should not be. The freedom to put your own church's name on it is what lets a cautious church say yes. `comehungry.org` prints on the foot of every page of every document, so discovery is carried without obligation.
- The church section walks a decision, not a set of objections: who it's for → what actually happens → what it costs → a voice → this won't fill your building → your doctrine governs it → three ways in → what Monday looks like → take it to your board.

## 13. Story preparation

**Recite, Retell, Recall** is the named method, from the Host's Guide, and now appears identically on all fifty story pages, in the arc booklets, and in the Start a Table deck. Three different instructions for the same task previously existed; the one where a host actually works was the weakest.

## 14. The weekly runner

`#tonight` walks Meet, Share, Grow, Act, holds the acts people commit to, and opens the following week with them. Stored on the host's own device only — never transmitted, cleared by a button on the last card, and degrades silently when storage is blocked.

The follow-up appears twice on purpose. It is where people change and it is the first thing skipped when dinner runs long.

## 15. Reachability and offline

Nineteen of nineteen documents now tell a reader how to reach a person. It was one this morning.

A service worker caches the site and any document a person opens, so a host who prepped a story on Sunday still has it at the table on Thursday with no signal.

## 16. Still open

- **hello@comehungry.org does not exist.** Printed in eighteen documents and on the site. Until it is routed, every promise of a reply is false.
- **Reply capacity.** The founder is currently the whole team. The human bench (Addendum §1) is unbuilt.
- **The kit-4 child-safety template** still needs review by someone with real child-protection credentials. That flag survives every rewrite.
- **The money page** still carries placeholder language the founder intends to rewrite.
- **Never tested on real iOS Safari.** All testing has been Chromium.
- **No search across the fifty stories.** A host who remembers "the one about the sower" must browse five arcs.
- **Flag 1** — the "about God" flex on question two — remains as ruled in the addendum: left alone.
