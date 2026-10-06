
export const HONEYPOT_FIELD = "company_website";
const MIN_FILL_MS = 2000;

export type AutomatedSignal = "honeypot" | "tooFast";

export function isHoneypotTriggered(body: Record<string, unknown>): boolean {
  const value = body[HONEYPOT_FIELD];
  return typeof value === "string" && value.trim().length > 0;
}

export function isSubmittedTooFast(body: Record<string, unknown>, now: number): boolean {
  const started = body.formStartedAt;
  if (typeof started !== "number" || !Number.isFinite(started)) {
    return false;
  }
  return now - started < MIN_FILL_MS;
}

export function automatedSignal(
  body: Record<string, unknown>,
  now: number
): AutomatedSignal | null {
  if (isHoneypotTriggered(body)) return "honeypot";
  if (isSubmittedTooFast(body, now)) return "tooFast";
  return null;
}

export function looksAutomated(body: Record<string, unknown>, now: number): boolean {
  return automatedSignal(body, now) !== null;
}
