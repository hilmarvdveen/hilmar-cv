// app/api/booking/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  getGraphCredentials,
  getAccessToken,
  getGraphClient,
  sendMail,
  createCalendarEvent,
} from "@/lib/graph";
import {
  isAllowedOrigin,
  enforceRateLimit,
  looksAutomated,
  validateFields,
  serverErrorResponse,
  LIMITS,
} from "@/lib/security";
import {
  renderBookingConfirmationEmail,
  renderBookingNotificationEmail,
  renderBookingCalendarEvent,
  type BookingEmailInput,
} from "@/lib/email";

export const runtime = "nodejs"; // Ensures Node.js runtime, not Edge

type BookingData = {
  name: string;
  email: string;
  date: string;
  company?: string;
  topic?: string;
  locale?: string;
  company_website?: string;
  formStartedAt?: number;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    if (!isAllowedOrigin(req)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const limited = enforceRateLimit(req, "email");
    if (limited) return limited;

    const body = (await req.json()) as Partial<BookingData>;
    const { name, email, date, company, topic } = body;
    const locale: BookingEmailInput["locale"] = body.locale === "en" ? "en" : "nl";

    if (looksAutomated(body as Record<string, unknown>, Date.now())) {
      return NextResponse.json({ success: true, message: "Booking created successfully" });
    }

    const validation = validateFields({
      name: { value: name, required: true, maxLength: LIMITS.name },
      email: { value: email, required: true, email: true },
      date: { value: date, required: true, maxLength: 40 },
      company: { value: company, maxLength: LIMITS.name },
      topic: { value: topic, maxLength: 1000 },
    });
    if (!validation.ok) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    // Validate date is real and not in the past.
    const bookingDate = new Date(date as string);
    if (isNaN(bookingDate.getTime())) {
      return NextResponse.json({ error: "Invalid date format" }, { status: 400 });
    }
    if (bookingDate < new Date()) {
      return NextResponse.json({ error: "Booking date cannot be in the past" }, { status: 400 });
    }

    const credentials = getGraphCredentials();
    if (!credentials) {
      console.error("Missing required environment variables for booking service");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    const accessToken = await getAccessToken(credentials);
    const client = getGraphClient(accessToken);
    const { smtpUser } = credentials;

    const booking: BookingEmailInput = {
      locale,
      name: name as string,
      email: email as string,
      company: (company ?? "").trim(),
      topic: (topic ?? "").trim(),
      isoDate: bookingDate.toISOString(),
    };
    const calendarEvent = renderBookingCalendarEvent(booking);
    const notification = renderBookingNotificationEmail(booking);
    const confirmation = renderBookingConfirmationEmail(booking);

    await createCalendarEvent(client, smtpUser, {
      name: booking.name,
      email: booking.email,
      date: booking.isoDate,
      subject: calendarEvent.subject,
      htmlBody: calendarEvent.html,
    });

    await sendMail(client, smtpUser, {
      to: smtpUser,
      toName: "Hilmar van der Veen",
      subject: notification.subject,
      body: notification.html,
      isHtml: true,
      replyTo: booking.email,
      replyToName: booking.name,
    });

    await sendMail(client, smtpUser, {
      to: booking.email,
      toName: booking.name,
      subject: confirmation.subject,
      body: confirmation.html,
      isHtml: true,
    });

    console.log(`Booking created for: ${booking.name} (${booking.email}) on ${bookingDate.toLocaleString()}`);

    return NextResponse.json({ success: true, message: "Booking created successfully" });
  } catch (error: unknown) {
    console.error("Booking error:", error);
    return serverErrorResponse(error);
  }
}
