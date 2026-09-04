import { describe, it, expect, vi } from "vitest";
import {
  generateTimeSlots,
  isSlotAvailable,
  createCalendarEvent,
  bookingWallClockToUtc,
  parseGraphDateTime,
  formatAsBookingWallClock,
  tomorrowBookingDateKey,
  bookingSubjectLocale,
  listUpcomingBookings,
  BOOKING_TIMEZONE,
  type CalendarEvent,
} from "./calendar";
import type { Client } from "@microsoft/microsoft-graph-client";

const amsterdamTime = (iso: string): string =>
  new Date(iso).toLocaleTimeString("nl-NL", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: BOOKING_TIMEZONE,
  });

describe("bookingWallClockToUtc", () => {
  it("maps 09:00 Amsterdam summer time to 07:00 UTC", () => {
    expect(bookingWallClockToUtc("2026-07-01", 9, 0).toISOString()).toBe(
      "2026-07-01T07:00:00.000Z"
    );
  });

  it("maps 09:00 Amsterdam winter time to 08:00 UTC", () => {
    expect(bookingWallClockToUtc("2026-01-15", 9, 0).toISOString()).toBe(
      "2026-01-15T08:00:00.000Z"
    );
  });

  it("treats an unparseable zone offset as UTC (defensive fallback)", () => {
    const dateTimeFormatSpy = vi
      .spyOn(Intl, "DateTimeFormat")
      .mockImplementation(function () {
        return {
          formatToParts: () => [],
        } as unknown as Intl.DateTimeFormat;
      });
    try {
      expect(bookingWallClockToUtc("2026-07-01", 9, 0).toISOString()).toBe(
        "2026-07-01T09:00:00.000Z"
      );
    } finally {
      dateTimeFormatSpy.mockRestore();
    }
  });
});

describe("parseGraphDateTime", () => {
  it("reads an offset-less Graph string as Amsterdam wall-clock time", () => {
    expect(
      parseGraphDateTime("2026-07-01T10:00:00.0000000").toISOString()
    ).toBe("2026-07-01T08:00:00.000Z");
  });

  it("leaves strings with an explicit UTC marker untouched", () => {
    expect(parseGraphDateTime("2026-07-01T10:00:00Z").toISOString()).toBe(
      "2026-07-01T10:00:00.000Z"
    );
  });

  it("falls back to native parsing for unrecognised formats", () => {
    expect(Number.isNaN(parseGraphDateTime("not a datetime").getTime())).toBe(true);
  });
});

describe("formatAsBookingWallClock", () => {
  it("renders a UTC instant as Amsterdam wall-clock text without an offset", () => {
    expect(formatAsBookingWallClock(new Date("2026-07-01T08:00:00Z"))).toBe(
      "2026-07-01T10:00:00"
    );
  });
});

describe("generateTimeSlots", () => {
  const slots = generateTimeSlots("2026-07-01");

  it("produces 16 half-hour slots (09:00-17:00)", () => {
    expect(slots).toHaveLength(16);
  });

  it("starts at 09:00 Amsterdam time regardless of the server timezone", () => {
    expect(amsterdamTime(slots[0])).toBe("09:00");
    expect(slots[0]).toBe("2026-07-01T07:00:00.000Z");
    const second = new Date(slots[1]);
    expect(second.getTime() - new Date(slots[0]).getTime()).toBe(30 * 60000);
  });

  it("last slot starts at 16:30 Amsterdam time", () => {
    expect(amsterdamTime(slots[slots.length - 1])).toBe("16:30");
  });

  it("also anchors to 09:00 Amsterdam in winter (daylight-saving change)", () => {
    const winterSlots = generateTimeSlots("2026-01-15");
    expect(amsterdamTime(winterSlots[0])).toBe("09:00");
    expect(winterSlots[0]).toBe("2026-01-15T08:00:00.000Z");
  });
});

