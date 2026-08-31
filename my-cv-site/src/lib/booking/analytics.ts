export type BookingEventName =
  | "booking_step_view"
  | "booking_day_selected"
  | "booking_slot_selected"
  | "booking_slots_empty"
  | "booking_slots_failed"
  | "booking_validation_error"
  | "booking_submitted"
  | "booking_completed"
  | "booking_failed";

export type BookingEventParameters = Record<string, string | number | boolean>;

type GtagGlobal = {
  gtag?: (command: "event", name: string, parameters?: BookingEventParameters) => void;
};

export function trackBookingEvent(
  name: BookingEventName,
  parameters: BookingEventParameters = {}
): void {
  try {
    const { gtag } = globalThis as unknown as GtagGlobal;
    if (typeof gtag === "function") {
      gtag("event", name, { event_category: "booking", ...parameters });
    }
  } catch {
    return;
  }
}
