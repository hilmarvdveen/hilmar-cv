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

## Options, in order of effect on first paint

1. **Trim the client payload.** Pass only the namespaces client components
   use to `NextIntlClientProvider` and convert the eight presentational
   client components to server components. Expected: HTML from 89KB to
   roughly 50KB gzip on the homepage, less hydration work, no visible change.
   No trade-off. Do this first.
2. **Serve GTM or GA4, not both**, and only after consent. Removes about
   100KB of third-party JavaScript and the largest blocking-time item.
   Decision for the owner: which one carries the funnel events.
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
