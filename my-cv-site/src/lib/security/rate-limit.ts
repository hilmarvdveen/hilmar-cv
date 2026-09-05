import { NextRequest, NextResponse } from "next/server";

export type RateLimitRule = { limit: number; windowMs: number };

export const RATE_LIMITS = {
  email: { limit: 5, windowMs: 60_000 },
  read: { limit: 30, windowMs: 60_000 }, // 30 requests / minute / IP
} as const;

export type RateLimitName = keyof typeof RATE_LIMITS;

const store = new Map<string, number[]>();

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

export function __resetRateLimitStore(): void {
  store.clear();
}
