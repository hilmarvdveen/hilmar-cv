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
| `GET ${FIT_AGENT_URL}/fit/:sessionId` | bearer only | `{ report, vacancy, locale, hasCv }` |
| `POST ${FIT_AGENT_URL}/fit/:sessionId/cv` | `{ locale }` | `{ ready, pages }` |
| `GET ${FIT_AGENT_URL}/fit/:sessionId/cv.pdf?locale=` | bearer only | the PDF bytes |
| `POST ${FIT_AGENT_URL}/leads/:sessionId/requester` | `{ emailDomain }` | ignored |
| `GET ${FIT_AGENT_URL}/leads?since=` | bearer only | the lead records |

`agentStoredResultPath(sessionId)` in `agentClient.ts` is the one place the
stored result path is written. The agent contract also offers the lead with the
stored vacancy at `GET /leads/:sessionId`. If the agent ever drops
`GET /fit/:sessionId`, that function is the single line to change.

Every agent request carries `Authorization: Bearer ${FIT_AGENT_TOKEN}` and
`x-forwarded-for` with the caller's address from `getClientIp`, so the agent's
own per-caller limit counts visitors and not the site. The request aborts on
`AbortSignal.timeout(FIT_AGENT_TIMEOUT_MS)`, 50 seconds by default, which sits
under the routes' `maxDuration = 60`.

The site's own routes answer:

| Route | Body | Answer |
|---|---|---|
| `POST /api/fit` | `{ vacancy, locale, turnstileToken, company_website, formStartedAt }` | `{ report, sessionId }` |
| `POST /api/fit/question` | `{ question, sessionId, locale, turnstileToken }` | `{ answer }` |
| `POST /api/fit/cv-request` | `{ sessionId, name, email, organisation, locale, company_website, formStartedAt }` | `{ sent: true }` |
| `GET /api/fit/result?session&key` | the signed link | `{ report, locale, hasCv }` |
| `GET /api/fit/cv?session&key&locale` | the signed link | the PDF as a download |
| `GET /api/fit/leads-digest` | `CRON_SECRET` | `{ sent, count }` |

`GET /api/fit/result` never answers the stored vacancy text. The browser has no
use for it and the page does not show it.

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

### The upstream 429 travels

The agent answers 429 for two different reasons: its own per-caller limit, and
its daily money cap. Both carry `retryAfterSeconds` in the body. Before
16 September 2026 `agentClient.ts` threw on every non-ok status and the routes
answered 500, so a spent daily cap told the visitor to try again in a moment,
which was the one thing that could not help.

Now `postToAgent` throws `FitAgentRateLimitError` on a 429, carrying the seconds
it read from the agent body (zero when that body is unreadable). Both routes
catch that error before `serverErrorResponse` and answer with
`tooManyRequestsResponse(retryAfterSeconds)` from `src/lib/security`, which puts
the number in the `Retry-After` header and in the body.

The island reads the number back and picks the sentence with `isDailyCapRetry`:
over 120 seconds it shows `errors.capReached` (the check is done for today, plan
a call), at or under it shows `errors.rateLimited` (a queue, wait a minute). The
site own per-minute refusal carries no `retryAfterSeconds`, so it reads as zero
and lands on the queue sentence, which is what it is.

## The CV step

After the report and the question box the page offers the CV written to that
vacancy (`FitCvCard`). The visitor fills in a name, an email address and
optionally an organisation, and `POST /api/fit/cv-request` does three things:
it mails the visitor a signed link in their own language, it mails the owner
the lead with the link and the session number, and it tells the agent the
requester's email domain for the lead register. That last call is wrapped:
a failure is logged as one sentence and never blocks the mail, because the
mail is what the visitor is waiting for.

The card then says to look in the mail and names the address it went to. The
file itself is never attached. The link is the delivery, so a forwarded mail
stays a working link and the agent builds the document only when somebody asks
for it.

Both mails live in `src/lib/email/templates.ts` next to the booking mails and
share its layout: `renderFitLinkEmail` (bilingual, the visitor reads it) and
`renderFitLeadNotification` (Dutch, reply-to set to the visitor).

## The signed link and the reopened state

`src/lib/fit/resultLink.ts` signs a session id with `FIT_LINK_SECRET`:
base64url HMAC-SHA256, verified in constant time with `timingSafeEqual` after a
length check. The mail link is
`/{locale}/fit?result=<sessionId>&key=<signature>`.

The page reads both parameters and asks `fitReopenState` what to render:

| State | What renders |
|---|---|
| `none` | the page as it always was |
| `valid` | the stored report above the form, with the CV download button |
| `invalid` | the page as new, with `result.invalid` above the form |

`FitReopenedResult` is the client island of that state. It asks
`GET /api/fit/result` for the stored report, and its button asks
`GET /api/fit/cv`, which triggers the build on the agent and streams the
document as a download. The button carries a waiting state because the first
call builds the document and takes about half a minute. Both routes verify the
key before they call the agent, and both refuse a wrong key with 403.

