import { NextRequest, NextResponse } from "next/server";
import {
  getGraphCredentials,
  getAccessToken,
  getGraphClient,
  sendMail,
  listUpcomingBookings,
  bookingSubjectLocale,
  parseGraphDateTime,
  bookingWallClockToUtc,
  tomorrowBookingDateKey,
} from "@/lib/graph";
import { enforceRateLimit, serverErrorResponse } from "@/lib/security";
import { renderBookingReminderEmail } from "@/lib/email";

export const runtime = "nodejs";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const expectedSecret = process.env.CRON_SECRET;
  const authorizationHeader = request.headers.get("authorization");
  const providedSecret = authorizationHeader?.startsWith("Bearer ")
    ? authorizationHeader.slice("Bearer ".length)
    : undefined;
  if (!expectedSecret || providedSecret !== expectedSecret) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const limited = enforceRateLimit(request, "read");
  if (limited) return limited;

  try {
    const credentials = getGraphCredentials();
    if (!credentials) {
      console.error("Missing required environment variables for booking reminders");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    const accessToken = await getAccessToken(credentials);
    const client = getGraphClient(accessToken);
    const { smtpUser } = credentials;

    const tomorrow = tomorrowBookingDateKey(new Date());
    const from = bookingWallClockToUtc(tomorrow, 0, 0, 0);
    const to = bookingWallClockToUtc(tomorrow, 23, 59, 59);

    const bookings = await listUpcomingBookings(client, smtpUser, from, to);

    let sent = 0;
    for (const booking of bookings) {
      const attendee = booking.attendees[0];
      if (!attendee) continue;

      const reminder = renderBookingReminderEmail({
        locale: bookingSubjectLocale(booking.subject),
        name: attendee.emailAddress.name,
        isoDate: parseGraphDateTime(booking.start.dateTime).toISOString(),
        joinUrl: booking.onlineMeeting?.joinUrl,
      });

      await sendMail(client, smtpUser, {
        to: attendee.emailAddress.address,
        toName: attendee.emailAddress.name,
        subject: reminder.subject,
        body: reminder.html,
        isHtml: true,
      });
      sent += 1;
    }

    return NextResponse.json({ sent });
  } catch (error: unknown) {
    console.error("Booking reminders error:", error);
    return serverErrorResponse(error);
  }
}
