/**
 * Bot mitigation that needs no third-party service.
 *
 * 1. Honeypot: forms render a hidden `company_website` field that real users
 *    never see. Any non-empty value means a bot auto-filled it.
 * 2. Timing guard: forms send `formStartedAt` (ms epoch from render). A
 *    submission faster than MIN_FILL_MS is almost certainly automated.
 */

export const HONEYPOT_FIELD = "company_website";
const MIN_FILL_MS = 2000;

export function isHoneypotTriggered(body: Record<string, unknown>): boolean {
  const value = body[HONEYPOT_FIELD];
  return typeof value === "string" && value.trim().length > 0;
}

export function isSubmittedTooFast(body: Record<string, unknown>, now: number): boolean {
  const started = body.formStartedAt;
  if (typeof started !== "number" || !Number.isFinite(started)) {
    // Missing/invalid timestamp is not treated as a hard failure on its own;
    // the honeypot remains the primary signal.
    return false;
  }
  return now - started < MIN_FILL_MS;
}

/** Returns true when the submission looks like a bot (honeypot or too fast). */
export function looksAutomated(body: Record<string, unknown>, now: number): boolean {
  return isHoneypotTriggered(body) || isSubmittedTooFast(body, now);
}
