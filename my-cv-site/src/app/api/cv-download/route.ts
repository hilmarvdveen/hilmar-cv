import { NextRequest, NextResponse } from "next/server";
import { getGraphCredentials, getAccessToken, getGraphClient, sendMail } from "@/lib/graph";
import {
  escapeHtml,
  isAllowedOrigin,
  looksAutomated,
  validateFields,
  serverErrorResponse,
  LIMITS,
} from "@/lib/security";

export const runtime = "nodejs";

type CVDownloadData = {
  name: string;
  email: string;
  purpose: string;
  locale: string;
  timestamp: string;
  company_website?: string; // honeypot
  formStartedAt?: number;
}

const purposeMap: Record<string, { en: string; nl: string }> = {
  recruitment: { en: "Recruitment/Job Opportunity", nl: "Werving/Vacature" },
  project_inquiry: { en: "Project Inquiry", nl: "Project Aanvraag" },
  business_partnership: { en: "Business Partnership", nl: "Zakelijke Samenwerking" },
  networking: { en: "Networking", nl: "Netwerken" },
  research: { en: "Research/Information", nl: "Onderzoek/Informatie" },
  other: { en: "Other", nl: "Anders" },
};

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    if (!isAllowedOrigin(request)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const data = (await request.json()) as Partial<CVDownloadData>;

    if (looksAutomated(data as Record<string, unknown>, Date.now())) {
      return NextResponse.json({ success: true, message: "CV download tracked successfully" });
    }

    const validation = validateFields({
      name: { value: data.name, required: true, maxLength: LIMITS.name },
      email: { value: data.email, required: true, email: true },
      purpose: { value: data.purpose, required: true, maxLength: LIMITS.subjectLike },
    });
    if (!validation.ok) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const credentials = getGraphCredentials();
    if (!credentials) {
      console.error("Missing required Microsoft Graph environment variables");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    const accessToken = await getAccessToken(credentials);
    const client = getGraphClient(accessToken);
    const { smtpUser } = credentials;

    const name = data.name as string;
    const email = data.email as string;
    const locale = data.locale === "nl" ? "nl" : "en";
    const purposeText = purposeMap[data.purpose as string]?.[locale] || (data.purpose as string);
    const timestamp = data.timestamp ? new Date(data.timestamp) : new Date();

    // Notification to owner (plain text).
    const notificationBody = `New CV Download Lead:

Name: ${name}
Email: ${email}
Purpose: ${purposeText}
Language: ${locale.toUpperCase()}
Timestamp: ${timestamp.toLocaleString("nl-NL", { timeZone: "Europe/Amsterdam" })}

---
This lead was generated from the CV download modal on hilmarvanderveen.com`;

    await sendMail(client, smtpUser, {
      to: smtpUser,
      toName: "Hilmar van der Veen",
      subject: `CV Download Lead: ${name}`,
      body: notificationBody,
      isHtml: false,
    });

    // Thank-you to the user (HTML — escape user name).
    const safeName = escapeHtml(name);
    const thankYouBody =
      locale === "nl"
        ? `<p>Hallo ${safeName},</p>

<p>Bedankt voor het downloaden van mijn CV! Ik stel je interesse zeer op prijs.</p>

<p>Als je vragen hebt of een gesprek wilt plannen, aarzel dan niet om contact met me op te nemen via:</p>
<ul>
<li>Email: <a href="mailto:${smtpUser}">${smtpUser}</a></li>
<li>Telefoon: <a href="tel:+31680149947">+31 6 8014 9947</a></li>
<li>LinkedIn: <a href="https://linkedin.com/in/hilmarvanderveen">linkedin.com/in/hilmarvanderveen</a></li>
</ul>

<p>Ik kijk ernaar uit om van je te horen!</p>

<p>Met vriendelijke groet,<br>
<strong>Hilmar van der Veen</strong><br>
Senior Frontend Developer</p>`
        : `<p>Hello ${safeName},</p>

<p>Thank you for downloading my CV! I really appreciate your interest.</p>

<p>If you have any questions or would like to schedule a conversation, please don't hesitate to reach out:</p>
<ul>
<li>Email: <a href="mailto:${smtpUser}">${smtpUser}</a></li>
<li>Phone: <a href="tel:+31680149947">+31 6 8014 9947</a></li>
<li>LinkedIn: <a href="https://linkedin.com/in/hilmarvanderveen">linkedin.com/in/hilmarvanderveen</a></li>
</ul>

<p>I look forward to hearing from you!</p>

<p>Best regards,<br>
<strong>Hilmar van der Veen</strong><br>
Senior Frontend Developer</p>`;

    await sendMail(client, smtpUser, {
      to: email,
      toName: name,
      subject:
        locale === "nl"
          ? "Bedankt voor het downloaden van mijn CV"
          : "Thank you for downloading my CV",
      body: thankYouBody,
      isHtml: true,
    });

    console.log(`CV download tracked: ${email} - ${purposeText}`);

    return NextResponse.json(
      { success: true, message: "CV download tracked successfully" },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error tracking CV download:", error);
    return serverErrorResponse(error, "Failed to track CV download");
  }
}
