# Typography

One role-based type set for the site, in place since 6 September 2026 from
the designer persona's proposal (`Hilmar/review-board/2026-09-05-typography-P5.md`,
inventory in `2026-09-05-typography-inventory.md`). `pnpm check:type-scale`
fails the build when a hand-typed size, leading or tracking comes back.

## The six rules

1. **Nine sizes exist.** 12, 14, 16, 18, 20, 24, 30, 36 and 48 pixels, each a
   step on Tailwind's scale (`text-xs` through `text-5xl`). Any other number
   is a defect.
2. **Only type above 20px moves with the viewport, once.** Four fluid roles
   carry a single `clamp()` in `@theme`, so a heading has one class:
   `text-display`, `text-section-title`, `text-subsection-title` and
   `text-figure`. Everything at 20px and below is fixed at every width.
3. **Weight follows size.** 800 above 30px, 700 from 18 to 30, 600 for labels,
   chips, buttons and form labels, 400 for anything read as a sentence.
   Emphasis inside a sentence is 600.
4. **Leading follows size.** 1.1 above 36px, 1.2 from 20 to 36, 1.6 below 20,
   `leading-prose` (1.7) for blog prose.
5. **Tracking follows size.** Minus 0.025em above 24px, zero below, plus 0.1em
   (`tracking-widest`) for uppercase eyebrows only.
6. **Colour follows surface.** On white: navy for headings, `gray-700` for body,
   `gray-600` for support, `emerald-700` (`text-primary`) for accent. On navy:
   white for headings, `slate-300` for body, `emerald-300` for accent,
   `gray-400` as the floor. `emerald-600` is a ring and border colour, never
   text on white.

Three named exceptions, defined once: the display token starts at 1.75rem so a
58 character title fits three lines at 390, `--text-code-inline` is 0.9em so
inline code tracks its host, and the booking page's phone hero is `text-lg`
(the day picker has to be in the first screen, see `BOOKING_FLOW.md`).

## The tokens

Declared in `src/app/globals.css` under `@theme`. Each fluid token carries its
own line height, letter spacing and weight, so a component writes one word.
The font family comes from one declaration: `@theme inline` maps
`--font-sans` to the `--font-inter` variable that `next/font` sets on `html`.
`src/lib/mergeClasses.ts` teaches `tailwind-merge` that these tokens are font
sizes, so `mergeClasses("text-section-title", "text-white")` keeps both.

| Token | 390 | 768 | 1280 | Weight | Leading |
|---|---|---|---|---|---|
| `text-display` | 28 | 39 | 48 | 800 | 1.1 |
| `text-section-title` | 24 | 32 | 36 | 800 | 1.15 |
| `text-subsection-title` | 20 | 24 | 24 | 700 | 1.25 |
| `text-figure` | 30 | 30 | 36 | 800 | 1.1 |

## The roles

| Role | Class | Colour |
|---|---|---|
| Page title, every `h1` (`PageHero`, the hero, the blog article, legal, error) | `text-display` | white on navy, `text-textMain` on white |
| Section title, every `h2` that opens a section (`SectionTitle`, the close bands) | `text-section-title` | `text-textMain`, white on navy |
| Subsection title, an `h2` or `h3` that groups cards or story blocks | `text-subsection-title` | `text-textMain` |
| Card title, an `h3` inside a card | `text-lg font-bold` | `text-textMain` |
| Figure, the results-strip numbers and the project outcome | `text-figure` | `text-primary` |
| Lead paragraph, hero and section subtitle | `text-lg` | `text-gray-600`, `text-slate-300` on navy |
| Body, anything read to decide | `text-base` | `text-gray-700` |
| Small body, chrome and dense controls, footer links | `text-sm` | `text-gray-600`, `text-gray-400` on navy |
| Caption and small print | `text-xs` | `text-gray-600` |
| Eyebrow, `dt` labels, footer column headings | `text-xs font-bold uppercase tracking-widest` | `text-primary` on white, `text-emerald-300` or white on navy |
| Chip, pill, badge | `text-sm font-semibold` | `text-gray-700` on tinted, `text-slate-200` on navy |
| Button small, medium, large | `text-sm`, `text-base`, `text-lg` inside `Button` | per variant |
| Form label | `text-sm font-semibold` | `text-gray-700` |
| Input and textarea | `text-base`, set explicitly | `text-gray-900`, placeholder `text-gray-500` |
| Navigation, desktop and drawer | `text-base font-medium` | `text-gray-700`, white in the drawer |
| Breadcrumb | `text-sm` | `text-slate-300` on navy |
| Blog prose body and lists | `text-lg leading-prose` in `max-w-[68ch]` | `text-gray-700` |
| Blog prose `h2` and `h3` | `text-section-title`, `text-subsection-title` | `text-textMain` |
| Inline code | `text-code-inline font-mono` | `text-primary` on `bg-gray-100` |

## What must not change

The booking page's phone hero exception, the 16px inputs (iOS zooms below
it), the measured header height, the contrast fixes from the WCAG pass, and
the primitives' `mergeClasses` use. Two rows were flagged for Hilmar's eye
when the set landed: the desktop navigation at 16px on a 1024 viewport, and
the footer column headings as 12px uppercase (the fallback is `text-lg
font-bold` on all four).
