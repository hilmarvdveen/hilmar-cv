import { NextRequest, NextResponse } from "next/server";

export type RateLimitRule = { limit: number; windowMilliseconds: number };

export const RATE_LIMITS = {
  email: { limit: 5, windowMilliseconds: 60_000 },
  read: { limit: 30, windowMilliseconds: 60_000 },
  fit: { limit: 10, windowMilliseconds: 60_000 },
  fitStatus: { limit: 60, windowMilliseconds: 60_000 },
} as const;

export type RateLimitName = keyof typeof RATE_LIMITS;

const store = new Map<string, number[]>();

export function getClientIp(request: NextRequest): string {
  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const hops = forwarded.split(",").map((hop) => hop.trim()).filter((hop) => hop !== "");
    const lastHop = hops[hops.length - 1];
    if (lastHop) return lastHop;
  }
  return "127.0.0.1";
}

export type RateLimitResult = {
  success: boolean;
  limit: number;
  remaining: number;
  retryAfterSeconds: number;
};

export function checkRateLimit(
  key: string,
  rule: RateLimitRule,
  now: number
): RateLimitResult {
  const windowStart = now - rule.windowMilliseconds;
  const hits = (store.get(key) ?? []).filter((hit) => hit > windowStart);

  if (hits.length >= rule.limit) {
    store.set(key, hits);
    const retryAfterSeconds = Math.ceil((hits[0]! + rule.windowMilliseconds - now) / 1000);
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

export function tooManyRequestsResponse(retryAfterSeconds: number): NextResponse {
  return NextResponse.json(
    { error: "Too many requests. Please try again later.", retryAfterSeconds },
    { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } }
  );
}

export function enforceRateLimit(
  request: NextRequest,
  name: RateLimitName,
  now: number = Date.now()
): NextResponse | null {
  const rule = RATE_LIMITS[name];
  const clientAddress = getClientIp(request);
  const result = checkRateLimit(`${name}:${clientAddress}`, rule, now);

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

export function __resetRateLimitStore(): void {
  store.clear();
}
