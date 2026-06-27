/**
 * Lightweight, dependency-free input validation for the public API routes.
 * Guards against missing fields, malformed emails, and oversized payloads
 * (denial-of-wallet / mailbomb amplification via huge bodies).
 */

export const LIMITS = {
  name: 100,
  email: 254, // RFC 5321 max
  subjectLike: 200,
  message: 5000,
  interestItem: 100,
  interestCount: 20,
} as const;

// Same pragmatic email shape already used across the routes/forms.
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string): boolean {
  return email.length <= LIMITS.email && EMAIL_REGEX.test(email);
}

export interface FieldSpec {
  value: unknown;
  required?: boolean;
  maxLength?: number;
  email?: boolean;
}

export interface ValidationResult {
  ok: boolean;
  error?: string;
}

/**
 * Validate a map of named fields. Returns the first failure, if any.
 * String values are checked for presence (when required) and length.
 */
export function validateFields(fields: Record<string, FieldSpec>): ValidationResult {
  for (const [name, spec] of Object.entries(fields)) {
    const { value, required, maxLength, email } = spec;

    const isEmptyString = typeof value === "string" && value.trim().length === 0;
    const isMissing = value === undefined || value === null || isEmptyString;

    if (required && isMissing) {
      return { ok: false, error: `Field "${name}" is required.` };
    }
    if (isMissing) continue;

    if (typeof value !== "string") {
      return { ok: false, error: `Field "${name}" must be a string.` };
    }
    if (maxLength !== undefined && value.length > maxLength) {
      return { ok: false, error: `Field "${name}" exceeds maximum length.` };
    }
    if (email && !isValidEmail(value)) {
      return { ok: false, error: "Invalid email format." };
    }
  }
  return { ok: true };
}

/** Validate an optional array of short string tags (e.g. contact interests). */
export function validateStringArray(
  value: unknown,
  maxItems = LIMITS.interestCount,
  maxItemLength = LIMITS.interestItem
): ValidationResult {
  if (value === undefined || value === null) return { ok: true };
  if (!Array.isArray(value)) {
    return { ok: false, error: "Expected an array." };
  }
  if (value.length > maxItems) {
    return { ok: false, error: "Too many items." };
  }
  for (const item of value) {
    if (typeof item !== "string" || item.length > maxItemLength) {
      return { ok: false, error: "Invalid array item." };
    }
  }
  return { ok: true };
}
