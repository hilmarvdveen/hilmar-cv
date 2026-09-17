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

The agent API is the authority, documented in `vacancy-fit/docs/architecture.md`.

| Call | Body | Answer |
|---|---|---|
| `POST ${FIT_AGENT_URL}/fit` | `{ vacancy, locale }` | `{ report, sessionId }`, or `400 { error, reason }` from the input gate |
| `POST ${FIT_AGENT_URL}/fit/question` | `{ question, sessionId, locale }` | `{ answer }` |
| `GET ${FIT_AGENT_URL}/fit/:sessionId` | bearer only | `{ report, vacancy, locale, title, createdAt, hasCv }`, 404 when the session is gone |
| `POST ${FIT_AGENT_URL}/fit/:sessionId/cv` | `{ locale }` | `200 { ready: true, pages }` when the document is stored, `202 { ready: false }` when the build just started |
| `GET ${FIT_AGENT_URL}/fit/:sessionId/cv?locale=` | bearer only | the state of the build: `{ ready, pages }`, `{ ready: false }`, `{ ready: false, failed: true }`, 404 when nothing was started |
| `GET ${FIT_AGENT_URL}/fit/:sessionId/cv.pdf?locale=` | bearer only | the PDF bytes, 404 or 409 while the document is not stored |
| `POST ${FIT_AGENT_URL}/leads/:sessionId/requester` | `{ emailDomain }`, the leads bearer | `{ ok: true }` |
| `GET ${FIT_AGENT_URL}/leads?since=&limit=` | the leads bearer | `{ since, limit, leads }`, each lead `{ sessionId, sessionIds, lead: { … }, verdictCounts, … }` |
| `GET ${FIT_AGENT_URL}/leads/:sessionId` | the leads bearer | `{ lead: <that record>, report, vacancy, locale }`, found by any session number of the lead |

The three register calls carry a second bearer, `FIT_LEADS_TOKEN`, and nothing
else does. The site token no longer opens the vacancy register.
`reportRequesterEmailDomain`, `requestLead` and `requestRecentLeads` in
`agentClient.ts` take the leads token as a parameter, so a route that forgets it
does not compile. Without the variable the digest answers
`Server configuration error`, the owner notification leaves its vacancy rows on
Onbekend and the requester domain is not reported, which are all the safe
direction.

The two polled routes, the CV status and the PDF, have their own caller window of
sixty a minute on the agent, so a poll every four seconds is inside it.

A refusal by the input gate is a typed error rather than a status. `postToAgent`
throws `FitAgentRefusalError` with the reason on a 400 that names one of the six
reasons, and the generic error on any other 400. A 404 on a read is not an error
at all: `requestStoredFitResult` and `requestLead` answer null, and
`requestTailoredCvStatus` answers a failed build, because a status the agent
never started cannot become ready.

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

| Route | Body | Answer | Rate rule |
|---|---|---|---|
| `POST /api/fit` | `{ vacancy, locale, turnstileToken, company_website, formStartedAt }` | `{ report, sessionId }`, or `422 { reason }` | `fit` |
| `POST /api/fit/question` | `{ question, sessionId, locale, turnstileToken }` | `{ answer }` | `fit` |
| `POST /api/fit/cv-request` | `{ sessionId, name, email, organisation, locale, turnstileToken, company_website, formStartedAt }` | `{ sent: true }` | `email` |
| `GET /api/fit/result?session&key` | the signed link | `{ report, locale, title, createdAt, hasCv }` | `read` |
| `POST /api/fit/cv` | `{ session, key, locale }` | `{ ready, pages, failed }`, the state of the build | `fit` |
| `GET /api/fit/cv/status?session&key&locale` | the signed link | `{ ready, pages, failed }` | `read` |
| `GET /api/fit/cv?session&key&locale` | the signed link | the PDF as a download, or `409 { ready: false }` | `read` |
| `GET /api/fit/leads-digest` | `CRON_SECRET` | `{ sent, count }` | `read` |

`GET /api/fit/result` never answers the stored vacancy text. The browser has no
use for it and the page does not show it. It does answer the extracted `title`,
the `createdAt` of the check and the stored `locale`, because the page a mail
link opens has to say which vacancy it is about and in which language the
document is written.

