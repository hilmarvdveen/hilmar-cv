# The vacancy fit check (/fit)

A recruiter or hiring manager pastes a vacancy and gets back, requirement by
requirement, what the record holds and which engagement shows it. Then they can
ask one question about the result and book a call from it. The page is the
second buyer's shortcut: the submittable package in thirty seconds, with honest
scoping as the visible feature, because "not in the record" is an answer the
tool gives.

## The two hops

```
browser ── POST /api/fit ──> src/lib/fit/agentClient.ts ──> agent API (Azure Container Apps)
                                                              Azure OpenAI, tool calling
                                                              MCP server over the record database
```

The browser only ever talks to the same-origin `/api/fit` routes. The CSP in
`src/proxy.ts` keeps `connect-src` on this origin, so nothing on the page
reaches Azure and `proxy.ts` needs no change for this feature. Every call to the
agent goes through `src/lib/fit/agentClient.ts`, following the rule that already
governs `src/lib/graph`: nothing is inlined in a route.

The site route holds `FIT_AGENT_TOKEN`. The agent holds the token for its MCP
server. The MCP server holds the database credentials. Each hop knows one
secret.

## Contracts

The agent API is the authority, documented in `record-assistant/docs/architecture.md`.

| Call | Body | Answer |
|---|---|---|
| `POST ${FIT_AGENT_URL}/fit` | `{ vacancy, locale }` | `{ report, sessionId }` |
| `POST ${FIT_AGENT_URL}/fit/question` | `{ question, sessionId, locale }` | `{ answer }` |

Every agent request carries `Authorization: Bearer ${FIT_AGENT_TOKEN}` and
`x-forwarded-for` with the caller's address from `getClientIp`, so the agent's
own per-caller limit counts visitors and not the site. The request aborts on
`AbortSignal.timeout(FIT_AGENT_TIMEOUT_MS)`, 50 seconds by default, which sits
under the routes' `maxDuration = 60`.

The site's own routes answer:

| Route | Body | Answer |
|---|---|---|
| `POST /api/fit` | `{ vacancy, locale, company_website, formStartedAt }` | `{ report, sessionId }` |
| `POST /api/fit/question` | `{ question, sessionId, locale }` | `{ answer }` |

The island keeps the session id it received with the report, so the vacancy text
travels once per check and the follow-up question is a short message.

The report and answer shapes live in `src/lib/fit/types.ts` and mirror the
agent's schema exactly. Verdicts are `inRecord`, `partly` and `notInRecord`.

## Gate order in both routes

Both routes follow the house gate, in this order:

1. `isAllowedOrigin`, 403 on a cross-site or null origin.
2. `enforceRateLimit(request, "fit")`, 429 with `Retry-After`.
3. `looksAutomated`, a silent success that calls nothing: `/api/fit` answers the
   empty report, `/api/fit/question` answers the empty answer.
4. `validateFields`, 400, with the length caps from `FIT_LIMITS`. The minimum
   lengths are checked after the trim, since `validateFields` only caps.
5. `getFitAgentConfiguration()`, 500 `Server configuration error` when either
   environment variable is missing. It never says which one.
6. The agent call, then `isFitReport` or `isFitAnswer`, then the sanitiser.
7. `serverErrorResponse` on anything thrown, with a generic public message. The
   upstream status stays in the thrown message and never reaches the visitor.

`export const runtime = "nodejs"` and `export const maxDuration = 60` on both.
The page is never prerendered, per the CSP nonce rule.

## Limits

`FIT_LIMITS` in `src/lib/fit/report.ts` is the one place they live.

| Limit | Value |
|---|---|
| Vacancy | 20 to 10,000 characters |
| Question | 5 to 500 characters |
| Requirements kept | 30 |
| Technologies kept | 40 |
| Summary, note, answer | 1,200, 400 and 1,500 characters |
| Engagements per item | 12 |
| Session id | 16 to 64 base64url characters |
| Rate rule `fit` | 10 requests a minute per address |

The `fit` bucket is shared by the two routes on purpose. A visitor who checks a
vacancy and asks three questions stays well inside it, and a script that loops
gets stopped whichever route it hits.

`sanitizeFitReport` and `sanitizeFitAnswer` drop every engagement id that is not
in `workHistory`, so the page can never link to an engagement page that answers
404, whatever the model invents. `sanitizeSessionId` refuses anything that is
not a plausible base64url identifier.

## What is not stored and not logged

The vacancy text and the question exist for the duration of the request. They
are never written to `console`, never put in an analytics parameter, and never
persisted on this side. The agent stores the report under a random session id
with a thirty day expiry and nothing else. The page says both things before the
form, in `fit.disclosure`, together with the disclosure that the assistant is an
AI system.

The two routes log a fixed sentence on failure, never the input and never the
upstream body.

## Events

`trackFitEvent` in `src/lib/fit/analytics.ts` pushes to the `dataLayer` under
the category `fit`, on top of `pushDataLayerEvent` like the booking family.

| Event | Parameters |
|---|---|
| `fit_submitted` | `characters` |
| `fit_completed` | `requirements`, `inRecord`, `partly`, `notInRecord` |
| `fit_failed` | `status`, 0 when the network threw |
| `fit_question_submitted` | `characters` |
| `fit_question_answered` | `engagements` |
| `fit_question_failed` | `status` |

No parameter carries text from the vacancy or the question. The booking button
inside the report carries `data-placement="fit-report"`, so `SiteEvents` reports
its `cta_click` without extra code, and the three entrances carry
`footer-fit`, `hiring-fit` and `contact-facts-fit`.

The hypotheses to read after the deploy:

1. A visitor who runs a check books more often than one who does not. Compare
   `cta_click` with placement `fit-report` against the other placements.
2. The share of `notInRecord` verdicts says which requirements the market asks
   for that the record does not carry. That is input for the next engagement,
   not a reason to change the copy.
3. `fit_question_submitted` against `fit_completed` says whether the report
   answers the question or raises one.

## The seed export

`pnpm export:seed [path]` writes the record the agent reads, defaulting to
`seed/record.json` (git-ignored). `buildSeedRecord` in `src/lib/fit/seed.ts` is
pure and tested, the script only loads the data and writes the file.

The shape is fixed by `record-assistant/docs/architecture.md`: a profile from
`BUSINESS_PROFILE`, `PRICING`, `RATE_TEXT` and `QUALIFICATIONS`, the engagements
with their English technology labels beside the technology keys, the role,
headline, summary and delivered list per locale, the posts with a null update
date when they have none, and the 33 FAQ pairs flattened to one entry per
question with both locales.

`scripts/typescript-module-hooks.mjs` lets plain Node load the site's sources:
it maps the `@/` alias to `src`, probes the extensions, and transpiles `.ts` and
`.tsx` with the TypeScript compiler that is already a dependency. That is what
makes the blog registry loadable, which is where a post's `track` lives.

The dossier stays the source of every fact, the message files stay the source of
every sentence, and the agent's database is derived. Reseed after any change to
`workHistory.ts`, the `work` namespace, the `faq` namespace or the blog
registry.

## Copy rules for this page

The rate never appears in the `fit` namespace, and a test asserts it. The
disclosure says what the tool does and what happens to the text, never what it
cannot do. The verdict labels are neutral names, and the summary says what the
record does show.

## Glitch log

Nothing yet. The first entries belong here: what the agent returned that the
guard refused, and what a real vacancy did to the report.
