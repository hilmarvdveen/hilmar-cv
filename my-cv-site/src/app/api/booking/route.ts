// app/api/booking/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Client } from "@microsoft/microsoft-graph-client";
import "isomorphic-fetch";

export const runtime = "nodejs"; // Ensures Node.js runtime, not Edge

interface BookingData {
  name: string;
  email: string;
  date: string; // ISO string
  message?: string;
}

async function getMicrosoftAccessToken(clientId: string, clientSecret: string, tenantId: string) {
  const res = await fetch(`https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
      scope: "https://graph.microsoft.com/.default"
    }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error_description || 'Failed to get Microsoft Graph token');
  }
  return data.access_token;
}

async function createCalendarEvent(accessToken: string, userEmail: string, { name, email, date, message }: BookingData) {
  const client = Client.init({
    authProvider: (done) => done(null, accessToken),
  });

  // Parse date once and create both start and end in ISO format
  const startDate = new Date(date);
  const endDate = new Date(startDate.getTime() + 30 * 60000); // 30 minutes later

  await client.api(`/users/${userEmail}/events`).post({
    subject: `New Booking from ${name}`,
    body: {
      contentType: "HTML",
      content: `Booking message: ${message || "(no message)"}`,
    },
    start: {
      dateTime: startDate.toISOString(),
      timeZone: "Europe/Amsterdam",
    },
    end: {
      dateTime: endDate.toISOString(),
      timeZone: "Europe/Amsterdam",
    },
    attendees: [
      {
        emailAddress: {
          address: email,
          name,
        },
        type: "required",
      },
    ],
  });
}

async function sendEmailViaGraph(accessToken: string, userEmail: string, emailData: {
  to: string;
  toName?: string;
  subject: string;
  body: string;
  isHtml?: boolean;
}) {
  const client = Client.init({
    authProvider: (done) => done(null, accessToken),
  });

  const message = {
    subject: emailData.subject,
    body: {
      contentType: emailData.isHtml ? "HTML" : "Text",
      content: emailData.body,
    },
    toRecipients: [
      {
        emailAddress: {
          address: emailData.to,
          name: emailData.toName || emailData.to,
        },
      },
    ],
  };

  await client.api(`/users/${userEmail}/sendMail`).post({ message });
}

async function sendConfirmationEmail(accessToken: string, userEmail: string, { name, email, date }: BookingData) {
  const formattedDate = new Date(date).toLocaleString('nl-NL', { 
    timeZone: 'Europe/Amsterdam',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const confirmationSubject = "Booking Confirmation - Hilmar van der Veen";
  const confirmationBody = `<p>Hi ${name},</p>

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

  await sendEmailViaGraph(accessToken, userEmail, {
    to: email,
    toName: name,
    subject: confirmationSubject,
    body: confirmationBody,
    isHtml: true,
  });
}

export async function POST(req: NextRequest) {
  try {
    // Get environment variables
    const clientId = process.env.MS_CLIENT_ID;
    const clientSecret = process.env.MS_CLIENT_SECRET;
    const tenantId = process.env.MS_TENANT_ID;
    const smtpUser = process.env.SMTP_USER;

    if (!clientId || !clientSecret || !tenantId || !smtpUser) {
      console.error("Missing required environment variables for booking service");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    const body = await req.json();
    const { name, email, date, message } = body as BookingData;

    if (!name || !email || !date) {
      return NextResponse.json({ error: "Missing required fields: name, email, and date are required" }, { status: 400 });
    }

    // Optional: Validate date format and ensure it's not in the past
    const bookingDate = new Date(date);
    if (isNaN(bookingDate.getTime())) {
      return NextResponse.json({ error: "Invalid date format" }, { status: 400 });
    }

    if (bookingDate < new Date()) {
      return NextResponse.json({ error: "Booking date cannot be in the past" }, { status: 400 });
    }

    // Get Microsoft Graph access token
    const token = await getMicrosoftAccessToken(clientId, clientSecret, tenantId);
    
    // Create calendar event and send confirmation email
    await createCalendarEvent(token, smtpUser, { name, email, date, message });
    await sendConfirmationEmail(token, smtpUser, { name, email, date });

    console.log(`Booking created for: ${name} (${email}) on ${new Date(date).toLocaleString()}`);

    return NextResponse.json({ success: true, message: "Booking created successfully" });
  } catch (error: unknown) {
    console.error("Booking error:", error);
    
    // Return more specific error messages for debugging (consider removing details in production)
    const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
    
    return NextResponse.json({ 
      error: errorMessage,
      ...(process.env.NODE_ENV === 'development' && { 
        details: error instanceof Error ? error.stack : String(error) 
      })
    }, { status: 500 });
  }
}
