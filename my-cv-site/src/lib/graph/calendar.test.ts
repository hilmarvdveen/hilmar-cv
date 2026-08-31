import { describe, it, expect, vi } from "vitest";
import {
  generateTimeSlots,
  isSlotAvailable,
  createCalendarEvent,
  bookingWallClockToUtc,
  parseGraphDateTime,
  formatAsBookingWallClock,
  BOOKING_TIMEZONE,
  type CalendarEvent,
} from "./calendar";
import type { Client } from "@microsoft/microsoft-graph-client";

/** Format a UTC instant as HH:mm wall-clock time in the booking timezone. */
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
    // 09:00 CEST is 07:00 UTC, which pins the server-timezone independence.
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
    // event ends exactly when the slot starts
    const events = [makeEvent("2026-07-01T08:30:00Z", "2026-07-01T09:00:00Z")];
    expect(isSlotAvailable(new Date("2026-07-01T09:00:00Z"), events)).toBe(true);
  });

  it("is unavailable when fully contained in a long event", () => {
    const events = [makeEvent("2026-07-01T08:00:00Z", "2026-07-01T12:00:00Z")];
    expect(isSlotAvailable(new Date("2026-07-01T09:00:00Z"), events)).toBe(false);
  });

  it("compares Graph's offset-less Amsterdam event times on the same clock as the slot", () => {
    // 10:00-10:30 Amsterdam summer time is 08:00-08:30 UTC. The 08:00 UTC
    // slot must therefore read as busy, and the 10:00 UTC slot as free.
    const events = [
      makeEvent("2026-07-01T10:00:00.0000000", "2026-07-01T10:30:00.0000000"),
    ];
    expect(isSlotAvailable(new Date("2026-07-01T08:00:00Z"), events)).toBe(false);
    expect(isSlotAvailable(new Date("2026-07-01T10:00:00Z"), events)).toBe(true);
  });
});

describe("createCalendarEvent", () => {
  it("posts a 30-minute Amsterdam event with the requester as required attendee", async () => {
    const post = vi.fn().mockResolvedValue(undefined);
    const api = vi.fn(() => ({ post }));
    const client = { api } as unknown as Client;

    await createCalendarEvent(client, "owner@example.com", {
      name: "Jane Doe",
      email: "jane@example.com",
      date: "2026-07-01T10:00:00.000Z",
      htmlBody: "<p>Meeting</p>",
      subject: "Consultation",
    });

    expect(api).toHaveBeenCalledWith("/users/owner@example.com/events");
    const event = post.mock.calls[0][0];
    expect(event.subject).toBe("Consultation");
    expect(event.body).toEqual({ contentType: "HTML", content: "<p>Meeting</p>" });
    // 10:00 UTC on 1 July is 12:00 Amsterdam wall-clock time, and Graph gets
    // the wall-clock string without a Z so the timeZone field is authoritative.
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
  });
});
