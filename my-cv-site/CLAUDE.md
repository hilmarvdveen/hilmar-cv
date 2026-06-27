# CLAUDE.md

Guidance for working in this repository.

## Overview

Multilingual (NL/EN) CV / portfolio site. **Next.js 16** App Router, **React 19**,
**TypeScript (strict)**, **Tailwind v4**, **next-intl**. Transactional email and
calendar booking go through **Microsoft Graph**. Hosted on **Vercel**.

## Commands

```bash
npm run dev          # dev server (http://localhost:3000)
npm run build        # production build
npm run start        # serve production build
npm run lint         # ESLint
npm test             # Vitest (unit + component)
npm run test:watch   # Vitest watch mode
```

## Required environment variables

`MS_CLIENT_ID`, `MS_CLIENT_SECRET`, `MS_TENANT_ID`, `SMTP_USER` (Microsoft Graph)
and optional `NEXT_PUBLIC_GA_MEASUREMENT_ID`, `NEXT_PUBLIC_GTM_ID`. See
`.env.example`. Missing Graph vars make the mail/booking routes return a generic
`Server configuration error` (they never reveal which var is absent).

## Architecture & conventions

### Security (important)

- **One CSP, one owner.** The Content-Security-Policy is generated per request
  with a nonce in `src/proxy.ts` (Next.js 16 renamed middleware to *proxy*;
  `proxy.ts` **is** the active middleware). Do **not** add a second CSP in
  `next.config.ts`. `script-src` uses `nonce` + `strict-dynamic` and must not
  reintroduce `'unsafe-inline'`/`'unsafe-eval'`.
- **Static security headers** (HSTS, COOP, X-Frame-Options, X-Content-Type-Options,
  Referrer-Policy, Permissions-Policy, X-DNS-Prefetch-Control) live once in
  `next.config.ts` `headers()` so they also cover API and static routes.
- **All Microsoft Graph access goes through `src/lib/graph/`** — never inline a
  token fetch or `Client.init` in a route again.
- **Every public API route must**, before doing any work:
  1. `isAllowedOrigin(request)` → 403 on cross-site/`null` origin (prod).
  2. `looksAutomated(body, Date.now())` → silently succeed (honeypot + timing).
  3. `validateFields(...)` / `validateStringArray(...)` → 400, with length caps
     from `LIMITS`.
  4. Escape user input with `escapeHtml()` before putting it in any HTML email
     or calendar body.
  5. Use `serverErrorResponse(error, publicMessage)` for 500s — details are only
     included in development.
- IP rate limiting is delegated to the **Vercel platform** (firewall / WAF), not
  application code.

### Forms

Client forms (`ContactForm`, `BookingForm`, `CVDownloadModal`) use
`useHoneypot()` + `<HoneypotField/>` and spread `honeypot.payload()` (hidden
`company_website` field + `formStartedAt`) into the POST body. Mirror the server
length caps with `maxLength` on inputs.

### i18n

`next-intl`; routes live under `src/app/[locale]/…`. All i18n lives under
`src/i18n/` — `config.ts`, `request.ts`, `routing.ts`, `navigation.ts`, and
`messages/{en,nl}.json`. Import navigation helpers via `@/i18n/navigation`.

## Folder structure (feature-based)

```
my-cv-site/
  src/
    app/                       # routes only
      [locale]/…               # localized pages & layouts
      api/{contact,cv-download,booking,booking/slots}/route.ts
      sitemap.xml/ robots.txt/
    features/                  # one folder per domain, each with a barrel index.ts
      booking/   { components/, context/ }
      contact/ cv-download/ home/ about/ services/ projects/ faq/ seo/ analytics/
    components/                # SHARED ONLY: Icon, SectionTitle, Header, Footer,
                               #              Breadcrumb, HoneypotField
    hooks/                     # useHoneypot (shared)
    lib/
      graph/                   # Microsoft Graph: client, mail, calendar
      security/                # origin, honeypot, validate, escape, http
      seo/                     # SEO engine, schema, constants
    i18n/  models/  types/  data/
  docs/                        # MICROSOFT_GRAPH.md, SEO.md
  public/                      # single source for static data (CV pdf, geojson)
```

### Structure conventions
- **Pages import features through the barrel**: `import { BookingForm } from "@/features/booking"` — not deep component paths. Each feature's `index.ts` re-exports its public components/context.
- **Shared vs feature**: cross-feature UI (Icon, SectionTitle, Header, Footer, Breadcrumb, HoneypotField) lives in `src/components/`; anything page/domain-specific lives in its `features/<domain>/`.
- **Imports use the `@/` alias** (→ `src/`); avoid `../` relative paths that break on moves. Co-located `./` imports within a feature are fine.
- **Routes stay thin**: route handlers delegate to `lib/` (and never inline Graph calls).

## Testing

Vitest + React Testing Library + jsdom (`vitest.config.ts`). Run `npm test`,
`npm run test:watch`, or `npm run test:coverage`.

- **Pure logic** (`lib/graph`, `lib/security`, `lib/seo`, `hooks`) is unit-tested
  directly; the SEO suite drives `SEOFactory` to cover the engine + generators.
- **API routes** are tested with a mocked `@/lib/graph`.
- **Interactive components** (ContactForm, CVDownloadModal, BookingForm, Header)
  have RTL tests with mocked `fetch` / `next-intl`.
- **Coverage gate**: `test:coverage` enforces thresholds (70/70/70 lines/funcs/
  stmts, 60 branches) on `src/lib` + `src/hooks`. Pages/components are excluded
  from the gate but still tested for regression.

Add/adjust tests when changing route validation, Graph calls, form payloads, or
SEO output.
