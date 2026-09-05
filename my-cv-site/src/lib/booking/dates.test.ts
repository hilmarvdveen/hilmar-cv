import { describe, it, expect } from "vitest";
import {
  toDateKey,
  fromDateKey,
  isWorkingDay,
  getUpcomingWorkingDays,
  toIntlLocale,
  formatDayLabel,
  formatLongDate,
  formatShortDate,
  formatSlotTime,
} from "./dates";

describe("date keys", () => {
  it("round-trips a local date through its key", () => {
    const key = toDateKey(new Date(2026, 9, 7));
    expect(key).toBe("2026-10-07");
    const parsed = fromDateKey(key);
    expect(parsed.getFullYear()).toBe(2026);
    expect(parsed.getMonth()).toBe(9);
    expect(parsed.getDate()).toBe(7);
  });
});

describe("isWorkingDay", () => {
  it("treats Saturday and Sunday as non-working days", () => {
    expect(isWorkingDay(new Date(2026, 9, 3))).toBe(false);
    expect(isWorkingDay(new Date(2026, 9, 4))).toBe(false);
    expect(isWorkingDay(new Date(2026, 9, 5))).toBe(true);
  });
});

describe("getUpcomingWorkingDays", () => {
  it("includes today when it is a working day and skips weekends", () => {
    const days = getUpcomingWorkingDays(new Date(2026, 9, 2, 15, 30), 3);
    expect(days).toEqual(["2026-10-02", "2026-10-05", "2026-10-06"]);
  });

  it("starts on Monday when called on a Saturday", () => {
    const days = getUpcomingWorkingDays(new Date(2026, 9, 3), 2);
    expect(days).toEqual(["2026-10-05", "2026-10-06"]);
  });
});

describe("formatting", () => {
  it("maps site locales to Intl locales and passes others through", () => {
    expect(toIntlLocale("nl")).toBe("nl-NL");
    expect(toIntlLocale("en")).toBe("en-GB");
    expect(toIntlLocale("de-DE")).toBe("de-DE");
  });

  it("formats day button labels without trailing dots", () => {
    expect(formatDayLabel("2026-10-07", "nl")).toEqual({
      weekday: "wo",
      day: "7",
      month: "okt",
    });
    expect(formatDayLabel("2026-10-07", "en")).toEqual({
      weekday: "Wed",
      day: "7",
      month: "Oct",
    });
  });

  it("formats long and short dates per locale", () => {
    expect(formatLongDate("2026-10-07", "nl")).toBe("woensdag 7 oktober 2026");
    expect(formatLongDate("2026-10-07", "en")).toBe("Wednesday, 7 October 2026");
    expect(formatShortDate("2026-10-07", "en")).toBe("Wed 7 Oct");
  });

  it("renders slot instants as Amsterdam wall-clock time", () => {
    expect(formatSlotTime("2026-07-01T08:00:00.000Z")).toBe("10:00");
    expect(formatSlotTime("2026-01-15T08:00:00.000Z")).toBe("09:00");
    expect(formatSlotTime("")).toBe("");
    expect(formatSlotTime("not a moment")).toBe("");
  });
});
