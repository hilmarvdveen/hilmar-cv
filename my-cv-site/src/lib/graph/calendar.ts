import { Client } from "@microsoft/microsoft-graph-client";
import { SLOT_MINUTES, SLOTS_PER_DAY, WORKDAY_START_HOUR } from "@/lib/booking/schedule";

export const BOOKING_TIMEZONE = "Europe/Amsterdam";
const REMINDER_MINUTES_BEFORE_START = 60;

export type CalendarEvent = {
  start: { dateTime: string };
  end: { dateTime: string };
}

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

function bookingTimezoneDateKey(instant: Date): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: BOOKING_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(instant);

  const partValue = (type: string): string =>
    parts.find((part) => part.type === type)?.value ?? "";

  return `${partValue("year")}-${partValue("month")}-${partValue("day")}`;
}

export function tomorrowBookingDateKey(instant: Date): string {
  const [year, month, day] = bookingTimezoneDateKey(instant)
    .split("-")
    .map(Number);
  const nextDay = new Date(Date.UTC(year, month - 1, day) + 86400000);
  const pad = (value: number): string => String(value).padStart(2, "0");
  return `${nextDay.getUTCFullYear()}-${pad(nextDay.getUTCMonth() + 1)}-${pad(
    nextDay.getUTCDate()
  )}`;
}

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
  date: string;
  htmlBody: string;
  subject: string;
}

export type CreateEventResult = {
  joinUrl: string | undefined;
}

type CalendarEventBody = {
  subject: string;
  body: { contentType: "HTML"; content: string };
  start: { dateTime: string; timeZone: string };
  end: { dateTime: string; timeZone: string };
  attendees: { emailAddress: { address: string; name: string }; type: "required" }[];
  isReminderOn: boolean;
  reminderMinutesBeforeStart: number;
  isOnlineMeeting?: boolean;
  onlineMeetingProvider?: "teamsForBusiness";
}

type CreatedCalendarEvent = {
  onlineMeeting?: { joinUrl?: string };
}

function buildCalendarEventBody(
  { name, email, date, htmlBody, subject }: CreateEventInput,
  withTeamsMeeting: boolean
): CalendarEventBody {
  const startDate = new Date(date);
  const endDate = new Date(startDate.getTime() + SLOT_MINUTES * 60000);

  return {
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
    isReminderOn: true,
    reminderMinutesBeforeStart: REMINDER_MINUTES_BEFORE_START,
    ...(withTeamsMeeting
      ? { isOnlineMeeting: true, onlineMeetingProvider: "teamsForBusiness" as const }
      : {}),
  };
}

export async function createCalendarEvent(
  client: Client,
  userEmail: string,
  input: CreateEventInput
): Promise<CreateEventResult> {
  try {
    const response = (await client
      .api(`/users/${userEmail}/events`)
      .post(buildCalendarEventBody(input, true))) as CreatedCalendarEvent | undefined;
    return { joinUrl: response?.onlineMeeting?.joinUrl };
  } catch {
    await client
      .api(`/users/${userEmail}/events`)
      .post(buildCalendarEventBody(input, false));
    return { joinUrl: undefined };
  }
}

const BOOKING_EVENT_SUBJECT_PREFIXES = {
  nl: "Kennismaking:",
  en: "Intro call:",
} as const;

export type BookingEmailLocale = keyof typeof BOOKING_EVENT_SUBJECT_PREFIXES;

function matchesBookingSubject(subject: string): boolean {
  return Object.values(BOOKING_EVENT_SUBJECT_PREFIXES).some((prefix) =>
    subject.startsWith(prefix)
  );
}

export function bookingSubjectLocale(subject: string): BookingEmailLocale {
  return subject.startsWith(BOOKING_EVENT_SUBJECT_PREFIXES.nl) ? "nl" : "en";
}

export type UpcomingBookingEvent = {
  subject: string;
  start: { dateTime: string };
  attendees: { emailAddress: { address: string; name: string } }[];
  onlineMeeting?: { joinUrl?: string };
}

export async function listUpcomingBookings(
  client: Client,
  userEmail: string,
  from: Date,
  to: Date
): Promise<UpcomingBookingEvent[]> {
  const result = (await client
    .api(`/users/${userEmail}/calendarview`)
    .query({
      startDateTime: from.toISOString(),
      endDateTime: to.toISOString(),
      $orderby: "start/dateTime",
    })
    .header("Prefer", `outlook.timezone="${BOOKING_TIMEZONE}"`)
    .get()) as { value?: UpcomingBookingEvent[] } | undefined;

  const events = result?.value ?? [];
  return events.filter((event) => matchesBookingSubject(event.subject));
}
