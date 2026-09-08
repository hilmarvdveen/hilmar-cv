import { describe, expect, it, vi } from "vitest";
import { NextRequest, NextResponse } from "next/server";

vi.mock("next-intl/middleware", () => ({
  default: () => () => NextResponse.next(),
}));

const { default: proxy } = await import("./proxy");

const directive = (policy: string, name: string) =>
  policy
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name} `)) ?? "";

describe("proxy", () => {
  it("sets a per-request nonce and a content security policy", async () => {
    const response = await proxy(new NextRequest("https://www.hilmarvanderveen.com/nl"));
    const nonce = response.headers.get("x-nonce");
    const policy = response.headers.get("Content-Security-Policy") ?? "";
    expect(nonce).toBeTruthy();
    expect(directive(policy, "script-src")).toContain(`'nonce-${nonce}'`);
    expect(directive(policy, "script-src")).toContain("'strict-dynamic'");
    expect(directive(policy, "frame-ancestors")).toBe("frame-ancestors 'none'");
  });

  it("lets Google Analytics 4 report through Tag Manager from every collection host", async () => {
    const response = await proxy(new NextRequest("https://www.hilmarvanderveen.com/nl"));
    const connect = directive(response.headers.get("Content-Security-Policy") ?? "", "connect-src");
    for (const host of [
      "https://*.google-analytics.com",
      "https://*.analytics.google.com",
      "https://www.googletagmanager.com",
      "https://*.g.doubleclick.net",
    ]) {
      expect(connect).toContain(host);
    }
  });

  it("issues a different nonce on every request", async () => {
    const first = await proxy(new NextRequest("https://www.hilmarvanderveen.com/nl"));
    const second = await proxy(new NextRequest("https://www.hilmarvanderveen.com/en"));
    expect(first.headers.get("x-nonce")).not.toBe(second.headers.get("x-nonce"));
  });
});
