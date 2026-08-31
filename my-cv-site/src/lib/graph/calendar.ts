import { Client } from "@microsoft/microsoft-graph-client";

export const BOOKING_TIMEZONE = "Europe/Amsterdam";
const SLOT_MINUTES = 30;
const SLOTS_PER_DAY = 16; // 09:00 - 17:00 in 30-minute steps
const WORKDAY_START_HOUR = 9;

export type CalendarEvent = {
  start: { dateTime: string };
  end: { dateTime: string };
}

/**
 * The UTC offset (in minutes) that BOOKING_TIMEZONE has at the given instant.
 * Derived via Intl so daylight saving is handled by the runtime's zone data
 * instead of a hardcoded offset.
 */
function bookingTimezoneOffsetMinutes(instant: Date): number {
  const timeZoneName = new Intl.DateTimeFormat("en-US", {
    timeZone: BOOKING_TIMEZONE,
    timeZoneName: "longOffset",
  })
    .formatToParts(instant)
    .find((part) => part.type === "timeZoneName")?.value;

  const offsetMatch = /GMT([+-])(\d{2}):(\d{2})/.exec(timeZoneName ?? "");
  if (!offsetMatch) return 0;
  const sign = offsetMatch[1] === "-" ? -1 : 1;
  return sign * (Number(offsetMatch[2]) * 60 + Number(offsetMatch[3]));
}

/**
 * The UTC instant at which the given wall-clock time occurs in
 * BOOKING_TIMEZONE on the given day (YYYY-MM-DD). This must not depend on the
 * server's own timezone: Vercel runs on UTC while bookings are Amsterdam
 * wall-clock times. The second pass handles a daylight-saving boundary
 * between the naive guess and the corrected instant.
 */
export function bookingWallClockToUtc(
  date: string,
  hour: number,
  minute: number,
  second = 0
): Date {
  const hourText = String(hour).padStart(2, "0");
  const minuteText = String(minute).padStart(2, "0");
  const secondText = String(second).padStart(2, "0");
  const naiveUtcMilliseconds = Date.parse(
    `${date}T${hourText}:${minuteText}:${secondText}Z`
  );

  let instant = new Date(naiveUtcMilliseconds);
  for (let pass = 0; pass < 2; pass++) {
    instant = new Date(
      naiveUtcMilliseconds - bookingTimezoneOffsetMinutes(instant) * 60000
    );
  }
  return instant;
}

/**
 * Parse a Microsoft Graph dateTime string as a UTC instant. Under
 * `Prefer: outlook.timezone="Europe/Amsterdam"` Graph returns wall-clock
 * strings with no offset (for example "2026-09-01T10:00:00.0000000"), which
 * `new Date(...)` would wrongly read in the server's timezone. Strings that
 * already carry a Z or an explicit offset parse as they are.
 */
export function parseGraphDateTime(dateTime: string): Date {
  if (/(Z|[+-]\d{2}:\d{2})$/.test(dateTime)) {
    return new Date(dateTime);
  }
  const wallClockMatch = /^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?/.exec(
    dateTime
  );
  if (!wallClockMatch) {
    return new Date(dateTime);
  }
  return bookingWallClockToUtc(
    wallClockMatch[1],
    Number(wallClockMatch[2]),
    Number(wallClockMatch[3]),
    Number(wallClockMatch[4] ?? 0)
  );
}

/**
 * Format a UTC instant as an Amsterdam wall-clock string without an offset,
 * the exact shape Microsoft Graph expects in a dateTimeTimeZone body. Sending
 * an ISO string with a trailing Z next to `timeZone: "Europe/Amsterdam"`
 * would make Graph read the UTC digits as Amsterdam time and shift the event.
 */
export function formatAsBookingWallClock(instant: Date): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: BOOKING_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(instant);

  const partValue = (type: string): string =>
    parts.find((part) => part.type === type)?.value ?? "00";

  return (
    `${partValue("year")}-${partValue("month")}-${partValue("day")}` +
    `T${partValue("hour")}:${partValue("minute")}:${partValue("second")}`
  );
}

/**
 * Generate the bookable 30-minute slot start times (UTC ISO strings) for a
 * given day, 09:00-17:00 Amsterdam wall-clock time. Pure function, unit-tested.
 */
export function generateTimeSlots(date: string): string[] {
  const firstSlotStart = bookingWallClockToUtc(date, WORKDAY_START_HOUR, 0);
  const slots: string[] = [];
  for (let slotIndex = 0; slotIndex < SLOTS_PER_DAY; slotIndex++) {
    slots.push(
      new Date(
        firstSlotStart.getTime() + slotIndex * SLOT_MINUTES * 60000
      ).toISOString()
    );
  }
  return slots;
}

/**
 * True when a 30-minute slot starting at `slotStart` does not overlap any
 * existing calendar event. Event times are parsed with parseGraphDateTime so
 * Graph's offset-less Amsterdam strings compare on the same clock as the
 * slot instants. Pure function, unit-tested.
 */
export function isSlotAvailable(
  slotStart: Date,
  events: CalendarEvent[]
): boolean {
  const slotEnd = new Date(slotStart.getTime() + SLOT_MINUTES * 60000);
  return !events.some((event) => {
    const eventStart = parseGraphDateTime(event.start.dateTime);
    const eventEnd = parseGraphDateTime(event.end.dateTime);
    return slotStart < eventEnd && slotEnd > eventStart;
  });
}

export type CreateEventInput = {
  name: string;
  email: string;
  date: string; // ISO start (a real UTC instant)
  htmlBody: string; // caller is responsible for escaping user content
  subject: string;
}

/** Create a 30-minute calendar event with the requester as a required attendee. */
export async function createCalendarEvent(
  client: Client,
  userEmail: string,
  { name, email, date, htmlBody, subject }: CreateEventInput
): Promise<void> {
  const startDate = new Date(date);
  const endDate = new Date(startDate.getTime() + SLOT_MINUTES * 60000);

  await client.api(`/users/${userEmail}/events`).post({
    subject,
    body: { contentType: "HTML", content: htmlBody },
    start: {
      dateTime: formatAsBookingWallClock(startDate),
      timeZone: BOOKING_TIMEZONE,
    },
    end: {
      dateTime: formatAsBookingWallClock(endDate),
      timeZone: BOOKING_TIMEZONE,
    },
    attendees: [
      {
        emailAddress: { address: email, name },
        type: "required",
      },
    ],
  });
}
