import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NextRequest } from "next/server";
import { __resetRateLimitStore } from "@/lib/security/rate-limit";

const getEvents = vi.fn();
const getGraphCredentials = vi.fn();
const sendMail = vi.fn();
vi.mock("@/lib/graph", async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>;
  return {
    ...actual,
    getGraphCredentials: () => getGraphCredentials(),
    getAccessToken: vi.fn(async () => "token"),
    getGraphClient: vi.fn(() => ({
      api: () => ({
        query: () => ({
          header: () => ({ get: () => getEvents() }),
        }),
      }),
    })),
    sendMail: (...args: unknown[]) => sendMail(...args),
  };
});

import { GET } from "./route";

const CREDS = {
  clientId: "id",
  clientSecret: "secret",
  tenantId: "tenant",
  smtpUser: "hilmar@hilmarvanderveen.com",
};

const CRON_SECRET = "test-cron-secret";

function get(token?: string): NextRequest {
  return new NextRequest("https://www.hilmarvanderveen.com/api/booking/reminders", {
    method: "GET",
    headers: token ? { authorization: `Bearer ${token}` } : {},
  });
}

const dutchBooking = {
  subject: "Kennismaking: Hilmar van der Veen en Jane Doe",
  start: { dateTime: "2026-07-02T10:00:00.0000000" },
  attendees: [{ emailAddress: { address: "jane@example.com", name: "Jane Doe" } }],
};

const englishBooking = {
  subject: "Intro call: Hilmar van der Veen and John Smith",
  start: { dateTime: "2026-07-02T13:00:00.0000000" },
  attendees: [{ emailAddress: { address: "john@example.com", name: "John Smith" } }],
  onlineMeeting: { joinUrl: "https://teams.microsoft.com/l/meetup-join/abc" },
};

beforeEach(() => {
  __resetRateLimitStore();
  process.env.CRON_SECRET = CRON_SECRET;
  getEvents.mockReset().mockResolvedValue({ value: [] });
  getGraphCredentials.mockReset().mockReturnValue(CREDS);
  sendMail.mockReset().mockResolvedValue(undefined);
});

afterEach(() => {
  delete process.env.CRON_SECRET;
});

describe("GET /api/booking/reminders", () => {
  it("returns 404 when CRON_SECRET is not configured", async () => {
    delete process.env.CRON_SECRET;
    const response = await GET(get(CRON_SECRET));
    expect(response.status).toBe(404);
    expect(getGraphCredentials).not.toHaveBeenCalled();
  });

  it("returns 404 when no authorization header is sent", async () => {
    const response = await GET(get());
    expect(response.status).toBe(404);
  });

  it("returns 404 when the bearer token does not match", async () => {
    const response = await GET(get("wrong-secret"));
    expect(response.status).toBe(404);
  });

  it("returns 500 when Graph credentials are missing", async () => {
    getGraphCredentials.mockReturnValue(null);
    const response = await GET(get(CRON_SECRET));
    expect(response.status).toBe(500);
  });

  it("sends nothing and reports zero when there are no upcoming bookings", async () => {
    const response = await GET(get(CRON_SECRET));
    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body).toEqual({ sent: 0 });
    expect(sendMail).not.toHaveBeenCalled();
  });

  it("keeps only events with a site booking subject and sends one reminder per match", async () => {
    getEvents.mockResolvedValue({
      value: [dutchBooking, englishBooking, { subject: "Team meeting", start: dutchBooking.start, attendees: [] }],
    });
    const response = await GET(get(CRON_SECRET));
    const body = await response.json();
    expect(body).toEqual({ sent: 2 });
    expect(sendMail).toHaveBeenCalledTimes(2);
  });

  it("skips a matching event with no attendees", async () => {
    getEvents.mockResolvedValue({
      value: [{ subject: "Kennismaking: Hilmar van der Veen en Jane Doe", start: dutchBooking.start, attendees: [] }],
    });
    const response = await GET(get(CRON_SECRET));
    const body = await response.json();
    expect(body).toEqual({ sent: 0 });
    expect(sendMail).not.toHaveBeenCalled();
  });

  it("derives the Dutch locale from the Kennismaking subject", async () => {
    getEvents.mockResolvedValue({ value: [dutchBooking] });
    await GET(get(CRON_SECRET));
    const [, , mail] = sendMail.mock.calls[0] as [unknown, unknown, Record<string, string>];
    expect(mail.to).toBe("jane@example.com");
    expect(mail.subject).toContain("Herinnering: ons gesprek op");
    expect(mail.body).toContain("Een herinnering voor ons gesprek morgen:");
  });

  it("derives the English locale from the Intro call subject and includes the Teams join link", async () => {
    getEvents.mockResolvedValue({ value: [englishBooking] });
    await GET(get(CRON_SECRET));
    const [, , mail] = sendMail.mock.calls[0] as [unknown, unknown, Record<string, string>];
    expect(mail.to).toBe("john@example.com");
    expect(mail.subject).toContain("Reminder: our call on");
    expect(mail.body).toContain("A reminder for our call tomorrow:");
    expect(mail.body).toContain("https://teams.microsoft.com/l/meetup-join/abc");
  });

  it("never includes an attendee address in the response body", async () => {
    getEvents.mockResolvedValue({ value: [dutchBooking, englishBooking] });
    const response = await GET(get(CRON_SECRET));
    const text = JSON.stringify(await response.json());
    expect(text).not.toContain("jane@example.com");
    expect(text).not.toContain("john@example.com");
  });
});
