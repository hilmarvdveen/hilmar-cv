# Page map

Read this first when a task names a page. It tells you where the page
lives, where its copy and data come from, how it is indexed and which doc
covers it, without a search through the tree.

`pnpm check:pages` fails when a `page.tsx` or `route.ts` under `src/app`
has no row here, and when a row names a route that no longer exists. The
first cell of every row is the route in backticks, exactly as the check
derives it.

Every page lives under `src/app/[locale]/`. The locales are `nl` (default)
and `en`, set in `src/i18n/routing.ts`, and every public URL carries the
prefix (`/nl/...`, `/en/...`). Copy comes only from
`src/i18n/messages/{nl,en}.json`. Domain UI sits in `src/features/<domain>/`
and is imported through the barrel. Paths below are relative to
`src/app/[locale]/` for pages and to `src/app/` for route handlers.

Metadata on every page comes from `generateMetadata`, with
`localizedAlternates` for the hreflang pair. "Sitemap" means the page is
listed by `src/app/sitemap.xml/route.ts`, either in the static list in
`src/lib/seo/core/seo-engine.ts` or as a dynamic entry.

## Home and about

| Route | Source file | Namespaces | Data | SEO | Doc | Instances |
|---|---|---|---|---|---|---|
| `/` | `(home)/page.tsx` | `home.*`, `common` | none | `SEOFactory.homepage`, sitemap | `LAYOUT.md` | 1 |
| `/about` | `about/page.tsx` | `about`, `about.map` | `data/workHistory.ts`, `data/regions.ts`, `public/data/geo-provinces.json` | `SEOFactory.about`, sitemap | none | 1 |

## Experience and projects

| Route | Source file | Namespaces | Data | SEO | Doc | Instances |
|---|---|---|---|---|---|---|
| `/experience` | `experience/page.tsx` | `experiencePage`, `home`, `work` | `data/workHistory.ts` | `experienceHubSchema`, sitemap | `EXPERIENCE_QUICK_NAV.md` | 1 |
| `/experience/[id]` | `experience/[id]/page.tsx` | `work`, `home` | `data/workHistory.ts` | `experienceDetailSchema`, `clampDescription`, sitemap | none | 12 |
| `/projects` | `projects/page.tsx` | `projects` (`projects.cases`), `work` | `data/workHistory.ts` | `SEOFactory.projects`, sitemap | none | 1 |

The 12 engagements: `bol`, `belastingdienst`, `postcode-loterij`,
`athlon`, `randstad`, `opinity`, `omniplan`, `ortec`, `bluefield`,
`niped`, `conclusion`, `transdev`. Copy per engagement sits under
`work.<id>`. Technologies have no route. They are `work.tech.*` labels on
the engagements and the related technologies in the `/fit` report.

`data/ownWork.ts` holds `own-platform`, `reference-repository` and
`vacancy-fit`. It feeds the `/fit` report (`FitEvidence`,
`lib/fit/report.ts`, `lib/fit/seed.ts`), not `/projects`.

## Services

| Route | Source file | Namespaces | Data | SEO | Doc | Instances |
|---|---|---|---|---|---|---|
| `/services` | `services/page.tsx` | `services` | none | `SEOFactory.services`, sitemap | none | 1 |
| `/services/frontend` | `services/frontend/page.tsx` | `services`, `services.frontend` | none | `SEOFactory.frontendService`, sitemap | none | 1 |
| `/services/fullstack` | `services/fullstack/page.tsx` | `services`, `services.fullstack` | none | `SEOFactory.fullstackService`, sitemap | none | 1 |
| `/services/consulting` | `services/consulting/page.tsx` | `services`, `services.consulting` | none | `SEOFactory.consultingService`, sitemap | none | 1 |
| `/services/design-systems` | `services/design-systems/page.tsx` | `services`, `services.designSystems` | none | `SEOFactory.designSystemsService`, sitemap | none | 1 |

## Blog

| Route | Source file | Namespaces | Data | SEO | Doc | Instances |
|---|---|---|---|---|---|---|
| `/blog` | `blog/page.tsx` | `blog` | `features/blog/registry.ts` | `SEOFactory.blog`, sitemap | none | 1 |
| `/blog/[slug]` | `blog/[slug]/page.tsx` | `blog`, plus the post's own bilingual `COPY` | `features/blog/registry.ts` | `SEOFactory.blogPost`, sitemap with `lastModified` from the post dates | none | 21 |