The plain session number under the report stays what it always was. It is not a
key: it opens nothing, and it exists so the privacy statement can offer
deletion by number. Opening a result needs the signed link from the mail.

`FIT_LINK_SECRET` is the one secret of this flow. Without it the three routes
answer `Server configuration error` and the page treats every link as invalid,
which is the safe direction.

## The optional challenge

Cloudflare Turnstile is off unless both `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and
`TURNSTILE_SECRET_KEY` are set. When they are:

- the vacancy form renders the widget, which writes its answer into the form's
  own `cf-turnstile-response` field, and the island posts that as
  `turnstileToken`,
- `/api/fit` and `/api/fit/question` verify the token at Cloudflare before they
  forward anything, and answer 403 when it does not hold,
- the page loads the widget script with the request nonce, and `src/proxy.ts`
  adds `https://challenges.cloudflare.com` to `script-src` and `frame-src`.

Without the keys nothing renders, nothing is verified and the policy is
unchanged. `src/proxy.test.ts` covers both states. This is the only reason
`proxy.ts` changes for this feature.

## The weekly digest

`GET /api/fit/leads-digest` is gated by `CRON_SECRET` exactly like the booking
reminders, answers a plain 404 otherwise, and runs on Monday at 07:15 through
`vercel.json`. It asks the agent for the leads of the last seven days and mails
the owner one Dutch table: vacancy, end client, intermediary, contract form,
rate, closing date, the verdict counts and the contact from the text. Every
field the vacancy did not name says Onbekend. With no new vacancy it sends
nothing and answers `{ sent: false, count: 0 }`.

The register itself lives on the agent side with a twelve month expiry, and no
MCP tool reads it. The privacy statement carries the matching bullet.

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

## The page, top to bottom

The order is fixed and every block sits in `FitCheck`, the one client island:

1. The form card. It leads the second section and carries its own `h2`
   (`section.title`, the id the `Section` is labelled by) and `section.intro`,
   so no separate section title block stands above it.
2. The disclosure card. The page renders it as a server component and hands it
   to `FitCheck` as a slot, so `fit.disclosure` and `fit.hero.note` stay out of
   the client payload. It sits under the textarea, where the visitor decides
   whether to paste a client text at all, and its last line is the text link to
   `/book` with `data-placement="fit-hero"`.
3. The status line, `role="status" aria-live="polite"`, visually hidden.
4. The result, `FitReport`, under its own `h2` (`report.title`), with the
   deterministic count line above the model prose, the three label definitions
   once above the requirement list, the years per technology with their basis
   and engagement names, and the number of the stored result at the end.
5. The question box, `FitQuestion`.
6. The CV card, `FitCvCard`, which asks for a name and an address and mails the
   link to the CV written to this vacancy.
7. The booking card, `FitBooking`, the close of the page.

A reopened link (see above) puts the stored result and its download button in
its own band above the form, so the form stays where an organic visitor expects
it.

The question box comes before the booking card on purpose. The booking card is
the last thing a visitor meets and does the close band job, which is why this
page has no close band of its own.

### Above the fold

The input is the one thing the page asks for, so it has to be reachable without
scrolling at 390 and at 1280. Three rules hold that:

- Both bands are `padding="compact"` (`PageHero` passes the prop through to
  `Section`).
- The disclosure card sits under the textarea, not in the hero.
- The form card leads the section. No section title block and no intro
  paragraph above the card.

Measured before the change on a 390 by 844 phone with the consent banner open:
662 pixels visible, the textarea starting at 1016. Anything added above the form
has to be measured again.

### States

| State | What renders |
|---|---|
| Idle | form, disclosure |
| Checking | the button marked `aria-disabled` and still focusable, the form `aria-busy`, `form.checkingNote` under the button, the status line saying the check is running |
| Done | the status line saying the result is below, focus moved to the result heading, the result, the question box (only with a session id), the booking card |
| Too short | `errors.tooShort` as a plain alert tied to the field through `aria-describedby`, the finished report and the question box left standing |
| Failed | a card with the message, the booking button (`fit-failed`) and the mail link (`fit-failed-mail`), below the submit so the button never moves under the visitor thumb, the finished report left standing |
| Empty result | the summary and the technologies when the agent returned them, the `report.empty` sentence, and the booking card |

Neither button ever carries the `disabled` attribute. A disabled button leaves
the tab order and hands focus to the document, which is what happened on
16 September 2026: pressing the check button dropped keyboard focus for the
whole wait and nothing announced the result.

## What is not stored and not logged

The vacancy text and the question exist for the duration of the request. They
are never written to `console`, never put in an analytics parameter, and never
persisted on this side. Since 16 September 2026 the agent stores the vacancy
text with the report under a random session id, both with a thirty day expiry,
because the follow-up question and the CV need it. The disclosure card says so
before the report exists, together with the disclosure that the assistant is an
AI system: the text stays with the result for thirty days under a random number,
and after that both are gone.

