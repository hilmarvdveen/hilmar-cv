# Layout: header offset, heroes, gutters, and the WCAG pass

The site has one fixed header and many pages with a hero. This document records
how the header offset works, the scale every hero follows, the mobile rules,
and the accessibility pass of 31 August 2026, so that a new page or section
lands on the same grid without rediscovering the reasoning.

## The fixed header and the measured offset

- The header is `position: fixed`. Its real rendered height is written into
  the `--header-height` custom property on `<html>` by a `ResizeObserver` in
  `src/components/Header.tsx`. `globals.css` sets a `65px` fallback for the
  server render and the first paint.
- `<main>` carries `pt-[var(--header-height)]`, so no page needs its own
  offset. The blog pages used to carry local padding hacks. They now use a
  plain `pt-8` like everything else.
- `html { scroll-padding-top: var(--header-height) }` makes anchor jumps and
  `scrollIntoView` land below the header.
- Anything sticky pins at `top-[var(--header-height)]`.

Why measured instead of a constant: the header height differs per breakpoint
(on phones the 48px hamburger sets the row, not the logo) and changes with
browser zoom and font settings. A hard-coded value left a visible gap between
the header and the pinned quick-nav on the experience page and put the
scroll-spy activation line in the wrong place.

### Scroll margins add up

`scroll-padding-top` on the root and `scroll-margin-top` on a target element
are summed by the browser. A card under a sticky bar therefore gets only the
bar's own height as its margin (`scroll-mt-16`), never header plus bar. With
`scroll-mt-32` the anchor jumps landed too deep.

## Hero scale

Every page hero renders through the shared `PageHero` primitive
(`src/components/PageHero.tsx`), which owns the navy band and the type
scale so a new page never hand rolls its own hero markup:

| Slot | Rule |
|---|---|
| Background and text | `bg-brand-navy text-white` |
| Vertical padding | `py-16 sm:py-20` |
| Badge | optional uppercase eyebrow in `text-emerald-300`, with an optional icon |
| Heading | `text-[1.75rem] leading-[1.15]` on phones (the shared `text-3xl` budget wrapped a 58-character title to four lines at 390), `sm:text-5xl` from `sm`, white, with an optional accent line |
| Description | `text-slate-300`, which meets 8.9:1 contrast on the navy background |
| Breadcrumb | optional, rendered at the top of the band through the `breadcrumb` slot |
| Aside | optional second column for a summary or preview |
| Container | `Container` (16px gutters on phones, 24px from `sm`) |

`ServicesHero`, `ProjectsHero`, `ContactHero` and `AboutPageContent` all
compose `PageHero`. The booking page is the one documented exception. It is
a task page, so its hero shrinks to a title band on phones to keep the day
picker in the first screen. Four overrides apply there and nowhere else:

- Vertical padding steps down to `py-5 sm:py-12 lg:py-14`.
- The heading drops to `text-lg` below `sm` instead of the shared `text-3xl`.
- The badge is hidden below `sm`.
- The description is hidden below `sm`.

`BOOKING_FLOW.md` has the full layout budget for the booking page.

The homepage hero is a separate component, not a use of `PageHero`, because
it carries the portrait and the chip row:

- `py-12 sm:py-24`, three columns from `md` with `items-center`, so the face
  sits level with the claim instead of floating above it.
- Below `md` the portrait becomes a byline lockup: a small round face with
  the name and role beside it, placed above the badge. The caption is hidden.
  Heading, badge, description and chips step down one size, chips are half
  height, and the primary button goes full width without its icon so the
  Dutch label fits on one line.

The breadcrumb now lives inside the hero band on every page that has one,
passed through `PageHero`'s `breadcrumb` slot instead of rendering as its
own band above the hero.

## Gutters

`Container` owns the horizontal padding: `px-4 sm:px-6`, which is 16px on
phones and 24px from `sm` up. Sections that still hand-roll a
`max-w-* mx-auto` wrapper use the same pair. New sections use `Container`
and never set their own gutters.

## Header

The desktop row is a fixed 64px band: `flex h-16 items-center justify-between`
on the row inside `nav`, instead of the row sizing itself from the tallest
child and a vertical padding value. `globals.css` sets the `--header-height`
fallback to `64px` to match. The wordmark next to the logo shows from `xl`
instead of `sm`, because at `lg` it collided with the first nav link. The
booking button sits after a `gap-1 xl:gap-2` link group, separated from the
nav links by a `mx-2 h-6 w-px bg-gray-200` divider and its own `ml-6`, and the
language switcher carries `ml-6` too.