Every route has one budget under its own `maxDuration`. `agentBudget` lowers the
configured timeout for that one call and never raises it: 15 seconds to start a
build, 10 for a status, 45 for the stream. Before that, the download route made
two hops of 50 seconds each under a `maxDuration` of 60, so a slow build was
killed by the platform instead of by the timeout.

The island keeps the session id it received with the report, so the vacancy text
travels once per check and the follow-up question is a short message.

The report and answer shapes live in `src/lib/fit/types.ts` and mirror the
agent's schema exactly. Verdicts are `inRecord`, `partly` and `notInRecord`.

## Gate order in both routes

Both routes follow the house gate, in this order:

1. `isAllowedOrigin`, 403 on a cross-site or null origin. A same-origin GET
   carries no `Origin` header, so the check also accepts
   `sec-fetch-site: same-origin` before it falls back to the environment.
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

`export const runtime = "nodejs"` and `export const maxDuration = 60` on both,
and 30 on the status route, which does one short read. The page is never
prerendered, per the CSP nonce rule.

### The refusal of the input gate travels

The agent refuses a text before any model call and answers `400 { error, reason }`
with one of `tooShort`, `notAVacancy`, `codeBlock`, `encodedBlob`,
`tooManyLinks` and `instruction`. `POST /api/fit` answers `422 { reason }` and
the island shows `check.errors.reasons.<reason>`, one sentence per reason in both
languages, written to help a recruiter fix the paste. The minimum is 200
characters on both sides now, the form's own gate uses the same number, and the
counter says it. A 422 that names no known reason reads as `notAVacancy`, which
is the sentence that fits every unreadable paste.

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
optionally an organisation, and `POST /api/fit/cv-request` runs the mail gate:

1. the `email` rate rule, 5 a minute, the same as every other route that sends
   mail from the owner's mailbox,
2. the challenge when Turnstile is configured,
3. `requestStoredFitResult`, so the request is bound to a check that actually
   ran. A session the agent does not hold answers the same `{ sent: true }` and
   sends nothing, which tells a caller nothing about which numbers exist,
4. one link per session and address. The pairs live in a bounded in-memory set
   (`sentLinks.ts`, 500 pairs, the oldest dropped), the way the rate limiter
   holds its keys, so a second request for the same pair answers the same
   success without mailing. A cold start forgets the set, and then one more mail
   goes out. That is the trade-off of keeping no store on this side,
5. `POST /fit/:sessionId/cv` in the language of the stored check, so the
   document is usually built by the time the visitor opens the mail. The call is
   wrapped: a failure is logged and never blocks the mail,
6. the mail to the visitor, then `GET /leads/:sessionId` for the lead and the
   mail to the owner, then the requester's email domain for the register. The
   last two are wrapped for the same reason.

Before 17 September 2026 this route ran on the `fit` bucket at ten a minute,
verified no challenge and never asked whether the session existed, which made it
the cheapest way on the site to have the owner's mailbox mail a stranger.

The card is offered only when the report holds at least one requirement. A CV
written to requirements the check could not read is not a document anybody
wants, so an empty result goes from the summary straight to the booking card.

The fields carry `required` for the semantics and the form carries `noValidate`,
the pairing the contact form already uses, so the written sentences in
`fit.cv.errors` are the ones the visitor reads instead of the browser bubble in
the browser's own language. One line under the submit says where the name and
the address go, with the privacy statement behind a link (`fit.cv.privacyNote`
and `fit.cv.privacyLink`). The submit is the outline treatment, so the filled
emerald below the report belongs to the call alone. When the request does not
come through, the mail address sits behind a labelled link inside the same
alert (`data-placement="fit-cv-mail"`).

Once the request is away the card keeps its place and its fill and the form is
replaced by the sent message inside it, focus moves to the sent heading, and
the page's own live region carries the sent sentence, which also clears the
sentence the check left there. The card then says to look in the mail and names
the address it went to. The file itself is never attached. The link is the
delivery, so a forwarded mail stays a working link and the agent builds the
document only when somebody asks for it.

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
| `valid` | the result page: its own hero, the download button, the stored report, the question box, the booking card, and the vacancy form behind a disclosure at the end |
| `invalid` | the page as new, with `result.invalid` above the form |

The hero belongs to the state. In `valid` the band carries `result.title` and
`result.intro` and drops the badge, because the visitor came from their own
mail to fetch their own result and not to read what the check does. The page
reads the state on the server, so the right hero is in the first response.

