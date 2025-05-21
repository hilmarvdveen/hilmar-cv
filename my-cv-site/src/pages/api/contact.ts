import type { NextApiRequest, NextApiResponse } from "next";
import { Resend } from "resend";

interface ContactFormRequest {
  name: string;
  email: string;
  message: string;
  interests?: string[];
}

const resendApiKey = process.env.RESEND_API_KEY!;
const emailFrom = process.env.EMAIL_FROM!;
const emailTo = process.env.EMAIL_TO!;

if (!resendApiKey || !emailFrom || !emailTo) {
  throw new Error("EMAIL_FROM, or EMAIL_TO env variables.");
}

const resend = new Resend(resendApiKey);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ success?: boolean; error?: string }>
): Promise<void> {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  const { name, email, message, interests } = req.body as Partial<ContactFormRequest>;

  if (!name || !email || !message) {
    res.status(400).json({ error: "All fields (name, email, message) are required." });
    return;
  }

  try {
    const interestText = interests?.length
      ? `\n\nInteresses:\n- ${interests.join("\n- ")}`
      : "";

    await resend.emails.send({
      from: emailFrom,
      to: emailTo,
      subject: `Nieuw bericht van ${name}`,
      replyTo: email,
      text: `Afzender: ${name}\nEmail: ${email}\n\nBericht:\n${message}${interestText}`,
    });

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Email sending failed:", err);
    const error = err instanceof Error ? err.message : "Unexpected error occurred.";
    res.status(500).json({ error });
  }
}
