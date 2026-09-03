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
| Heading | `text-3xl sm:text-5xl`, white, with an optional accent line |
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

## Mobile header

The header is an app bar below `lg`:

- 40px icon-only mark (`/images/logo_v1.svg`), the name is hidden below `sm`.
- A compact `/book` button sits beside the hamburger. A scheduled call was
  chosen over a `tel:` link because the buyer for this site plans calls, and
  a calendar booking lands in both agendas. The calendar icon shows from
  400px so the label fits on the narrowest phones.
- The hamburger is a 24px icon with `p-3`, which makes the 48px row.

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

Advisories that were logged and deliberately not applied:

- Resting borders of day and time buttons are `gray-200` (1.24:1). They are
  decorative, the selected state carries the meaning.
- The credentials line under the hero uses `slate-400`, which meets AA but
  not AAA.
- Inner links in the mobile drawer do not yet share the focus ring.
