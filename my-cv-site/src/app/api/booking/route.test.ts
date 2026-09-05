import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { __resetRateLimitStore } from "@/lib/security/rate-limit";

const sendMail = vi.fn();
const createCalendarEvent = vi.fn();
const getGraphCredentials = vi.fn();
vi.mock("@/lib/graph", () => ({
  getGraphCredentials: () => getGraphCredentials(),
  getAccessToken: vi.fn(async () => "token"),
  getGraphClient: vi.fn(() => ({})),
  sendMail: (...args: unknown[]) => sendMail(...args),
  createCalendarEvent: (...args: unknown[]) => createCalendarEvent(...args),
  BOOKING_TIMEZONE: "Europe/Amsterdam",
}));

import { POST } from "./route";

const CREDS = {
  clientId: "id",
  clientSecret: "secret",
  tenantId: "tenant",
  smtpUser: "hilmar@hilmarvanderveen.com",
};

function future(daysAhead = 5) {
  return new Date(Date.now() + daysAhead * 86400000).toISOString();
}

function post(body: unknown, headers: Record<string, string> = {}) {
  return new NextRequest("https://www.hilmarvanderveen.com/api/booking", {
    method: "POST",
    headers: {
      origin: "https://www.hilmarvanderveen.com",
      "content-type": "application/json",
      ...headers,
    },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  __resetRateLimitStore();
  sendMail.mockReset().mockResolvedValue(undefined);
  createCalendarEvent.mockReset().mockResolvedValue({ joinUrl: undefined });
  getGraphCredentials.mockReset().mockReturnValue(CREDS);
});

const valid = () => ({
  name: "Jane",
  email: "jane@example.com",
  date: future(),
  company: "Acme",
  topic: "Legacy checkout",
  locale: "en",
  formStartedAt: Date.now() - 10000,
});

describe("POST /api/booking", () => {
  it("rejects cross-origin with 403", async () => {
    const response = await POST(post(valid(), { origin: "https://evil.example.com" }));
    expect(response.status).toBe(403);
  });

  it("returns 400 when the date is missing", async () => {
    const response = await POST(post({ ...valid(), date: undefined }));
    expect(response.status).toBe(400);
  });

  it("returns 400 for a past booking date", async () => {
    const response = await POST(post({ ...valid(), date: new Date(Date.now() - 86400000).toISOString() }));
    expect(response.status).toBe(400);
    expect((await response.json()).error).toMatch(/past/i);
  });

  it("silently succeeds on honeypot without creating an event", async () => {
    const response = await POST(post({ ...valid(), company_website: "bot" }));
    expect(response.status).toBe(200);
    expect(createCalendarEvent).not.toHaveBeenCalled();
  });

  it("creates an event, notifies the owner and confirms to the visitor", async () => {
    const response = await POST(post(valid()));
    expect(response.status).toBe(200);
    expect(createCalendarEvent).toHaveBeenCalledTimes(1);
    expect(sendMail).toHaveBeenCalledTimes(2);
    const mails = sendMail.mock.calls.map((call) => call[2] as Record<string, string>);
    const notification = mails.find((mail) => mail.to === CREDS.smtpUser);
    const confirmation = mails.find((mail) => mail.to === "jane@example.com");
    expect(notification?.subject).toContain("Nieuwe boeking: Jane");
    expect(notification?.replyTo).toBe("jane@example.com");
    expect(notification?.body).toContain("Acme");
    expect(confirmation?.subject).toContain("Confirmed: our call on");
    expect(createCalendarEvent.mock.calls[0][2].subject).toContain("Intro call:");
  });

  it("writes Dutch emails when the visitor booked in Dutch", async () => {
    await POST(post({ ...valid(), locale: "nl" }));
    const mails = sendMail.mock.calls.map((call) => call[2] as Record<string, string>);
    const confirmation = mails.find((mail) => mail.to === "jane@example.com");
    expect(confirmation?.subject).toContain("Bevestigd: ons gesprek op");
    expect(createCalendarEvent.mock.calls[0][2].subject).toContain("Kennismaking:");
  });

  it("escapes the visitor's topic in the calendar event body", async () => {
    await POST(post({ ...valid(), topic: "<b>x</b>" }));
    const arg = createCalendarEvent.mock.calls[0][2];
    expect(arg.htmlBody).toContain("&lt;b&gt;x&lt;/b&gt;");
    expect(arg.htmlBody).not.toContain("<b>x</b>");
  });

  it("includes the Teams join link from createCalendarEvent in both email bodies", async () => {
    createCalendarEvent.mockResolvedValue({
      joinUrl: "https://teams.microsoft.com/l/meetup-join/abc",
    });
    await POST(post(valid()));
    const mails = sendMail.mock.calls.map((call) => call[2] as Record<string, string>);
    expect(
      mails.every((mail) =>
        mail.body.includes("https://teams.microsoft.com/l/meetup-join/abc")
      )
    ).toBe(true);
  });

  it("omits any Teams mention from both email bodies when no join link comes back", async () => {
    await POST(post(valid()));
    const mails = sendMail.mock.calls.map((call) => call[2] as Record<string, string>);
    expect(mails.every((mail) => !mail.body.includes("Teams"))).toBe(true);
  });
});
