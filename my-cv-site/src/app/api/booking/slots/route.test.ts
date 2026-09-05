import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { __resetRateLimitStore } from "@/lib/security/rate-limit";

const getEvents = vi.fn();
const getGraphCredentials = vi.fn();
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
  const date = new Date(Date.now() + daysAhead * 86400000);
  while (date.getUTCDay() === 0 || date.getUTCDay() === 6) {
    date.setUTCDate(date.getUTCDate() + 1);
  }
  return date.toISOString().slice(0, 10);
}

function futureWeekendDate() {
  const date = new Date(Date.now() + 5 * 86400000);
  while (date.getUTCDay() !== 6) date.setUTCDate(date.getUTCDate() + 1);
  return date.toISOString().slice(0, 10);
}

beforeEach(() => {
  __resetRateLimitStore();
  getEvents.mockReset().mockResolvedValue({ value: [] });
  getGraphCredentials.mockReset().mockReturnValue(CREDS);
});

describe("GET /api/booking/slots", () => {
  it("returns 400 when date is missing (before any Graph call)", async () => {
    const response = await GET(get());
    expect(response.status).toBe(400);
    expect(getGraphCredentials).not.toHaveBeenCalled();
  });

  it("returns 400 for a malformed date", async () => {
    const response = await GET(get("07-01-2026"));
    expect(response.status).toBe(400);
  });

  it("returns 400 for a past date", async () => {
    const response = await GET(get("2000-01-01"));
    expect(response.status).toBe(400);
  });

  it("returns 16 slots for an empty day", async () => {
    const response = await GET(get(futureDate()));
    expect(response.status).toBe(200);
    const json = await response.json();
    expect(json.totalAvailable).toBe(16);
    expect(json.slots).toHaveLength(16);
  });

  it("filters out slots overlapping existing events", async () => {
    const day = futureDate();
    getEvents.mockResolvedValue({
      value: [{ start: { dateTime: `${day}T09:00:00` }, end: { dateTime: `${day}T09:30:00` } }],
    });
    const response = await GET(get(day));
    const json = await response.json();
    expect(json.totalAvailable).toBeLessThan(16);
  });

  it("offers no slots on a weekend", async () => {
    const response = await GET(get(futureWeekendDate()));
    expect(response.status).toBe(200);
    const json = await response.json();
    expect(json.slots).toEqual([]);
    expect(json.totalAvailable).toBe(0);
  });

  it("hides times that start within the next hour on the current day", async () => {
    vi.useFakeTimers();
    try {
      vi.setSystemTime(new Date("2026-07-01T07:45:00.000Z"));
      const response = await GET(get("2026-07-01"));
      const json = await response.json();
      expect(json.totalAvailable).toBe(12);
      expect(json.slots[0].label).toBe("11:00");
    } finally {
      vi.useRealTimers();
    }
  });

  it("returns 500 config error when credentials are missing", async () => {
    getGraphCredentials.mockReturnValue(null);
    const response = await GET(get(futureDate()));
    expect(response.status).toBe(500);
  });
});