describe("isSlotAvailable", () => {
  const makeEvent = (start: string, end: string): CalendarEvent => ({
    start: { dateTime: start },
    end: { dateTime: end },
  });

  it("is available when there are no events", () => {
    expect(isSlotAvailable(new Date("2026-07-01T09:00:00Z"), [])).toBe(true);
  });

  it("is unavailable when an event overlaps", () => {
    const events = [makeEvent("2026-07-01T09:15:00Z", "2026-07-01T09:45:00Z")];
    expect(isSlotAvailable(new Date("2026-07-01T09:00:00Z"), events)).toBe(false);
  });

  it("treats adjacent (touching) events as non-overlapping", () => {
    const events = [makeEvent("2026-07-01T08:30:00Z", "2026-07-01T09:00:00Z")];
    expect(isSlotAvailable(new Date("2026-07-01T09:00:00Z"), events)).toBe(true);
  });

  it("is unavailable when fully contained in a long event", () => {
    const events = [makeEvent("2026-07-01T08:00:00Z", "2026-07-01T12:00:00Z")];
    expect(isSlotAvailable(new Date("2026-07-01T09:00:00Z"), events)).toBe(false);
  });

  it("compares Graph's offset-less Amsterdam event times on the same clock as the slot", () => {
    const events = [
      makeEvent("2026-07-01T10:00:00.0000000", "2026-07-01T10:30:00.0000000"),
    ];
    expect(isSlotAvailable(new Date("2026-07-01T08:00:00Z"), events)).toBe(false);
    expect(isSlotAvailable(new Date("2026-07-01T10:00:00Z"), events)).toBe(true);
  });
});

describe("createCalendarEvent", () => {
  const input = {
    name: "Jane Doe",
    email: "jane@example.com",
    date: "2026-07-01T10:00:00.000Z",
    htmlBody: "<p>Meeting</p>",
    subject: "Consultation",
  };

  it("posts a 30-minute Amsterdam Teams event with the requester as required attendee", async () => {
    const post = vi.fn().mockResolvedValue({
      onlineMeeting: { joinUrl: "https://teams.microsoft.com/l/meetup-join/abc" },
    });
    const api = vi.fn(() => ({ post }));
    const client = { api } as unknown as Client;

    const result = await createCalendarEvent(client, "owner@example.com", input);

    expect(api).toHaveBeenCalledWith("/users/owner@example.com/events");
    const event = post.mock.calls[0][0];
    expect(event.subject).toBe("Consultation");
    expect(event.body).toEqual({ contentType: "HTML", content: "<p>Meeting</p>" });
    expect(event.start).toEqual({
      dateTime: "2026-07-01T12:00:00",
      timeZone: "Europe/Amsterdam",
    });
    expect(event.end).toEqual({
      dateTime: "2026-07-01T12:30:00",
      timeZone: "Europe/Amsterdam",
    });
    expect(event.attendees).toEqual([
      { emailAddress: { address: "jane@example.com", name: "Jane Doe" }, type: "required" },
    ]);
    expect(event.isOnlineMeeting).toBe(true);
    expect(event.onlineMeetingProvider).toBe("teamsForBusiness");
    expect(event.isReminderOn).toBe(true);
    expect(event.reminderMinutesBeforeStart).toBe(60);
    expect(result).toEqual({ joinUrl: "https://teams.microsoft.com/l/meetup-join/abc" });
  });

  it("returns an undefined joinUrl when the response carries no online meeting", async () => {
    const post = vi.fn().mockResolvedValue(undefined);
    const api = vi.fn(() => ({ post }));
    const client = { api } as unknown as Client;

    const result = await createCalendarEvent(client, "owner@example.com", input);

    expect(result).toEqual({ joinUrl: undefined });
  });

  it("retries without the Teams meeting fields when the first post is rejected, and returns an undefined joinUrl", async () => {
    const post = vi
      .fn()
      .mockRejectedValueOnce(new Error("mailbox has no Teams licence"))
      .mockResolvedValueOnce(undefined);
    const api = vi.fn(() => ({ post }));
    const client = { api } as unknown as Client;

    const result = await createCalendarEvent(client, "owner@example.com", input);

    expect(post).toHaveBeenCalledTimes(2);
    const firstAttempt = post.mock.calls[0][0];
    const secondAttempt = post.mock.calls[1][0];
    expect(firstAttempt.isOnlineMeeting).toBe(true);
    expect(firstAttempt.onlineMeetingProvider).toBe("teamsForBusiness");
    expect(secondAttempt).not.toHaveProperty("isOnlineMeeting");
    expect(secondAttempt).not.toHaveProperty("onlineMeetingProvider");
    expect(secondAttempt.subject).toBe("Consultation");
    expect(firstAttempt.isReminderOn).toBe(true);
    expect(firstAttempt.reminderMinutesBeforeStart).toBe(60);
    expect(secondAttempt.isReminderOn).toBe(true);
    expect(secondAttempt.reminderMinutesBeforeStart).toBe(60);
    expect(result).toEqual({ joinUrl: undefined });
  });
});

