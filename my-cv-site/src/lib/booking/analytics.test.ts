import { describe, it, expect, afterEach } from "vitest";
import { trackBookingEvent } from "./analytics";

type DataLayerWindow = { dataLayer?: unknown[] };

afterEach(() => {
  delete (window as unknown as DataLayerWindow).dataLayer;
});

describe("trackBookingEvent", () => {
  it("pushes the event with the booking category onto the dataLayer", () => {
    trackBookingEvent("booking_slot_selected", { step: 1 });
    expect((window as unknown as DataLayerWindow).dataLayer).toEqual([
      { event: "booking_slot_selected", event_category: "booking", step: 1 },
    ]);
  });

  it("creates the dataLayer when Tag Manager has not loaded yet and appends when it has", () => {
    (window as unknown as DataLayerWindow).dataLayer = [{ event: "gtm.js" }];
    trackBookingEvent("booking_step_view", { step: 2 });
    expect((window as unknown as DataLayerWindow).dataLayer).toHaveLength(2);
  });

  it("swallows a dataLayer that refuses the push", () => {
    (window as unknown as DataLayerWindow).dataLayer = Object.freeze([]) as unknown as unknown[];
    expect(() => trackBookingEvent("booking_failed")).not.toThrow();
  });
});
