import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { __resetRateLimitStore } from "@/lib/security/rate-limit";

// Mock the Graph layer so no network calls happen.
const sendMail = vi.fn();
const getGraphCredentials = vi.fn();
vi.mock("@/lib/graph", () => ({
  getGraphCredentials: () => getGraphCredentials(),
  getAccessToken: vi.fn(async () => "token"),
  getGraphClient: vi.fn(() => ({})),
  sendMail: (...args: unknown[]) => sendMail(...args),
}));

import { POST } from "./route";

const CREDS = {
  clientId: "id",
  clientSecret: "secret",
  tenantId: "tenant",
  smtpUser: "hilmar@hilmarvanderveen.com",
};

function post(body: unknown, headers: Record<string, string> = {}) {
  return new NextRequest("https://hilmarvanderveen.com/api/contact", {
    method: "POST",
    headers: {
      origin: "https://hilmarvanderveen.com",
      "content-type": "application/json",
      ...headers,
    },
    body: JSON.stringify(body),
  });
}

const valid = {
  name: "Jane Doe",
  email: "jane@example.com",
  message: "Hello there",
  formStartedAt: Date.now() - 10000,
};

beforeEach(() => {
  __resetRateLimitStore();
  sendMail.mockReset();
  sendMail.mockResolvedValue(undefined);
  getGraphCredentials.mockReset();
  getGraphCredentials.mockReturnValue(CREDS);
});

describe("POST /api/contact", () => {
  it("rejects cross-origin requests with 403", async () => {
    const res = await POST(post(valid, { origin: "https://evil.example.com" }));
    expect(res.status).toBe(403);
    expect(sendMail).not.toHaveBeenCalled();
  });

  it("returns 400 when required fields are missing", async () => {
    const res = await POST(post({ ...valid, email: "" }));
    expect(res.status).toBe(400);
    expect(sendMail).not.toHaveBeenCalled();
  });

  it("returns 400 on invalid email", async () => {
    const res = await POST(post({ ...valid, email: "not-an-email" }));
    expect(res.status).toBe(400);
  });

  it("silently succeeds and sends nothing when the honeypot is filled", async () => {
    const res = await POST(post({ ...valid, company_website: "bot" }));
    expect(res.status).toBe(200);
    expect(sendMail).not.toHaveBeenCalled();
  });

  it("returns 500 (config error) when Graph credentials are missing", async () => {
    getGraphCredentials.mockReturnValue(null);
    const res = await POST(post(valid));
    expect(res.status).toBe(500);
    expect(await res.json()).toMatchObject({ error: "Server configuration error" });
    expect(sendMail).not.toHaveBeenCalled();
  });

  it("sends both emails on the happy path", async () => {
    const res = await POST(post(valid));
    expect(res.status).toBe(200);
    expect(sendMail).toHaveBeenCalledTimes(2);
  });

  it("escapes user input in the HTML confirmation email", async () => {
    await POST(post({ ...valid, name: '<img src=x onerror=alert(1)>' }));
    // Second call is the HTML confirmation to the sender.
    const htmlCall = sendMail.mock.calls.find((c) => c[2]?.isHtml === true);
    expect(htmlCall).toBeTruthy();
    const body: string = htmlCall![2].body;
    expect(body).not.toContain("<img src=x");
    expect(body).toContain("&lt;img src=x");
  });

  it("returns a generic 500 without leaking details on Graph failure", async () => {
    sendMail.mockRejectedValueOnce(new Error("super secret graph internals"));
    const res = await POST(post(valid));
    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.error).toBe("Failed to send message");
    expect(JSON.stringify(json)).not.toContain("super secret graph internals");
  });
});
