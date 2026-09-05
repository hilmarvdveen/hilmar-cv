import { describe, it, expect, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import {
  checkRateLimit,
  getClientIp,
  enforceRateLimit,
  RATE_LIMITS,
  __resetRateLimitStore,
} from "./rate-limit";

beforeEach(() => __resetRateLimitStore());

function buildRequest(headers: Record<string, string> = {}) {
  return new NextRequest("https://www.hilmarvanderveen.com/api/contact", {
    method: "POST",
    headers,
  });
}

describe("getClientIp", () => {
  it("uses the first x-forwarded-for entry", () => {
    expect(getClientIp(buildRequest({ "x-forwarded-for": "203.0.113.7, 70.41.3.18" }))).toBe("203.0.113.7");
  });
  it("falls back to x-real-ip, then a default", () => {
    expect(getClientIp(buildRequest({ "x-real-ip": "198.51.100.2" }))).toBe("198.51.100.2");
    expect(getClientIp(buildRequest({}))).toBe("127.0.0.1");
  });
});

describe("checkRateLimit", () => {
  const rule = { limit: 3, windowMs: 1000 };

  it("allows up to the limit then blocks within the window", () => {
    const now = 1_000_000;
    expect(checkRateLimit("k", rule, now).success).toBe(true);
    expect(checkRateLimit("k", rule, now).success).toBe(true);
    const third = checkRateLimit("k", rule, now);
    expect(third.success).toBe(true);
    expect(third.remaining).toBe(0);

    const blocked = checkRateLimit("k", rule, now);
    expect(blocked.success).toBe(false);
    expect(blocked.remaining).toBe(0);
    expect(blocked.retryAfterSeconds).toBe(1);
  });

  it("frees up capacity once the window slides past old hits", () => {
    const now = 2_000_000;
    checkRateLimit("k", rule, now);
    checkRateLimit("k", rule, now);
    checkRateLimit("k", rule, now);
    expect(checkRateLimit("k", rule, now).success).toBe(false);
    expect(checkRateLimit("k", rule, now + 2000).success).toBe(true);
  });
});

describe("enforceRateLimit", () => {
  it("returns null while under the limit", () => {
    const now = 5_000_000;
    expect(enforceRateLimit(buildRequest({ "x-real-ip": "1.1.1.1" }), "email", now)).toBeNull();
  });

  it("returns a 429 with Retry-After once the email limit is exceeded", async () => {
    const now = 6_000_000;
    const makeRequest = () => buildRequest({ "x-real-ip": "2.2.2.2" });
    for (let index = 0; index < RATE_LIMITS.email.limit; index++) {
      expect(enforceRateLimit(makeRequest(), "email", now)).toBeNull();
    }
    const response = enforceRateLimit(makeRequest(), "email", now);
    expect(response).not.toBeNull();
    expect(response!.status).toBe(429);
    expect(response!.headers.get("Retry-After")).toBeTruthy();
    expect(response!.headers.get("X-RateLimit-Limit")).toBe(String(RATE_LIMITS.email.limit));
    expect((await response!.json()).error).toMatch(/too many requests/i);
  });

  it("tracks limits per IP independently", () => {
    const now = 7_000_000;
    for (let index = 0; index < RATE_LIMITS.email.limit; index++) {
      enforceRateLimit(buildRequest({ "x-real-ip": "3.3.3.3" }), "email", now);
    }
    expect(enforceRateLimit(buildRequest({ "x-real-ip": "4.4.4.4" }), "email", now)).toBeNull();
  });
});
