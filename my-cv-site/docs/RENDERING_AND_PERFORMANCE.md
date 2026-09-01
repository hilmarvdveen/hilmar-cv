# Rendering model and performance: what the site ships, and why

Measured on 1 September 2026 against a production build (`pnpm build`,
`pnpm start`) with Lighthouse 13.4 in mobile simulation, plus the live site.
This document records how pages are rendered, what a visitor downloads, where
the first paint goes, and the options with their trade-offs. Update the
numbers when something structural changes.

## How every page is rendered

Every page route is **dynamic** (`ƒ` in the build table): rendered on the
server per request, never prerendered. Only `/robots.txt`, `/sitemap.xml`
and the fallback `_not-found` are static. This is not an accident and not a
missing `generateStaticParams`. The cause is the Content-Security-Policy in
`src/proxy.ts`: it generates a fresh nonce per request and puts it on every
inline script (`script-src 'nonce-…' 'strict-dynamic'`). A nonce that changes
per request cannot live in static HTML, so Next renders on demand and Vercel
sends `Cache-Control: private, no-cache, no-store` with `X-Vercel-Cache: MISS`.

What that costs, measured live:

| Request | Result |
|---|---|
| `https://hilmarvanderveen.com/` | 307 to `www` (1.8s to first byte from Zandvoort) |
| `https://www.hilmarvanderveen.com/` | 307 to `/nl` (0.9s) |
| `https://www.hilmarvanderveen.com/en` | 200 in 1.3s to first byte |

A Dutch visitor typing the bare domain waits for two redirects and one
function invocation before any HTML arrives. On the local build the
document takes 40 to 100ms, so the live gap is function cold start plus
network, not rendering work.

Server components versus client components: all page content is server
rendered either way (client components are rendered to HTML on the server
too). The distinction is what gets hydrated in the browser and what has to
travel in the flight payload. 23 files carry `"use client"`. Eight of them
use no client-only API at all (Footer, AboutPageContent, BookingSummary,
ContactHero, ClientLogosCarousel, ProjectsHero, ProjectShowcase,
ServicesHero) and could become server components. `WorkExperienceSection`
needs the client only for the chip bar, so its 3,700 words of cards could
be server rendered with a small client chip bar around them.

## What a visitor downloads

Homepage `/nl`, production build, before gzip and after:

| Part | Raw | Gzip |
|---|---|---|
| HTML document | 421KB | 89KB |
| of which the RSC flight payload | 256KB | |
| of which inline CSS (`experimental.inlineCss`) | 77KB | |
| JavaScript, 13 files | 782KB | 234KB |

The three biggest scripts are the React and Next runtime (221KB raw, 69KB
gzip), a second runtime chunk (186KB, 47KB) and a chunk of 110KB (39KB),
the same on every page. `d3` (the map) and `@xyflow/react` (the blog
diagrams) are correctly split into their own chunks and do not load on the
homepage.

The flight payload carries the **whole message file** for the locale on
every page: `NextIntlClientProvider` receives `getMessages()` unfiltered, so
150KB of JSON for pages that use a fraction of it. That is the single
largest avoidable byte cost. next-intl supports passing only the namespaces
client components need. The fewer client components, the fewer namespaces.

Google Tag Manager, when the production env vars are set, adds 100KB of
unused JavaScript per Lighthouse and is the top "reduce unused JavaScript"
item. The GA4 component loads `gtag/js` separately as well, so analytics
loads twice when both IDs are present.

## Lighthouse (mobile simulation, local production build)

| Page | Performance | SEO | A11y | Best practices | FCP | LCP | TBT | CLS |
|---|---|---|---|---|---|---|---|---|
| `/nl` | 82 | 92 | 96 | 96 | 1.1s | 3.5s | 380ms | 0 |
| `/nl/experience` | 77 | 92 | | | 1.2s | 3.6s | 530ms | 0 |

The LCP element is the H1, not an image. Its render delay (410ms locally)
comes from the main thread evaluating 234KB of JavaScript, not from fonts
(Inter is self-hosted via `next/font` with preload) and not from CSS (it is
inlined). The 3.5s figure is Lighthouse's throttled simulation. In the field,
TTFB comes on top.

The single SEO failure Lighthouse reported was the canonical bug (fixed the
same day, see `SEO.md`). The accessibility failure was `text-gray-500` on
the navy footer (2.75:1), now `gray-400`. The console errors are the Vercel
insight scripts returning 404 on a local server only.

## What changed on 1 September 2026, and what it moved

| Change | Effect |
|---|---|
| Seven presentational components became server components, the experience cards render on the server behind a client chip bar, the hero is a server component with a client CV button that loads the modal on demand | fewer hydrated components, `home.hero` and `work` no longer travel to the client |
| `NextIntlClientProvider` receives only the namespaces client components read (`pickMessages`) | homepage flight payload 256KB to 197KB, HTML 89KB to 66KB gzip, booking page 78KB to 52KB gzip |
| Booking context moved from the layout to `/book` | its code and localStorage handling left every other page |
| GTM loads only after the same consent as GA4 | 100KB of third-party JavaScript no longer loads on a first visit |
| Dead colour palette and comments removed from `globals.css`, carousel logos no longer preloaded | 4KB less CSS in every document, three fewer requests competing before the first paint |
| Nested `<main>` on four pages, heading skips on services and search, definition lists on contact, duplicate diagram ids, day-button names, seven contrast failures | accessibility 100 on home, experience, book, contact, about, faq, and 96 on services and the blog |

