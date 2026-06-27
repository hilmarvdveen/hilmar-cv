// app/api/booking/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  getGraphCredentials,
  getAccessToken,
  getGraphClient,
  sendMail,
  createCalendarEvent,
  BOOKING_TIMEZONE,
} from "@/lib/graph";
import {
  escapeHtml,
  isAllowedOrigin,
  looksAutomated,
  validateFields,
  serverErrorResponse,
  LIMITS,
} from "@/lib/security";

export const runtime = "nodejs"; // Ensures Node.js runtime, not Edge

interface BookingData {
  name: string;
  email: string;
  date: string; // ISO string
  message?: string;
  company_website?: string; // honeypot
  formStartedAt?: number;
}

function buildConfirmationEmail(name: string, date: string, userEmail: string): string {
  const formattedDate = new Date(date).toLocaleString("nl-NL", {
    timeZone: BOOKING_TIMEZONE,
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return `<p>Hi ${escapeHtml(name)},</p>

<p>Thank you for booking a consultation with me! Your booking has been confirmed for:</p>

<div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
<p style="margin: 0; font-size: 18px; font-weight: bold; color: #059669;">
📅 ${formattedDate}
</p>
</div>

<p>I'm looking forward to our conversation! If you have any questions or need to reschedule, please don't hesitate to reach out:</p>

<ul>
<li>Email: <a href="mailto:${userEmail}">${userEmail}</a></li>
<li>Phone: <a href="tel:+31680149947">+31 6 8014 9947</a></li>
<li>LinkedIn: <a href="https://linkedin.com/in/hilmarvanderveen">linkedin.com/in/hilmarvanderveen</a></li>
</ul>

<p>I'll send you a calendar invitation shortly with all the details.</p>

<p>Best regards,<br>
<strong>Hilmar van der Veen</strong><br>
Senior Frontend Developer</p>

<hr style="margin-top: 30px; border: none; border-top: 1px solid #e5e7eb;">
<p style="font-size: 12px; color: #6b7280;">This is an automated confirmation email.</p>`;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    if (!isAllowedOrigin(req)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = (await req.json()) as Partial<BookingData>;
    const { name, email, date, message } = body;

    if (looksAutomated(body as Record<string, unknown>, Date.now())) {
      return NextResponse.json({ success: true, message: "Booking created successfully" });
    }

    const validation = validateFields({
      name: { value: name, required: true, maxLength: LIMITS.name },
      email: { value: email, required: true, email: true },
      date: { value: date, required: true, maxLength: 40 },
      message: { value: message, maxLength: LIMITS.message },
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

    const safeName = name as string;
    const safeEmail = email as string;
    const isoDate = bookingDate.toISOString();

    await createCalendarEvent(client, smtpUser, {
      name: safeName,
      email: safeEmail,
      date: isoDate,
      subject: `New Booking from ${safeName}`,
      htmlBody: `Booking message: ${escapeHtml(message || "(no message)")}`,
    });

    await sendMail(client, smtpUser, {
      to: safeEmail,
      toName: safeName,
      subject: "Booking Confirmation - Hilmar van der Veen",
      body: buildConfirmationEmail(safeName, isoDate, smtpUser),
      isHtml: true,
    });

    console.log(`Booking created for: ${safeName} (${safeEmail}) on ${bookingDate.toLocaleString()}`);

    return NextResponse.json({ success: true, message: "Booking created successfully" });
  } catch (error: unknown) {
    console.error("Booking error:", error);
    return serverErrorResponse(error);
  }
}
