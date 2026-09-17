import { describe, it, expect } from "vitest";
import {
  formatBookingMoment,
  renderBookingConfirmationEmail,
  renderBookingNotificationEmail,
  renderBookingCalendarEvent,
  renderBookingReminderEmail,
  renderContactConfirmationEmail,
  renderBookingWatchEmail,
  renderFitLeadNotification,
  formatDigestDate,
  renderFitLeadsDigestEmail,
  renderFitLinkEmail,
  type BookingEmailInput,
  type BookingReminderEmailInput,
} from "./templates";

const booking: BookingEmailInput = {
  locale: "nl",
  name: "Jane Doe",
  email: "jane@example.com",
  company: "Acme",
  topic: "Legacy checkout",
  isoDate: "2026-10-07T08:00:00.000Z",
};

describe("formatBookingMoment", () => {
  it("renders the Amsterdam wall-clock moment per locale", () => {
    const nl = formatBookingMoment(booking.isoDate, "nl");
    expect(nl).toContain("woensdag");
    expect(nl).toContain("7 oktober 2026");
    expect(nl).toContain("10:00");
    const en = formatBookingMoment(booking.isoDate, "en");
    expect(en).toContain("Wednesday");
    expect(en).toContain("October 2026");
    expect(en).toContain("10:00");
  });
});

describe("renderBookingConfirmationEmail", () => {
  it("writes a Dutch confirmation with the moment in the subject", () => {
    const { subject, html } = renderBookingConfirmationEmail(booking);
    expect(subject).toContain("Bevestigd: ons gesprek op woensdag");
    expect(html).toContain("Hi Jane Doe,");
    expect(html).toContain("Waar je op kunt rekenen");
    expect(html).toContain("10:00");
    expect(html).toContain("KVK 97564303");
    expect(html).toContain("automatische bevestiging");
    expect(html).toContain(
      "Komt het toch niet uit? Beantwoord deze mail, dan kiezen we een nieuw moment."
    );
  });

  it("writes an English confirmation for the en locale", () => {
    const { subject, html } = renderBookingConfirmationEmail({ ...booking, locale: "en" });
    expect(subject).toContain("Confirmed: our call on Wednesday");
    expect(html).toContain("What you can count on");
    expect(html).toContain("Amsterdam time");
    expect(html).toContain(
      "Need another moment? Reply to this email and we pick a new one."
    );
  });

  it("escapes the visitor's name", () => {
    const { html } = renderBookingConfirmationEmail({
      ...booking,
      name: "<script>alert(1)</script>",
    });
    expect(html).not.toContain("<script>alert(1)</script>");
    expect(html).toContain("&lt;script&gt;");
  });
});

describe("renderBookingConfirmationEmail with a Teams join link", () => {
  it("renders the Dutch join button and a plain-text link", () => {
    const { html } = renderBookingConfirmationEmail({
      ...booking,
      joinUrl: "https://teams.microsoft.com/l/meetup-join/abc",
    });
    expect(html).toContain("Deelnemen aan het Teams-gesprek");
    expect(html).toContain("Werkt de knop niet? Kopieer deze link:");
    expect(html.match(/https:\/\/teams\.microsoft\.com\/l\/meetup-join\/abc/g)).toHaveLength(3);
  });

  it("writes the English join button copy for the en locale", () => {
    const { html } = renderBookingConfirmationEmail({
      ...booking,
      locale: "en",
      joinUrl: "https://teams.microsoft.com/l/meetup-join/abc",
    });
    expect(html).toContain("Join the Teams call");
    expect(html).toContain("If the button does not work, copy this link:");
  });

  it("escapes a join URL that carries a quote and an ampersand", () => {
    const { html } = renderBookingConfirmationEmail({
      ...booking,
      joinUrl: 'https://teams.microsoft.com/l/meetup-join/abc?token="x"&y=1',
    });
    expect(html).not.toContain('"x"&y=1');
    expect(html).toContain("&quot;x&quot;&amp;y=1");
  });

  it("omits the join block entirely when no joinUrl is given", () => {
    const { html } = renderBookingConfirmationEmail(booking);
    expect(html).not.toContain("Teams");
  });

  it("places the reschedule line under the join block", () => {
    const { html } = renderBookingConfirmationEmail({
      ...booking,
      joinUrl: "https://teams.microsoft.com/l/meetup-join/abc",
    });
    const joinIndex = html.indexOf("Deelnemen aan het Teams-gesprek");
    const rescheduleIndex = html.indexOf(
      "Komt het toch niet uit? Beantwoord deze mail, dan kiezen we een nieuw moment."
    );
    expect(joinIndex).toBeGreaterThan(-1);
    expect(rescheduleIndex).toBeGreaterThan(joinIndex);
  });
});

