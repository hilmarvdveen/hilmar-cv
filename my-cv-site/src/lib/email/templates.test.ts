import { describe, it, expect } from "vitest";
import {
  formatBookingMoment,
  renderBookingConfirmationEmail,
  renderBookingNotificationEmail,
  renderBookingCalendarEvent,
  type BookingEmailInput,
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
  });

  it("writes an English confirmation for the en locale", () => {
    const { subject, html } = renderBookingConfirmationEmail({ ...booking, locale: "en" });
    expect(subject).toContain("Confirmed: our call on Wednesday");
    expect(html).toContain("What you can count on");
    expect(html).toContain("Amsterdam time");
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
