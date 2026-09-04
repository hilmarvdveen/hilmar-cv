import { pushDataLayerEvent } from "@/lib/analytics/events";

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

export function trackBookingEvent(
  name: BookingEventName,
  parameters: BookingEventParameters = {}
): void {
  pushDataLayerEvent(name, "booking", parameters);
}
