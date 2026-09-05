import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import { isAllowedOrigin } from "./origin";

function buildRequest(headers: Record<string, string>) {
  return new NextRequest("https://www.hilmarvanderveen.com/api/contact", {
    method: "POST",
    headers,
  });
}

describe("isAllowedOrigin", () => {
  it("allows the production origin", () => {
    expect(isAllowedOrigin(buildRequest({ origin: "https://www.hilmarvanderveen.com" }))).toBe(true);
    expect(isAllowedOrigin(buildRequest({ origin: "https://www.hilmarvanderveen.com" }))).toBe(true);
  });

  it("allows localhost during development/testing", () => {
    expect(isAllowedOrigin(buildRequest({ origin: "http://localhost:3000" }))).toBe(true);
  });

  it("rejects a foreign origin", () => {
    expect(isAllowedOrigin(buildRequest({ origin: "https://evil.example.com" }))).toBe(false);
  });

  it("falls back to referer when origin is absent", () => {
    expect(isAllowedOrigin(buildRequest({ referer: "https://www.hilmarvanderveen.com/contact" }))).toBe(true);
    expect(isAllowedOrigin(buildRequest({ referer: "https://evil.example.com/x" }))).toBe(false);
  });

  it("tolerates a missing origin outside production (test env)", () => {
    expect(isAllowedOrigin(buildRequest({}))).toBe(true);
  });

  it("treats a malformed Origin as no origin (falls back to referer/env)", () => {
    // Malformed Origin -> hostFromUrl throws/returns null; with no referer and
    // a non-production env this resolves to allowed.
    expect(isAllowedOrigin(buildRequest({ origin: "not a url" }))).toBe(true);
    // Malformed origin but a foreign referer -> rejected.
    expect(
      isAllowedOrigin(buildRequest({ origin: "::::", referer: "https://evil.example.com/x" }))
    ).toBe(false);
  });
});
