# Strict SEO, Performance & Accessibility Playbook (Next.js App Router)

A portable, copy-into-any-project checklist for shipping technical **SEO,
performance, and accessibility** that scores ~100 on Lighthouse/PageSpeed
across all four categories **and** renders correct rich results + social
previews. Written from real audits — every "Gotcha" below is a bug that
actually shipped and cost points. Work top-to-bottom; each item says **what**,
**why**, and **how to verify**.

> Scope: technical + on-page SEO you control in code. It does **not** replace
> good content, real data, or off-page signals (backlinks). Those still matter
> most for ranking — this gets the *foundation* perfect.

---

## 0. Golden rules

1. **Server-render everything SEO-relevant.** Metadata + JSON-LD must be in the
   initial HTML (App Router `generateMetadata` + inline `<script type="application/ld+json">`). Most crawlers (incl. AI) don't run your JS.
2. **One source of truth for the base URL.** A single `SITE_URL` constant /
   `NEXT_PUBLIC_SITE_URL` env. Every canonical, OG, sitemap, schema URL derives
   from it. Mismatches (www vs non-www, http vs https) silently break canonical.
3. **Validate, don't assume.** After deploy: Rich Results Test, PageSpeed,
   Search Console URL Inspection. The DOM is the truth, not the source.
4. **Guard with tests.** Encode the rules below as unit tests (see §10) so they
   can't regress.

---

## 1. Metadata (`generateMetadata`)

- [ ] **`metadataBase`** set once (root/layout) so relative canonical/OG resolve to absolute URLs.
- [ ] **`<title>` ≤ 60 chars, unique per page, no literal `...`.**
  - **Gotcha (real bug):** a "smart" title optimizer truncated long titles to
    57 chars + `'...'` then appended `' | Brand'`, producing `…Amsterdam... | Brand` in Google. Author titles that already fit; if you must truncate, cut at a **word boundary** with a single `…` and **never** append a brand after a truncation.
- [ ] **Meta description** present, ~120–160 chars, unique, compelling.
- [ ] **Canonical** is absolute, self-referential, and uses the **primary host** (see §8). Lighthouse fails canonical if it points to a *different host* (www ≠ non-www counts as different).
- [ ] **`robots`**: content pages `index, follow`; include `max-image-preview:large` (rich image previews), `max-snippet:-1` or a sane cap. Utility pages (search results, thank-you) → `index: false`.
- [ ] **hreflang** for multilingual: one `alternate` per locale **plus `x-default`**. In Next: `alternates.languages = { 'en-US': …, 'nl-NL': …, 'x-default': … }`.

---

## 2. Open Graph & social (WhatsApp / LinkedIn / X / Slack)

- [ ] Use **Next's exact metadata shape**, not a custom one.
  - **Gotcha (real bug):** code set `openGraph.image` / `imageAlt` /
    `alternateLocales`. Next ignores those — it wants `openGraph.images: [{ url, width, height, alt }]` and `alternateLocale`. Result: **no `og:image` was ever emitted**. Same for `twitter.images`.
