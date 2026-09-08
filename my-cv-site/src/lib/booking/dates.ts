import { MINIMUM_NOTICE_MINUTES, lastSlotStartMinutes } from "./schedule";

export const BOOKING_TIMEZONE = "Europe/Amsterdam";

const INTL_LOCALES: Record<string, string> = {
  nl: "nl-NL",
  en: "en-GB",
};

const pad = (value: number): string => String(value).padStart(2, "0");

export function toDateKey(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function fromDateKey(key: string): Date {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function isWorkingDay(date: Date): boolean {
  const weekday = date.getDay();
  return weekday !== 0 && weekday !== 6;
}

export function getUpcomingWorkingDays(from: Date, count: number): string[] {
  const days: string[] = [];
  const cursor = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  while (days.length < count) {
    if (isWorkingDay(cursor)) days.push(toDateKey(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  return days;
}

export function toIntlLocale(locale: string): string {
  return INTL_LOCALES[locale] ?? locale;
}

export type DayLabel = {
  weekday: string;
  day: string;
  month: string;
};

export function formatDayLabel(key: string, locale: string): DayLabel {
  const date = fromDateKey(key);
  const intlLocale = toIntlLocale(locale);
  return {
    weekday: new Intl.DateTimeFormat(intlLocale, { weekday: "short" })
      .format(date)
      .replace(/\.$/, ""),
    day: new Intl.DateTimeFormat(intlLocale, { day: "numeric" }).format(date),
    month: new Intl.DateTimeFormat(intlLocale, { month: "short" })
      .format(date)
      .replace(/\.$/, ""),
  };
}

export function formatLongDate(key: string, locale: string): string {
  return new Intl.DateTimeFormat(toIntlLocale(locale), {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(fromDateKey(key));
}

export function formatShortDate(key: string, locale: string): string {
  const label = formatDayLabel(key, locale);
  return `${label.weekday} ${label.day} ${label.month}`;
}

export function formatSlotTime(iso: string): string {
  const moment = new Date(iso);
  if (Number.isNaN(moment.getTime())) return "";
  return new Intl.DateTimeFormat("nl-NL", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: BOOKING_TIMEZONE,
  }).format(moment);
}

const bookingClockFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: BOOKING_TIMEZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

function bookingClockParts(instant: Date): Record<string, string> {
  const parts: Record<string, string> = {};
  for (const part of bookingClockFormatter.formatToParts(instant)) parts[part.type] = part.value;
  return parts;
}

export function bookingDateKey(instant: Date): string {
  const parts = bookingClockParts(instant);
  return `${parts.year}-${parts.month}-${parts.day}`;
}

export function bookingWallClockMinutes(instant: Date): number {
  const parts = bookingClockParts(instant);
  return Number(parts.hour) * 60 + Number(parts.minute);
}

export function firstBookableDay(now: Date): string {
  const todayKey = bookingDateKey(now);
  const today = fromDateKey(todayKey);
  const todayStillHasTimes =
    isWorkingDay(today) &&
    bookingWallClockMinutes(now) + MINIMUM_NOTICE_MINUTES <= lastSlotStartMinutes();
  if (todayStillHasTimes) return todayKey;
  const tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
  return getUpcomingWorkingDays(tomorrow, 1)[0];
}
