import { escapeHtml } from "@/lib/security";

export type EmailLocale = "nl" | "en";

export type RenderedEmail = {
  subject: string;
  html: string;
};

export type BookingEmailInput = {
  locale: EmailLocale;
  name: string;
  email: string;
  company: string;
  topic: string;
  isoDate: string;
};

const BOOKING_TIMEZONE = "Europe/Amsterdam";
const BRAND_NAVY = "#12314e";
const BRAND_EMERALD = "#047857";
const FONT_STACK =
  "-apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

export function formatBookingMoment(isoDate: string, locale: EmailLocale): string {
  return new Intl.DateTimeFormat(locale === "nl" ? "nl-NL" : "en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: BOOKING_TIMEZONE,
  }).format(new Date(isoDate));
}

function renderLayout(bodyHtml: string, footerText: string): string {
  return `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background-color:#f3f4f6;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f3f4f6;">
<tr><td align="center" style="padding:24px 12px;">
<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="width:560px;max-width:100%;background-color:#ffffff;border-radius:12px;overflow:hidden;font-family:${FONT_STACK};">
<tr><td style="background-color:${BRAND_NAVY};padding:22px 28px;">
<p style="margin:0;font-size:18px;font-weight:700;color:#ffffff;">Hilmar van der Veen</p>
<p style="margin:4px 0 0;font-size:13px;color:#6ee7b7;">Senior Frontend Engineer</p>
</td></tr>
<tr><td style="padding:28px;font-size:15px;line-height:1.65;color:#1f2937;">${bodyHtml}</td></tr>
<tr><td style="padding:18px 28px;background-color:#f9fafb;border-top:1px solid #e5e7eb;">
<p style="margin:0;font-size:12px;line-height:1.6;color:#6b7280;">Hilmar ICT Services · KVK 97564303 · Zandvoort NL<br>
<a href="https://www.hilmarvanderveen.com" style="color:${BRAND_EMERALD};">hilmarvanderveen.com</a> · <a href="tel:+31680149947" style="color:${BRAND_EMERALD};text-decoration:none;">+31 6 8014 9947</a></p>
<p style="margin:8px 0 0;font-size:12px;color:#9ca3af;">${footerText}</p>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

function renderMomentBlock(momentText: string, captionText: string): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:18px 0;">
<tr><td style="background-color:#ecfdf5;border-left:3px solid ${BRAND_EMERALD};border-radius:0 8px 8px 0;padding:14px 18px;">
<p style="margin:0;font-size:16px;font-weight:700;color:${BRAND_NAVY};">${momentText}</p>
<p style="margin:4px 0 0;font-size:13px;color:#6b7280;">${captionText}</p>
</td></tr>
</table>`;
}

function renderDetailRow(label: string, valueHtml: string): string {
  return `<tr>
<td style="padding:6px 16px 6px 0;font-size:13px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.4px;white-space:nowrap;vertical-align:top;">${label}</td>
<td style="padding:6px 0;font-size:15px;color:#1f2937;">${valueHtml}</td>
</tr>`;
}

const CONFIRMATION_COPY = {
  nl: {
    subject: (moment: string) => `Bevestigd: ons gesprek op ${moment}`,
    greeting: (name: string) => `Hi ${name},`,
    intro: "Ons gesprek is bevestigd:",
    momentCaption: "30 minuten · tijd in Amsterdam",
    expectTitle: "Waar je op kunt rekenen",
    expectations: [
      "Dertig minuten, technisch en concreet.",
      "Neem mee wat moet veranderen en waar het nu op draait.",
      "Aan het einde weet je of ik de juiste persoon ben en wat de eerste stap is.",
    ],
    next: "De agenda-uitnodiging komt in een aparte e-mail. Verzetten of een vraag? Beantwoord deze mail, dan regelen we het.",
    signoff: "Tot dan,",
    footer: "Dit is een automatische bevestiging van je boeking.",
  },
  en: {
    subject: (moment: string) => `Confirmed: our call on ${moment}`,
    greeting: (name: string) => `Hi ${name},`,
    intro: "Our call is confirmed:",
    momentCaption: "30 minutes · Amsterdam time",
    expectTitle: "What you can count on",
    expectations: [
      "Thirty minutes, technical and concrete.",
      "Bring what has to change and what it runs on today.",
      "At the end you know whether I am the right person for it and what the first step is.",
    ],
    next: "The calendar invitation arrives in a separate email. Need to reschedule or have a question? Reply to this email and we will sort it out.",
    signoff: "See you then,",
    footer: "This is an automated confirmation of your booking.",
  },
} as const;