Lighthouse mobile after the pass (local production build, same machine,
scores vary by 3 to 5 points between runs on this machine):

| Page | Performance | SEO | A11y | Best practices | FCP | LCP | TBT |
|---|---|---|---|---|---|---|---|
| `/nl` | 81 to 88 | 92 | 100 | 96 | 1.1s | 3.5s | 180 to 330ms |
| `/nl/experience` | 89 | 92 | 100 | 96 | 1.3s | 3.4s | 160ms |
| `/nl/book` | 84 | 92 | 100 | 96 | 1.0s | 3.7s | 280ms |
| `/nl/contact` | 84 | 92 | 100 | 96 | 1.0s | 3.4s | 320ms |
| `/nl/about` | 88 | 92 | 100 | 96 | 1.0s | 3.5s | 210ms |
| `/nl/privacy` | 92 | | | | 1.2s | 3.3s | 90ms |

SEO 92 and best practices 96 are local artifacts: the canonical points at
`www.hilmarvanderveen.com` while the page is served from `localhost`, and
Vercel's insight scripts return 404 without Vercel. Both audits pass on the
deployed site.

### Why performance stops at about 90 in this lab

Three experiments on the homepage, all without a rebuild:

| Experiment | Performance | LCP |
|---|---|---|
| baseline | 88 | 3.5s |
| web font blocked | 90 | 3.6s |
| all JavaScript chunks blocked | 97 | 2.4s |
| header runtime, next-intl client bundle and Vercel scripts blocked | 88 | 3.7s |

The font is not the cause. JavaScript is, and specifically the framework:
React DOM (71KB gzip), the Next runtime and router (61KB) and the Turbopack
runtime cost 136KB of the 189KB a modern browser fetches, and Lighthouse's
simulated throttling schedules the H1 paint behind their evaluation on a
four-times slower CPU. Removing the whole app-level share (53KB) does not
move the LCP. The lightest page on the site, `/privacy`, scores 92 with a
TBT of 90ms. That is the floor for a React 19 App Router page in this lab
setup. Reaching 95 or more means fewer framework bytes, which this stack
does not offer, or a different measurement (the field, where the paint
does not wait for script evaluation on most devices). `SpeedInsights`
reports the field numbers once the site is deployed.

## Options, in order of effect on first paint

1. **Trim the client payload.** Done on 1 September 2026 (see above).
2. **GTM and GA4 both stay** (owner's decision, 1 September 2026: they work
   as a team). Both wait for consent, so a first visit loads neither and the
   consenting visitor loads GTM first and gtag lazily. One check in the GTM
   container: if it fires the GA4 configuration tag as well, every page view
   is counted twice. Let GTM own the events, or let gtag own the config, not
   both.
3. **Static HTML at the edge.** The only way to remove the per-request
   function and the `no-store` cache header is to drop the per-request
   nonce. Without a nonce, an App Router site needs `'unsafe-inline'` in
   `script-src` (Next's own inline flight scripts require it) or a
   hash-based policy that has to be rebuilt per deploy. For a marketing site
   without sessions or user data the practical risk is small, and the win is
   large: `generateStaticParams` for the two locales, pages prerendered at
   build, served from the CDN in tens of milliseconds, `X-Vercel-Cache: HIT`.
   Trade-off: the strict CSP was a deliberate security decision ("one CSP,
   one owner"). This is the owner's call. Middle ground if the nonce stays:
   pin the Vercel function region to `fra1` or `ams1` and keep option 1.
4. **One redirect instead of two.** Point the apex domain at `www` in DNS
   (Vercel does this at the edge) and consider serving Dutch at the root
   (`localePrefix: "as-needed"`), which removes the `/` to `/nl` hop for the
   majority of visitors. That is also a URL-structure decision with SEO
   consequences, see `SEO.md`.
5. **Image sources.** The hero portrait is 200 × 200 and renders at 200px,
   so it is soft on high-density screens. A 400 × 400 source fixes that at
   no cost. Two client logos are heavy PNGs (249KB and 101KB) that
   `next/image` resizes at request time.

## How to re-measure

```bash
pnpm build && pnpm start -p 3123
node scripts/crawl-locales.mjs http://localhost:3123
pnpm dlx lighthouse http://localhost:3123/nl --output=json --output-path=./lh.json --chrome-flags="--headless=new"
```

The Lighthouse command needs `CHROME_PATH` on Windows. Read the scores from
`categories`, the metrics from `audits.first-contentful-paint` and friends,
and the top items from `audits.unused-javascript`. Run it against the
production build, never the dev server.
