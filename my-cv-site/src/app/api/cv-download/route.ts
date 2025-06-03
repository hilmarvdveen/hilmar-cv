import { NextRequest, NextResponse } from "next/server";
import { Client } from "@microsoft/microsoft-graph-client";
import "isomorphic-fetch";

export const runtime = "nodejs";

interface CVDownloadData {
  name: string;
  email: string;
  purpose: string;
  locale: string;
  timestamp: string;
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

async function sendEmailViaGraph(accessToken: string, emailData: {
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

  await client.api('/me/sendMail').post({ message });
}

export async function POST(request: NextRequest) {
  try {
    const data: CVDownloadData = await request.json();

    // Validate required fields
    if (!data.email || !data.name || !data.purpose) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Get environment variables
    const clientId = process.env.MS_CLIENT_ID;
    const clientSecret = process.env.MS_CLIENT_SECRET;
    const tenantId = process.env.MS_TENANT_ID;

    if (!clientId || !clientSecret || !tenantId) {
      console.error("Missing required Microsoft Graph environment variables");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Get Microsoft Graph access token
    const accessToken = await getMicrosoftAccessToken(clientId, clientSecret, tenantId);

    // Prepare email content
    const purposeMap: Record<string, { en: string; nl: string }> = {
      recruitment: { en: "Recruitment/Job Opportunity", nl: "Werving/Vacature" },
      project_inquiry: { en: "Project Inquiry", nl: "Project Aanvraag" },
      business_partnership: { en: "Business Partnership", nl: "Zakelijke Samenwerking" },
      networking: { en: "Networking", nl: "Netwerken" },
      research: { en: "Research/Information", nl: "Onderzoek/Informatie" },
      other: { en: "Other", nl: "Anders" },
    };

    const purposeText = purposeMap[data.purpose]?.[data.locale as 'en' | 'nl'] || data.purpose;

    // Send notification email to yourself
    const notificationSubject = `CV Download Lead: ${data.name}`;
    const notificationBody = `New CV Download Lead:

Name: ${data.name}
Email: ${data.email}
Purpose: ${purposeText}
Language: ${data.locale.toUpperCase()}
Timestamp: ${new Date(data.timestamp).toLocaleString('nl-NL', { timeZone: 'Europe/Amsterdam' })}

---
This lead was generated from the CV download modal on hilmarvanderveen.com`;

    await sendEmailViaGraph(accessToken, {
      to: "hilmar@hilmarvanderveen.com",
      toName: "Hilmar van der Veen",
      subject: notificationSubject,
      body: notificationBody,
      isHtml: false,
    });

    // Send thank you email to the user
    const thankYouSubject = data.locale === 'nl' 
      ? "Bedankt voor het downloaden van mijn CV"
      : "Thank you for downloading my CV";
    
    const thankYouBody = data.locale === 'nl'
      ? `<p>Hallo ${data.name},</p>

<p>Bedankt voor het downloaden van mijn CV! Ik stel je interesse zeer op prijs.</p>

<p>Als je vragen hebt of een gesprek wilt plannen, aarzel dan niet om contact met me op te nemen via:</p>
<ul>
<li>Email: <a href="mailto:hilmar@hilmarvanderveen.com">hilmar@hilmarvanderveen.com</a></li>
<li>Telefoon: <a href="tel:+31680149947">+31 6 8014 9947</a></li>
<li>LinkedIn: <a href="https://linkedin.com/in/hilmarvanderveen">linkedin.com/in/hilmarvanderveen</a></li>
</ul>

<p>Ik kijk ernaar uit om van je te horen!</p>

<p>Met vriendelijke groet,<br>
<strong>Hilmar van der Veen</strong><br>
Senior Frontend Developer</p>`
      : `<p>Hello ${data.name},</p>

<p>Thank you for downloading my CV! I really appreciate your interest.</p>

<p>If you have any questions or would like to schedule a conversation, please don't hesitate to reach out:</p>
<ul>
<li>Email: <a href="mailto:hilmar@hilmarvanderveen.com">hilmar@hilmarvanderveen.com</a></li>
<li>Phone: <a href="tel:+31680149947">+31 6 8014 9947</a></li>
<li>LinkedIn: <a href="https://linkedin.com/in/hilmarvanderveen">linkedin.com/in/hilmarvanderveen</a></li>
</ul>

<p>I look forward to hearing from you!</p>

<p>Best regards,<br>
<strong>Hilmar van der Veen</strong><br>
Senior Frontend Developer</p>`;

    await sendEmailViaGraph(accessToken, {
      to: data.email,
      toName: data.name,
      subject: thankYouSubject,
      body: thankYouBody,
      isHtml: true,
    });

    console.log(`CV download tracked: ${data.email} - ${purposeText}`);

    return NextResponse.json(
      { 
        success: true, 
        message: "CV download tracked successfully" 
      },
      { status: 200 }
    );

  } catch (error: unknown) {
    console.error("Error tracking CV download:", error);
    
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    
    return NextResponse.json(
      { 
        error: "Failed to track CV download", 
        details: errorMessage 
      },
      { status: 500 }
    );
  }
} 