const reminder: BookingReminderEmailInput = {
  locale: "nl",
  name: "Jane Doe",
  isoDate: "2026-10-07T08:00:00.000Z",
};

describe("renderBookingReminderEmail", () => {
  it("writes a Dutch reminder with the moment and the reschedule line", () => {
    const { subject, html } = renderBookingReminderEmail(reminder);
    expect(subject).toContain("Herinnering: ons gesprek op woensdag");
    expect(html).toContain("Hi Jane Doe,");
    expect(html).toContain("Een herinnering voor ons gesprek morgen:");
    expect(html).toContain("10:00");
    expect(html).toContain(
      "Komt het toch niet uit? Beantwoord deze mail, dan kiezen we een nieuw moment."
    );
    expect(html).toContain("automatische herinnering");
  });

  it("writes an English reminder for the en locale", () => {
    const { subject, html } = renderBookingReminderEmail({ ...reminder, locale: "en" });
    expect(subject).toContain("Reminder: our call on Wednesday");
    expect(html).toContain("A reminder for our call tomorrow:");
    expect(html).toContain(
      "Need another moment? Reply to this email and we pick a new one."
    );
  });

  it("escapes the visitor's name", () => {
    const { html } = renderBookingReminderEmail({
      ...reminder,
      name: "<script>alert(1)</script>",
    });
    expect(html).not.toContain("<script>alert(1)</script>");
    expect(html).toContain("&lt;script&gt;");
  });

  it("renders the Teams join button and link when joinUrl is given", () => {
    const { html } = renderBookingReminderEmail({
      ...reminder,
      joinUrl: "https://teams.microsoft.com/l/meetup-join/abc",
    });
    expect(html).toContain("Deelnemen aan het Teams-gesprek");
    expect(html.match(/https:\/\/teams\.microsoft\.com\/l\/meetup-join\/abc/g)).toHaveLength(
      3
    );
  });

  it("omits the join block when no joinUrl is given", () => {
    const { html } = renderBookingReminderEmail(reminder);
    expect(html).not.toContain("Teams");
  });
});

describe("renderBookingNotificationEmail", () => {
  it("lists every booking detail for the owner in Dutch", () => {
    const { subject, html } = renderBookingNotificationEmail(booking);
    expect(subject).toContain("Nieuwe boeking: Jane Doe, woensdag");
    expect(html).toContain("Wanneer");
    expect(html).toContain('href="mailto:jane@example.com"');
    expect(html).toContain("Acme");
    expect(html).toContain("Legacy checkout");
    expect(html).toContain("Nederlands");
  });

  it("falls back for missing company and topic and names the language", () => {
    const { html } = renderBookingNotificationEmail({
      ...booking,
      locale: "en",
      company: "",
      topic: "",
    });
    expect(html.match(/Niet opgegeven/g)).toHaveLength(2);
    expect(html).toContain("Engels");
  });

  it("escapes visitor input in the details table", () => {
    const { html } = renderBookingNotificationEmail({
      ...booking,
      topic: "<img src=x onerror=alert(1)>",
    });
    expect(html).not.toContain("<img src=x");
    expect(html).toContain("&lt;img");
  });
});

