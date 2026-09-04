import { NextRequest, NextResponse } from "next/server";
import { getGraphCredentials, getAccessToken, getGraphClient, sendMail } from "@/lib/graph";
import { renderContactConfirmationEmail, type EmailLocale } from "@/lib/email";
import {
  isAllowedOrigin,
  enforceRateLimit,
  looksAutomated,
  validateFields,
  validateStringArray,
  serverErrorResponse,
  LIMITS,
} from "@/lib/security";

export const runtime = "nodejs";

type ContactFormRequest = {
  name: string;
  email: string;
  message: string;
  interests?: string[];
  locale?: string;
  company_website?: string;
  formStartedAt?: number;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    if (!isAllowedOrigin(request)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const limited = enforceRateLimit(request, "email");
    if (limited) return limited;

    const body = (await request.json()) as Partial<ContactFormRequest>;
    const { name, email, message, interests } = body;
    const locale: EmailLocale = body.locale === "nl" ? "nl" : "en";

    if (looksAutomated(body as Record<string, unknown>, Date.now())) {
      return NextResponse.json({ success: true, message: "Message sent successfully" });
    }

    const validation = validateFields({
      name: { value: name, required: true, maxLength: LIMITS.name },
      email: { value: email, required: true, email: true },
      message: { value: message, required: true, maxLength: LIMITS.message },
    });
    if (!validation.ok) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }
    const interestsCheck = validateStringArray(interests);
    if (!interestsCheck.ok) {
      return NextResponse.json({ error: interestsCheck.error }, { status: 400 });
    }

    const credentials = getGraphCredentials();
    if (!credentials) {
      console.error("Missing required Microsoft Graph environment variables");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    const accessToken = await getAccessToken(credentials);
    const client = getGraphClient(accessToken);
    const { smtpUser } = credentials;

    const safeName = name as string;
    const safeEmail = email as string;
    const safeMessage = message as string;

    const interestText = interests?.length
      ? `\n\nInteressen:\n- ${interests.join("\n- ")}`
      : "";

    const notificationBody = `Nieuw contactformulier bericht:

Afzender: ${safeName}
Email: ${safeEmail}

Bericht:
${safeMessage}${interestText}

---
Dit bericht is verzonden via het contactformulier op hilmarvanderveen.com
Tijdstempel: ${new Date().toLocaleString("nl-NL", { timeZone: "Europe/Amsterdam" })}`;

    await sendMail(client, smtpUser, {
      to: smtpUser,
      toName: "Hilmar van der Veen",
      subject: `Nieuw bericht van ${safeName}`,
      body: notificationBody,
      isHtml: false,
      replyTo: safeEmail,
      replyToName: safeName,
    });

    const confirmation = renderContactConfirmationEmail({ locale, name: safeName });

    await sendMail(client, smtpUser, {
      to: safeEmail,
      toName: safeName,
      subject: confirmation.subject,
      body: confirmation.html,
      isHtml: true,
    });

    console.log(`Contact form submitted by: ${safeName} (${safeEmail})`);

    return NextResponse.json({ success: true, message: "Message sent successfully" });
  } catch (error: unknown) {
    console.error("Contact form submission failed:", error);
    return serverErrorResponse(error, "Failed to send message");
  }
}
