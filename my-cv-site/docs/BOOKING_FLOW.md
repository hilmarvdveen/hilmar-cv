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
  (message), failed (message plus retry) and ready (buttons) all render inside
  the same box.
- Every field reserves one line under it for its error message, so an
  appearing error never pushes the fields below it.
- The day strip has a fixed button height. The "another date" control lives in
  a fixed-height row whether it shows the link or the input.
- Times for a day are cached, so going back to a day already seen renders
  instantly.

### Mobile

- A sticky bottom bar carries the current selection and the primary button,
  so the next action is always on screen and the visitor never scrolls to
  find it. Back is a text link above the bar.
- The two-column layout collapses to one. The "what to expect" panel moves
  below the form. The live selection panel disappears because the sticky bar
  shows the selection.
- Inputs use 16px text so iOS does not zoom on focus. Day and time buttons are
  44px tall for a comfortable tap target.

### Server rules that support the flow

- The slots API drops times that start within the next hour and offers
  nothing on weekends, so the grid never shows a time that cannot be booked.
- A booking draft is saved for 24 hours and restored on return. A restored
  time that is no longer free is dropped silently. A saved step is only
  restored when the data it needs is still there.

## Funnel events

`src/lib/booking/analytics.ts` sends these to Google Analytics when the
visitor has given consent. The hypotheses below are measured with them.

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
