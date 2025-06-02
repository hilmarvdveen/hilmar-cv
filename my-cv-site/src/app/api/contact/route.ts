import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

interface ContactFormRequest {
  name: string;
  email: string;
  message: string;
  interests?: string[];
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const resendApiKey = process.env.RESEND_API_KEY;
    const emailFrom = process.env.EMAIL_FROM;
    const emailTo = process.env.EMAIL_TO;

    if (!resendApiKey || !emailFrom || !emailTo) {
      console.error("Missing required environment variables: RESEND_API_KEY, EMAIL_FROM, or EMAIL_TO");
      return NextResponse.json(
        { error: "Server configuration error. Please contact administrator." },
        { status: 500 }
      );
    }

    const resend = new Resend(resendApiKey);

    const body = await request.json() as Partial<ContactFormRequest>;
    const { name, email, message, interests } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "All fields (name, email, message) are required." },
        { status: 400 }
      );
    }

    const interestText = interests?.length
      ? `\n\nInteressen:\n- ${interests.join("\n- ")}`
      : "";

    await resend.emails.send({
      from: emailFrom,
      to: emailTo,
      subject: `Nieuw bericht van ${name}`,
      replyTo: email,
      text: `Afzender: ${name}\nEmail: ${email}\n\nBericht:\n${message}${interestText}`,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Email sending failed:", err);
    const error = err instanceof Error ? err.message : "Unexpected error occurred.";
    return NextResponse.json(
      { error },
      { status: 500 }
    );
  }
}
