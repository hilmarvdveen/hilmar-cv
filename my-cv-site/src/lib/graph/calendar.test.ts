import { describe, it, expect, vi } from "vitest";
import {
  generateTimeSlots,
  isSlotAvailable,
  createCalendarEvent,
  type CalendarEvent,
} from "./calendar";
import type { Client } from "@microsoft/microsoft-graph-client";

describe("generateTimeSlots", () => {
  const slots = generateTimeSlots("2026-07-01");

  it("produces 16 half-hour slots (09:00–17:00)", () => {
    expect(slots).toHaveLength(16);
  });

  it("starts at 09:00 local and steps by 30 minutes", () => {
    const first = new Date(slots[0]);
    const second = new Date(slots[1]);
    expect(first.getHours()).toBe(9);
    expect(first.getMinutes()).toBe(0);
    expect(second.getTime() - first.getTime()).toBe(30 * 60000);
  });

  it("last slot starts at 16:30 local", () => {
    const last = new Date(slots[slots.length - 1]);
    expect(last.getHours()).toBe(16);
    expect(last.getMinutes()).toBe(30);
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
    expect(event.start.timeZone).toBe("Europe/Amsterdam");
    expect(event.end.timeZone).toBe("Europe/Amsterdam");
    expect(event.attendees).toEqual([
      { emailAddress: { address: "jane@example.com", name: "Jane Doe" }, type: "required" },
    ]);

    const durationMs =
      new Date(event.end.dateTime).getTime() - new Date(event.start.dateTime).getTime();
    expect(durationMs).toBe(30 * 60000);
  });
});
