// app/api/booking/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Client } from "@microsoft/microsoft-graph-client";
import "isomorphic-fetch";
import nodemailer from 'nodemailer';

export const runtime = "nodejs"; // Ensures Node.js runtime, not Edge

const BOOKING_EMAIL = "hilmar@hilmarvanderveen.com";

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

async function createCalendarEvent(accessToken: string, { name, email, date, message }: BookingData) {
  const client = Client.init({
    authProvider: (done) => done(null, accessToken),
  });

  // Parse date once and create both start and end in ISO format
  const startDate = new Date(date);
  const endDate = new Date(startDate.getTime() + 30 * 60000); // 30 minutes later

  await client.api(`/users/${BOOKING_EMAIL}/events`).post({
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

async function sendConfirmationEmail({ name, email, date }: BookingData, smtpUser: string, smtpPass: string) {
  // Use explicit SMTP settings for better compatibility on Vercel
  const transporter = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    secure: false, // Use STARTTLS
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  await transporter.sendMail({
    from: `Hilmar van der Veen <${smtpUser}>`,
    to: email,
    subject: "Booking Confirmation",
    html: `<p>Hi ${name},</p><p>Your booking has been scheduled for <strong>${new Date(date).toLocaleString('nl-NL', { timeZone: 'Europe/Amsterdam' })}</strong>.</p><p>We'll contact you soon!</p>`,
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

    // Create calendar event and send confirmation email
    const token = await getMicrosoftAccessToken(clientId, clientSecret, tenantId);
    await createCalendarEvent(token, { name, email, date, message });
    await sendConfirmationEmail({ name, email, date }, smtpUser, smtpPass);

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
