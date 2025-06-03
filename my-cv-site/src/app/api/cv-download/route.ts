import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

interface CVDownloadData {
  name: string;
  email: string;
  purpose: string;
  locale: string;
  timestamp: string;
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

    // Create email transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.office365.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS ,
      },
    });

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

    const emailSubject = `CV Download Lead: ${data.name}`;
    const emailBody = `
New CV Download Lead:

Name: ${data.name}
Email: ${data.email}
Purpose: ${purposeText}
Language: ${data.locale.toUpperCase()}
Timestamp: ${new Date(data.timestamp).toLocaleString()}

---
This lead was generated from the CV download modal on hilmarvanderveen.com
    `;

    // Send notification email to yourself
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.SMTP_USER, // Send to yourself
      subject: emailSubject,
      text: emailBody,
    });

    // Optional: Send thank you email to the user
    const thankYouSubject = data.locale === 'nl' 
      ? "Bedankt voor het downloaden van mijn CV"
      : "Thank you for downloading my CV";
    
    const thankYouBody = data.locale === 'nl'
      ? `Hallo ${data.name},

Bedankt voor het downloaden van mijn CV! Ik stel je interesse zeer op prijs.

Als je vragen hebt of een gesprek wilt plannen, aarzel dan niet om contact met me op te nemen via:
- Email: hilmar@hilmarvanderveen.com
- LinkedIn: linkedin.com/in/hilmarvanderveen

Ik kijk ernaar uit om van je te horen!

Met vriendelijke groet,
Hilmar van der Veen
Senior Frontend Developer`
      : `Hello ${data.name},

Thank you for downloading my CV! I really appreciate your interest.

If you have any questions or would like to schedule a conversation, please don't hesitate to reach out:
- Email: hilmar@hilmarvanderveen.com
- LinkedIn: linkedin.com/in/hilmarvanderveen

I look forward to hearing from you!

Best regards,
Hilmar van der Veen
Senior Frontend Developer`;

    // Send thank you email (optional - you can enable this if desired)
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: data.email,
      subject: thankYouSubject,
      text: thankYouBody,
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