import { describe, it, expect } from "vitest";
import { generateTimeSlots, isSlotAvailable, type CalendarEvent } from "./calendar";

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