Each post is one component in `src/features/blog/components/`, registered
in `registry.ts` with its track. `pnpm check:reading-times` keeps the
reading time honest.

| Track | Component | Slug |
|---|---|---|
| frontend | `FolderStructurePost` | `react-folder-structure` |
| frontend | `ArchitecturePost` | `modern-react-architecture-vite-router-vitest-storybook` |
| frontend | `UnitTestingPost` | `unit-testing-react-the-right-way` |
| frontend | `SeoPost` | `100-percent-seo-score-and-what-actually-ranks` |
| frontend | `RoutingPost` | `react-router-remix-routes-loaders-actions-folder-structure` |
| frontend | `RxjsSignalsPost` | `rxjs-versus-signals-in-angular` |
| frontend | `AccessibilityPost` | `wcag-aa-in-the-component` |
| frontend | `StateWithoutStorePost` | `state-without-a-store-react-router-angular-graphql` |
| backend | `HexagonalCSharpPost` | `hexagonal-architecture-csharp-dotnet` |
| backend | `HexagonalKotlinPost` | `hexagonal-architecture-kotlin` |
| backend | `HexagonalJavaPost` | `hexagonal-architecture-java` |
| backend | `CsharpApiPost` | `building-an-api-in-csharp` |
| backend | `JavaApiPost` | `building-an-api-in-java` |
| backend | `KotlinApiPost` | `building-an-api-in-kotlin` |
| backend | `FederationPost` | `apollo-federation-explained-by-building-a-supergraph` |
| fullstack | `CutOverPost` | `reversible-cut-over-legacy-to-new` |
| fullstack | `GraphQLContractPost` | `graphql-as-a-contract-between-frontend-and-backend` |
| fullstack | `DockerApisPost` | `dockerising-dotnet-java-kotlin-apis` |
| fullstack | `SessionsAndJwtPost` | `sessions-and-jwt-one-design-built-seven-times` |
| fullstack | `ApolloAcrossStackPost` | `graphql-with-apollo-react-nodejs-kotlin` |
| fullstack | `RestAndGraphQLPost` | `rest-and-graphql-idempotency-status-codes-when-to-use-which` |

## Regions

| Route | Source file | Namespaces | Data | SEO | Doc | Instances |
|---|---|---|---|---|---|---|
| `/freelance-frontend-developer` | `freelance-frontend-developer/page.tsx` | `regions`, `home`, `breadcrumb` | `data/regions.ts`, `data/workHistory.ts` | `regionHubSchema`, sitemap | `SEO.md` | 1 |
| `/freelance-frontend-developer/[city]` | `freelance-frontend-developer/[city]/page.tsx` | `regions`, `home`, `breadcrumb` | `data/regions.ts`, `data/workHistory.ts`, the blog registry | `regionPageSchema`, sitemap | `SEO.md` | 4 |

The 4 cities: `amsterdam`, `utrecht`, `rotterdam`, `den-haag`.

## Conversion

| Route | Source file | Namespaces | Data | SEO | Doc | Instances |
|---|---|---|---|---|---|---|
| `/book` | `book/page.tsx` | `booking` | Microsoft Graph through `lib/graph/` | `SEOFactory.booking`, sitemap | `BOOKING_FLOW.md`, `MICROSOFT_GRAPH.md` | 1 |
| `/contact` | `contact/page.tsx` | `contact`, `common` | Microsoft Graph through `lib/graph/` | `SEOFactory.contact`, sitemap | none | 1 |
| `/fit` | `fit/page.tsx` | `fit`, `breadcrumb` | the fit agent through `lib/fit/agentClient.ts`, `data/ownWork.ts` | `fitPageSchema`, not in the sitemap | `FIT_CHECK.md` | 1 |

## Help, search and legal

