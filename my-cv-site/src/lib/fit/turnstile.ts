export const TURNSTILE_VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export const TURNSTILE_SCRIPT_URL = "https://challenges.cloudflare.com/turnstile/v0/api.js";

export { TURNSTILE_TOKEN_FIELD, turnstileTokenFrom } from "./turnstileField";

const VERIFY_TIMEOUT_MILLISECONDS = 8_000;

export type TurnstileConfiguration = {
  secretKey: string;
};

export function getTurnstileSiteKey(): string | null {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  return siteKey ? siteKey : null;
}

export function getTurnstileConfiguration(): TurnstileConfiguration | null {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;
  if (!secretKey || !getTurnstileSiteKey()) return null;
  return { secretKey };
}

export type TurnstileVerification = {
  token: unknown;
  clientAddress: string;
};

export async function verifyTurnstileToken(
  configuration: TurnstileConfiguration,
  { token, clientAddress }: TurnstileVerification
): Promise<boolean> {
  if (typeof token !== "string" || token.trim() === "") return false;

  const form = new URLSearchParams({
    secret: configuration.secretKey,
    response: token.trim(),
    remoteip: clientAddress,
  });

  try {
    const response = await fetch(TURNSTILE_VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form.toString(),
      signal: AbortSignal.timeout(VERIFY_TIMEOUT_MILLISECONDS),
      cache: "no-store",
    });
    if (!response.ok) return false;
    const body = (await response.json()) as { success?: unknown };
    return body.success === true;
  } catch {
    return false;
  }
}
