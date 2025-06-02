// app/api/booking/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Client } from "@microsoft/microsoft-graph-client";
import "isomorphic-fetch";
import nodemailer from 'nodemailer';

// This should be stored securely (e.g. in Vercel environment variables)
const MICROSOFT_CLIENT_ID = process.env.MS_CLIENT_ID!;
const MICROSOFT_CLIENT_SECRET = process.env.MS_CLIENT_SECRET!;
const MICROSOFT_TENANT_ID = process.env.MS_TENANT_ID!;
const BOOKING_EMAIL = "booking@hilmarvanderveen.com";
const SMTP_USER = process.env.SMTP_USER!;
const SMTP_PASS = process.env.SMTP_PASS!;

interface BookingData {
  name: string;
  email: string;
  date: string;
  message?: string;
}

async function getMicrosoftAccessToken() {
  const res = await fetch(`https://login.microsoftonline.com/${MICROSOFT_TENANT_ID}/oauth2/v2.0/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: MICROSOFT_CLIENT_ID,
      client_secret: MICROSOFT_CLIENT_SECRET,
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

async function sendConfirmationEmail({ name, email, date }: BookingData) {
  const transporter = nodemailer.createTransport({
    service: "Office365",
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: `Hilmar van der Veen <${SMTP_USER}>`,
    to: email,
    subject: "Booking Confirmation",
    html: `<p>Hi ${name},</p><p>Your booking has been scheduled for <strong>${new Date(date).toLocaleString('nl-NL')}</strong>.</p><p>We'll contact you soon!</p>`,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, date, message } = body;

    if (!name || !email || !date) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const token = await getMicrosoftAccessToken();
    await createCalendarEvent(token, { name, email, date, message });
    await sendConfirmationEmail({ name, email, date });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Booking error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
