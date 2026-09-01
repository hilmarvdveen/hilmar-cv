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
