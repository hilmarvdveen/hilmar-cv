import { NextRequest, NextResponse } from "next/server";

/**
 * Per-IP rate limiting.
 *
 * Limits are based on common guidance for form / email-sending endpoints
 * (OWASP automated-threats, Cloudflare/Upstash examples): keep state-changing,
 * email-sending routes tight to prevent spam, mailbombing and denial-of-wallet,
 * while allowing a few legitimate retries; keep read-only endpoints looser.
 *
 * NOTE: this is an in-memory sliding window — effective per serverless instance
 * and great for a personal-site traffic profile. For multi-region / high scale,
 * back it with a shared store (e.g. @upstash/ratelimit + Upstash Redis) keyed by
 * the same IP; the call sites below would not need to change.
 */
export type RateLimitRule = { limit: number; windowMs: number };

export const RATE_LIMITS = {
  // contact, cv-download, booking — each sends email via Microsoft Graph.
  email: { limit: 5, windowMs: 60_000 }, // 5 requests / minute / IP
  // booking slots — read-only, fired on each date selection.
  read: { limit: 30, windowMs: 60_000 }, // 30 requests / minute / IP
} as const;

export type RateLimitName = keyof typeof RATE_LIMITS;

// IP -> recent hit timestamps (ms). Per-instance; resets on cold start.
const store = new Map<string, number[]>();

/** Best-effort client IP from the proxy headers Vercel/Node set. */
export function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return request.headers.get("x-real-ip") ?? "127.0.0.1";
}

export type RateLimitResult = {
  success: boolean;
  limit: number;
  remaining: number;
  retryAfterSeconds: number;
};

/** Sliding-window check for a single key. Pure aside from the module store. */
export function checkRateLimit(
  key: string,
  rule: RateLimitRule,
  now: number
): RateLimitResult {
  const windowStart = now - rule.windowMs;
  const hits = (store.get(key) ?? []).filter((t) => t > windowStart);

  if (hits.length >= rule.limit) {
    store.set(key, hits);
    const retryAfterSeconds = Math.ceil((hits[0]! + rule.windowMs - now) / 1000);
    return { success: false, limit: rule.limit, remaining: 0, retryAfterSeconds };
  }

  hits.push(now);
  store.set(key, hits);
  return {
    success: true,
    limit: rule.limit,
    remaining: rule.limit - hits.length,
    retryAfterSeconds: 0,
  };
}

/**
 * Enforce a named rate limit for a request. Returns a ready-to-send 429
 * response when the limit is exceeded, or null when the request may proceed.
 */
export function enforceRateLimit(
  request: NextRequest,
  name: RateLimitName,
  now: number = Date.now()
): NextResponse | null {
  const rule = RATE_LIMITS[name];
  const ip = getClientIp(request);
  const result = checkRateLimit(`${name}:${ip}`, rule, now);

  if (result.success) return null;

  return NextResponse.json(
    { error: "Too many requests. Please try again later." },
    {
      status: 429,
      headers: {
        "Retry-After": String(result.retryAfterSeconds),
        "X-RateLimit-Limit": String(result.limit),
        "X-RateLimit-Remaining": "0",
      },
    }
  );
}

/** Test helper: clear the in-memory store. */
export function __resetRateLimitStore(): void {
  store.clear();
}
