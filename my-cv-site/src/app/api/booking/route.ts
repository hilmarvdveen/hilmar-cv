// app/api/booking/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Client } from "@microsoft/microsoft-graph-client";
import "isomorphic-fetch";
import nodemailer from 'nodemailer';

const BOOKING_EMAIL = "booking@hilmarvanderveen.com";

interface BookingData {
  name: string;
  email: string;
  date: string;
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
  return data.access_token;
}

async function createCalendarEvent(accessToken: string, { name, email, date, message }: BookingData) {
  const client = Client.init({
    authProvider: (done) => done(null, accessToken),
  });

  await client.api(`/users/${BOOKING_EMAIL}/events`).post({
    subject: `New Booking from ${name}`,
    body: {
      contentType: "HTML",
      content: `Booking message: ${message || "(no message)"}`,
    },
    start: {
      dateTime: date,
      timeZone: "Europe/Amsterdam",
    },
    end: {
      dateTime: new Date(new Date(date).getTime() + 30 * 60000).toISOString(),
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

async function sendConfirmationEmail({ name, email, date }: BookingData, smtpUser: string, smtpPass: string) {
  const transporter = nodemailer.createTransport({
    service: "Office365",
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  await transporter.sendMail({
    from: `Hilmar van der Veen <${smtpUser}>`,
    to: email,
    subject: "Booking Confirmation",
    html: `<p>Hi ${name},</p><p>Your booking has been scheduled for <strong>${new Date(date).toLocaleString('nl-NL')}</strong>.</p><p>We'll contact you soon!</p>`,
  });
}

export async function POST(req: NextRequest) {
  try {
    // Get environment variables
    const clientId = process.env.MS_CLIENT_ID;
    const clientSecret = process.env.MS_CLIENT_SECRET;
    const tenantId = process.env.MS_TENANT_ID;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (!clientId || !clientSecret || !tenantId || !smtpUser || !smtpPass) {
      console.error("Missing required environment variables for booking service");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    const body = await req.json();
    const { name, email, date, message } = body;

    if (!name || !email || !date) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const token = await getMicrosoftAccessToken(clientId, clientSecret, tenantId);
    await createCalendarEvent(token, { name, email, date, message });
    await sendConfirmationEmail({ name, email, date }, smtpUser, smtpPass);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Booking error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
