export type SecretExpiryLevel = "unknown" | "expired" | "urgent" | "soon" | "fine";

export type SecretExpiry = {
  level: SecretExpiryLevel;
  daysLeft: number | null;
  expiresOn: string | null;
};

const DATE_KEY = /^\d{4}-\d{2}-\d{2}$/;
const DAY_MILLISECONDS = 24 * 60 * 60 * 1000;
export const URGENT_DAYS = 7;
export const SOON_DAYS = 30;

export function describeSecretExpiry(expiresOn: string | undefined, now: Date): SecretExpiry {
  if (!expiresOn || !DATE_KEY.test(expiresOn)) return { level: "unknown", daysLeft: null, expiresOn: null };
  const expiry = new Date(`${expiresOn}T00:00:00Z`);
  if (Number.isNaN(expiry.getTime())) return { level: "unknown", daysLeft: null, expiresOn: null };
  const daysLeft = Math.floor((expiry.getTime() - now.getTime()) / DAY_MILLISECONDS);
  if (daysLeft < 0) return { level: "expired", daysLeft, expiresOn };
  if (daysLeft <= URGENT_DAYS) return { level: "urgent", daysLeft, expiresOn };
  if (daysLeft <= SOON_DAYS) return { level: "soon", daysLeft, expiresOn };
  return { level: "fine", daysLeft, expiresOn };
}
