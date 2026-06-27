import { NextRequest, NextResponse } from "next/server";
import { getGraphCredentials, getAccessToken, getGraphClient, sendMail } from "@/lib/graph";
import {
  escapeHtml,
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
  company_website?: string; // honeypot
  formStartedAt?: number;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // 1. Reject cross-origin / CSRF-style requests up front.
    if (!isAllowedOrigin(request)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 2. Per-IP rate limit (spam / mailbomb / denial-of-wallet).
    const limited = enforceRateLimit(request, "email");
    if (limited) return limited;

    const body = (await request.json()) as Partial<ContactFormRequest>;
    const { name, email, message, interests } = body;

    // 2. Bot mitigation (honeypot + timing) — respond 200 to avoid signalling.
    if (looksAutomated(body as Record<string, unknown>, Date.now())) {
      return NextResponse.json({ success: true, message: "Message sent successfully" });
    }

    // 3. Validate and length-cap all input.
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

    // Notification to the site owner (plain text — no escaping needed).
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

    // Confirmation to the sender (HTML — user values must be escaped).
    const confirmationBody = `<p>Hallo ${escapeHtml(safeName)},</p>

<p>Bedankt voor je bericht! Ik heb je contactformulier ontvangen en zal binnen 24 uur reageren.</p>

<p>Voor dringende zaken kun je me ook direct bereiken:</p>
<ul>
<li>Telefoon: <a href="tel:+31680149947">+31 6 8014 9947</a></li>
<li>Email: <a href="mailto:${smtpUser}">${smtpUser}</a></li>
<li>LinkedIn: <a href="https://www.linkedin.com/in/hilmar-van-der-veen/">linkedin.com/in/hilmar-van-der-veen</a></li>
</ul>

<p>Met vriendelijke groet,<br>
<strong>Hilmar van der Veen</strong><br>
Senior Frontend Developer</p>

<hr>
<p><small>Dit is een automatisch gegenereerd bericht.</small></p>`;

    await sendMail(client, smtpUser, {
      to: safeEmail,
      toName: safeName,
      subject: "Bedankt voor je bericht - Hilmar van der Veen",
      body: confirmationBody,
      isHtml: true,
    });

    console.log(`Contact form submitted by: ${safeName} (${safeEmail})`);

    return NextResponse.json({ success: true, message: "Message sent successfully" });
  } catch (error: unknown) {
    console.error("Contact form submission failed:", error);
    return serverErrorResponse(error, "Failed to send message");
  }
}
