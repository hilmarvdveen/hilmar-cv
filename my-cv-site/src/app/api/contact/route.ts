import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

interface ContactFormRequest {
  name: string;
  email: string;
  message: string;
  interests?: string[];
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json() as Partial<ContactFormRequest>;
    const { name, email, message, interests } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "All fields (name, email, message) are required." },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Check environment variables
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.error("Missing required environment variables: SMTP_USER or SMTP_PASS");
      return NextResponse.json(
        { error: "Server configuration error. Please contact administrator." },
        { status: 500 }
      );
    }

    // Create email transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.office365.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Prepare interests text
    const interestText = interests?.length
      ? `\n\nInteressen:\n- ${interests.join("\n- ")}`
      : "";

    // Email content
    const emailSubject = `Nieuw bericht van ${name}`;
    const emailBody = `Nieuw contactformulier bericht:

Afzender: ${name}
Email: ${email}

Bericht:
${message}${interestText}

---
Dit bericht is verzonden via het contactformulier op hilmarvanderveen.com
Tijdstempel: ${new Date().toLocaleString('nl-NL', { timeZone: 'Europe/Amsterdam' })}`;

    // Send email to yourself
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.SMTP_USER,
      subject: emailSubject,
      text: emailBody,
      replyTo: email, // This allows you to reply directly to the sender
    });

    // Optional: Send confirmation email to the sender
    const confirmationSubject = "Bedankt voor je bericht - Hilmar van der Veen";
    const confirmationBody = `Hallo ${name},

Bedankt voor je bericht! Ik heb je contactformulier ontvangen en zal binnen 24 uur reageren.

Voor dringende zaken kun je me ook direct bereiken:
- Telefoon: +31 6 8014 9947
- Email: hilmar@hilmarvanderveen.com

Met vriendelijke groet,
Hilmar van der Veen
Senior Frontend Developer

---
Dit is een automatisch gegenereerd bericht.`;

    // Send confirmation email to sender
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: confirmationSubject,
      text: confirmationBody,
    });

    console.log(`Contact form submitted by: ${name} (${email})`);

    return NextResponse.json({ 
      success: true,
      message: "Message sent successfully" 
    });

  } catch (error: unknown) {
    console.error("Contact form submission failed:", error);
    
    const errorMessage = error instanceof Error ? error.message : "Unexpected error occurred.";
    
    return NextResponse.json(
      { 
        error: "Failed to send message", 
        details: errorMessage 
      },
      { status: 500 }
    );
  }
}