describe("renderBookingNotificationEmail with a Teams join link", () => {
  it("adds a Teams row with the link when present", () => {
    const { html } = renderBookingNotificationEmail({
      ...booking,
      joinUrl: "https://teams.microsoft.com/l/meetup-join/abc",
    });
    expect(html).toContain("Teams");
    expect(html).toContain('href="https://teams.microsoft.com/l/meetup-join/abc"');
  });

  it("escapes a join URL that carries a quote and an ampersand", () => {
    const { html } = renderBookingNotificationEmail({
      ...booking,
      joinUrl: 'https://teams.microsoft.com/l/meetup-join/abc?token="x"&y=1',
    });
    expect(html).toContain("&quot;x&quot;&amp;y=1");
    expect(html).not.toContain('"x"&y=1');
  });

  it("has no Teams row when no joinUrl is given", () => {
    const { html } = renderBookingNotificationEmail(booking);
    expect(html).not.toContain("Teams");
  });
});

describe("renderBookingCalendarEvent", () => {
  it("writes a Dutch event for Dutch visitors", () => {
    const { subject, html } = renderBookingCalendarEvent(booking);
    expect(subject).toBe("Kennismaking: Hilmar van der Veen en Jane Doe");
    expect(html).toContain("Onderwerp:");
    expect(html).toContain("Legacy checkout");
  });

  it("writes an English event with fallbacks for the en locale", () => {
    const { subject, html } = renderBookingCalendarEvent({
      ...booking,
      locale: "en",
      company: "",
      topic: "",
    });
    expect(subject).toBe("Intro call: Hilmar van der Veen and Jane Doe");
    expect(html).toContain("Topic:");
    expect(html.match(/Not provided/g)).toHaveLength(2);
  });

  it("escapes visitor input in the event body", () => {
    const { html } = renderBookingCalendarEvent({ ...booking, topic: "<b>x</b>" });
    expect(html).toContain("&lt;b&gt;x&lt;/b&gt;");
    expect(html).not.toContain("<b>x</b>");
  });
});

describe("renderBookingCalendarEvent with a Teams join link", () => {
  it("writes a Deelnemen line at the top for Dutch visitors", () => {
    const { html } = renderBookingCalendarEvent({
      ...booking,
      joinUrl: "https://teams.microsoft.com/l/meetup-join/abc",
    });
    expect(html.startsWith("<p><strong>Deelnemen:</strong>")).toBe(true);
    expect(html).toContain('href="https://teams.microsoft.com/l/meetup-join/abc"');
  });

  it("writes a Join line at the top for English visitors", () => {
    const { html } = renderBookingCalendarEvent({
      ...booking,
      locale: "en",
      joinUrl: "https://teams.microsoft.com/l/meetup-join/abc",
    });
    expect(html.startsWith("<p><strong>Join:</strong>")).toBe(true);
  });

  it("escapes a join URL that carries a quote and an ampersand", () => {
    const { html } = renderBookingCalendarEvent({
      ...booking,
      joinUrl: 'https://teams.microsoft.com/l/meetup-join/abc?token="x"&y=1',
    });
    expect(html).toContain("&quot;x&quot;&amp;y=1");
    expect(html).not.toContain('"x"&y=1');
  });

  it("has no join line when no joinUrl is given", () => {
    const { html } = renderBookingCalendarEvent(booking);
    expect(html.startsWith("<p>30 minuten")).toBe(true);
  });
});

