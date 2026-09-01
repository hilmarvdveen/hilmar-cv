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

type DataLayerGlobal = {
  dataLayer?: unknown[];
};

export function trackBookingEvent(
  name: BookingEventName,
  parameters: BookingEventParameters = {}
): void {
  try {
    const globalScope = globalThis as unknown as DataLayerGlobal;
    globalScope.dataLayer = globalScope.dataLayer ?? [];
    globalScope.dataLayer.push({ event: name, event_category: "booking", ...parameters });
  } catch {
    return;
  }
}