- [ ] **og:image is 1200×630**, absolute URL, < ~1 MB (WhatsApp is picky). Set `og:image:width/height/type` and `og:image:alt`.
- [ ] Prefer a **dynamic branded card** via the file convention
  `app/**/opengraph-image.tsx` (+ `twitter-image.tsx`) using `next/og`'s `ImageResponse`. It auto-injects `og:image`. If you do this, **don't also set `openGraph.images` in metadata** (it would override the generated card).
  - **Gotcha (real bug, Vercel-only):** loading the logo with
    `readFile(process.cwd() + 'public/…')` **fails on Vercel** (public/ isn't in the serverless FS) and `readFile(new URL('./x', import.meta.url))` throws "URL must be of scheme file" in some runtimes/tests. **Fix:** embed the logo as a **base64 data URI** in a sibling module and reference it — zero filesystem/fetch, works on edge+node+tests.
- [ ] Keep the **twitter card** (`summary_large_image` + title/description/image) even with **no X account** — it makes previews work when *others* share you. Omit `twitter:site`/`twitter:creator` if the handle doesn't exist (a bogus handle is worse than none).
- [ ] **Verify:** view-source for `og:image`; re-scrape with the FB Sharing
  Debugger / LinkedIn Post Inspector (they cache aggressively).

---

## 3. Structured data (JSON-LD)

- [ ] Server-render JSON-LD in the page HTML for each page's primary type(s):
  `WebSite` (+ `SearchAction`), `Organization`/`Person`, `BreadcrumbList`,
  `FAQPage`, `Service`/`Product`, `Article`/`BlogPosting`, etc.
- [ ] **`sameAs` entries must be full URLs**, not handles.
  - **Gotcha (real bug):** `sameAs: ['@handle']` is invalid → fails Rich Results. Use `https://x.com/handle`. Only list profiles that **exist**.
- [ ] **Every URL in schema must resolve** (no 404s).
  - **Gotcha (real bug):** `Person.image` pointed at `/images/hilmar-profile.jpg` which didn't exist. Point at a real file; ideally the same photo shown on the page (avoid "schema drift" — structured data must match visible content).
- [ ] **`SearchAction` requires a working search endpoint.** Don't declare a
  sitelinks searchbox targeting `/search?q=…` if `/search` 404s — build it (it can be a simple client-side filter over a static index) or drop the action.
- [ ] Link the entity graph with `@id` where useful (WebPage → WebSite → Person).
- [ ] **Verify:** Google Rich Results Test on each template.

---

## 4. Core Web Vitals & performance

Targets: **LCP < 2.5 s, INP < 200 ms, CLS < 0.1.**

- [ ] **LCP image** uses `next/image` with `priority` and explicit `width`/`height` (or `fill` + sized container). Never lazy-load the hero.
- [ ] **`next/font`** for fonts (self-hosted, no layout shift, no render-blocking 3rd-party font CSS).
- [ ] **Explicit dimensions on all images/media** → no CLS.
- [ ] **Animate only compositor-friendly properties** (`transform`, `opacity`).
  - **Gotcha (real bug):** a logo carousel animated `left` (and elsewhere `top`/`width`). Lighthouse "Avoid non-composited animations" → jank + CLS. **Fix:** animate `transform: translateX()` instead, add `will-change: transform`. (Anchor the element with a static `left`, translate by the equivalent distance.)
  - When converting, beware **`transform` conflicts**: if an element's
    `transform` carries an animation, a `:hover { transform: scale() }` clobbers it. Move the hover effect to a child (e.g. the `<img>`).
- [ ] **Defer/condition third-party scripts** (analytics, tag managers) — they're the usual "unused/legacy JS" + "render-blocking" offenders. Load only on consent (also a privacy/legal requirement in the EU).
- [ ] **Render-blocking CSS → inline it.** A single render-blocking
  `<link rel="stylesheet">` delays FCP/LCP (~150–200 ms for a small global sheet). In Next App Router, enable **`experimental.inlineCss: true`** (next.config) to inline the page CSS into `<head>`. Confirm the build logs `✓ inlineCss`. (Trade-off: inlined CSS isn't cached across navigations — fine for small global CSS, reconsider for very large stylesheets.)
- [ ] **Drop unused `preconnect`/`dns-prefetch`.** Only hint origins the page actually requests. **Gotcha (real):** a manual `<link rel="preconnect" href="https://fonts.gstatic.com">` was flagged "Unused preconnect" because **`next/font` self-hosts** the font — the Google Fonts origins are never hit. Remove font preconnects when using `next/font`. Keep ≤4 preconnects, real ones only.
- [ ] **Stop shipping legacy polyfills → set a modern `browserslist`.** With no `browserslist`, Next/SWC transpiles + polyfills for ancient browsers (Lighthouse "Legacy JavaScript": `Array.prototype.at`, `Object.hasOwn`, `flat`/`flatMap`, `Object.fromEntries`, `trimStart`/`trimEnd` …). Add to `package.json`:
  ```json
  "browserslist": ["chrome >= 93", "edge >= 93", "firefox >= 92", "safari >= 15.4", "not dead"]
  ```
  These targets support all those methods natively, so SWC injects nothing. Verify with `npx browserslist` (should list modern versions only). Trade-off: pre-2021 browsers lose those polyfills — fine for most sites, loosen if you must support older.
- [ ] **`next/image` sizing — two warnings to avoid:**
  - **width/height + CSS resize:** if you set `width`/`height` *and* resize with CSS that effectively changes one axis (e.g. `max-w-full max-h-full object-contain` in a flex box), Next warns "*width or height modified, but not the other*." **Fix:** add `style={{ width: "auto", height: "auto" }}` so both axes are auto and the aspect ratio holds.
  - **`fill` needs `sizes`:** every `<Image fill>` must declare `sizes`, or Next assumes `100vw` and serves an oversized file. For a fixed-size box (e.g. `w-32` = 128px) use `sizes="128px"`; for responsive use real breakpoints (`"(max-width: 768px) 100vw, 33vw"`).
- [ ] **Verify:** PageSpeed (field + lab), `@next/bundle-analyzer` for JS weight, and a clean **browser console** (Next surfaces image/perf warnings there in dev).

---

## 5. Crawlability & indexing

- [ ] **`sitemap.xml`** lists every indexable page, with `hreflang` alternates for multilingual. `lastmod` should be **stable per deploy**, not `new Date()` per request (a "changed every crawl" signal erodes trust). Compute it once at module load.
- [ ] **`robots.txt`** allows crawl, points to the sitemap, disallows `/api/` and noindex utility paths. Don't block CSS/JS.
- [ ] **404s return HTTP 404** (Next does this for `notFound()` / unmatched). Add a branded `not-found.tsx` (still 404 → auto-noindex) and an `error.tsx` boundary.
- [ ] **No broken internal links.** Audit header/footer/nav links against the
  routes that actually exist — dead links (e.g. footer `/terms` with no page) hurt UX + crawl. Either build the page or remove the link.
- [ ] Utility pages (search results, thank-you, previews) → `robots: { index: false }`.

---

## 6. Accessibility that is also SEO

- [ ] **Exactly one `<h1>` per page**, logical heading order.
- [ ] **All images have meaningful `alt`** (decorative → `alt=""`).
- [ ] **Color contrast ≥ 4.5:1** for normal text, ≥ 3:1 for large (≥ 18.66 px bold / 24 px).
  - **Gotcha (real bug):** white text on `bg-emerald-600` (#059669) is **3.8:1** → fails AA; a hover to the *lighter* `emerald-500` was worse. **Fix:** use `emerald-700` (≈5.6:1) for filled buttons; never hover to a lighter shade under white text. (Tailwind: `*-700` greens/blues generally pass with white; `*-600`/`*-500` often don't.)
- [ ] **Form inputs:** `<label htmlFor>` ↔ `id`, correct `type`, and
  **`autocomplete`** (`name`/`email`/`tel`/`organization`) — WCAG 1.3.5 "Identify Input Purpose" + browser autofill.
- [ ] **Landmarks:** `<header> <nav> <main> <footer>`. `aria-current` on the active nav link. Hidden/offscreen content `aria-hidden`.
- [ ] Interactive elements keyboard-focusable with visible focus.
- [ ] **Centralise repeated controls in ONE component.** Dozens of inline
  button class strings drift apart and re-introduce contrast/hover bugs one at a time. A single `<Button>` (variants `primary`/`outline`/`white`/`neutral`, sizes, renders `<button>`/`Link`/`<a>`) makes contrast, focus ring, and hover **fixable in one place**. Use `tailwind-merge` inside it so a caller's `className` reliably overrides the variant defaults instead of producing conflicting utilities. **Hover rule:** filled buttons darken on hover (`-700 → -800`); never lighten a fill under white text.

---

## 7. Domain & URL hygiene

- [ ] **Pick ONE canonical host** (www **or** non-www) and make everything match: the `SITE_URL` constant, `NEXT_PUBLIC_SITE_URL`, image `remotePatterns`, Server-Action `allowedOrigins`, schema/OG/sitemap.
- [ ] **Redirect the other host** (301) to the canonical at the platform (Vercel → Domains → set primary + redirect). Otherwise the same content lives on two hosts and the canonical points "off-host" → Lighthouse flags an invalid canonical.
  - **Gotcha (real bug):** code used `hilmarvanderveen.com` everywhere but the
    site was served at `www.hilmarvanderveen.com` → SEO score dropped on the canonical audit.
- [ ] HTTPS only; HSTS; no mixed content.
- [ ] Keep **env var names consistent** (e.g. one `GOOGLE_SITE_VERIFICATION`, one `NEXT_PUBLIC_SITE_URL`) — duplicate/old names cause silent gaps. Document them in `.env.example`.

---

## 8. Delete dead SEO weight

- [ ] **Remove unused SEO components/code.** If pages already inject metadata +
  JSON-LD server-side, client-side "SEO components" that re-inject the same data after hydration are redundant **and worse** (client-rendered). Audit for components nothing imports.

---

## 8b. Framework & i18n gotchas (Next.js + next-intl)

- [ ] **Locale-aware links on i18n sites.** With `localePrefix: 'always'`, a
  plain `next/link href="/book"` produces a **locale-less** URL that hits the middleware and redirects (extra hop, can land on the wrong locale). Use next-intl's `Link` from `createNavigation` (`@/i18n/navigation`) so internal hrefs carry the locale (`/nl/book`). Route external/`mailto:`/`tel:`/`#` hrefs through a plain `<a>`. **Centralise this in your `<Button>`** so every CTA is correct.
  - **Test note:** mock `@/i18n/navigation` globally (in the vitest setup) to render the locale-aware `Link` as a plain `<a>`, so component tests don't need the routing provider.
- [ ] **Middleware is `proxy.ts` in Next 16.** Middleware was renamed — `src/proxy.ts` *is* the active middleware (CSP/nonce live there). Don't add a second CSP in `next.config.ts`.
- [ ] **Config changes need a dev-server restart.** Editing `next.config.ts` or `package.json` while `next dev` is running can throw a **`ChunkLoadError: Failed to load chunk …/[turbopack]…/hmr-client.ts`** in the open tab — it's a **dev-only HMR artifact**, never in production. Fix: stop dev, `rm -rf .next`, restart, hard-refresh (Ctrl-Shift-R).
- [ ] **Keep the browser console clean in dev.** Next surfaces real image/perf/a11y problems there (the `fill`/`sizes` and aspect-ratio warnings above came from the console, not Lighthouse).

---

## 9. Pre-launch checklist (run before "done")

- [ ] PageSpeed (desktop + mobile) — Perf / A11y / Best-Practices / SEO.
- [ ] Rich Results Test — each page template; 0 errors.
- [ ] View-source: `<title>`, description, **one** canonical (right host),
  hreflang+x-default, `og:image` present & 1200×630, `lang`, viewport.
- [ ] Share the URL into WhatsApp/LinkedIn/Slack → image + title + description show.
- [ ] Search Console: submit sitemap, verify ownership, URL-inspect a few pages.
- [ ] Lighthouse "Diagnostics": no non-composited animations, no broken links.

---

## 10. Strict mode: encode it as tests

Make regressions impossible. Examples (Vitest), all fast and deterministic:

```ts
// Titles: every page, both locales — within length, no literal "...".
for (const page of PAGES) for (const locale of LOCALES) {
  const title = String(SEO[page](locale).metadata.title);
  expect(title.length).toBeLessThanOrEqual(60);
  expect(title).not.toContain('...');
  expect(title).not.toMatch(/…\s*\|/);
}

// OG contract: metadata must NOT inline images (the image route provides them).
const og = meta.openGraph as Record<string, unknown>;
expect(og.images).toBeUndefined();

// OG route actually renders (catches the fs/asset bug):
const res = await OpengraphImage();
expect(res.headers.get('content-type')).toContain('image/png');

// sameAs are URLs, not handles:
for (const ref of personSchema.sameAs) expect(ref).toMatch(/^https?:\/\//);

// Animations are composited (read the CSS, assert the keyframe):
expect(keyframeBlock).toContain('translateX');
expect(keyframeBlock).not.toMatch(/\bleft\s*:/);

// robots requests large image previews:
expect(String(meta.robots)).toContain('max-image-preview:large');
```

---

## Appendix — the bugs that actually shipped (quick reference)

| Symptom in the report | Root cause | Fix |
|---|---|---|
| No `og:image` anywhere | metadata used `openGraph.image` (Next wants `images: [...]`) | Use Next's shape, or file-based `opengraph-image.tsx` |
| OG route 500s on Vercel | `readFile(process.cwd()+'public/…')` / `import.meta.url` | **Embed asset as base64 data URI** |
| `…Title... | Brand` in Google | truncate-to-N + `'...'` + append brand | clean word-boundary `…`, no brand after truncation |
| Invalid `rel=canonical` | canonical host ≠ served host (www vs non-www) | one host everywhere + 301 redirect the other |
| Structured data invalid | `sameAs: ['@handle']`; `image` 404 | full URLs; real, existing image |
| Sitelinks searchbox invalid | `SearchAction` → non-existent `/search` | build `/search` or drop the action |
| Non-composited animation (CLS) | animating `left`/`top`/`width` | animate `transform`/`opacity` + `will-change` |
| Low contrast buttons | white on `bg-emerald-600` (3.8:1) | `emerald-700`+ (≥4.5:1); never hover lighter |
| `lastmod` distrusted | `new Date()` per request in sitemap | stable per-deploy timestamp |
| Broken footer links | linked to pages that don't exist | build or remove |
| Dead client SEO components | re-inject server-rendered data | delete |
| Render-blocking CSS (~170 ms) | external `<link rel=stylesheet>` | `experimental.inlineCss: true` |
| "Unused preconnect" to fonts.gstatic.com | manual font preconnect + `next/font` self-hosts | remove the preconnect |
| Legacy JS polyfills (~14 KiB) | no `browserslist` → transpile for old browsers | modern `browserslist` in package.json |
| Image "width or height modified, not the other" | `width`/`height` + CSS resize one axis | `style={{ width:"auto", height:"auto" }}` |
| Image `fill` missing `sizes` | `<Image fill>` with no `sizes` → serves 100vw | add `sizes` (e.g. `"128px"`) |
| CTA links drop the locale | plain `next/link` + `localePrefix:'always'` | next-intl locale-aware `Link` |
| Button contrast/hover drift | inline class strings copy-pasted everywhere | one `<Button>` + `tailwind-merge` |
| `ChunkLoadError …/hmr-client.ts` (dev) | edited config while `next dev` running | restart dev, `rm -rf .next`, hard refresh |
