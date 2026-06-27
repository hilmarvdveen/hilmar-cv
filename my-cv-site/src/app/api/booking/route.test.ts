import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

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
  return new NextRequest("https://hilmarvanderveen.com/api/booking", {
    method: "POST",
    headers: {
      origin: "https://hilmarvanderveen.com",
      "content-type": "application/json",
      ...headers,
    },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  sendMail.mockReset().mockResolvedValue(undefined);
  createCalendarEvent.mockReset().mockResolvedValue(undefined);
  getGraphCredentials.mockReset().mockReturnValue(CREDS);
});

const valid = () => ({
  name: "Jane",
  email: "jane@example.com",
  date: future(),
  message: "Let's talk",
  formStartedAt: Date.now() - 10000,
});

describe("POST /api/booking", () => {
  it("rejects cross-origin with 403", async () => {
    const res = await POST(post(valid(), { origin: "https://evil.example.com" }));
    expect(res.status).toBe(403);
  });

  it("returns 400 when the date is missing", async () => {
    const res = await POST(post({ ...valid(), date: undefined }));
    expect(res.status).toBe(400);
  });

  it("returns 400 for a past booking date", async () => {
    const res = await POST(post({ ...valid(), date: new Date(Date.now() - 86400000).toISOString() }));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/past/i);
  });

  it("silently succeeds on honeypot without creating an event", async () => {
    const res = await POST(post({ ...valid(), company_website: "bot" }));
    expect(res.status).toBe(200);
    expect(createCalendarEvent).not.toHaveBeenCalled();
  });

  it("creates an event and sends confirmation on the happy path", async () => {
    const res = await POST(post(valid()));
    expect(res.status).toBe(200);
    expect(createCalendarEvent).toHaveBeenCalledTimes(1);
    expect(sendMail).toHaveBeenCalledTimes(1);
  });

  it("escapes the user message in the calendar event body", async () => {
    await POST(post({ ...valid(), message: "<b>x</b>" }));
    const arg = createCalendarEvent.mock.calls[0][2];
    expect(arg.htmlBody).toContain("&lt;b&gt;x&lt;/b&gt;");
    expect(arg.htmlBody).not.toContain("<b>x</b>");
  });
});
