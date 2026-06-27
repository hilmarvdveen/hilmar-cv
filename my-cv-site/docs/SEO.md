# SEO

SEO is implemented in code under `src/lib/seo/` and consumed by the App Router
metadata APIs. This document is the single reference (it replaces the previous
set of overlapping `SEO_*` status logs).

## Where it lives

- `src/lib/seo/core/` — engine, metadata generator, schema (JSON-LD) generator,
  analytics manager.
- `src/lib/seo/constants/` — per-page content and meta constants.
- `src/lib/seo/factory.ts`, `src/lib/seo/index.ts` — entry points used by pages.
- `src/components/SEO/` — `ComprehensiveSEO`, `PageSEO`, `StructuredData`
  components that render `<script type="application/ld+json">` blocks.
- `src/app/sitemap.xml/route.ts` and `src/app/robots.txt/route.ts` — generated
  sitemap and robots files.

## How to add/adjust SEO for a page

1. Add or update the page entry in `src/lib/seo/constants/page-content.ts`.
2. Use the metadata helpers from `src/lib/seo` in the route's `generateMetadata`.
3. For structured data, render `StructuredData`/`PageSEO` with the relevant
   schema from `schema-generator.ts`.

## Notes

- JSON-LD blocks use `type="application/ld+json"` and are **data**, not
  executable script — they are unaffected by the `script-src` CSP directive.
- Canonical/OG/Twitter tags and locale alternates are produced by the metadata
  generator; keep the canonical host in sync with `next.config.ts`
  `images.remotePatterns` (`hilmarvanderveen.com`).