`FitReopenedResult` is the client island of that state. It asks
`GET /api/fit/result` for the stored report, and its button runs the download in
three steps: `POST /api/fit/cv` starts the build and answers the agent's state,
`GET /api/fit/cv/status` is asked every four seconds for at most three minutes
while the document is not ready, and `GET /api/fit/cv` streams it. Every route
verifies the key before it calls the agent and refuses a wrong key with 403.

The key leaves the address bar as soon as the report is in:
`history.replaceState` rewrites the URL to the plain path, and the component
keeps the key in memory for the download. The trade-off is a reload: after one,
the page has no key any more and the visitor needs the link from the mail again.
The key opens the stored result and the tailored CV for thirty days, and the
alternative was leaving it in `page_location` in Tag Manager and in the platform
access log.

The download card carries the extracted vacancy title as its `h2` with the date
of the check under it, so a recruiter holding two mails can tell the two pages
apart. The half minute note shows only when `hasCv` is false, because on a
second visit the document is already built. The CV request, the file name and
the date all follow the stored locale, never the URL, so a Dutch check reopened
at `/en/fit` still downloads the Dutch document. The file name carries a slug of
the title (`tailoredCvFileName`), so three checks do not land in the downloads
folder as the same name with `(1)` and `(2)`.

The band ends the way the done state ends, with the question box (the session
lives thirty days and the question needs nothing but its id) and the booking
card as the close. The vacancy form follows in its own section, inside a
`details` disclosure labelled `result.newCheck`, so the page a mail link opens
does not end on an empty textarea. That disclosure is the one place on this
page where the form is not the first thing in its section.

The live region names every step and the newest event wins, because the
component sets the sentence at each step instead of picking one from a priority
list. Before that, one download left "the CV is in your downloads" standing for
the rest of the visit. The sentences are the wait, the arrival
(`result.ready`), a result that is gone (`result.failed`), a queue on the read
bucket (`result.rateLimited`, which does not say the result is gone, because a
429 and a rotated secret are not the same thing as an expired session), a saved
document (`result.downloaded`), a build that did not come through
(`result.downloadFailed`), a build that outlasted the three minutes
(`result.downloadTimedOut`) and a queue of downloads
(`result.downloadRateLimited`). The three failures show the mail address behind
`data-placement="fit-download-mail"`. The document is saved through an anchor
that is appended, clicked and removed, with the object URL revoked on the next
task.

The summary card of a reopened result carries `result.nextSteps` with a text
link to `/book` (`data-placement="fit-result-next"`), because the report can run
to thirty requirement cards and the booking card then sits far below the point
where the reader has just formed an opinion.

Both cards in that band are `variant="default"`. The band is
`background="light"`, so a tinted card would have the fill of its own
background and a hairline would carry the one action on the band.

The plain session number under the report stays what it always was. It is not a
key: it opens nothing, and it exists so the privacy statement can offer
deletion by number. Opening a result needs the signed link from the mail.

`FIT_LINK_SECRET` is the one secret of this flow. Without it the three routes
answer `Server configuration error` and the page treats every link as invalid,
which is the safe direction.

## The optional challenge

Cloudflare Turnstile is off unless both `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and
`TURNSTILE_SECRET_KEY` are set. When they are:

- the vacancy form and the question box each render the widget, which writes its
  answer into that form's own `cf-turnstile-response` field, and the island posts
  it as `turnstileToken`. A token is single use, so the two forms need two
  widgets. Before 17 September 2026 the question box posted no token at all,
  which would have answered 403 on every follow-up question the day the
  challenge went on,
- `/api/fit`, `/api/fit/question` and `/api/fit/cv-request` verify the token at
  Cloudflare before they forward anything, and answer 403 when it does not hold,
- the page loads the widget script with the request nonce, and `src/proxy.ts`
  adds `https://challenges.cloudflare.com` to `script-src` and `frame-src`.

The page renders the widget and its script only when
`getTurnstileConfiguration()` holds, which needs both keys. On the public key
alone it used to render a challenge that nothing verified, which is the failing
open direction. On a reopened page the vacancy form sits inside a closed
`details`, so its widget mounts hidden and becomes visible when the visitor opens
the disclosure. The question box is visible on that page and carries its own.

