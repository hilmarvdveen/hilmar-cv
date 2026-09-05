# Booking flow: design, rules, and hypothesis tests

The booking page has one job: get a 30-minute call into both calendars with as
few decisions as possible. This document records the design rules the flow
follows, the reasoning behind them, and the hypotheses to test with the funnel
events the flow emits.

## The flow

Three steps, in this order:

1. **Pick a moment.** The next ten working days as buttons, the first one
   pre-selected so times are on screen without a click. Times render as a grid
   of buttons. "Pick another date" reveals a native date input for anything
   further out (up to 90 days).
2. **Your details.** Name and email address (required), company and topic
   (optional). Optional fields are labelled "optional". Required fields carry
   no asterisk, because the flow tells the visitor what is missing the moment
   they press Next.
3. **Check and confirm.** One summary with a "Change" link per row, then one
   button. The confirmation states what happens next: invitation in the
   calendar, confirmation by email.

The previous form asked for a service type, an engagement type, a budget band,
a project description, a phone number and a date before the visitor could see
a single time. That is nine decisions for a call that exists to make those
decisions together. The new flow asks for two.

## Design rules

### Direct feedback

- The primary button is never disabled to signal "you are missing something".
  A disabled button makes the visitor guess what is wrong. Instead, pressing
  Next runs validation, writes an inline error under the field, scrolls the
  first invalid field into view, and focuses it. On step 1 the same rule
  brings the time grid into view and focuses the first time.
- Errors clear live once a field has been flagged, so the visitor sees the
  message go away while typing. Fields that have never been flagged are not
  validated on every keystroke, so nobody is nagged before they finish.
- Every step change scrolls the step heading into view and moves focus to
  it, so keyboard and screen-reader users land on the new step.

### No layout shift

- The time grid has a fixed minimum height. Loading (skeleton pills), empty
  (message), failed (a neutral panel) and ready (buttons) all render inside
  the same box.
- The failed state reads as a normal panel, not an alarm: a `Card` surface
  with a gray `AlertCircle` icon and `text-gray-700` body copy, not the red
  alert styling used for a submission failure. Below the shortened error
  sentence, a retry link sits next to two direct recovery actions, an email
  `Button` (`mailto:`, primary) and a call `Button` (`tel:`, outline), stacked
  on phones and side by side from `sm`. A slots failure is a service hiccup,
  not the visitor's fault, so the panel offers a way through rather than a
  warning.
- Every field reserves one line under it for its error message, so an
  appearing error never pushes the fields below it.
- The day strip has a fixed button height. The "another date" control lives in
  a fixed-height row whether it shows the link or the input.
- Times for a day are cached, so going back to a day already seen renders
  instantly.

### The first screen shows the task

The page exists to pick a moment, so the day strip and the first rows of
times must be visible without scrolling on every viewport. This is a
deliberate exception to the shared hero scale in `LAYOUT.md`: on phones the
navy hero collapses to a title band (H1 at `text-lg`, `py-5`, badge and
description hidden below `sm`) because both facts repeat in the aside under
the form. On desktop the hero keeps `py-14` at `lg`, the ten working days sit
on one row (`lg:grid-cols-10`) and the time grid runs six across
(`lg:grid-cols-6`) so two rows of times fit under the days on a 900px
window. The "another date" control shares the row with the day label instead
of taking a row of its own.

Pixel budget on a 375 × 667 phone, measured from the top: header 65, title
band 68, section padding 24, step header 74, card 16, day label row 44, days
120 (`h-14`), then the time label and the first two rows of times before the
sticky bar starts at 602. A visitor who arrives from the header button sees
days and times at once. (Found on 1 September 2026, when the hero pushed the
step header under the sticky bar and the visitor saw an intro plus a Next
button and no picker.)

### Mobile

- A sticky bottom bar carries the current selection and the primary button,
  so the next action is always on screen and the visitor never scrolls to
  find it. Back is a text link above the bar.