The availability badge that used to sit next to the desktop booking button
was removed on 3 September 2026. It duplicated a claim that already lives in
several other places: the homepage hero chip row, the footer's about column,
the contact page's facts, the FAQ's availability chip, and the service pages'
terms. The mobile drawer keeps its own availability line (`Calendar` icon
plus `nav.availability`) in a bordered block between the drawer header and
the nav list, since the drawer has no other surface carrying that fact.

## Footer bottom bar

The bottom bar is one row (`flex flex-col gap-4 sm:flex-row sm:items-center
sm:justify-between sm:gap-6`): the copyright line as a paragraph, and the
legal links as a `nav` with a `ul` of Links, each with `py-1` for a 24px hit
area and the on-navy focus ring (`ring-emerald-300` with
`ring-offset-brand-navy`, `emerald-600` disappears against navy the same way
it does in the hero). The "Built with Next.js / TypeScript / Tailwind CSS"
block and the "Netherlands • EU Based" block were removed, they told the
visitor nothing that helps a hiring decision. The quick-links column above it
dropped its booking entry (the header and the closing CTA already carry that
action) and every remaining quick link gets `inline-block py-1` for the same
24px target.

## Mobile header

The header is an app bar below `lg`:

- 40px icon-only mark (`/images/logo_v1.svg`), the name is hidden below `sm`.
- A compact `/book` button sits beside the hamburger. A scheduled call was
  chosen over a `tel:` link because the buyer for this site plans calls, and
  a calendar booking lands in both agendas. The calendar icon shows from
  400px so the label fits on the narrowest phones.
- The hamburger is a 24px icon with `p-3`, which makes the 48px row.

## Homepage consistency pass (4 September 2026)