Without the keys nothing renders, nothing is verified and the policy is
unchanged. `src/proxy.test.ts` covers both states. This is the only reason
`proxy.ts` changes for this feature.

## The weekly digest

`GET /api/fit/leads-digest` is gated by `isAuthorizedCron` (the one owner of the
`CRON_SECRET` comparison, shared with the two booking crons and constant time),
answers a plain 404 otherwise, and runs on Monday at 07:15 through `vercel.json`.
It asks the agent for the leads of the last seven days with the leads token and
mails the owner one card per lead: the title as the heading, then Eindklant,
Bemiddelaar, Contractvorm, Tarief, Sluit op, Aansluiting and Contact. An
eight-column table at 13 pixels wrapped every cell on the phone where he reads
it. Every field the vacancy did not name says Onbekend, the date in the first
line and the subject is written as a Dutch date, and with no new vacancy it
sends nothing and answers `{ sent: false, count: 0 }`.

The register itself lives on the agent side with a twelve month expiry, and no
MCP tool reads it. The privacy statement carries the matching bullet.

## Limits

`FIT_LIMITS` in `src/lib/fit/report.ts` is the one place they live.

| Limit | Value |
|---|---|
| Vacancy | 200 to 10,000 characters |
| Question | 5 to 500 characters |
| Requirements kept | 30 |
| Technologies kept | 40 |
| Summary, requirement, note, answer | 1,200, 500, 400 and 1,500 characters |
| Company name, technology name, vacancy title | 120, 60 and 160 characters |
| Engagements per item | 12 |
| Session id | 16 to 64 base64url characters |
| Rate rule `fit` | 10 requests a minute per address, shared by the check, the question and the start of a CV build |
| Rate rule `email` | 5 requests a minute per address, the CV request |
| Rate rule `read` | 30 requests a minute per address, the stored result, the status and the stream |
| CV build wait | asked every 4 seconds for at most 180 seconds |

The `fit` bucket is shared by the check, the question and the start of a build
on purpose. A visitor who checks a vacancy, asks three questions and downloads
the CV stays well inside it, and a script that loops gets stopped whichever
route it hits. The mail route is on the `email` bucket with every other route
that sends from the owner's mailbox, and the two read routes are on `read`,
because a three minute wait asks for a status forty-five times.

The length caps are the agent's caps. `FIT_LIMITS.requirement` is 500 and
`company` is 120 because the agent's own schema allows those, and the site used
to cut a long requirement at 400 mid sentence. The golden answers in
`src/lib/fit/fixtures/` are the proof: `fitResponse.json`, `storedResult.json`
and `leadRecord.json` are copies of the agent's own fixtures, and the guards,
the sanitiser and the lead reader are tested against them. When the agent's
shape changes, those three files change with it and the tests say so.

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
   link to the CV written to this vacancy. It renders only when the report
   holds a requirement, and the summary card then closes with
   `report.nextSteps` naming what waits below, because on a phone the card
   sits several screens under the verdicts.
7. The booking card, `FitBooking`, the close of the page.

A reopened link (see above) has its own order: the hero says it is the
visitor's result, the band carries the download button, the report, the
question box and the booking card, and the vacancy form sits at the end behind
the `result.newCheck` disclosure.

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
| Done | the status line saying the result is below, focus moved to the result heading, the result, the question box (only with a session id), the CV card (only with a requirement), the booking card |
| CV sent | the same card with the form replaced by the sent message, focus on the sent heading, the sent sentence in the page live region |
| Too short or refused | one sentence from `errors.reasons.*` as a plain alert tied to the field through `aria-describedby`, the finished report and the question box left standing |
| Failed | a card with the message, the booking button (`fit-failed`) and the mail link (`fit-failed-mail`), below the submit so the button never moves under the visitor thumb, the finished report left standing |
| Empty result | the summary and the technologies when the agent returned them, `report.empty` only when there is no summary to say it, no CV card, and the booking card |
| Reopened | the result hero, the vacancy title with the date of the check, the download button, the report with the way on to a call, the question box, the booking card, and the vacancy form behind the `result.newCheck` disclosure |
| Building the CV | the button marked `aria-disabled` with the spinner, the status line saying the document is being built, the status route asked every four seconds |
| Build timed out | `result.downloadTimedOut` under the button with the mail link, the result left standing |
| Download refused | `result.downloadRateLimited` on a 429 and `result.downloadFailed` on anything else, both with the mail link |

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
AI system: the text stays with the result and the CV for thirty days under a
random number, and after that those three are gone.

