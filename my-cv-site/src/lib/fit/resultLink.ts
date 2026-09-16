import { createHmac, timingSafeEqual } from "node:crypto";
import { BUSINESS_PROFILE } from "@/lib/seo/constants/meta-constants";
import { sanitizeSessionId } from "./report";
import type { FitLocale } from "./types";

export type FitReopenState = "none" | "invalid" | "valid";

export function getFitLinkSecret(): string | null {
  const secret = process.env.FIT_LINK_SECRET;
  return secret ? secret : null;
}

export function signSession(sessionId: string, secret: string): string {
  return createHmac("sha256", secret).update(sessionId).digest("base64url");
}

export function verifySession(sessionId: string, key: string, secret: string): boolean {
  if (!sessionId || !key || !secret) return false;
  const expected = Buffer.from(signSession(sessionId, secret), "utf8");
  const provided = Buffer.from(key, "utf8");
  if (expected.length !== provided.length) return false;
  return timingSafeEqual(expected, provided);
}

export function fitResultPath(locale: FitLocale, sessionId: string, key: string): string {
  const parameters = new URLSearchParams({ result: sessionId, key });
  return `/${locale}/fit?${parameters.toString()}`;
}

export function fitResultUrl(locale: FitLocale, sessionId: string, key: string): string {
  const base = BUSINESS_PROFILE.CONTACT.WEBSITE.replace(/\/+$/, "");
  return `${base}${fitResultPath(locale, sessionId, key)}`;
}

export function fitReopenState(
  session: unknown,
  key: unknown,
  secret: string | null
): FitReopenState {
  if (session === undefined && key === undefined) return "none";
  const sessionId = sanitizeSessionId(session);
  if (!sessionId || typeof key !== "string" || !secret) return "invalid";
  return verifySession(sessionId, key, secret) ? "valid" : "invalid";
}
