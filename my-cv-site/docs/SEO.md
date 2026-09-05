# SEO

SEO is implemented in code under `src/lib/seo/` and consumed by the App Router
metadata APIs. This document is the single reference for how it works and
holds the audit of 1 September 2026.

## Where it lives

- `src/lib/seo/core/`: engine, metadata generator, schema (JSON-LD) generator,
  analytics manager.
- `src/lib/seo/constants/`: `meta-constants.ts` (business profile, locale
  config, limits, social settings) and `page-content.ts` (only the
  `SEO_FOCUS` keyword arrays per page, everything else was dead and removed).
- `src/lib/seo/factory.ts`, `src/lib/seo/index.ts`: entry points used by
  pages. `localizedAlternates()` builds canonical plus hreflang for pages
  that do not go through the engine (experience, search).
- `src/app/[locale]/{opengraph-image,twitter-image}.tsx`: the generated
  1200 × 630 social cards.
- `src/app/sitemap.xml/route.ts` and `src/app/robots.txt/route.ts`.

## Rules that the audit turned into code

1. **Every URL carries the locale prefix**, the Dutch default included,
   because `routing.ts` uses `localePrefix: "always"`. Canonicals, hreflang
   alternates, `x-default` and sitemap entries all come from
   `buildCanonicalUrl`, which prefixes unconditionally. If the routing ever
   moves to `"as-needed"` (Dutch at the root), that one function changes.
2. **Every page sets its own `alternates`.** A page without them inherits
   the homepage canonical from the layout metadata and declares itself a
   duplicate of the homepage. Engine pages get them from the generator,
   the others call `localizedAlternates(path, locale)`.
3. **The generator references the generated social card explicitly**
   (`openGraph.images` and `twitter.images` point at
   `/{locale}/opengraph-image` and `/{locale}/twitter-image`). A page that
   defines `openGraph` replaces the layout's `openGraph` wholesale, which is
   how the file-based card vanished from every engine page.
4. **Titles stay under 60 characters at the source.** The generator appends
   a suffix when it fits and otherwise truncates with an ellipsis. A title
   that ends in "…" in the search results is a title that was written too
   long, not a generator feature to rely on.

## Audit of 1 September 2026

Method: a crawl of every route in both locales on a production build that
parsed title, description, canonical, hreflang, Open Graph, JSON-LD and the
H1 count, a check that every sitemap URL returns 200, Lighthouse on the
homepage and the experience page, and a look at the live host redirects.

### Fixed the same day

| Finding | Cause | Fix |
|---|---|---|
| Dutch canonicals pointed at URLs that do not exist (`/about` instead of `/nl/about`) and 18 of 36 sitemap URLs returned 307 | the generator assumed an unprefixed default locale while routing prefixes always | `buildCanonicalUrl` prefixes every locale, sitemap follows |
| `/experience` and `/search` declared the homepage as canonical | no `alternates` in their `generateMetadata`, inherited from the layout | `localizedAlternates()` |
| No `og:image` or `twitter:image` on any engine page (home, about, services, projects, faq, book, contact, blog) | page-level `openGraph` replaced the layout's file-based image | explicit `images` on both |
| Lighthouse SEO failed the canonical audit | the first row | same |

### Decisions for the owner (copy, not code)

The engine's titles and descriptions still sell the pre-2026 positioning:

- "Senior Frontend Developer **Amsterdam**" in every title and the keyword
  arrays, with geo meta tags for Amsterdam. The dossier says Zandvoort
  (business address) and Utrecht (work). Decide the city to target.
- "**8+ years** experience" and "8 years experience" in descriptions and
  long-tail keywords. The locked framing is ten-plus years since 2016.
- "**€95-125/hour**" in the booking title and description, "Vue.js" and
  "React Native" in the frontend services copy, "MSc Physics UvA" as a
  headline credential. Decide what the titles should promise.
