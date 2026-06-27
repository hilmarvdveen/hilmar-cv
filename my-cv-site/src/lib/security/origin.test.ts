import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import { isAllowedOrigin } from "./origin";

function req(headers: Record<string, string>) {
  return new NextRequest("https://hilmarvanderveen.com/api/contact", {
    method: "POST",
    headers,
  });
}

describe("isAllowedOrigin", () => {
  it("allows the production origin", () => {
    expect(isAllowedOrigin(req({ origin: "https://hilmarvanderveen.com" }))).toBe(true);
    expect(isAllowedOrigin(req({ origin: "https://www.hilmarvanderveen.com" }))).toBe(true);
  });

  it("allows localhost during development/testing", () => {
    expect(isAllowedOrigin(req({ origin: "http://localhost:3000" }))).toBe(true);
  });

  it("rejects a foreign origin", () => {
    expect(isAllowedOrigin(req({ origin: "https://evil.example.com" }))).toBe(false);
  });

  it("falls back to referer when origin is absent", () => {
    expect(isAllowedOrigin(req({ referer: "https://hilmarvanderveen.com/contact" }))).toBe(true);
    expect(isAllowedOrigin(req({ referer: "https://evil.example.com/x" }))).toBe(false);
  });

  it("tolerates a missing origin outside production (test env)", () => {
    expect(isAllowedOrigin(req({}))).toBe(true);
  });

  it("treats a malformed Origin as no origin (falls back to referer/env)", () => {
    // Malformed Origin -> hostFromUrl throws/returns null; with no referer and
    // a non-production env this resolves to allowed.
    expect(isAllowedOrigin(req({ origin: "not a url" }))).toBe(true);
    // Malformed origin but a foreign referer -> rejected.
    expect(
      isAllowedOrigin(req({ origin: "::::", referer: "https://evil.example.com/x" }))
    ).toBe(false);
  });
});