Package R1 of the P5/P7/P8 joint review board pass (see
`Hilmar/review-board/2026-09-03-P5-P7-P8-joint.md`, section 1 "the six
questions" and the code change list C-1 to C-6, C-20, C-21).

### `SectionTitle` sizes and character budgets

`SectionTitle` takes `size?: "display" | "default" | "compact"`, default
`"default"`, which is pixel-identical to the size every section used before
this pass.

| Size | Classes | Use | Budget (characters) |
|---|---|---|---|
| `display` | `text-3xl sm:text-4xl md:text-5xl` | the flagship heading only | 62, two lines at 1280, three at 390 |
| `default` | `text-3xl md:text-4xl` | most sections | 47, two lines at 390 |
| `compact` | `text-[26px] leading-[1.15] sm:text-3xl md:text-4xl` | headings that carry the whole message on their own (track record, method, standards, stack, hiring shapes, the projects showcase) | 55, two lines at 390 |

This package applies `size="display"` to the flagship section, the only
consumer inside its ownership. The `compact` consumers named above belong to
other sections and still need the prop applied where those files are owned.

### Results strip: explicit rows instead of subgrid

`ResultsStrip` used to size each tile with `lg:row-span-3 lg:grid
lg:grid-rows-subgrid` against a `lg:grid-rows-[auto_auto_auto]` parent. Auto
sizing made every row as tall as its tallest cell, which left roughly 70px of
white space under short details on the other tiles.

Each tile is now its own three-row grid with fixed tracks,
`lg:grid-rows-[5rem_2.5rem_1fr]`: the value box is always two lines tall, the
label box is always two lines tall, and the detail takes whatever is left.
Tiles no longer depend on their neighbours' content height. The value carries
the emerald figure treatment (`text-primary` instead of `text-brand-navy`) so
the numbers read as numbers against the navy body copy around them.

### Client logos: a static grid, not a carousel

`ClientLogosCarousel` no longer auto-scrolls. The CSS-driven `.slider` marquee
(`@keyframes autoRun`, the white card background, the per-brand colour
variables) is gone from `globals.css`. Logos render in a plain responsive grid,
`grid-cols-2 sm:grid-cols-3 lg:grid-cols-6` with one equal `gap-4`, grayscale
and `opacity-80` by default with `group-hover:grayscale-0
group-hover:opacity-100` (and the `group-focus-visible` equivalents) revealing
the logo's own colour on hover and keyboard focus. Because nothing scrolls,
every logo including the four named clients (bol.com, Belastingdienst,
Nationale Postcode Loterij, Athlon), which lead the list, is on screen at once
instead of only some of them at any one scroll frame. The three sector
indicator lines under the logos are gone, they repeated hero chips from two
screens earlier. What is left under the title: one subtitle line and the
invite line.

Every logo sits in its own fixed box: a `relative h-12 w-full` span inside a
`bg-white ring-1 ring-gray-200` frame with padding, holding a `next/image`
with `fill`, `object-contain` and `sizes="(min-width: 1024px) 160px, 40vw"`.
The white frame also normalises the four rasters that read badly on the bare
`bg-bgLight` section background: Opinity and Conclusion are dark rasters on a
black background, Omniplan and Transdev are marks meant for a light ground,
and the frame gives every one of them the same light neutral surround.

Before this fix eight of the twelve logos measured 0 by 0 below `sm`. The
component rendered `next/image` at a fixed intrinsic size (`width={120}
height={60}`) with `style={{ width: "auto", height: "auto" }}` so CSS, not the
HTML attributes, decided the rendered box. That removes the browser's built-in
box reservation for an image that has not loaded yet, and eight of the twelve
logos carried `loading="lazy"`. At 390 wide the grid is two columns, so those
eight sit three and four rows below the fold. A full-page capture at that
width never scrolled them into the viewport, native lazy loading never fired,
and an unloaded image with no CSS-declared size and no HTML-attribute
fallback collapses to 0 by 0 while its flex wrapper (`h-14 w-full`) kept its
own height, leaving four logos and a band of empty space. At 1280 the six-
column grid fits every logo above the fold, lazy loading fires immediately,
and the bug did not show. `fill` sizes the image from the parent box
regardless of load state or column count, which is why it closes the bug at
every width rather than only masking it at the width that was tested.

### Card tinted variant

`Card` takes `variant?: "default" | "tinted"`. `default` is the existing
white surface. `tinted` swaps to `bg-bgLight` so a card grid sitting on a
`background="white"` `Section` gets its own definition instead of reading as
flat white-on-white. The flagship cards use it, since the flagship section
(white background) sits directly above the track record cards (light
background, white cards), and without the swap the two adjacent card grids
read as one long strip.

### Experience card container width

`WorkExperienceSection`'s two card grids sit in their own `Container
width="narrow"` (`max-w-4xl`), separate from the `Container` (`max-w-7xl`)
that holds the section heading. At 1280 the default container let each card
grow to 1232px wide while the prose inside stayed capped at `max-w-[68ch]`
(about 700px), so 41 percent of every card was empty. The narrow container
now bounds the card at 896px, close enough to the 68 character measure that
the `max-w-[68ch]` caps on the summary and body paragraphs are gone, the
container does that job. The quick-nav chip bar and the section heading keep
the default container, only the card grids moved.

### Close band boundary

`CloseSection` and the footer are both `bg-brand-navy`, back to back, which
read as one 1000px navy field. `CloseSection` now overrides to
`bg-brand-navy-deep` (already defined in `globals.css`, previously unused)
with a `border-b border-white/10` seam, so the close band is visibly its own
element above the footer rather than a continuation of it.

### One button treatment on navy

Every navy close band uses `variant="white"` on its `Button`, including the
homepage close (`CloseSection`), which used to be the one exception on
`variant="primary"` (the site's emerald action colour). One navy band should
not carry two different primary-button treatments, so the homepage close
matches the FAQ, about, projects and service-page closes. `data-placement`
stays on the button for the funnel events.

### Sticky call-to-action bar and `--bottom-bar-offset`

`StickyCallToActionBar` (`src/components/StickyCallToActionBar.tsx`) is
mounted once in `src/app/[locale]/layout.tsx`, inside `<body>`, alongside
`AnalyticsConsent`. It renders nothing until the visitor has scrolled past
the page's hero, then shows one `Button href="/book"` in a bottom bar
(`fixed inset-x-0 bottom-0 z-40 ... lg:hidden`), so mobile and tablet
visitors always have the booking action one thumb away without the hero's
button leaving the screen forever.

It has no reference to any specific hero component, which matters because the
homepage hero (`HeroSection`) and every other page's hero (`PageHero`) are
different components. Instead it observes `document.querySelector("main")
?.firstElementChild`, which is always the page's hero regardless of which
component renders it, with a plain `IntersectionObserver`: once that element
is no longer intersecting the viewport, the bar appears. This is the same
"appears after the hero leaves the viewport" behaviour the review board asked
for, without threading a sentinel prop through every hero component.

The bar is hidden entirely on `/book`, which already has its own sticky
bar inside `BookingForm`. It measures its own rendered height with a
`ResizeObserver` and writes it to the `--header-height`-style custom property
`--bottom-bar-offset` on `<html>`, exactly like `BookingForm`'s sticky bar
does. `AnalyticsConsent` reads that same property
(`bottom-[var(--bottom-bar-offset,0px)]`) so the cookie banner always stacks
above whichever bottom bar is currently showing, booking's or this one, and
sits flush with the viewport bottom when neither is present. The property is
removed whenever the bar is not rendered, so the banner does not carry a
stale offset from a page that no longer has a bottom bar.

### Cookie banner buttons

`AnalyticsConsent` renders Decline before Accept, both `variant="outline"`
and `size="sm"`. Decline used to be `variant="neutral"`, a filled grey
button, next to Accept's outline, which read as Decline being the primary
action on a banner that wants the visitor to accept. Giving both the same
outline weight removes that reversed emphasis without picking a winner
between the two choices.

## WCAG 2.2 pass (31 August 2026)

Contrast and focus fixes applied after a UX-agent audit:

| Element | Before | After |
|---|---|---|
| Input placeholders | `gray-400` (2.54:1) | `gray-500` (4.83:1) |
| Input borders | `gray-300` (1.47:1) | `gray-500` (4.83:1) |
| Primary button focus ring | `emerald-500`, no offset | `emerald-600` with `ring-offset-2` |
| Small booking links (back, change) | text only | 24px minimum hit area via `-my-2 py-2` (and `-mx-2 px-2` for inline links) |

One focus style is used everywhere: `focus-visible:outline-none
focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2`
on header links, the hamburger, the language switcher, and the day and time
buttons in the booking flow. Links on the navy hero use `ring-emerald-300`
because `emerald-600` disappears against navy.

Advisories that were logged at the time, and what became of them:

- Resting borders of day and time buttons were `gray-200` (1.24:1). Raised to
  `gray-500` (4.83:1) on 7 September 2026, matching the input borders, because
  the border is what identifies each button as a control (WCAG 1.4.11).
- The credentials line under the hero uses `slate-400`, which meets AA but
  not AAA. Left as is, by choice.
- Inner links in the mobile drawer share the focus ring since 1 September 2026.

## Wide diagrams on phones (5 September 2026)

A React Flow diagram in a blog post used to fit its whole graph into
the phone width, which put the node titles at roughly a third of their
size. Below `sm` the diagram now keeps a minimum width of 640px inside
its own horizontally scrolling frame, panning and scroll capture are
off so a touch scrolls the frame, and from `sm` up it fills the column
as before. The page body never scrolls sideways.

## Reserved space at the bottom of the page

Two fixed elements can sit at the bottom: the sticky booking bar (sets
`--bottom-bar-offset`, the consent banner stacks above it) and the
consent banner (sets `--consent-height`, the footer pads its bottom by it, so
the reserved strip is navy under the legal bar and never a pale band between
the last section and the footer, which is what padding on `main` produced).
Anything new that is fixed to the bottom follows the same pattern:
measure, publish a custom property, and let the page reserve the space.

## The identity device (6 September 2026)

One drawing, the ramp, carries the site's idea: a gray lane that keeps
running (the live system) and an emerald path that climbs in four equal
steps with a bead per method step. Geometry, weights and tones live in
`src/lib/rampGeometry.ts`. `RampDevice` renders it, `CaseSchematic`
renders it or one of three sibling drawings per project case.

- Placements: under the portrait in the hero (md and up, 340 by 170),
  a wide lockup above the five method columns (lg and up, the column
  rules disappear there), a 96 by 48 glyph bottom right of each project
  card (sm and up), and a fine-weight motif on the social card at 18
  percent through a data URI.
- Every instance is decorative: `aria-hidden`, no role, nothing the
  page does not also say in text. Tests count svg elements on the
  render container.
- Every placement carries a caption as real text next to the drawing
  (Hilmar's rule of 6 September 2026: a diagram is self-explanatory by
  animation or by text). The svg stays `aria-hidden`, the caption is
  what a reader and a screen reader get.
- The return arrow (the rollback) is opt-in through `showReturn` and
  appears only where copy explains it in the same breath. Standing
  alone it reads as a climb that ends in a fall.
- Card variants: `default` for things the reader can act on, `tinted`
  for a grid under one claim, `quiet` (top rule, no box) for an
  enumeration the reader reads and does not click. Three is the
  ceiling. `SectionTitle` takes an `eyebrow`, the element that
  separates sections.

## Type sizes

Every size, weight, leading and tracking on the site follows
`docs/TYPOGRAPHY.md` since 6 September 2026. The hero scale and the other
measurements in this document stay, the type classes they mention are the
role tokens from that file, and `pnpm check:type-scale` guards them.

## Touch affordance (7 September 2026)

From the designer persona’s audit of 1,084 targets at 390 wide
(`Hilmar/review-board/2026-09-07-review-P5-touch-affordance.md`). A phone
has no hover and no cursor, so every interactive element has to read as
tappable from its resting state.

- **Fill plus border means control.** Read-only pills (stack tiers, service
  technologies, hero fact chips) are fill-only or bare. Bordered pills are
  interactive: the contact interest toggles (`border-gray-500`, `aria-pressed`)
  and the engagement page’s other-engagement chips (`border-gray-300`,
  `text-primary`).
- **Resting boundaries meet 3:1** where the boundary identifies the control:
  booking day and time buttons and contact toggles on `gray-500`, cards that
  are links and the hub action row on `gray-300`.
- **Links on navy carry a resting underline** (breadcrumbs, the method article
  link, the hero facts link). Emerald on navy is emphasis, not a link.
- **Whole-card links end with a glyph**: the blog cards’ read line, the logo
  tiles’ chevron, the contact channel cards’ chevron, the FAQ category tiles’
  arrow.
- **Disclosures show a chevron** that rotates when open (FAQ, city pages).
- **Every `button` shows the pointer cursor** through the base rule in
  `globals.css`, because Tailwind v4 dropped that preflight rule. Every
  `Button` variant has an `active:` colour.
- **Primary actions are 44px or taller**: the header and sticky booking
  buttons use `size="md"`.
- **Dialogs are dialogs**: the CV modal carries `role="dialog"`, `aria-modal`,
  a labelled heading, focus on open, `Escape` to close, focus back on the
  trigger, and a body scroll lock. The closed mobile drawer is `inert` and
  the open one is a named `nav`.
- **The map cities** carry a transparent 24px hit circle with a role, a name
  and keyboard activation behind each 10px dot.

Two card patterns remain (whole card as link, and a line inside the card as
link). Unifying them is a decision for Hilmar (reconciliation file, item 8).

## The about page and the map (8 September 2026)

Hilmar's phone screenshot showed the Netherlands map at about half the
width of its card. The drawing hook scaled and centred the projection in
container pixels while the svg kept a fixed 500 by 425 viewBox, so on a
398px card the land was drawn at 73 percent of the box and the box was
then shrunk to the card. Rules now:

- The map svg carries a portrait viewBox of 440 by 500 units
  (`MAP_VIEWBOX` in `netherlandsMapData.ts`) and the projection is fitted
  to the province data with `fitExtent` and a 12 unit margin, so the land
  fills the box at every width. The svg is `w-full max-w-lg mx-auto`,
  which keeps the desktop map at the height it had (about 580px) and lets
  the phone map fill its card (land 333 by 394px at 430 wide, measured).
- The city hit circles scale with the render: at least 12 units, and as
  many units as it takes to stay 24px on screen where the svg renders
  below its viewBox width. The nine city chips under the map are the
  compliant control on phones, where the dots sit 15 to 26px apart.
- The about page follows the designer's proposal of 7 September 2026
  (`Hilmar/review-board/2026-09-07-about-redesign-P5.md`, merged with the
  copy and consistency proposals P7 and P8): hero on `PageHero` with a
  320px rail aside and the portrait lockup leading on phones, the five
  changes as an ordered list sized by content (no cards, one hairline
  between rows, the ramp glyph with its caption on row one), the record
  in three tinted cards, the map section owned by the page (heading
  through `SectionTitle`, the three counts once in the subtitle, chips
  first on phones, the detail panel sticky on desktop), the practical
  facts in one `dl` card with the CV, LinkedIn and rate links beneath it,
  and a close with one button and the contact link in plain text. Every
  practical fact appears once on the page.

## A sticky element needs a column of its own (8 September 2026)

Hilmar's screenshot showed the three engagement-shape cards drawn over the
practical facts card on the homepage. The facts card still carried
`lg:sticky` from the time it was the side column of a two-column grid.
Since 7 September it leads the hiring section at full width, so its
containing block runs to the end of the section, and once it stuck, every
block after it scrolled underneath (the quiet cards are transparent, so
their text showed through). Rule: `sticky` only on an element that sits in
a column of its own, whose containing block is that column. A full-width
block in a single-column flow is never sticky. The map's detail panel on
/about follows the rule: it is sticky inside its own grid column from md.
