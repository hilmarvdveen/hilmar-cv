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
  joinUrl?: string;
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

const PREHEADER_PADDING = "‌".repeat(60);

type LayoutInput = {
  locale: EmailLocale;
  preheader: string;
  bodyHtml: string;
  footerText: string;
};

function renderLayout({ locale, preheader, bodyHtml, footerText }: LayoutInput): string {
  return `<!DOCTYPE html>
<html lang="${locale}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light dark">
<meta name="supported-color-schemes" content="light dark">
</head>
<body style="margin:0;padding:0;background-color:#f3f4f6;">
<div style="display:none;max-height:0;max-width:0;overflow:hidden;opacity:0;font-size:1px;line-height:1px;color:#f3f4f6;mso-hide:all;">${preheader}${PREHEADER_PADDING}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f3f4f6;">
<tr><td align="center" style="padding:24px 12px;">
<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="width:560px;max-width:100%;background-color:#ffffff;border-radius:12px;overflow:hidden;font-family:${FONT_STACK};">
<tr><td style="background-color:${BRAND_NAVY};padding:22px 28px;">
<p style="margin:0;font-size:18px;font-weight:700;color:#ffffff;">Hilmar van der Veen</p>
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

function renderButtonBlock(buttonLabel: string, targetUrl: string): string {
  const url = escapeHtml(targetUrl);
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:18px 0;">
<tr><td style="border-radius:8px;background-color:${BRAND_EMERALD};padding:12px 24px;">
<a href="${url}" style="display:block;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;">${buttonLabel}</a>
</td></tr>
</table>`;
}

function renderFallbackLink(linkLabel: string, targetUrl: string): string {
  const url = escapeHtml(targetUrl);
  return `<p style="margin:0 0 18px;font-size:12px;line-height:1.6;color:#6b7280;word-break:break-all;">${linkLabel} <a href="${url}" style="color:${BRAND_EMERALD};">${url}</a></p>`;
}

function renderTextLinkLine(introText: string, linkLabel: string, targetUrl: string): string {
  const url = escapeHtml(targetUrl);
  return `<p style="margin:0 0 18px;">${introText} <a href="${url}" style="color:${BRAND_EMERALD};font-weight:700;">${linkLabel}</a></p>`;
}

function renderActionBlock(buttonLabel: string, linkLabel: string, joinUrl: string): string {
  return `${renderButtonBlock(buttonLabel, joinUrl)}
${renderFallbackLink(linkLabel, joinUrl)}`;
}