The name, address and organisation of the CV step go to the mailbox and nowhere
else. The agent hears only the email domain, never the address. The vacancy
register on the agent side keeps the contact details that stand in the vacancy
text itself for twelve months, which the privacy statement names as its own
bullet with the legitimate interest basis and the line that nobody is contacted
automatically.

That number is on the page in small type under the report
(`report.sessionLabel`), with the contact email from `BUSINESS_PROFILE`, because
the privacy statement offers deletion by number. The privacy document in
`src/features/legal/legalContent.ts` carries the matching lines in both
languages: the vacancy text as a processed item under article 6(1)(f), Microsoft
Azure and Supabase in the processor list, and one sentence under automated
decision-making saying the assistant describes the owner record and decides
nothing about the reader.

The honeypot timing starts at the first change of the textarea, not at
hydration. `useHoneypot` keeps its own semantics for the other forms and the
island overrides `formStartedAt` in the body it posts. Before that, a visitor
who arrived with the vacancy on the clipboard and pasted within two seconds was
told the text held no requirements.

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
| `fit_cv_requested` | none |
| `fit_cv_downloaded` | `locale` |

No parameter carries text from the vacancy or the question. The booking button
in the closing card carries `data-placement="fit-report"`, so `SiteEvents`
reports its `cta_click` without extra code. The other placements on this page
are `fit-hero` (the text link in the disclosure card), `fit-failed` and
`fit-failed-mail` (the failure card), and `fit-evidence` and
`fit-answer-evidence` (the engagement links in a report and in an answer). The
three entrances carry `footer-fit`, `hiring-fit` and `contact-facts-fit`.

The CV request button and the CV download button carry no placement label.
`SiteEvents` reads `data-placement` from anchors only, and both of these are
buttons, so `fit_cv_requested` and `fit_cv_downloaded` are the whole signal.

The hypotheses to read after the deploy:

1. A visitor who runs a check books more often than one who does not. Compare
   `cta_click` with placement `fit-report` against the other placements.
2. The share of `notInRecord` verdicts says which requirements the market asks
   for that the record does not carry. That is input for the next engagement,
   not a reason to change the copy.
3. `fit_question_submitted` against `fit_completed` says whether the report
   answers the question or raises one.
4. `fit_cv_requested` against `fit_completed` says whether a recruiter wants the
   package after seeing the verdicts, and `fit_cv_downloaded` against
   `fit_cv_requested` says whether the mail arrives and gets opened.

## The seed export

`pnpm export:seed [path]` writes the record the agent reads, defaulting to
`seed/record.json` (git-ignored). `buildSeedRecord` in `src/lib/fit/seed.ts` is
pure and tested, the script only loads the data and writes the file.

The shape is fixed by `record-assistant/docs/architecture.md`: a profile from
`BUSINESS_PROFILE`, `PRICING`, `RATE_TEXT` and `QUALIFICATIONS`, the engagements
with their English technology labels beside the technology keys, the role,
headline, summary and delivered list per locale, the story paragraphs of the
engagement page in order per locale (`stories`, read from `work.<id>.body`,
which is what the tailored CV quotes from), the posts with a null update
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

- 16 September 2026, the review board round on this page (P5 designer, P7 sales
  editor, P8 product editor). The defects that were real: the input sat a screen
  and a half below the fold at both widths, the check dropped keyboard focus to
  the document for the whole wait and announced nothing, the Dutch booking
  button stuck eight pixels out of its card at 390, two length rules disagreed
  (the button gate let twelve characters through while the handler refused under
  twenty), a validation error unmounted the finished report, the failure message
  named an action with no button behind it, a spent daily cap said "try again in
  a moment", the privacy statement said nothing about the feature, and the years
  figure printed a bare number that could read "0 jaar". All of those are fixed
  above.
- Still open and not this page code: the years figure counts distinct months
  over case-insensitive substring matches, so React includes the React Router
  months. The basis line now says how it counts and the engagement names sit
  beside each figure, but the match rule lives in the agent. A stored report
  still cannot be reopened or forwarded.

- 16 September 2026, the CV step. Two things were decided rather than found.
  The CV is not attached to the mail: the link is the delivery, so the document
  is built only when somebody asks for it and a forwarded mail keeps working.
  And `GET /api/fit/result` answers the report without the stored vacancy text,
  because the page has no use for it and the shorter answer cannot leak it.
- Still open and not this page code: the years figure counts distinct months
  over case-insensitive substring matches. The tailored CV, the input gate and
  the lead register all live on the agent side, so a mismatch between the
  report and the CV is an agent question, not a page question.

The first entries about the model belong here too: what the agent returned that
the guard refused, and what a real vacancy did to the report.
