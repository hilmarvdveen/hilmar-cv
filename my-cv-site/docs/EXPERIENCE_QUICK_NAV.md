# Experience quick-nav: chip bar, scroll spy, and click lock

The experience page lists eleven engagements as long cards. A sticky bar of
company chips lets a visitor jump to one and shows which card is on screen.
This document records the rules the bar follows and the glitches that shaped
them, so the next change does not reintroduce one.

## What it is

- One chip per work-history entry: the company's name, in one horizontally
  scrolling row that pins at `top-[var(--header-height)]` once the page has
  scrolled past it. Chips are text only. The per-chip logo image was
  dropped on 4 September 2026, so `ExperienceChip` no longer carries a
  `logo` or `color` field.
- A right-edge fade (the `quick-nav-fade` utility in `globals.css`) shows the
  strip continues before a visitor touches it. The active chip has an
  emerald border and background and carries `aria-current="location"`.
- The chip for the card currently on screen is centred in the strip whenever
  the strip overflows.

## Files

| File | Role | In the coverage gate |
|---|---|---|
| `src/lib/scrollSpy.ts` | Pure math: `pickActiveSectionId`, `centeredScrollLeft` | yes |
| `src/features/experience/hooks/useExperienceScrollSpy.ts` | Browser wiring: listeners, refs, click lock, centring | no (needs layout, jsdom cannot measure) |
| `src/features/experience/components/WorkExperienceSection.tsx` | Renders the bar and the cards | yes |

Keep every decision that can be expressed as numbers in `scrollSpy.ts`. The
hook only reads the DOM and calls those functions.

## Rules

1. **Activation line.** A card is active when its top has crossed the line
   at the chip bar's measured bottom edge plus 16px. The last card that
   crossed wins. At the bottom of the document the last card wins regardless,
   because it may never reach the line.
2. **Measure every frame.** The bar's bottom edge and the card tops come from
   `getBoundingClientRect()` inside the update. No height is assumed.
3. **Throttle on animation frames.** The `scroll` listener is passive and
   schedules one `requestAnimationFrame`. `scrollend` runs the same update.
4. **Click lock.** A click highlights the chip at once and locks it so the
   chips in between never flicker while the page scrolls. The lock releases
   when the spy's own pick equals the locked id, when the page is stranded at
   the bottom with the target in view, after 1500ms, or on a real `wheel` or
   `touchmove`. Arrival is never a symmetric "within N pixels" band.
5. **Centring.** The active chip is centred with `list.scrollTo` and a
   computed, clamped `left`. Never `scrollIntoView` on a chip: it scrolls the
   page as well. No CSS scroll-snap on the strip: snapping fights the
   centring.
6. **Reduced motion.** Every programmatic scroll uses `behavior: "auto"` when
   `prefers-reduced-motion: reduce` matches.
7. **History stays clean.** A plain left click calls `preventDefault` and
   scrolls the card into view with the URL untouched, so the back button
   leaves the page. Modifier and middle clicks keep native anchor behaviour
   (open in a new tab, copy the link). Inbound `#experience-<id>` deep links
   still work: the hash initialises the highlight and the lock, and
   `scroll-padding-top` plus the card's `scroll-mt-16` position the card.
8. **Cards** carry `scroll-mt-16`, the bar's own height (see `LAYOUT.md` on
   why scroll margins add up).

## Glitch log

Each row is something seen in the browser, its cause, and the rule it became.