- The homepage title uses an em dash ("Hilmar van der Veen — Senior
  Frontend Developer Amsterdam"), against the house style.
- `hreflang="en-US"` and `og:locale` = `en-US`. The English audience is
  international, `en` is the broader tag, and Open Graph expects `en_US`
  with an underscore.
- `robots.txt` blocks GPTBot, ClaudeBot, PerplexityBot, Google-Extended and
  others. That keeps the site out of AI answers, where people now search for
  freelancers. A deliberate choice either way.

### Structural, see RENDERING_AND_PERFORMANCE.md

Every page renders on demand because of the per-request CSP nonce, the
apex domain takes two redirects to reach Dutch content, and the whole
message file travels to the client on every page.

## Audit of 3 September 2026 (sharing and structured data)

A crawl of all 46 URLs plus the social card images and the sitemap and
robots routes, described in full in
`Hilmar/review-board/2026-09-03-P6-seo-sharing.md`. Fixed the same day:

| Finding | Cause | Fix |
|---|---|---|
| `/experience`, `/search` and the four legal pages inherited the homepage's Open Graph, so sharing any of those 12 URLs on WhatsApp, LinkedIn or Slack showed the homepage's title, image and link | those six `generateMetadata` functions set only `title`, `description` and `alternates` | a new `localizedOpenGraph(path, locale, title, description)` next to `localizedAlternates()` in `src/lib/seo/alternates.ts`, spread into each page's returned metadata |
| The four service detail pages emitted two `BreadcrumbList` blocks, one from the engine pointing at a URL that 404s (`/services/frontend-development`) with English labels on Dutch pages, one correct block from the rendered `Breadcrumb` component | `createFrontendServiceSEO`, `createFullstackServiceSEO`, `createDesignSystemsServiceSEO` and `createConsultingServiceSEO` in `seo-engine.ts` all passed `breadcrumbs` into the config | stopped passing `breadcrumbs` from those four methods, so the engine emits none and the component's correct block is the only one. The services overview, projects, contact and FAQ pages keep the engine's single block, because `Breadcrumb.tsx` renders nothing for a one-segment route |
| Every engine-driven page duplicated the whole `WebSite` entity, once as its own top-level schema and again inside `WebPage.isPartOf` | `generateWebPageSchema` built a second full `WebSiteSchema` object instead of referencing the first | the top-level `WebSite` schema now carries a stable `@id` (`{origin}/{locale}#website`), and `WebPage.isPartOf` is a thin `{ "@type": "WebSite", "@id": ... }` reference to it |
| `og:site_name` said "Hilmar van der Veen \| Senior Frontend Engineer" while every title and `og:title` says "Developer" | `MetadataGenerator.generateOpenGraphMetadata`'s `siteName` combined the name and the title | `siteName` is `BUSINESS_PROFILE.NAME` alone |
| All ten blog post `<title>` tags were cut with a literal ellipsis while `og:title` showed the full text | the five source titles in `ArchitecturePost.tsx`, `FolderStructurePost.tsx`, `RoutingPost.tsx`, `SeoPost.tsx` and `UnitTestingPost.tsx` were all over the 60-character budget | shortened every title, both locales, to fit under 60 characters without truncation |
| 8 indexable URLs, the four legal pages in both locales, were missing from the sitemap | `generateSitemapData`'s `staticPages` array stopped at `book` | added `privacy`, `terms`, `cookies`, `disclaimer` |
| `robots.txt` declared three `Sitemap:` locations that do not exist (`/sitemap-0.xml`, `/en/sitemap.xml`, `/nl/sitemap.xml`) | `SEOUtils.generateRobotsTxt` listed them speculatively | declares only the one real `/sitemap.xml` route |

Also added: a booking action on `/experience` (`PageHero` gets a
"Book a 30-minute call" action reusing `home.hero.bookCall`) and a closing
band, `ExperienceClose`, after the work-history cards.

Still open, unchanged since 1 September: the social card image itself is
one static, English-only, Amsterdam-only PNG for the whole site and every
locale, and it carries a dash the house style forbids. `hreflang="en-US"`
versus the broader `en`, and whether to keep blocking the named AI
crawlers, are still Hilmar's decisions.

## How to add or adjust SEO for a page

1. Add or update the page's `SEO_FOCUS` in `src/lib/seo/constants/page-content.ts`
   and its copy in the engine.
2. Use `SEOFactory.<page>(locale)` in the route's `generateMetadata`, or for
   a page outside the engine set `title`, `description` and
   `alternates: localizedAlternates(path, locale)`.
3. For structured data, render the JSON-LD from `seoData.structuredData`
   with `<script type="application/ld+json">`.
4. Re-run the crawl (`pnpm check:locales`) and view-source one page per
   locale for canonical, hreflang, og:image.

## Notes

- JSON-LD blocks use `type="application/ld+json"` and are data, not
  executable script. The `script-src` CSP directive does not apply to them.
- Keep the canonical host (`https://www.hilmarvanderveen.com`) in sync with
  `next.config.ts` `images.remotePatterns`. The bare domain redirects to
  `www` at the platform.

## Page-aware social card (5 September 2026)

Every page's `og:image` and `twitter:image` point at `/api/og` with the
locale and the page title as query parameters (`socialCardUrl` in
`src/lib/seo/socialCard.ts`, used by the metadata generator and by
`localizedOpenGraph()`). The route renders the navy card with the logo,
the name, the page title and the positioning line, cached for a day.
The per-locale `opengraph-image` and `twitter-image` routes stay as the
default card without a title. Titles are cleaned by `socialCardTitle`:
the brand suffix goes, whitespace collapses, and anything over 90
characters is cut on a word boundary.

## Robots, build date and the search index (5 September 2026)

`robots.txt` is one `User-agent: *` group (`Allow: /api/og` for the
social card, `Disallow: /api/`), the AI and scraper blocks, and one
sitemap line. The JSON-LD `dateModified` comes from
`NEXT_PUBLIC_BUILD_DATE`, which `next.config.ts` sets at build time, so
every instance of one deploy reports the same date. The search page
indexes the static pages plus the eight blog posts and the twelve
engagements, built on the server and handed to the client as extra
entries so the post bodies never reach the browser bundle.

## Card whitelist, experience structured data and the 404 (5 September 2026, evening)

`/api/og` renders a page title only when it is a title the site itself
publishes: `knownSocialCardTitles(locale)` collects the engine pages,
the posts, the engagement pages ("{headline} | {company}"), the
experience and search titles and the legal titles, all normalised by
`socialCardTitle`. Any other title falls back to the default card, so
a crafted URL cannot put a claim under the logo and the name. The
twelve engagement pages emit WebPage and BreadcrumbList JSON-LD and the
hub a ProfilePage whose Person lists every engagement as an occupation
(`src/lib/seo/experienceSchema.ts`). The catch-all route sets noindex
and no canonical, so a 404 no longer points search engines at the
homepage. The schema generator and the engine share the build date.

## Social card typeface (5 September 2026)

The card renderer (`src/app/[locale]/social-card.tsx`) sets its text in
Inter 400 and 700. `next/og` renders with Satori, which needs a font
file per weight and accepts TTF, OTF and WOFF, not WOFF2. The loader in
`src/lib/seo/socialCardFont.ts` fetches the Google Fonts stylesheet
with a legacy user agent (so the stylesheet lists TTF or WOFF faces),
parses the two faces, downloads both, and caches the buffers for the
life of the serverless instance. Each request times out after three
seconds. When anything fails the card renders in the system sans and
the next request tries again. The image route tests mock the loader so
the suite never touches the network.