| Route | Source file | Namespaces | Data | SEO | Doc | Instances |
|---|---|---|---|---|---|---|
| `/faq` | `faq/page.tsx` | `faq` | none | `SEOFactory.faq`, sitemap | none | 1 |
| `/search` | `search/page.tsx` | `search`, `faq`, `work` | `features/search/searchIndex.ts`, the blog registry, `data/workHistory.ts` | noindex, not in the sitemap | none | 1 |
| `/privacy` | `privacy/page.tsx` | `legal`, `breadcrumb` | `features/legal/legalContent.ts` | `legalPageSchema`, sitemap | none | 1 |
| `/terms` | `terms/page.tsx` | `legal`, `breadcrumb` | `features/legal/legalContent.ts` | `legalPageSchema`, sitemap | none | 1 |
| `/cookies` | `cookies/page.tsx` | `legal`, `breadcrumb` | `features/legal/legalContent.ts` | `legalPageSchema`, sitemap | none | 1 |
| `/disclaimer` | `disclaimer/page.tsx` | `legal`, `breadcrumb` | `features/legal/legalContent.ts` | `legalPageSchema`, sitemap | none | 1 |
| `/[...rest]` | `[...rest]/page.tsx` | `notFound` | none | noindex, calls `notFound()` | none | any other path |

Shared files in `[locale]/`: `layout.tsx`, `error.tsx`, `not-found.tsx`,
`opengraph-image.tsx`, `twitter-image.tsx` and `og-motif.ts`.

Totals: 24 static pages, 12 engagements, 4 cities and 21 posts. That is
about 60 URLs per locale.

## Route handlers

The browser only calls these same-origin routes. The rule column names the
`.claude/rules/` file that loads for the path.

| Route | Source file | Methods | Purpose | Rule |
|---|---|---|---|---|
| `/sitemap.xml` | `sitemap.xml/route.ts` | GET | Every indexed page in both locales | `seo-metadata.md` |
| `/robots.txt` | `robots.txt/route.ts` | GET | Crawl rules | `seo-metadata.md` |
| `/api/og` | `api/og/route.tsx` | GET | Open Graph images | `api-security.md` |
| `/api/contact` | `api/contact/route.ts` | POST | Contact form to Graph mail | `api-security.md` |
| `/api/cv-download` | `api/cv-download/route.ts` | POST | CV download request | `api-security.md` |
| `/api/booking` | `api/booking/route.ts` | POST | Book a call in the calendar | `api-security.md` |
| `/api/booking/slots` | `api/booking/slots/route.ts` | GET | Free slots for a date | `api-security.md` |
| `/api/booking/health` | `api/booking/health/route.ts` | GET | Health of the booking chain | `api-security.md` |
| `/api/booking/reminders` | `api/booking/reminders/route.ts` | GET | Cron, daily 07:00 | `api-security.md` |
| `/api/booking/watch` | `api/booking/watch/route.ts` | GET | Cron, Monday 07:30 | `api-security.md` |
| `/api/fit` | `api/fit/route.ts` | POST | Start a vacancy check | `api-security.md` |
| `/api/fit/status` | `api/fit/status/route.ts` | GET | Poll a running check | `api-security.md` |
| `/api/fit/result` | `api/fit/result/route.ts` | GET | Read a finished report | `api-security.md` |
| `/api/fit/question` | `api/fit/question/route.ts` | POST | A follow-up question on a report | `api-security.md` |
| `/api/fit/cv` | `api/fit/cv/route.ts` | GET, POST | The tailored CV from a check | `api-security.md` |
| `/api/fit/cv/status` | `api/fit/cv/status/route.ts` | GET | Poll the tailored CV | `api-security.md` |
| `/api/fit/cv-request` | `api/fit/cv-request/route.ts` | POST | Ask for the CV by mail | `api-security.md` |
| `/api/fit/leads-digest` | `api/fit/leads-digest/route.ts` | GET | Cron, Monday 07:15 | `api-security.md` |

The crons are set in `vercel.json`. The `lib/graph`, `lib/fit` and `lib/email` code these routes call loads `integrations.md`.

## Where a change goes

- New page: a folder under `[locale]/`, a namespace in both message
  files, the path in the sitemap's static list or dynamic entries, a row
  here. `pnpm check:pages` fails until the row exists.
- New post or engagement: see the files listed in the sections above, and
  update the instance count.
- `lib/fit/seed.ts` reads `work.*` from the message files and
  `data/ownWork.ts` for the fit agent. A change to engagement copy or own
  work also changes what `/fit` knows, and the agent database needs a
  reseed.
- Never prerender a page under `[locale]`. `pnpm check:nonce` fails on it.