describe("tomorrowBookingDateKey", () => {
  it("returns the next Amsterdam calendar day for a summer morning instant", () => {
    expect(tomorrowBookingDateKey(new Date("2026-07-01T10:00:00Z"))).toBe(
      "2026-07-02"
    );
  });

  it("returns the next Amsterdam calendar day for a winter morning instant", () => {
    expect(tomorrowBookingDateKey(new Date("2026-01-15T10:00:00Z"))).toBe(
      "2026-01-16"
    );
  });

  it("uses the Amsterdam calendar day, not the UTC one, near midnight", () => {
    expect(tomorrowBookingDateKey(new Date("2026-07-01T22:30:00Z"))).toBe(
      "2026-07-03"
    );
  });

  it("rolls over a year boundary", () => {
    expect(tomorrowBookingDateKey(new Date("2025-12-31T10:00:00Z"))).toBe(
      "2026-01-01"
    );
  });
});

describe("bookingSubjectLocale", () => {
  it("reads a Kennismaking subject as Dutch", () => {
    expect(bookingSubjectLocale("Kennismaking: Hilmar van der Veen en Jane Doe")).toBe(
      "nl"
    );
  });

  it("reads an Intro call subject as English", () => {
    expect(bookingSubjectLocale("Intro call: Hilmar van der Veen and Jane Doe")).toBe(
      "en"
    );
  });

  it("falls back to English for an unrecognised subject", () => {
    expect(bookingSubjectLocale("Team meeting")).toBe("en");
  });
});

describe("listUpcomingBookings", () => {
  const from = new Date("2026-07-02T00:00:00Z");
  const to = new Date("2026-07-02T23:59:59Z");

  it("reads the mailbox calendar view for the given range with the Amsterdam timezone preference", async () => {
    const get = vi.fn().mockResolvedValue({ value: [] });
    const header = vi.fn(() => ({ get }));
    const query = vi.fn(() => ({ header }));
    const api = vi.fn(() => ({ query }));
    const client = { api } as unknown as Client;

    await listUpcomingBookings(client, "owner@example.com", from, to);

    expect(api).toHaveBeenCalledWith("/users/owner@example.com/calendarview");
    expect(query).toHaveBeenCalledWith({
      startDateTime: from.toISOString(),
      endDateTime: to.toISOString(),
      $orderby: "start/dateTime",
    });
    expect(header).toHaveBeenCalledWith(
      "Prefer",
      'outlook.timezone="Europe/Amsterdam"'
    );
  });

  it("keeps only events whose subject starts with a site booking prefix", async () => {
    const events = [
      { subject: "Kennismaking: Hilmar van der Veen en Jane Doe" },
      { subject: "Intro call: Hilmar van der Veen and John Smith" },
      { subject: "Team meeting" },
      { subject: "Kennismaking" },
    ];
    const get = vi.fn().mockResolvedValue({ value: events });
    const api = vi.fn(() => ({
      query: () => ({ header: () => ({ get }) }),
    }));
    const client = { api } as unknown as Client;

    const result = await listUpcomingBookings(client, "owner@example.com", from, to);

    expect(result).toEqual([events[0], events[1]]);
  });

  it("returns an empty list when the response carries no events", async () => {
    const get = vi.fn().mockResolvedValue(undefined);
    const api = vi.fn(() => ({
      query: () => ({ header: () => ({ get }) }),
    }));
    const client = { api } as unknown as Client;

    const result = await listUpcomingBookings(client, "owner@example.com", from, to);

    expect(result).toEqual([]);
  });
});