- On step 1 the bar's button is the neutral variant until a time is picked,
  then it turns primary. The flip is the feedback. It stays enabled (see
  "Direct feedback"), so a tap still explains what is missing, but it no
  longer reads as "nothing to do here, continue" while the picker is on
  screen.
- The two-column layout collapses to one. The "what to expect" panel moves
  below the form. The live selection panel disappears because the sticky bar
  shows the selection.
- Inputs use 16px text so iOS does not zoom on focus, the native date input
  included (`h-11 text-base`). Time buttons are 44px tall and day buttons
  56px on phones, 68px from `sm`.
- The sticky bar measures its own rendered height with a `ResizeObserver`,
  the same pattern the header uses for `--header-height` (see
  `src/components/Header.tsx`), and writes it to `--bottom-bar-offset` on
  the document root while it is mounted, removing the property on unmount.
  `AnalyticsConsent` reads that variable for its own `bottom` offset
  (`bottom-[var(--bottom-bar-offset,0px)]`), so the cookie banner sits above
  the sticky bar on phones instead of covering it. Off `/book` the variable
  is unset, the fallback is `0px`, and the banner sits flush with the
  viewport bottom as before.
- Scroll targets inside the form (step header, heading, time group) use
  `scroll-mt-4`. The root already carries `scroll-padding-top` for the
  header, and the two add up (see `LAYOUT.md`). With `scroll-mt-28` a step
  change landed the heading 177px down and left a phone 425px for four
  fields.

### Server rules that support the flow

- The slots API drops times that start within the next hour and offers
  nothing on weekends, so the grid never shows a time that cannot be booked.
- A booking draft is saved for seven days and restored on return. A restored
  time that is no longer free is dropped silently. A saved step is only
  restored when the data it needs is still there.

## Funnel events

