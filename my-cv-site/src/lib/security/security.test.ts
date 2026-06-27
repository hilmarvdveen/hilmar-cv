import { describe, it, expect } from "vitest";
import { escapeHtml } from "./escape";
import { validateFields, validateStringArray, isValidEmail, LIMITS } from "./validate";
import { isHoneypotTriggered, isSubmittedTooFast, looksAutomated } from "./honeypot";

describe("escapeHtml", () => {
  it("escapes HTML-significant characters", () => {
    expect(escapeHtml(`<script>alert("x")</script>`)).toBe(
      "&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;"
    );
    expect(escapeHtml("a & b")).toBe("a &amp; b");
    expect(escapeHtml("it's")).toBe("it&#39;s");
  });

  it("leaves plain text unchanged", () => {
    expect(escapeHtml("Hilmar van der Veen")).toBe("Hilmar van der Veen");
  });
});

describe("isValidEmail", () => {
  it("accepts well-formed addresses", () => {
    expect(isValidEmail("a@b.co")).toBe(true);
  });
  it("rejects malformed addresses", () => {
    expect(isValidEmail("nope")).toBe(false);
    expect(isValidEmail("a@b")).toBe(false);
    expect(isValidEmail("a @b.co")).toBe(false);
  });
  it("rejects addresses over the length cap", () => {
    expect(isValidEmail("a".repeat(250) + "@b.co")).toBe(false);
  });
});

describe("validateFields", () => {
  it("passes valid required fields", () => {
    expect(
      validateFields({
        name: { value: "Jane", required: true, maxLength: LIMITS.name },
        email: { value: "jane@example.com", required: true, email: true },
      }).ok
    ).toBe(true);
  });

  it("fails on missing required field", () => {
    const r = validateFields({ name: { value: "  ", required: true } });
    expect(r.ok).toBe(false);
    expect(r.error).toMatch(/required/i);
  });

  it("fails on oversized field", () => {
    const r = validateFields({ name: { value: "x".repeat(101), maxLength: 100 } });
    expect(r.ok).toBe(false);
    expect(r.error).toMatch(/maximum length/i);
  });

  it("fails on invalid email", () => {
    const r = validateFields({ email: { value: "bad", email: true } });
    expect(r.ok).toBe(false);
  });

  it("skips optional empty fields", () => {
    expect(validateFields({ message: { value: "", maxLength: 10 } }).ok).toBe(true);
  });

  it("rejects a non-string value supplied for a present field", () => {
    const r = validateFields({ name: { value: 42 as unknown as string } });
    expect(r.ok).toBe(false);
    expect(r.error).toMatch(/must be a string/i);
  });
});

describe("validateStringArray", () => {
  it("accepts undefined and small arrays", () => {
    expect(validateStringArray(undefined).ok).toBe(true);
    expect(validateStringArray(["a", "b"]).ok).toBe(true);
  });
  it("rejects too many items", () => {
    expect(validateStringArray(Array(21).fill("x")).ok).toBe(false);
  });
  it("rejects non-arrays and bad items", () => {
    expect(validateStringArray("nope").ok).toBe(false);
    expect(validateStringArray([123]).ok).toBe(false);
  });
});

describe("honeypot + timing", () => {
  it("flags a filled honeypot", () => {
    expect(isHoneypotTriggered({ company_website: "spam" })).toBe(true);
    expect(isHoneypotTriggered({ company_website: "" })).toBe(false);
    expect(isHoneypotTriggered({})).toBe(false);
  });

  it("flags submissions faster than the minimum fill time", () => {
    const now = 1_000_000;
    expect(isSubmittedTooFast({ formStartedAt: now - 500 }, now)).toBe(true);
    expect(isSubmittedTooFast({ formStartedAt: now - 5000 }, now)).toBe(false);
  });

  it("does not flag when timestamp is missing or non-finite", () => {
    expect(isSubmittedTooFast({}, 1000)).toBe(false);
    expect(isSubmittedTooFast({ formStartedAt: NaN }, 1000)).toBe(false);
    expect(isSubmittedTooFast({ formStartedAt: "123" as unknown as number }, 1000)).toBe(false);
  });

  it("looksAutomated combines both signals", () => {
    const now = 1_000_000;
    expect(looksAutomated({ company_website: "x", formStartedAt: now - 10000 }, now)).toBe(true);
    expect(looksAutomated({ formStartedAt: now - 100 }, now)).toBe(true);
    expect(looksAutomated({ formStartedAt: now - 10000 }, now)).toBe(false);
  });
});
