import { NextRequest, NextResponse } from "next/server";
import { Client } from "@microsoft/microsoft-graph-client";
import "isomorphic-fetch";

export const runtime = "nodejs";

interface ContactFormRequest {
  name: string;
  email: string;
  message: string;
  interests?: string[];
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
  replyTo?: string;
  replyToName?: string;
}) {
  const client = Client.init({
    authProvider: (done) => done(null, accessToken),
  });

  interface EmailMessage {
    subject: string;
    body: {
      contentType: string;
      content: string;
    };
    toRecipients: Array<{
      emailAddress: {
        address: string;
        name: string;
      };
    }>;
    replyTo?: Array<{
      emailAddress: {
        address: string;
        name: string;
      };
    }>;
  }

  const message: EmailMessage = {
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

  // Add reply-to if specified
  if (emailData.replyTo) {
    message.replyTo = [
      {
        emailAddress: {
          address: emailData.replyTo,
          name: emailData.replyToName || emailData.replyTo,
        },
      },
    ];
  }

  // Use specific user email instead of /me for application authentication
  await client.api(`/users/${process.env.SMTP_USER}/sendMail`).post({ message });
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

    // Prepare interests text
    const interestText = interests?.length
      ? `\n\nInteressen:\n- ${interests.join("\n- ")}`
      : "";

    // Send notification email to yourself
    const notificationSubject = `Nieuw bericht van ${name}`;
    const notificationBody = `Nieuw contactformulier bericht:

Afzender: ${name}
Email: ${email}

Bericht:
${message}${interestText}

---
Dit bericht is verzonden via het contactformulier op hilmarvanderveen.com
Tijdstempel: ${new Date().toLocaleString('nl-NL', { timeZone: 'Europe/Amsterdam' })}`;

    await sendEmailViaGraph(accessToken, {
      to: "hilmar@hilmarvanderveen.com",
      toName: "Hilmar van der Veen",
      subject: notificationSubject,
      body: notificationBody,
      isHtml: false,
      replyTo: email,
      replyToName: name,
    });

    // Send confirmation email to the sender
    const confirmationSubject = "Bedankt voor je bericht - Hilmar van der Veen";
    const confirmationBody = `<p>Hallo ${name},</p>

<p>Bedankt voor je bericht! Ik heb je contactformulier ontvangen en zal binnen 24 uur reageren.</p>

<p>Voor dringende zaken kun je me ook direct bereiken:</p>
<ul>
<li>Telefoon: <a href="tel:+31680149947">+31 6 8014 9947</a></li>
<li>Email: <a href="mailto:hilmar@hilmarvanderveen.com">hilmar@hilmarvanderveen.com</a></li>
<li>LinkedIn: <a href="https://linkedin.com/in/hilmarvanderveen">linkedin.com/in/hilmarvanderveen</a></li>
</ul>

<p>Met vriendelijke groet,<br>
<strong>Hilmar van der Veen</strong><br>
Senior Frontend Developer</p>

<hr>
<p><small>Dit is een automatisch gegenereerd bericht.</small></p>`;

    await sendEmailViaGraph(accessToken, {
      to: email,
      toName: name,
      subject: confirmationSubject,
      body: confirmationBody,
      isHtml: true,
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
