import { timingSafeEqual } from "node:crypto";
import { NextRequest } from "next/server";

const BEARER_PREFIX = "Bearer ";

const matchesSecret = (provided: string, expected: string): boolean => {
  const providedBytes = Buffer.from(provided, "utf8");
  const expectedBytes = Buffer.from(expected, "utf8");
  if (providedBytes.length !== expectedBytes.length) return false;
  return timingSafeEqual(providedBytes, expectedBytes);
};

export function isAuthorizedCron(request: NextRequest): boolean {
  const expectedSecret = process.env.CRON_SECRET;
  if (!expectedSecret) return false;
  const authorizationHeader = request.headers.get("authorization");
  if (!authorizationHeader?.startsWith(BEARER_PREFIX)) return false;
  return matchesSecret(authorizationHeader.slice(BEARER_PREFIX.length), expectedSecret);
}