describe("renderContactConfirmationEmail", () => {
  it("writes a Dutch confirmation with the response promise and a booking link", () => {
    const { subject, html } = renderContactConfirmationEmail({
      locale: "nl",
      name: "Jane Doe",
    });
    expect(subject).toBe("Bedankt voor je bericht");
    expect(html).toContain("Hi Jane Doe,");
    expect(html).toContain("Je hoort binnen één werkdag van me.");
    expect(html).toContain('href="https://www.hilmarvanderveen.com/nl/book"');
    expect(html).toContain("Plan een gesprek van 30 minuten");
    expect(html).toContain("Hilmar van der Veen, Senior Frontend Engineer");
  });

  it("writes an English confirmation with the response promise and a booking link", () => {
    const { subject, html } = renderContactConfirmationEmail({
      locale: "en",
      name: "Jane Doe",
    });
    expect(subject).toBe("Thanks for your message");
    expect(html).toContain("You will hear from me within one business day.");
    expect(html).toContain('href="https://www.hilmarvanderveen.com/en/book"');
    expect(html).toContain("Book a 30-minute call");
  });

  it("escapes the visitor's name", () => {
    const { html } = renderContactConfirmationEmail({
      locale: "en",
      name: "<script>alert(1)</script>",
    });
    expect(html).not.toContain("<script>alert(1)</script>");
    expect(html).toContain("&lt;script&gt;");
  });
});

describe("renderBookingWatchEmail", () => {
  const healthySteps = [
    { step: "environment", ok: true, detail: "all four Microsoft Graph variables are set" },
    { step: "token", ok: true, detail: "client-credentials token acquired" },
    { step: "mailbox", ok: true, detail: "mailbox owner@example.com is reachable" },
    { step: "calendar", ok: true, detail: "calendar readable" },
  ];

  it("names the failed stage in the subject and escapes its detail", () => {
    const email = renderBookingWatchEmail({
      steps: [healthySteps[0], healthySteps[1], { step: "mailbox", ok: false, detail: "status 403 <forbidden>" }],
      expiry: { level: "fine", daysLeft: 200, expiresOn: "2027-03-27" },
    });
    expect(email.subject).toBe("Boekingen: de agendakoppeling werkt niet (Mailbox)");
    expect(email.html).toContain("status 403 &lt;forbidden&gt;");
    expect(email.html).toContain("Mislukt");
    expect(email.html).toContain("ziet een bezoeker op de boekingspagina geen tijden");
  });

  it("warns with the number of days when the secret expires soon", () => {
    const email = renderBookingWatchEmail({
      steps: healthySteps,
      expiry: { level: "urgent", daysLeft: 5, expiresOn: "2026-09-13" },
    });
    expect(email.subject).toBe("Boekingen: het Azure-geheim verloopt over 5 dagen");
    expect(email.html).toContain("2026-09-13");
    expect(email.html).toContain("Maak deze week een nieuw geheim aan");
    expect(email.html).toContain("MS_CLIENT_SECRET_EXPIRES_ON");
  });

  it("asks for the date when the expiry is unknown, and reports a fine secret and an expired one", () => {
    expect(renderBookingWatchEmail({ steps: healthySteps, expiry: { level: "unknown", daysLeft: null, expiresOn: null } }).subject).toContain("vervaldatum");
    expect(renderBookingWatchEmail({ steps: healthySteps, expiry: { level: "soon", daysLeft: 20, expiresOn: "2026-09-28" } }).subject).toContain("over 20 dagen");
    expect(renderBookingWatchEmail({ steps: healthySteps, expiry: { level: "fine", daysLeft: 200, expiresOn: "2027-03-27" } }).subject).toContain("in orde");
    expect(renderBookingWatchEmail({ steps: healthySteps, expiry: { level: "expired", daysLeft: -3, expiresOn: "2026-09-05" } }).html).toContain("kan niemand een gesprek boeken");
  });
});

