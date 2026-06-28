import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { __resetRateLimitStore } from "@/lib/security/rate-limit";

// Graph client.calendarview chain is mocked so the happy path is exercisable.
const getEvents = vi.fn();
const getGraphCredentials = vi.fn();
vi.mock("@/lib/graph", async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>;
  return {
    ...actual, // keep real generateTimeSlots / isSlotAvailable / BOOKING_TIMEZONE
    getGraphCredentials: () => getGraphCredentials(),
    getAccessToken: vi.fn(async () => "token"),
    getGraphClient: vi.fn(() => ({
      api: () => ({
        query: () => ({
          header: () => ({ get: () => getEvents() }),
        }),
      }),
    })),
  };
});

import { GET } from "./route";

const CREDS = {
  clientId: "id",
  clientSecret: "secret",
  tenantId: "tenant",
  smtpUser: "hilmar@hilmarvanderveen.com",
};

function get(date?: string) {
  const url = date
    ? `https://www.hilmarvanderveen.com/api/booking/slots?date=${date}`
    : "https://www.hilmarvanderveen.com/api/booking/slots";
  return new NextRequest(url, { method: "GET" });
}

function futureDate(daysAhead = 5) {
  return new Date(Date.now() + daysAhead * 86400000).toISOString().slice(0, 10);
}

beforeEach(() => {
  __resetRateLimitStore();
  getEvents.mockReset().mockResolvedValue({ value: [] });
  getGraphCredentials.mockReset().mockReturnValue(CREDS);
});

describe("GET /api/booking/slots", () => {
  it("returns 400 when date is missing (before any Graph call)", async () => {
    const res = await GET(get());
    expect(res.status).toBe(400);
    expect(getGraphCredentials).not.toHaveBeenCalled();
  });

  it("returns 400 for a malformed date", async () => {
    const res = await GET(get("07-01-2026"));
    expect(res.status).toBe(400);
  });

  it("returns 400 for a past date", async () => {
    const res = await GET(get("2000-01-01"));
    expect(res.status).toBe(400);
  });

  it("returns 16 slots for an empty day", async () => {
    const res = await GET(get(futureDate()));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.totalAvailable).toBe(16);
    expect(json.slots).toHaveLength(16);
  });

  it("filters out slots overlapping existing events", async () => {
    const day = futureDate();
    getEvents.mockResolvedValue({
      value: [{ start: { dateTime: `${day}T09:00:00` }, end: { dateTime: `${day}T09:30:00` } }],
    });
    const res = await GET(get(day));
    const json = await res.json();
    expect(json.totalAvailable).toBeLessThan(16);
  });

  it("returns 500 config error when credentials are missing", async () => {
    getGraphCredentials.mockReturnValue(null);
    const res = await GET(get(futureDate()));
    expect(res.status).toBe(500);
  });
});