The name, address and organisation of the CV step go to the mailbox and nowhere
else. The agent hears only the email domain, never the address. The pairs of a
session and an address that already got a link live in memory for the lifetime of
the instance, and hold no name and no organisation.

The vacancy register on the agent side is the one thing that outlives the thirty
days, and since 17 September 2026 the page says so. `fit.disclosure.processing`
names the thirty days for the text, the result and the CV, and
`fit.disclosure.register` names what stays for twelve months from the first
check: the title, the organisation, the conditions, the requirements with their
verdicts and the contact details that stand in the vacancy text itself, read by
the owner only and erased on request with the session number. The privacy
statement in `src/features/legal/legalContent.ts` carries the same two facts in
both languages, which is a statement the owner approves himself.

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
| `fit_cv_requested` | none, and only after the route answered |
| `fit_cv_failed` | `status`, 0 when the network threw or the agent reported a failed build |
| `fit_cv_downloaded` | `locale`, the language of the stored check |

No parameter carries text from the vacancy or the question. The booking button
in the closing card carries `data-placement="fit-report"`, so `SiteEvents`
reports its `cta_click` without extra code. The other placements on this page
are `fit-hero` (the text link in the disclosure card), `fit-failed` and
`fit-failed-mail` (the failure card), `fit-evidence` and
`fit-answer-evidence` (the engagement links in a report and in an answer), and
`fit-result-next` (the text link to the call in the summary card of a reopened
result). The three entrances carry `footer-fit`, `hiring-fit` and
`contact-facts-fit`. The two mail links of the CV step carry `fit-cv-mail` (the
request did not come through) and `fit-download-mail` (the build did not come
through).

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
5. `fit_cv_failed` against `fit_cv_requested` is the health of the CV step, and
   the share of `fit_failed` with status 422 says how often a paste is something
   the check cannot read, which is a copy question about the form, not a fault.

## The seed export

`pnpm export:seed [path]` writes the record the agent reads, defaulting to
`seed/record.json` (git-ignored). `buildSeedRecord` in `src/lib/fit/seed.ts` is
pure and tested, the script only loads the data and writes the file.

The export carries `schemaVersion: 1` as its first field, and the agent's loader
refuses a file of another version. A change to the shape raises that number on
both sides. `generatedAt` is the date only, or `SEED_GENERATED_AT` when it is
set, so two exports of the same record are byte for byte identical and a
re-export can be read as "nothing changed".

The shape is fixed by `vacancy-fit/docs/architecture.md`: a profile from
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

### Own work in the export (17 September 2026)

The twelve client engagements say nothing about Node.js, PostgreSQL, MongoDB,
Azure OpenAI or MCP, while the CVs describe them in his own work. So the export
carries his own work as engagements of a second kind. Every engagement has
`kind`, `"client"` or `"ownWork"`, and own work comes last in the list.

- The entries live in `src/data/ownWork.ts` (id, name, url, start month,
  technologies from the same `Tech` map) and their sentences in the `ownWork`
  namespace of both message files, in the shape of a `work` entry without
  company and location. Three entries on 17 September 2026: `own-platform`
  (this site), `reference-repository` (the public Zappy Mart repository) and
  `vacancy-fit` (the fit check itself).
- An own-work entry has no end month in the data. The builder writes the month
  of the export, so a reseed keeps it current.
- The rule on the agent side: evidence from own work alone never makes a
  requirement fully met. It gives "partly", with a note that says it runs in his
  own platform and not yet at a client. The years table counts client months
  only. The CV written to a vacancy keeps own work in its own paragraph.
- A technology goes into an own-work entry only when it runs today and a reader
  can check it: on this site, in the public repository, or on the live fit
  check. What is written and not yet verified by a run stays out (the PostgreSQL
  profiles and Testcontainers rows of Zappy Mart on 17 September 2026).
- The page still links evidence to `/experience/<id>` and drops ids it does not
  know, so own-work evidence shows in the note and not as a link. An own-work
  page on the site is on the backlog (improvements section L), and the link
  follows it.