describe("renderFitLinkEmail", () => {
  const resultUrl =
    "https://www.hilmarvanderveen.com/nl/fit?result=session-id-value&key=signature";

  it("opens the result with one button, the note before the fallback link, in Dutch", () => {
    const email = renderFitLinkEmail({
      locale: "nl",
      name: "Jane Doe",
      resultUrl,
      vacancyTitle: "Senior Frontend Engineer",
    });
    expect(email.subject).toBe("Je resultaat en het CV op deze vacature");
    expect(email.html).toContain("Hi Jane Doe,");
    expect(email.html).toContain("Open je resultaat");
    expect(email.html).toContain("Veel succes met de vacature,");
    expect(email.html).toContain("Het CV is geschreven op Senior Frontend Engineer.");
    expect(email.html).toContain('<html lang="nl">');
    expect(email.html).toContain('<meta name="color-scheme" content="light dark">');

    const escapedUrl = resultUrl.replace("&", "&amp;");
    expect(email.html.split(escapedUrl).length - 1).toBe(3);

    const noteIndex = email.html.indexOf("Het CV wordt bij de eerste download opgebouwd");
    const fallbackIndex = email.html.indexOf("Werkt de knop niet?");
    expect(noteIndex).toBeGreaterThan(0);
    expect(noteIndex).toBeLessThan(fallbackIndex);
  });

  it("carries one button and the booking offer as a text link", () => {
    const email = renderFitLinkEmail({ locale: "nl", name: "Jane Doe", resultUrl });
    expect(email.html.split("display:block;font-size:15px").length - 1).toBe(1);
    expect(email.html).toContain("/nl/book");
    expect(email.html).toContain("Plan een gesprek van 30 minuten</a>");
    expect(email.html).toContain("KVK 97564303");
    expect(email.html).toContain("Het CV is op deze vacature geschreven.");
  });

  it("writes the same mail in English", () => {
    const email = renderFitLinkEmail({
      locale: "en",
      name: "Jane Doe",
      resultUrl,
      vacancyTitle: "Senior Frontend Engineer",
    });
    expect(email.subject).toBe("Your result and the CV for this vacancy");
    expect(email.html).toContain("Open your result");
    expect(email.html).toContain("Good luck with the vacancy,");
    expect(email.html).toContain("/en/book");
    expect(email.html).toContain('<html lang="en">');
  });

  it("escapes the visitor name and the vacancy title", () => {
    const email = renderFitLinkEmail({
      locale: "nl",
      name: '<script>alert("x")</script>',
      resultUrl,
      vacancyTitle: '<img src=x onerror="alert(1)">',
    });
    expect(email.html).not.toContain("<script>alert");
    expect(email.html).not.toContain("<img src=x");
    expect(email.html).toContain("&lt;script&gt;");
  });
});

describe("renderFitLeadNotification", () => {
  const lead = {
    name: "Jane Doe",
    email: "jane@example.com",
    organisation: "Acme",
    sessionId: "session-id-value",
    resultUrl: "https://www.hilmarvanderveen.com/nl/fit?result=session-id-value&key=signature",
    vacancyTitle: "Senior Frontend Engineer",
    endClient: "A government body",
    closingDate: "2026-09-30",
    verdictCounts: { inRecord: 4, partly: 4, notInRecord: 1 },
  };

  it("names the vacancy, the end client, the fit and the closing date", () => {
    const email = renderFitLeadNotification(lead);
    expect(email.subject).toBe("CV gevraagd: Jane Doe, Acme");
    expect(email.html).toContain("De link is naar jane@example.com verstuurd.");
    expect(email.html).toContain("Vacature");
    expect(email.html).toContain("Senior Frontend Engineer");
    expect(email.html).toContain("Eindklant");
    expect(email.html).toContain("A government body");
    expect(email.html).toContain("Aansluiting");
    expect(email.html).toContain("4 in, 4 deels, 1 niet");
    expect(email.html).toContain("Sluit op");
    expect(email.html).toContain("2026-09-30");
    expect(email.html).toContain("mailto:jane@example.com");
  });

  it("carries the session number in the footer line and not as a row", () => {
    const email = renderFitLeadNotification(lead);
    expect(email.html).toContain("Nummer van dit resultaat: session-id-value.");
    expect(email.html).not.toContain(">Nummer</td>");
  });

  it("falls back to the name alone and to Onbekend for what the vacancy did not name", () => {
    const email = renderFitLeadNotification({
      name: "Jane Doe",
      email: "jane@example.com",
      organisation: "",
      sessionId: "session-id-value",
      resultUrl: "https://www.hilmarvanderveen.com/nl/fit",
    });
    expect(email.subject).toBe("CV gevraagd: Jane Doe");
    expect(email.html).toContain("Niet opgegeven");
    expect(email.html.split("Onbekend").length - 1).toBeGreaterThanOrEqual(4);
  });
});