| Seen | Cause | Fix |
|---|---|---|
| Gap between the header and the pinned bar, wrong card highlighted | `--header-height` and the activation line were constants (73px, then 65px, then 132px) | Header measures itself, spy reads the bar's bottom each frame (rules 1 and 2) |
| Anchor jumps landed too deep under the bar | `scroll-padding-top` and `scroll-mt-32` added up | Cards use `scroll-mt-16` (rule 8) |
| After a click the chip centred, then slid right | `scrollend` cleared the lock, the spy picked a neighbour and centred again | The lock survives `scrollend` and releases only when the spy agrees (rule 4) |
| A chip near the end lost its highlight to the last card | The page bottomed out before the card reached the line, and "at bottom" forces the last card | The lock resolves as arrived when the page cannot scroll further with the target in view (rule 4) |
| Small back-and-forth when clicking chips on the right | A symmetric arrival band let the picker disagree for one frame on downward scrolls, so the strip centred twice | Arrival is "picked equals locked id" only (rule 4) |
| Chips fought the centring | CSS scroll-snap on the strip | Snap classes removed (rule 5) |
| Every click added a browser history entry | Native anchor navigation writes the hash | `preventDefault` plus `scrollIntoView` on the card (rule 7) |

## Manual checks after a change

Unit tests cover the math and the chip rendering. The hook needs a browser.
Check these by hand:

- Click the first chip, the last chip, and one two places from the end. The
  clicked chip stays highlighted until its card arrives, and the strip
  centres once.
- Scroll with the wheel right after a click. The lock releases and the
  highlight follows the page.
- Open `/experience#experience-belastingdienst` directly. The card sits just
  under the bar and its chip is highlighted and centred.
- Press back after several chip clicks. The browser leaves the page.
- Enable reduced motion in the OS. Every scroll is instant.
- Zoom the browser to 150 percent. The bar still pins flush under the header.

## Card structure (5 September 2026)

Each engagement card reads in this order: company and period, the fact
list (location, mode, language), the role, the one-sentence summary, a
visible "What it changed" heading with three or four outcome-first
bullets (`work.<id>.delivered`, the client's gain first and the
technique as the tail), one full-width link to the engagement's own
page (`work.readMore`), and the technology pills. The bullets come from
the entry's own story and add no claim of their own. The GMV figure
never appears in a bullet, because the canonical sentence with its
caveat may not be split. The story itself is not on the hub: the
second review round (5 September 2026) measured that an inline
disclosure doubled the page, duplicated every story on two indexable
URLs and broke the browser's Back from a detail page, so the story
lives on one URL.

Every engagement has its own page at `/experience/<id>`
(`ExperienceDetail` behind `app/[locale]/experience/[id]/page.tsx`).
The hero leads with the outcome headline (`work.<id>.headline`),
carries company and period as the eyebrow, the role under it, a back
link at the top and the booking action. The body: the summary, the
delivered list beside a facts panel (period, location, work mode,
language, role), the story with `h3` subheadings where a paragraph
carries `heading`, the technology pills, and previous and next
engagement links. WebPage and BreadcrumbList JSON-LD come from
`experienceDetailSchema`, the hub's ProfilePage from
`experienceHubSchema`. The pages are in the sitemap, the search index
and the social card whitelist. Every logo mark, project case, flagship
link and search result points at them. Hilmar's reason (5 September
2026): the detail must stay one click away and shareable, never
hidden, and the site goes to the best solution for the page's value.

## The way back and onward (5 September 2026, late)

Hilmar felt stuck on an engagement page. Three routes now sit on every
page: the breadcrumb in the hero (Home, the work history, the company,
through `Breadcrumb` with `currentLabel`), the previous and next
engagement links under the technology, and an "Andere opdrachten" row
with every other company as a pill. The hub carries the breadcrumb
too. WhatsApp sits under the experience close band as well, with its
own placement label.

## Four full cards, eight compact rows (5 September 2026, night)

The hub shows the four engagements that sell (the first four entries in
`workHistory`, `FULL_CARD_COUNT`) as full cards, the booking band, and
then the eight earlier engagements under "Eerdere opdrachten" as
compact rows: mark, company, period and role, the summary and the link
to the page. The quick-nav chips still target every card's anchor.
The sales editor's argument: twelve identical cards made the page a
third longer than it needs to be and gave the four that sell no
precedence.