The same day the technologies the CVs claim per engagement and the data lacked
were attached, from the inventory in
`Hilmar/review-board/2026-09-17-cv-versus-site-record.md`: Node.js and Express
at bol.com, gRPC, Microsoft Identity and Azure Key Vault at Omniplan, RabbitMQ
and MassTransit at Bluefield, ASP.NET Core at Opinity, Azure at the
Belastingdienst, Kubernetes and Azure DevOps at Athlon, the named headless CMS
per engagement, Linux where containers and clusters ran, and SSH at every
engagement (his statement of 11 September 2026). Reseed after any change to
`ownWork.ts` or the `ownWork` namespace too.

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

- 16 September 2026, the designer round on the CV step and the reopened link
  (`Hilmar/review-board/2026-09-16-fit-P5-designer-cv-step.md`). What was real:
  handing over the address lost focus to the document and announced nothing,
  the page a mail link opens sold the check instead of showing the result and
  ended on an empty form, two Dutch labels inside a card ran past their own
  button at 390, the browser bubble hid the written sentences, the download
  failure said the result was gone while it stood on the screen, the action
  card had the fill of its own band, the sent card took the fill of the close,
  the card asked for a name and an address without saying where they go, the CV
  was offered on an empty result, nothing pointed at the CV four screens below
  the verdicts, the reopened page never announced the arrival, the failure
  named a mail with no link behind it, two filled emerald buttons sat on one
  phone screen, the saved document depended on a detached anchor, the empty
  state could say the same thing twice, and the hero description spent 146
  pixels of the first phone screen. All of those are fixed above. Left open:
  telling two reopened results apart needs a title or a date from the agent, so
  it is a contract question first.

- 16 September 2026, the CV step. Two things were decided rather than found.
  The CV is not attached to the mail: the link is the delivery, so the document
  is built only when somebody asks for it and a forwarded mail keeps working.
  And `GET /api/fit/result` answers the report without the stored vacancy text,
  because the page has no use for it and the shorter answer cannot leak it.
- Still open and not this page code: the years figure counts distinct months
  over case-insensitive substring matches. The tailored CV, the input gate and
  the lead register all live on the agent side, so a mismatch between the
  report and the CV is an agent question, not a page question.

- 17 September 2026, the four reviews of this feature (a senior frontend
  engineer on the code, the designer on the CV step and the mails, the editor on
  the generated text, and the architect across both repositories). What was real
  and is fixed: the follow-up question never sent the challenge token that its
  own route verifies, the one route that sends mail ran on the `fit` bucket with
  no challenge and no proof that the session existed, a second check on a
  reopened page put four element ids in the document twice, the download route
  spent two 50 second budgets under a `maxDuration` of 60, the signing key rode
  into every later page view, two length caps were a hundred characters under
  the agent's own schema, the widget rendered on the public key alone, a 429 on
  the reopened page said the result was gone, a same-origin GET without a
  referrer answered 403, two fixtures declared `body` twice while `no-dupe-keys`
  was off, a test queried a class name, the count line had no plural, the seed
  export was not deterministic, the module resolver accepted a directory as a
  file, the cron gate was copied three times and compared in variable time, the
  four client components pulled the agent client into the browser graph through
  the barrel, two nested live regions announced the same error twice, and
  `fit_cv_requested` counted attempts instead of mails. All of those are fixed
  above.
- 17 September 2026, the reopened page and the mails. The page a mail link opens
  now names the vacancy and the date, promises the half minute only when the
  document is not built, follows the stored language for the request and the file
  name, carries the way on to a call in the summary card, and lets the newest
  event win in the live region. The six mails gained a preheader and a real
  `<head>` with the two colour scheme metas, one button each with the booking
  offer as a text link, the note before the fallback link, and the band without
  the role line, which disagreed with the role line of the document it carries.
  The owner notification names the vacancy, the end client, the fit and the
  closing date from the register, and the weekly digest is one card per lead.
- 17 September 2026, what stays after thirty days. The disclosure said the text
  and the result were gone after thirty days, which was not the whole truth: the
  register keeps the key facts of the vacancy for twelve months. The page and
  the privacy statement now say both, in both languages, and the deletion offer
  covers the register too. The owner approves that wording himself.

The first entries about the model belong here too: what the agent returned that
the guard refused, and what a real vacancy did to the report.
