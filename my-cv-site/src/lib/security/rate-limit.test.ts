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

function req(headers: Record<string, string> = {}) {
  return new NextRequest("https://www.hilmarvanderveen.com/api/contact", {
    method: "POST",
    headers,
  });
}

describe("getClientIp", () => {
  it("uses the first x-forwarded-for entry", () => {
    expect(getClientIp(req({ "x-forwarded-for": "203.0.113.7, 70.41.3.18" }))).toBe("203.0.113.7");
  });
  it("falls back to x-real-ip, then a default", () => {
    expect(getClientIp(req({ "x-real-ip": "198.51.100.2" }))).toBe("198.51.100.2");
    expect(getClientIp(req({}))).toBe("127.0.0.1");
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
    // Far enough in the future that all earlier hits expired.
    expect(checkRateLimit("k", rule, now + 2000).success).toBe(true);
  });
});

describe("enforceRateLimit", () => {
  it("returns null while under the limit", () => {
    const now = 5_000_000;
    expect(enforceRateLimit(req({ "x-real-ip": "1.1.1.1" }), "email", now)).toBeNull();
  });

  it("returns a 429 with Retry-After once the email limit is exceeded", async () => {
    const now = 6_000_000;
    const r = () => req({ "x-real-ip": "2.2.2.2" });
    for (let i = 0; i < RATE_LIMITS.email.limit; i++) {
      expect(enforceRateLimit(r(), "email", now)).toBeNull();
    }
    const res = enforceRateLimit(r(), "email", now);
    expect(res).not.toBeNull();
    expect(res!.status).toBe(429);
    expect(res!.headers.get("Retry-After")).toBeTruthy();
    expect(res!.headers.get("X-RateLimit-Limit")).toBe(String(RATE_LIMITS.email.limit));
    expect((await res!.json()).error).toMatch(/too many requests/i);
  });

  it("tracks limits per IP independently", () => {
    const now = 7_000_000;
    for (let i = 0; i < RATE_LIMITS.email.limit; i++) {
      enforceRateLimit(req({ "x-real-ip": "3.3.3.3" }), "email", now);
    }
    // A different IP is unaffected.
    expect(enforceRateLimit(req({ "x-real-ip": "4.4.4.4" }), "email", now)).toBeNull();
  });
});
