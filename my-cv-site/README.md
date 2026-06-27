# Hilmar van der Veen — CV / Portfolio

A multilingual (NL/EN) personal portfolio and CV built with **Next.js 16**
(App Router, React 19, TypeScript, Tailwind v4). It features project highlights,
a services overview, an SEO layer, and contact / consultation-booking / CV-lead
forms that send mail and create calendar events via **Microsoft Graph**.

## Tech stack

- Next.js 16 (App Router) · React 19 · TypeScript (strict)
- Tailwind CSS v4
- `next-intl` for i18n (NL/EN), routing under `/[locale]`
- Microsoft Graph (`@microsoft/microsoft-graph-client`, `@azure/identity`) for
  transactional email and calendar
- Vercel Analytics + Speed Insights, optional Google Analytics / Tag Manager
- d3 for the Netherlands coverage map
- Vitest + React Testing Library for unit/component tests

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev                  # http://localhost:3000
```

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run lint` | ESLint |
| `npm test` | Run the Vitest suite |
| `npm run test:watch` | Vitest in watch mode |

## Environment variables

See `.env.example`. The mail/booking API routes require the Microsoft Graph
application credentials; without them those routes return a generic
`Server configuration error`.

| Variable | Purpose |
| --- | --- |
| `MS_CLIENT_ID` | Azure app registration (client credentials) |
| `MS_CLIENT_SECRET` | Azure app client secret |
| `MS_TENANT_ID` | Azure tenant id |
| `SMTP_USER` | Mailbox/user the app sends as and books on (e.g. `hilmar@…`) |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics id (optional, prod only) |
| `NEXT_PUBLIC_GTM_ID` | Google Tag Manager id (optional, prod only) |

## Documentation

- `CLAUDE.md` — architecture, conventions, and the target folder structure.
- `docs/MICROSOFT_GRAPH.md` — Graph setup & troubleshooting.
- `docs/SEO.md` — how the SEO layer works.

## Security model (summary)

- A single **Content-Security-Policy** with a per-request nonce is set in
  `src/proxy.ts` (Next.js 16 middleware). Static security headers live in
  `next.config.ts`.
- The public API routes validate + length-cap input, escape user content in
  HTML emails, check the request `Origin`, and use a honeypot + timing guard
  against bots. IP rate limiting is delegated to the Vercel platform.

See `CLAUDE.md` for the full conventions.
