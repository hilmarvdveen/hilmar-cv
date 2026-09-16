import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { __resetRateLimitStore } from "@/lib/security/rate-limit";

const getGraphCredentials = vi.fn();
const sendMail = vi.fn();
vi.mock("@/lib/graph", async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>;
  return {
    ...actual,
    getGraphCredentials: () => getGraphCredentials(),
    getAccessToken: vi.fn(async () => "token"),
    getGraphClient: vi.fn(() => ({})),
    sendMail: (...parameters: unknown[]) => sendMail(...parameters),
  };
});

const getFitAgentConfiguration = vi.fn();
const reportRequesterEmailDomain = vi.fn();
vi.mock("@/lib/fit", async () => {
  const actual = await vi.importActual<typeof import("@/lib/fit")>("@/lib/fit");
  return {
    ...actual,
    getFitAgentConfiguration: () => getFitAgentConfiguration(),
    reportRequesterEmailDomain: (...parameters: unknown[]) =>
      reportRequesterEmailDomain(...parameters),
  };
});

import { POST } from "./route";
import { signSession } from "@/lib/fit/resultLink";

const CREDENTIALS = {
  clientId: "id",
  clientSecret: "secret",
  tenantId: "tenant",
  smtpUser: "hilmar@hilmarvanderveen.com",
};

const CONFIGURATION = {
  url: "https://agent.example.com",
  token: "secret-token",
  timeoutMilliseconds: 50_000,
};

const LINK_SECRET = "a-long-random-signing-secret";
const SESSION = "session-id-value-1";

const originalEnvironment = { ...process.env };

function post(body: unknown, headers: Record<string, string> = {}) {
  return new NextRequest("https://www.hilmarvanderveen.com/api/fit/cv-request", {
    method: "POST",
    headers: {
      origin: "https://www.hilmarvanderveen.com",
      "content-type": "application/json",
      "x-forwarded-for": "203.0.113.7",
      ...headers,
    },
    body: JSON.stringify(body),
  });
}

const valid = () => ({
  sessionId: SESSION,
  name: "Jane Doe",
  email: "jane@Example.com",
  organisation: "Acme",
  locale: "nl",
  formStartedAt: Date.now() - 10_000,
});

beforeEach(() => {
  __resetRateLimitStore();
  process.env.FIT_LINK_SECRET = LINK_SECRET;
  getGraphCredentials.mockReset().mockReturnValue(CREDENTIALS);
  getFitAgentConfiguration.mockReset().mockReturnValue(CONFIGURATION);
  reportRequesterEmailDomain.mockReset().mockResolvedValue(undefined);
  sendMail.mockReset().mockResolvedValue(undefined);
  vi.spyOn(console, "error").mockImplementation(() => undefined);
});

afterEach(() => {
  process.env = { ...originalEnvironment };
});

describe("POST /api/fit/cv-request", () => {
  it("refuses a cross-site origin with 403", async () => {
    const response = await POST(post(valid(), { origin: "https://evil.example.com" }));
    expect(response.status).toBe(403);
    expect(sendMail).not.toHaveBeenCalled();
  });

  it("answers 429 with Retry-After once the fit bucket is empty", async () => {
    for (let attempt = 0; attempt < 10; attempt += 1) {
      expect((await POST(post(valid()))).status).toBe(200);
    }
    const response = await POST(post(valid()));
    expect(response.status).toBe(429);
    expect(response.headers.get("Retry-After")).toBeTruthy();
  });

  it("succeeds silently on the honeypot without sending a mail", async () => {
    const response = await POST(post({ ...valid(), company_website: "bot" }));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ sent: true });
    expect(sendMail).not.toHaveBeenCalled();
  });

  it("answers 400 on a missing name, an unusable address and an unusable session", async () => {
    expect((await POST(post({ ...valid(), name: "" }))).status).toBe(400);
    expect((await POST(post({ ...valid(), email: "not-an-address" }))).status).toBe(400);
    expect((await POST(post({ ...valid(), sessionId: "short" }))).status).toBe(400);
    expect(sendMail).not.toHaveBeenCalled();
  });

  it("answers 500 without naming the missing variable", async () => {
    getGraphCredentials.mockReturnValue(null);
    expect((await POST(post(valid()))).status).toBe(500);

    getGraphCredentials.mockReturnValue(CREDENTIALS);
    delete process.env.FIT_LINK_SECRET;
    const response = await POST(post(valid()));
    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: "Server configuration error" });
  });

  it("mails the visitor the signed link and the owner the lead", async () => {
    const response = await POST(post(valid()));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ sent: true });
    expect(sendMail).toHaveBeenCalledTimes(2);

    const expectedLink = `https://www.hilmarvanderveen.com/nl/fit?result=${SESSION}&amp;key=${signSession(
      SESSION,
      LINK_SECRET
    )}`;

    const [, , visitorMail] = sendMail.mock.calls[0] as [unknown, unknown, Record<string, string>];
    expect(visitorMail.to).toBe("jane@Example.com");
    expect(visitorMail.body).toContain(expectedLink);

    const [, , ownerMail] = sendMail.mock.calls[1] as [unknown, unknown, Record<string, string>];
    expect(ownerMail.to).toBe(CREDENTIALS.smtpUser);
    expect(ownerMail.replyTo).toBe("jane@Example.com");
    expect(ownerMail.body).toContain("Jane Doe");
    expect(ownerMail.body).toContain("Acme");
    expect(ownerMail.body).toContain(SESSION);
  });

  it("tells the agent the requester domain without the address", async () => {
    await POST(post(valid()));
    expect(reportRequesterEmailDomain).toHaveBeenCalledWith(CONFIGURATION, {
      sessionId: SESSION,
      emailDomain: "example.com",
      clientAddress: "203.0.113.7",
    });
  });

  it("still answers sent when the requester call fails or the agent is not configured", async () => {
    reportRequesterEmailDomain.mockRejectedValue(new Error("The fit agent answered 500"));
    expect((await POST(post(valid()))).status).toBe(200);

    getFitAgentConfiguration.mockReturnValue(null);
    const response = await POST(post(valid()));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ sent: true });
    expect(sendMail).toHaveBeenCalledTimes(4);
  });

  it("answers 500 with a generic message when the mail fails", async () => {
    sendMail.mockRejectedValue(new Error("Graph refused"));
    const response = await POST(post(valid()));
    expect(response.status).toBe(500);
    expect(await response.json()).toMatchObject({
      error: "The CV request did not come through",
    });
  });
});
