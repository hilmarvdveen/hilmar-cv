import { Client } from "@microsoft/microsoft-graph-client";

export const BOOKING_TIMEZONE = "Europe/Amsterdam";
const SLOT_MINUTES = 30;
const SLOTS_PER_DAY = 16; // 09:00 - 17:00 in 30-minute steps

export type CalendarEvent = {
  start: { dateTime: string };
  end: { dateTime: string };
}

/**
 * Generate the bookable 30-minute slot start times (ISO) for a given day,
 * 09:00–17:00 local. Pure function — unit-tested.
 */
export function generateTimeSlots(date: string): string[] {
  const slots: string[] = [];
  const base = new Date(date);
  base.setHours(9, 0, 0, 0);

  for (let i = 0; i < SLOTS_PER_DAY; i++) {
    slots.push(new Date(base.getTime() + i * SLOT_MINUTES * 60000).toISOString());
  }
  return slots;
}

/**
 * True when a 30-minute slot starting at `slotStart` does not overlap any
 * existing calendar event. Pure function — unit-tested.
 */
export function isSlotAvailable(slotStart: Date, events: CalendarEvent[]): boolean {
  const slotEnd = new Date(slotStart.getTime() + SLOT_MINUTES * 60000);
  return !events.some((ev) => {
    const evStart = new Date(ev.start.dateTime);
    const evEnd = new Date(ev.end.dateTime);
    return slotStart < evEnd && slotEnd > evStart;
  });
}

export type CreateEventInput = {
  name: string;
  email: string;
  date: string; // ISO start
  htmlBody: string; // caller is responsible for escaping user content
  subject: string;
}

/** Create a 30-minute calendar event with the requester as a required attendee. */
export async function createCalendarEvent(
  client: Client,
  userEmail: string,
  { name, email, date, htmlBody, subject }: CreateEventInput
): Promise<void> {
  const startDate = new Date(date);
  const endDate = new Date(startDate.getTime() + SLOT_MINUTES * 60000);

  await client.api(`/users/${userEmail}/events`).post({
    subject,
    body: { contentType: "HTML", content: htmlBody },
    start: { dateTime: startDate.toISOString(), timeZone: BOOKING_TIMEZONE },
    end: { dateTime: endDate.toISOString(), timeZone: BOOKING_TIMEZONE },
    attendees: [
      {
        emailAddress: { address: email, name },
        type: "required",
      },
    ],
  });
}