const CONFIRMATION_COPY = {
  nl: {
    subject: (moment: string) => `Bevestigd: ons gesprek op ${moment}`,
    greeting: (name: string) => `Hi ${name},`,
    intro: "Ons gesprek is bevestigd:",
    momentCaption: "30 minuten · tijd in Amsterdam",
    reschedule:
      "Komt het toch niet uit? Beantwoord deze mail, dan kiezen we een nieuw moment.",
    expectTitle: "Waar je op kunt rekenen",
    expectations: [
      "Dertig minuten, technisch en concreet.",
      "Neem mee wat moet veranderen en waar het nu op draait.",
      "Aan het einde weet je of ik de juiste persoon ben en wat de eerste stap is.",
    ],
    next: "De agenda-uitnodiging komt in een aparte e-mail. Verzetten of een vraag? Beantwoord deze mail, dan regelen we het.",
    preheader: (moment: string) => `Ons gesprek staat vast op ${moment}. De agenda-uitnodiging volgt apart.`,
    signoff: "Tot dan,",
    footer: "Dit is een automatische bevestiging van je boeking.",
    joinButtonLabel: "Deelnemen aan het Teams-gesprek",
    joinLinkLabel: "Werkt de knop niet? Kopieer deze link:",
  },
  en: {
    subject: (moment: string) => `Confirmed: our call on ${moment}`,
    greeting: (name: string) => `Hi ${name},`,
    intro: "Our call is confirmed:",
    momentCaption: "30 minutes · Amsterdam time",
    reschedule: "Need another moment? Reply to this email and we pick a new one.",
    expectTitle: "What you can count on",
    expectations: [
      "Thirty minutes, technical and concrete.",
      "Bring what has to change and what it runs on today.",
      "At the end you know whether I am the right person for it and what the first step is.",
    ],
    next: "The calendar invitation arrives in a separate email. Need to reschedule or have a question? Reply to this email and we will sort it out.",
    preheader: (moment: string) => `Our call is set for ${moment}. The calendar invitation follows separately.`,
    signoff: "See you then,",
    footer: "This is an automated confirmation of your booking.",
    joinButtonLabel: "Join the Teams call",
    joinLinkLabel: "If the button does not work, copy this link:",
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
  const joinBlock = input.joinUrl
    ? renderActionBlock(copy.joinButtonLabel, copy.joinLinkLabel, input.joinUrl)
    : "";
  const bodyHtml = `<p style="margin:0 0 14px;">${copy.greeting(name)}</p>
<p style="margin:0;">${copy.intro}</p>
${renderMomentBlock(escapeHtml(moment), copy.momentCaption)}
${joinBlock}<p style="margin:0 0 18px;font-size:14px;color:#4b5563;">${copy.reschedule}</p>
<p style="margin:0 0 8px;font-weight:700;color:${BRAND_NAVY};">${copy.expectTitle}</p>
<ul style="margin:0 0 18px;padding-left:20px;">${bullets}</ul>
<p style="margin:0 0 18px;">${copy.next}</p>
<p style="margin:0;">${copy.signoff}<br><strong>Hilmar van der Veen</strong></p>`;
  return {
    subject: copy.subject(moment),
    html: renderLayout({
      locale: input.locale,
      preheader: copy.preheader(moment),
      bodyHtml,
      footerText: copy.footer,
    }),
  };
}

export type BookingReminderEmailInput = {
  locale: EmailLocale;
  name: string;
  isoDate: string;
  joinUrl?: string;
};

const REMINDER_COPY = {
  nl: {
    subject: (moment: string) => `Herinnering: ons gesprek op ${moment}`,
    greeting: (name: string) => `Hi ${name},`,
    intro: "Een herinnering voor ons gesprek morgen:",
    momentCaption: "30 minuten · tijd in Amsterdam",
    reschedule:
      "Komt het toch niet uit? Beantwoord deze mail, dan kiezen we een nieuw moment.",
    signoff: "Tot morgen,",
    preheader: (moment: string) => `Morgen spreken we elkaar, ${moment}.`,
    footer: "Dit is een automatische herinnering aan je boeking.",
    joinButtonLabel: "Deelnemen aan het Teams-gesprek",
    joinLinkLabel: "Werkt de knop niet? Kopieer deze link:",
  },
  en: {
    subject: (moment: string) => `Reminder: our call on ${moment}`,
    greeting: (name: string) => `Hi ${name},`,
    intro: "A reminder for our call tomorrow:",
    momentCaption: "30 minutes · Amsterdam time",
    reschedule: "Need another moment? Reply to this email and we pick a new one.",
    signoff: "See you tomorrow,",
    preheader: (moment: string) => `We speak tomorrow, ${moment}.`,
    footer: "This is an automated reminder of your booking.",
    joinButtonLabel: "Join the Teams call",
    joinLinkLabel: "If the button does not work, copy this link:",
  },
} as const;

export function renderBookingReminderEmail(
  input: BookingReminderEmailInput
): RenderedEmail {
  const copy = REMINDER_COPY[input.locale];
  const moment = formatBookingMoment(input.isoDate, input.locale);
  const name = escapeHtml(input.name);
  const joinBlock = input.joinUrl
    ? renderActionBlock(copy.joinButtonLabel, copy.joinLinkLabel, input.joinUrl)
    : "";
  const bodyHtml = `<p style="margin:0 0 14px;">${copy.greeting(name)}</p>
<p style="margin:0;">${copy.intro}</p>
${renderMomentBlock(escapeHtml(moment), copy.momentCaption)}
${joinBlock}<p style="margin:0 0 18px;font-size:14px;color:#4b5563;">${copy.reschedule}</p>
<p style="margin:0;">${copy.signoff}<br><strong>Hilmar van der Veen</strong></p>`;
  return {
    subject: copy.subject(moment),
    html: renderLayout({
      locale: input.locale,
      preheader: copy.preheader(moment),
      bodyHtml,
      footerText: copy.footer,
    }),
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
  const joinUrl = input.joinUrl ? escapeHtml(input.joinUrl) : undefined;
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
    joinUrl
      ? renderDetailRow(
          "Teams",
          `<a href="${joinUrl}" style="color:${BRAND_EMERALD};word-break:break-all;">${joinUrl}</a>`
        )
      : "",
  ].join("");
  const bodyHtml = `<p style="margin:0 0 14px;">Nieuwe boeking via de site. De uitnodiging staat in de agenda en ${name} heeft een bevestiging ontvangen.</p>
<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 18px;">${rows}</table>
<p style="margin:0;">Beantwoord deze mail om direct bij ${name} uit te komen.</p>`;
  return {
    subject: `Nieuwe boeking: ${input.name}, ${moment}`,
    html: renderLayout({
      locale: "nl",
      preheader: `${name} boekte ${escapeHtml(moment)}.`,
      bodyHtml,
      footerText: "Automatische melding van het boekingsformulier.",
    }),
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
      ? { intro: "30 minuten, ingepland via hilmarvanderveen.com.", topic: "Onderwerp", company: "Bedrijf", contact: "Contact", join: "Deelnemen" }
      : { intro: "30 minutes, scheduled via hilmarvanderveen.com.", topic: "Topic", company: "Company", contact: "Contact", join: "Join" };
  const subject =
    input.locale === "nl"
      ? `Kennismaking: Hilmar van der Veen en ${input.name}`
      : `Intro call: Hilmar van der Veen and ${input.name}`;
  const joinUrl = input.joinUrl ? escapeHtml(input.joinUrl) : undefined;
  const joinLine = joinUrl
    ? `<p><strong>${labels.join}:</strong> <a href="${joinUrl}">${joinUrl}</a></p>\n`
    : "";
  const html = `${joinLine}<p>${labels.intro}</p>
<p><strong>${labels.topic}:</strong> ${topic}<br>
<strong>${labels.company}:</strong> ${company}<br>
<strong>${labels.contact}:</strong> ${name}, <a href="mailto:${email}">${email}</a></p>`;
  return { subject, html };
}

const CONTACT_SITE_URL = "https://www.hilmarvanderveen.com";

export type ContactEmailInput = {
  locale: EmailLocale;
  name: string;
};

const CONTACT_CONFIRMATION_COPY = {
  nl: {
    subject: "Bedankt voor je bericht",
    greeting: (name: string) => `Hi ${name},`,
    received: "Je bericht is binnengekomen.",
    response: "Je hoort binnen één werkdag van me.",
    bookingIntro: "Je kunt ook direct een gesprek van 30 minuten inplannen.",
    bookingLabel: "Plan een gesprek van 30 minuten",
    signoff: "Hilmar van der Veen, Senior Frontend Engineer",
    footer: "Dit is een automatische bevestiging van je bericht.",
    preheader: "Je bericht is binnengekomen. Je hoort binnen één werkdag van me.",
  },
  en: {
    subject: "Thanks for your message",
    greeting: (name: string) => `Hi ${name},`,
    received: "Your message has arrived.",
    response: "You will hear from me within one business day.",
    bookingIntro: "You can also book a 30-minute call directly.",
    bookingLabel: "Book a 30-minute call",
    signoff: "Hilmar van der Veen, Senior Frontend Engineer",
    footer: "This is an automated confirmation of your message.",
    preheader: "Your message has arrived. You will hear from me within one business day.",
  },
} as const;

function renderContactBookingBlock(
  introText: string,
  buttonLabel: string,
  bookingUrl: string
): string {
  const url = escapeHtml(bookingUrl);
  return `<p style="margin:0 0 10px;">${introText}</p>
<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 18px;">
<tr><td style="border-radius:8px;background-color:${BRAND_EMERALD};">
<a href="${url}" style="display:inline-block;padding:12px 24px;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;">${buttonLabel}</a>
</td></tr>
</table>`;
}

export function renderContactConfirmationEmail(input: ContactEmailInput): RenderedEmail {
  const copy = CONTACT_CONFIRMATION_COPY[input.locale];
  const name = escapeHtml(input.name);
  const bookingUrl = `${CONTACT_SITE_URL}/${input.locale}/book`;
  const bodyHtml = `<p style="margin:0 0 14px;">${copy.greeting(name)}</p>
<p style="margin:0 0 8px;">${copy.received}</p>
<p style="margin:0 0 18px;">${copy.response}</p>
${renderContactBookingBlock(copy.bookingIntro, copy.bookingLabel, bookingUrl)}
<p style="margin:0;">${copy.signoff}</p>`;
  return {
    subject: copy.subject,
    html: renderLayout({
      locale: input.locale,
      preheader: copy.preheader,
      bodyHtml,
      footerText: copy.footer,
    }),
  };
}

export type BookingWatchStep = {
  step: string;
  ok: boolean;
  detail: string;
};

export type BookingWatchEmailInput = {
  steps: BookingWatchStep[];
  expiry: {
    level: "unknown" | "expired" | "urgent" | "soon" | "fine";
    daysLeft: number | null;
    expiresOn: string | null;
  };
};

const WATCH_SUBJECT: Record<BookingWatchEmailInput["expiry"]["level"], (daysLeft: number | null) => string> = {
  unknown: () => "Boekingen: zet de vervaldatum van het Azure-geheim in Vercel",
  expired: () => "Boekingen: het Azure-geheim is verlopen, boeken werkt niet",
  urgent: (daysLeft) => `Boekingen: het Azure-geheim verloopt over ${daysLeft} dagen`,
  soon: (daysLeft) => `Boekingen: het Azure-geheim verloopt over ${daysLeft} dagen`,
  fine: () => "Boekingen: de agendakoppeling is in orde",
};

const WATCH_EXPIRY_LINE: Record<BookingWatchEmailInput["expiry"]["level"], (input: BookingWatchEmailInput["expiry"]) => string> = {
  unknown: () =>
    "De vervaldatum van het geheim is niet bekend. Zet <strong>MS_CLIENT_SECRET_EXPIRES_ON</strong> in Vercel op de datum die Azure toont (JJJJ-MM-DD), dan waarschuwt deze controle dertig en zeven dagen van tevoren.",
  expired: (expiry) => `Het geheim is verlopen op <strong>${expiry.expiresOn}</strong>. Zolang er geen nieuw geheim staat, kan niemand een gesprek boeken.`,
  urgent: (expiry) => `Het geheim verloopt op <strong>${expiry.expiresOn}</strong>, over ${expiry.daysLeft} dagen. Maak deze week een nieuw geheim aan.`,
  soon: (expiry) => `Het geheim verloopt op <strong>${expiry.expiresOn}</strong>, over ${expiry.daysLeft} dagen.`,
  fine: (expiry) => `Het geheim is geldig tot <strong>${expiry.expiresOn}</strong>, nog ${expiry.daysLeft} dagen.`,
};

const WATCH_STEP_NAME: Record<string, string> = {
  environment: "Omgevingsvariabelen",
  token: "Toegangstoken",
  mailbox: "Mailbox",
  calendar: "Agenda",
};

export function renderBookingWatchEmail(input: BookingWatchEmailInput): RenderedEmail {
  const failedStep = input.steps.find((step) => !step.ok);
  const subject = failedStep
    ? `Boekingen: de agendakoppeling werkt niet (${WATCH_STEP_NAME[failedStep.step] ?? failedStep.step})`
    : WATCH_SUBJECT[input.expiry.level](input.expiry.daysLeft);
  const intro = failedStep
    ? "De wekelijkse controle van de boekingskoppeling is mislukt. Zolang dit zo is, ziet een bezoeker op de boekingspagina geen tijden en komt er geen afspraak in de agenda."
    : "De wekelijkse controle van de boekingskoppeling is gedaan. De koppeling werkt, dit bericht gaat over de vervaldatum van het geheim.";
  const rows = input.steps
    .map((step) =>
      renderDetailRow(
        WATCH_STEP_NAME[step.step] ?? escapeHtml(step.step),
        `<span style="color:${step.ok ? BRAND_EMERALD : "#b91c1c"};font-weight:700;">${step.ok ? "In orde" : "Mislukt"}</span> ${escapeHtml(step.detail)}`
      )
    )
    .join("");
  const bodyHtml = `<p style="margin:0 0 14px;">${intro}</p>
<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 18px;">${rows}</table>
<p style="margin:0 0 14px;">${WATCH_EXPIRY_LINE[input.expiry.level](input.expiry)}</p>
<p style="margin:0 0 6px;font-weight:700;">Zo vernieuw je het geheim</p>
<ol style="margin:0 0 18px;padding-left:20px;">
<li>Azure Portal, App registrations, de app van de site, Certificates &amp; secrets, New client secret. Kopieer de waarde meteen, die is later niet meer te zien.</li>
<li>Vercel, Settings, Environment Variables: zet de nieuwe waarde in <strong>MS_CLIENT_SECRET</strong> en de vervaldatum uit Azure in <strong>MS_CLIENT_SECRET_EXPIRES_ON</strong> (JJJJ-MM-DD). Redeploy.</li>
<li>Controleer met de health-endpoint (docs/MICROSOFT_GRAPH.md) of elke stap weer in orde is.</li>
</ol>
<p style="margin:0;">Deze controle draait elke maandagochtend.</p>`;
  return {
    subject,
    html: renderLayout({
      locale: "nl",
      preheader: failedStep
        ? "De boekingskoppeling werkt niet. Bezoekers zien geen tijden."
        : "De boekingskoppeling werkt. Dit bericht gaat over de vervaldatum van het geheim.",
      bodyHtml,
      footerText: "Wekelijkse controle van de boekingskoppeling.",
    }),
  };
}

export type FitLinkEmailInput = {
  locale: EmailLocale;
  name: string;
  resultUrl: string;
  vacancyTitle?: string;
};

const FIT_LINK_COPY = {
  nl: {
    subject: "Je resultaat en het CV op deze vacature",
    greeting: (name: string) => `Hi ${name},`,
    intro:
      "Hieronder open je je resultaat opnieuw, met het CV dat op deze vacature is geschreven. Dat CV zet de eisen van de vacature in de eerste tabel, met per eis de opdracht die het laat zien.",
    buttonLabel: "Open je resultaat",
    linkLabel: "Werkt de knop niet? Kopieer deze link:",
    note: "Het CV wordt bij de eerste download opgebouwd, dat duurt een halve minuut. De link werkt dertig dagen.",
    bookingIntro: "Wil je de vacature liever samen doorlopen?",
    bookingLabel: "Plan een gesprek van 30 minuten",
    signoff: "Veel succes met de vacature,",
    footer: "Je ontvangt deze mail omdat je een CV op een vacature hebt aangevraagd.",
    preheader: (title: string) =>
      title
        ? `Het CV is geschreven op ${title}. De link werkt dertig dagen.`
        : "Het CV is op deze vacature geschreven. De link werkt dertig dagen.",
  },
  en: {
    subject: "Your result and the CV for this vacancy",
    greeting: (name: string) => `Hi ${name},`,
    intro:
      "The link below reopens your result, with the CV written for this vacancy. The CV puts the vacancy's requirements in the first table and names the engagement that shows each one.",
    buttonLabel: "Open your result",
    linkLabel: "If the button does not work, copy this link:",
    note: "The CV is built on the first download, which takes about half a minute. The link works for thirty days.",
    bookingIntro: "Rather go through the vacancy together?",
    bookingLabel: "Book a 30-minute call",
    signoff: "Good luck with the vacancy,",
    footer: "You received this email because you asked for a CV for a vacancy.",
    preheader: (title: string) =>
      title
        ? `The CV is written for ${title}. The link works for thirty days.`
        : "The CV is written for this vacancy. The link works for thirty days.",
  },
} as const;

export function renderFitLinkEmail(input: FitLinkEmailInput): RenderedEmail {
  const copy = FIT_LINK_COPY[input.locale];
  const name = escapeHtml(input.name);
  const bookingUrl = `${CONTACT_SITE_URL}/${input.locale}/book`;
  const bodyHtml = `<p style="margin:0 0 14px;">${copy.greeting(name)}</p>
<p style="margin:0 0 18px;">${copy.intro}</p>
${renderButtonBlock(copy.buttonLabel, input.resultUrl)}
<p style="margin:0 0 10px;font-size:14px;color:#4b5563;">${copy.note}</p>
${renderFallbackLink(copy.linkLabel, input.resultUrl)}
${renderTextLinkLine(copy.bookingIntro, copy.bookingLabel, bookingUrl)}
<p style="margin:0;">${copy.signoff}<br><strong>Hilmar van der Veen</strong></p>`;
  return {
    subject: copy.subject,
    html: renderLayout({
      locale: input.locale,
      preheader: copy.preheader(escapeHtml(input.vacancyTitle ?? "")),
      bodyHtml,
      footerText: copy.footer,
    }),
  };
}

export type FitVerdictCountsInput = {
  inRecord: number;
  partly: number;
  notInRecord: number;
};

export type FitLeadNotificationInput = {
  name: string;
  email: string;
  organisation: string;
  sessionId: string;
  resultUrl: string;
  vacancyTitle?: string;
  endClient?: string;
  closingDate?: string;
  verdictCounts?: FitVerdictCountsInput;
};

const UNKNOWN_VALUE = "Onbekend";

const leadValue = (value: string | undefined): string =>
  value ? escapeHtml(value) : UNKNOWN_VALUE;

const verdictSummary = (counts: FitVerdictCountsInput | undefined): string =>
  counts
    ? `${counts.inRecord} in, ${counts.partly} deels, ${counts.notInRecord} niet`
    : UNKNOWN_VALUE;

export function renderFitLeadNotification(input: FitLeadNotificationInput): RenderedEmail {
  const name = escapeHtml(input.name);
  const email = escapeHtml(input.email);
  const organisation = input.organisation ? escapeHtml(input.organisation) : NOT_PROVIDED.nl;
  const resultUrl = escapeHtml(input.resultUrl);
  const rows = [
    renderDetailRow("Wie", `<strong>${name}</strong>`),
    renderDetailRow(
      "E-mail",
      `<a href="mailto:${email}" style="color:${BRAND_EMERALD};">${email}</a>`
    ),
    renderDetailRow("Organisatie", organisation),
    renderDetailRow("Vacature", leadValue(input.vacancyTitle)),
    renderDetailRow("Eindklant", leadValue(input.endClient)),
    renderDetailRow("Aansluiting", verdictSummary(input.verdictCounts)),
    renderDetailRow("Sluit op", leadValue(input.closingDate)),
    renderDetailRow(
      "Resultaat",
      `<a href="${resultUrl}" style="color:${BRAND_EMERALD};word-break:break-all;">${resultUrl}</a>`
    ),
  ].join("");
  const bodyHtml = `<p style="margin:0 0 14px;">${name} heeft via de vacaturecheck het CV op een vacature gevraagd. De link is naar ${email} verstuurd.</p>
<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 18px;">${rows}</table>
<p style="margin:0;">Beantwoord deze mail om direct bij ${name} uit te komen.</p>`;
  const subject = input.organisation
    ? `CV gevraagd: ${input.name}, ${input.organisation}`
    : `CV gevraagd: ${input.name}`;
  const titleForPreheader = input.vacancyTitle ? escapeHtml(input.vacancyTitle) : "een vacature";
  return {
    subject,
    html: renderLayout({
      locale: "nl",
      preheader: `${name} vroeg het CV op ${titleForPreheader}. Aansluiting: ${verdictSummary(
        input.verdictCounts
      )}.`,
      bodyHtml,
      footerText: `Automatische melding van de vacaturecheck. Nummer van dit resultaat: ${escapeHtml(
        input.sessionId
      )}.`,
    }),
  };
}

export type FitLeadsDigestLead = {
  sessionId: string;
  lead: {
    title: string;
    endClient: string;
    intermediary: string;
    contractForm: string;
    closingDate: string;
    rate: { minimum: number | null; maximum: number | null; unit: string; currency: string };
    contact: { name: string; email: string; phone: string; organisation: string };
  };
  verdictCounts: FitVerdictCountsInput;
};

export type FitLeadsDigestEmailInput = {
  since: string;
  leads: FitLeadsDigestLead[];
};

const CONTRACT_FORM_NAME: Record<string, string> = {
  freelance: "Freelance",
  secondment: "Detachering",
  payroll: "Loondienst",
  unknown: UNKNOWN_VALUE,
};

export function formatDigestDate(isoDate: string): string {
  const parsed = new Date(`${isoDate}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return isoDate;
  return new Intl.DateTimeFormat("nl-NL", {
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  }).format(parsed);
}

const digestValue = (value: string): string => (value ? escapeHtml(value) : UNKNOWN_VALUE);

const digestRate = (rate: FitLeadsDigestLead["lead"]["rate"]): string => {
  const currency = rate.currency ? escapeHtml(rate.currency) : "\u20ac";
  const unit = rate.unit === "day" ? "per dag" : rate.unit === "hour" ? "per uur" : "";
  if (rate.minimum && rate.maximum && rate.minimum !== rate.maximum) {
    return `${currency}${rate.minimum} tot ${currency}${rate.maximum} ${unit}`.trim();
  }
  const single = rate.minimum ?? rate.maximum;
  return single ? `${currency}${single} ${unit}`.trim() : UNKNOWN_VALUE;
};

const digestContact = (contact: FitLeadsDigestLead["lead"]["contact"]): string => {
  const parts = [contact.name, contact.organisation, contact.email, contact.phone].filter(
    (part) => part !== ""
  );
  return parts.length > 0 ? escapeHtml(parts.join(", ")) : UNKNOWN_VALUE;
};

function renderDigestCard(entry: FitLeadsDigestLead): string {
  const rows = [
    renderDetailRow("Eindklant", digestValue(entry.lead.endClient)),
    renderDetailRow("Bemiddelaar", digestValue(entry.lead.intermediary)),
    renderDetailRow("Contractvorm", CONTRACT_FORM_NAME[entry.lead.contractForm] ?? UNKNOWN_VALUE),
    renderDetailRow("Tarief", digestRate(entry.lead.rate)),
    renderDetailRow("Sluit op", digestValue(entry.lead.closingDate)),
    renderDetailRow("Aansluiting", verdictSummary(entry.verdictCounts)),
    renderDetailRow("Contact", digestContact(entry.lead.contact)),
  ].join("");
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 18px;border:1px solid #e5e7eb;border-radius:8px;">
<tr><td style="padding:14px 18px;">
<p style="margin:0 0 8px;font-size:16px;font-weight:700;color:${BRAND_NAVY};">${digestValue(
    entry.lead.title
  )}</p>
<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;">${rows}</table>
</td></tr>
</table>`;
}

export function renderFitLeadsDigestEmail(input: FitLeadsDigestEmailInput): RenderedEmail {
  const since = formatDigestDate(input.since);
  const count = input.leads.length;
  const countedVacancies = count === 1 ? "1 nieuwe vacature" : `${count} nieuwe vacatures`;
  const firstLine =
    count === 1
      ? `Sinds ${since} is er 1 vacature gecheckt.`
      : `Sinds ${since} zijn er ${count} vacatures gecheckt. De vacature met de eerste sluitingsdatum staat bovenaan.`;
  const bodyHtml = `<p style="margin:0 0 18px;">${firstLine}</p>
${input.leads.map(renderDigestCard).join("\n")}
<p style="margin:0;">Onbekend betekent dat de vacaturetekst het veld niet noemde.</p>`;
  return {
    subject: `Vacaturecheck: ${countedVacancies} sinds ${since}`,
    html: renderLayout({
      locale: "nl",
      preheader: `${countedVacancies} door de check. De eerste sluitingsdatum staat bovenaan.`,
      bodyHtml,
      footerText: "Wekelijks overzicht van de vacaturecheck.",
    }),
  };
}