`src/lib/booking/analytics.ts` pushes these onto `window.dataLayer` as
`{ event, event_category: "booking", ...parameters }`. Google Tag Manager
picks them up once the visitor has consented (a push made before GTM loads
is queued in the array and read when it does). GTM owns the tags: there is
no direct GA4 script on the site (owner's decision, 1 September 2026), so a
GA4 event tag in the container with a Custom Event trigger per name below
is what turns them into reports. The hypotheses are measured with them.

| Event | When | Parameters |
|---|---|---|
| `booking_step_view` | a step renders | `step` |
| `booking_day_selected` | a day button or the date input changes the day | `date` |
| `booking_slot_selected` | a time is chosen | `date` |
| `booking_slots_empty` | a day loads with no free times | `date` |
| `booking_slots_failed` | the slots request fails | `date` |
| `booking_validation_error` | Next is pressed with something missing | `step`, `field` |
| `booking_submitted` | the confirm button is pressed | |
| `booking_completed` | the API confirms the booking | |
| `booking_failed` | the API rejects or the request fails | `status` |

Step conversion is `booking_step_view(step n+1) / booking_step_view(step n)`,
and end-to-end conversion is `booking_completed / booking_step_view(step 1)`.

## Site events

Measurement does not stop at the booking form. `src/lib/analytics/events.ts`
holds `pushDataLayerEvent(name, category, parameters)`, the same push
mechanics as the booking helper (create the array if it is missing, push,
swallow a dataLayer that refuses the write), and `pushSiteEvent(name,
parameters)`, which calls it with `event_category: "site"`.
`trackBookingEvent` in `src/lib/booking/analytics.ts` now calls
`pushDataLayerEvent` with `event_category: "booking"` too, so both live
behind one push function without any booking event name changing.

`SiteEvents`, a client island mounted once in `src/app/[locale]/layout.tsx`
inside the message provider, emits these events for every page on the site:

| Event | When | Parameters |
|---|---|---|
| `cta_click` | a click reaches an anchor whose `href` ends with `/book` | `placement`, `path` |
| `contact_click` | a click reaches an anchor whose `href` ends with `/contact` | `placement`, `path` |
| `section_view` | an element carrying `data-track-section` first enters the viewport | `section` |
| `consent_choice` | the visitor accepts or declines the cookie banner | `choice` ("accept" or "decline") |
| `cv_download` | the CV document opens from the download modal | `language` |
| `contact_submit` | the contact form is submitted successfully | |

`placement` comes from a `data-placement` attribute on the clicked anchor
(`hero`, `sticky-bar`, `header`, `close`, `mid-cta`, `hiring-shape`,
`experience-hero`, `experience-band`, `experience-close`, `faq-close`,
`service-hero`, `service-close`, `about-hero`, `about-close`,
`contact-hero`, `projects-close`), or `unlabelled` when the attribute is
absent. `path` comes from `usePathname()` at the moment of the click.
`section_view` fires once per page view per section: the observer
unobserves a target after its first intersection, and a fresh set of seen
sections is created whenever the pathname changes. `data-track-section` is
carried by the results strip, the homepage close band, the experience mid
page band, and the FAQ close band.

`consent_choice` is pushed by `AnalyticsConsent` in the same handler that
calls `storeConsent`, so the choice reaches the dataLayer before Google Tag
Manager has necessarily loaded. That is not a problem: GTM reads the whole
array once it starts, the same reason a `booking_*` push made before consent
is not lost. GTM owns turning every event above into a report: add a GA4
event tag with a Custom Event trigger per event name, the same pattern
already used for the booking funnel events.

## Hypothesis tests

The site does not carry enough traffic for split tests to reach significance
in a useful time. Measure each hypothesis as a before-and-after comparison
over matched periods (same weekdays, same campaign mix) using the events
above. State the expected effect before shipping, then compare.

| # | Hypothesis | What changed | Metric | Expected |
|---|---|---|---|---|
| H1 | Showing times without a click raises step 1 completion | First working day is pre-selected on load | step 1 to step 2 conversion | up |
| H2 | Two required fields instead of six raise details completion | Service, engagement type, budget, phone and description are gone | step 2 to step 3 conversion | up |
| H3 | An always-enabled Next with scroll-and-focus lowers abandonment on errors | Disabled button replaced by direct feedback | `booking_validation_error` followed by `booking_step_view` of the next step, within the session | up |
| H4 | A fixed-height time grid lowers mis-taps and back-and-forth | Skeleton, empty, failed and ready states share one box | `booking_day_selected` per session | down |
| H5 | The sticky mobile bar shortens time to book on phones | Primary button always visible under `lg` | time from step 1 view to `booking_completed`, mobile only | down |
| H6 | A summary with per-row edit links lowers wrong bookings | Step 3 shows when, who, topic with "Change" | reschedule or cancel emails after booking | down |
| H7 | Dropping past-hour and weekend times lowers failed submissions | Server filters | `booking_failed` with status 400 | down |
| H8 | Naming the outcome in the hero raises entry into step 1 | "Book a 30-minute call" plus three facts, no pricing cards | `booking_step_view(1)` per page view | up |

Candidates for a later round, once the baseline is known:

- Optional topic chips (legacy migration, team reinforcement, design system)
  instead of a free-text field, to see whether a tap beats typing.
- A second day strip row for the following week, to see whether visitors
  book further out when it is one tap away.
- Prefilling the email domain from the company field.

## Layout

The form spans the full site container, as in the Book artboard of the sales
page design: `lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-10`, the form on the
left and a 380px aside on the right. The aside (`BookingSummary`) holds the
live selection card, the "what to expect" list and the practical facts, both
lists with small emerald check marks (`Check`, 16px, `emerald-600`). Below
`lg` the aside drops under the form and the sticky bar carries the selection.

The page hero follows the shared hero scale in `LAYOUT.md`: navy background,
default section padding, a badge, the heading, a description and three fact
chips. No pricing cards.

## Emails

`src/lib/email/templates.ts` renders four pieces for every booking:

| Piece | Recipient | Language | Subject |
|---|---|---|---|
| `renderBookingConfirmationEmail` | the visitor | the visitor's locale | "Bevestigd: ons gesprek op {moment}" / "Confirmed: our call on {moment}" |
| `renderBookingNotificationEmail` | the site owner | Dutch, reply-to set to the visitor | "Nieuwe boeking: {name}, {moment}" |
| `renderBookingCalendarEvent` | the calendar invitation body | the visitor's locale | "Kennismaking: Hilmar van der Veen en {name}" / "Intro call: Hilmar van der Veen and {name}" |
| `renderBookingReminderEmail` | the visitor, the day before the call | the visitor's locale | "Herinnering: ons gesprek op {moment}" / "Reminder: our call on {moment}" |

The confirmation email carries a reschedule line under the join block:
"Komt het toch niet uit? Beantwoord deze mail, dan kiezen we een nieuw
moment." / "Need another moment? Reply to this email and we pick a new
one." The reminder email carries the same line. Both emails ask the
visitor to reply to the sender rather than pointing at a self-service
reschedule flow, because none exists yet.

`renderBookingReminderEmail` shares the confirmation's layout, greeting and
moment block, with one paragraph in place of the "what you can count on"
list ("Een herinnering voor ons gesprek morgen:" / "A reminder for our call
tomorrow:") and the same Teams join button when the event carries a join
link. `GET /api/booking/reminders`, gated by `CRON_SECRET` and run once a
day by Vercel Cron, is what calls it. See the "Reminders" section of
`docs/MICROSOFT_GRAPH.md` for the cron schedule, the token gate and how to
test it.

Rules the templates follow:

- One shared table-based layout of 560px with inline styles only: navy
  header, emerald accents, KVK footer. No external stylesheet, no web font,
  no image that needs a request. Email clients strip or block all three.
- `formatBookingMoment` prints the Amsterdam wall-clock time in the visitor's
  locale (`nl-NL` or `en-GB`), so the visitor and the owner read the same
  moment.
- Every visitor field passes through `escapeHtml` before it enters a
  template. The owner notification prints "Niet opgegeven" for an empty
  company or topic.
- The form posts `company`, `topic` and `locale` as structured fields. The
  route validates their lengths (company up to the name limit, topic up to
  1000 characters) and coerces the locale to `en` or otherwise `nl`.
- The owner notification has `replyTo` set to the visitor's address so a
  reply from the inbox goes to the right person.
- Every calendar event is created as a Microsoft Teams meeting (see
  `docs/MICROSOFT_GRAPH.md`). When Graph returns a join link,
  `BookingEmailInput.joinUrl` carries it and the confirmation email gets a
  Teams join button plus a plain-text copy of the link, the owner
  notification gets a Teams detail row, and the calendar body gets a join
  line at the top. When the mailbox has no Teams licence, Graph could not
  create the meeting, `joinUrl` is undefined, and all three templates
  render exactly as they did before Teams support existed.
- Every calendar event carries `isReminderOn: true` and
  `reminderMinutesBeforeStart: 60`, so Outlook shows its own native
  60-minute reminder to the organiser on top of the reminder email.

To preview the templates outside the test runner, render them with
`node --experimental-strip-types` on a copy that concatenates
`src/lib/security/escape.ts` and `templates.ts` (esbuild is not exposed by
pnpm in this project), or read the rendered HTML in `templates.test.ts`.


## Stale drafts and the consent banner (5 September 2026)

A draft is kept for seven days. When a visitor returns with a draft at
step 3 whose time has passed or is no longer offered, the slot effects
clear the time. Two rules keep that from crashing the page: the slot
time formatter returns an empty string for a value it cannot parse, and
the form returns to step 1 whenever the time is empty while the step is
higher, keeping the date. The regression test seeds a stale step 3 draft
into local storage and expects the time grid.

The consent banner writes its measured height into `--consent-height`
on the root element while it is visible, and `main` reserves that space
as bottom padding. On a short page (the booking failure state on a
phone) the recovery buttons therefore never sit behind the banner. The
banner still stacks above the sticky booking bar through
`--bottom-bar-offset`.