export function renderBookingConfirmationEmail(input: BookingEmailInput): RenderedEmail {
  const copy = CONFIRMATION_COPY[input.locale];
  const moment = formatBookingMoment(input.isoDate, input.locale);
  const name = escapeHtml(input.name);
  const bullets = copy.expectations
    .map(
      (item) =>
        `<li style="margin:0 0 6px;font-size:15px;line-height:1.6;color:#1f2937;">${item}</li>`
    )
    .join("");
  const bodyHtml = `<p style="margin:0 0 14px;">${copy.greeting(name)}</p>
<p style="margin:0;">${copy.intro}</p>
${renderMomentBlock(escapeHtml(moment), copy.momentCaption)}
<p style="margin:0 0 8px;font-weight:700;color:${BRAND_NAVY};">${copy.expectTitle}</p>
<ul style="margin:0 0 18px;padding-left:20px;">${bullets}</ul>
<p style="margin:0 0 18px;">${copy.next}</p>
<p style="margin:0;">${copy.signoff}<br><strong>Hilmar van der Veen</strong></p>`;
  return {
    subject: copy.subject(moment),
    html: renderLayout(bodyHtml, copy.footer),
  };
}

const NOT_PROVIDED = { nl: "Niet opgegeven", en: "Not provided" } as const;
const LANGUAGE_NAME = { nl: "Nederlands", en: "Engels" } as const;

export function renderBookingNotificationEmail(input: BookingEmailInput): RenderedEmail {
  const moment = formatBookingMoment(input.isoDate, "nl");
  const name = escapeHtml(input.name);
  const email = escapeHtml(input.email);
  const company = input.company ? escapeHtml(input.company) : NOT_PROVIDED.nl;
  const topic = input.topic ? escapeHtml(input.topic) : NOT_PROVIDED.nl;
  const rows = [
    renderDetailRow("Wanneer", `<strong>${escapeHtml(moment)}</strong>`),
    renderDetailRow("Wie", name),
    renderDetailRow(
      "E-mail",
      `<a href="mailto:${email}" style="color:${BRAND_EMERALD};">${email}</a>`
    ),
    renderDetailRow("Bedrijf", company),
    renderDetailRow("Onderwerp", topic),
    renderDetailRow("Taal", LANGUAGE_NAME[input.locale]),
  ].join("");
  const bodyHtml = `<p style="margin:0 0 14px;">Nieuwe boeking via de site. De uitnodiging staat in de agenda en ${name} heeft een bevestiging ontvangen.</p>
<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 18px;">${rows}</table>
<p style="margin:0;">Beantwoord deze mail om direct bij ${name} uit te komen.</p>`;
  return {
    subject: `Nieuwe boeking: ${input.name}, ${moment}`,
    html: renderLayout(bodyHtml, "Automatische melding van het boekingsformulier."),
  };
}

export function renderBookingCalendarEvent(input: BookingEmailInput): RenderedEmail {
  const notProvided = NOT_PROVIDED[input.locale];
  const company = input.company ? escapeHtml(input.company) : notProvided;
  const topic = input.topic ? escapeHtml(input.topic) : notProvided;
  const name = escapeHtml(input.name);
  const email = escapeHtml(input.email);
  const labels =
    input.locale === "nl"
      ? { intro: "30 minuten, ingepland via hilmarvanderveen.com.", topic: "Onderwerp", company: "Bedrijf", contact: "Contact" }
      : { intro: "30 minutes, scheduled via hilmarvanderveen.com.", topic: "Topic", company: "Company", contact: "Contact" };
  const subject =
    input.locale === "nl"
      ? `Kennismaking: Hilmar van der Veen en ${input.name}`
      : `Intro call: Hilmar van der Veen and ${input.name}`;
  const html = `<p>${labels.intro}</p>
<p><strong>${labels.topic}:</strong> ${topic}<br>
<strong>${labels.company}:</strong> ${company}<br>
<strong>${labels.contact}:</strong> ${name}, <a href="mailto:${email}">${email}</a></p>`;
  return { subject, html };
}
