export {
  getGraphCredentials,
  getAccessToken,
  getGraphClient,
  type GraphCredentials,
} from "./client";
export { sendMail, type SendMailOptions } from "./mail";
export {
  runGraphHealthChecks,
  describeGraphError,
  type GraphHealthReport,
  type HealthStep,
} from "./health";
export {
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
  type CreateEventInput,
  type CreateEventResult,
  type BookingEmailLocale,
  type UpcomingBookingEvent,
} from "./calendar";