describe("formatDigestDate", () => {
  it("writes a Dutch day and month", () => {
    expect(formatDigestDate("2026-09-10")).toBe("10 september");
  });

  it("keeps a date it cannot read", () => {
    expect(formatDigestDate("not a date")).toBe("not a date");
  });
});

describe("renderFitLeadsDigestEmail", () => {
  const record = {
    sessionId: "session-id-value",
    lead: {
      title: "Senior frontend engineer",
      endClient: "A government body",
      intermediary: "An agency",
      contractForm: "freelance",
      closingDate: "2026-09-21",
      rate: { minimum: 95, maximum: 125, unit: "hour", currency: "\u20ac" },
      contact: {
        name: "A recruiter",
        email: "recruiter@example.com",
        phone: "",
        organisation: "An agency",
      },
    },
    verdictCounts: { inRecord: 8, partly: 2, notInRecord: 1 },
  };

  it("counts the vacancies in the subject and renders one card per lead", () => {
    const email = renderFitLeadsDigestEmail({ since: "2026-09-14", leads: [record, record] });
    expect(email.subject).toBe("Vacaturecheck: 2 nieuwe vacatures sinds 14 september");
    expect(email.html).toContain(
      "Sinds 14 september zijn er 2 vacatures gecheckt. De vacature met de eerste sluitingsdatum staat bovenaan."
    );
    expect(email.html.split("Senior frontend engineer").length - 1).toBe(2);
    expect(email.html).toContain("Eindklant");
    expect(email.html).toContain("Bemiddelaar");
    expect(email.html).toContain("Contractvorm");
    expect(email.html).toContain("Freelance");
    expect(email.html).toContain("Tarief");
    expect(email.html).toContain("\u20ac95 tot \u20ac125 per uur");
    expect(email.html).toContain("Sluit op");
    expect(email.html).toContain("Aansluiting");
    expect(email.html).toContain("8 in, 2 deels, 1 niet");
    expect(email.html).toContain("A recruiter, An agency, recruiter@example.com");
  });

  it("writes one vacancy in the singular", () => {
    const email = renderFitLeadsDigestEmail({ since: "2026-09-14", leads: [record] });
    expect(email.subject).toBe("Vacaturecheck: 1 nieuwe vacature sinds 14 september");
    expect(email.html).toContain("Sinds 14 september is er 1 vacature gecheckt.");
  });

  it("says Onbekend for every field the vacancy did not name", () => {
    const email = renderFitLeadsDigestEmail({
      since: "2026-09-14",
      leads: [
        {
          sessionId: "session-id-value",
          lead: {
            title: "",
            endClient: "",
            intermediary: "",
            contractForm: "",
            closingDate: "",
            rate: { minimum: null, maximum: null, unit: "", currency: "" },
            contact: { name: "", email: "", phone: "", organisation: "" },
          },
          verdictCounts: { inRecord: 0, partly: 0, notInRecord: 0 },
        },
      ],
    });
    expect(email.html.split("Onbekend").length - 1).toBeGreaterThanOrEqual(7);
  });

  it("reads a single rate and a day rate", () => {
    const perDay = renderFitLeadsDigestEmail({
      since: "2026-09-14",
      leads: [
        {
          ...record,
          lead: {
            ...record.lead,
            rate: { minimum: 800, maximum: null, unit: "day", currency: "" },
          },
        },
      ],
    });
    expect(perDay.html).toContain("\u20ac800 per dag");
  });
});
