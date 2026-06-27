export {
  getGraphCredentials,
  getAccessToken,
  getGraphClient,
  type GraphCredentials,
} from "./client";
export { sendMail, type SendMailOptions } from "./mail";
export {
  generateTimeSlots,
  isSlotAvailable,
  createCalendarEvent,
  BOOKING_TIMEZONE,
  type CalendarEvent,
  type CreateEventInput,
} from "./calendar";
