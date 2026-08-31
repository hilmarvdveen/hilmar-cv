import { describe, it, expect, vi, afterEach } from "vitest";
import { trackBookingEvent } from "./analytics";

type GtagWindow = { gtag?: unknown };

afterEach(() => {
  delete (window as unknown as GtagWindow).gtag;
});

describe("trackBookingEvent", () => {
  it("forwards the event to gtag with the booking category", () => {
    const gtag = vi.fn();
    (window as unknown as GtagWindow).gtag = gtag;
    trackBookingEvent("booking_slot_selected", { step: 1 });
    expect(gtag).toHaveBeenCalledWith("event", "booking_slot_selected", {
      event_category: "booking",
      step: 1,
    });
  });

  it("does nothing when gtag is absent", () => {
    expect(() => trackBookingEvent("booking_step_view")).not.toThrow();
  });

  it("swallows errors thrown by gtag", () => {
    (window as unknown as GtagWindow).gtag = () => {
      throw new Error("boom");
    };
    expect(() => trackBookingEvent("booking_failed")).not.toThrow();
  });
});
