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
const requestRecentLeads = vi.fn();
vi.mock("@/lib/fit", async () => {
  const actual = await vi.importActual<typeof import("@/lib/fit")>("@/lib/fit");
  return {
    ...actual,
    getFitAgentConfiguration: () => getFitAgentConfiguration(),
    requestRecentLeads: (...parameters: unknown[]) => requestRecentLeads(...parameters),
  };
});

import { GET } from "./route";

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

const CRON_SECRET = "test-cron-secret";

const LEAD = {
  sessionId: "session-id-value-1",
  title: "Senior frontend engineer",
  endClient: "A government body",
  intermediary: "An agency",
  contractForm: "freelance",
  location: "Utrecht",
  closingDate: "2026-09-21",
  rate: { minimum: 95, maximum: 125, unit: "hour", currency: "€" },
  contact: { name: "A recruiter", email: "recruiter@example.com", phone: "", organisation: "" },
  verdictCounts: { inRecord: 8, partly: 2, notInRecord: 1 },
};

const originalEnvironment = { ...process.env };

function get(token?: string) {
  return new NextRequest("https://www.hilmarvanderveen.com/api/fit/leads-digest", {
    method: "GET",
    headers: token ? { authorization: `Bearer ${token}` } : {},
  });
}

beforeEach(() => {
  __resetRateLimitStore();
  process.env.CRON_SECRET = CRON_SECRET;
  getGraphCredentials.mockReset().mockReturnValue(CREDENTIALS);
  getFitAgentConfiguration.mockReset().mockReturnValue(CONFIGURATION);
  requestRecentLeads.mockReset().mockResolvedValue([LEAD]);
  sendMail.mockReset().mockResolvedValue(undefined);
  vi.spyOn(console, "error").mockImplementation(() => undefined);
});

afterEach(() => {
  process.env = { ...originalEnvironment };
});

describe("GET /api/fit/leads-digest", () => {
  it("answers a plain 404 without the cron secret", async () => {
    expect((await GET(get())).status).toBe(404);
    expect((await GET(get("wrong-secret"))).status).toBe(404);
    delete process.env.CRON_SECRET;
    expect((await GET(get(CRON_SECRET))).status).toBe(404);
    expect(requestRecentLeads).not.toHaveBeenCalled();
  });

  it("answers 429 once the read bucket is empty", async () => {
    for (let attempt = 0; attempt < 30; attempt += 1) {
      expect((await GET(get(CRON_SECRET))).status).toBe(200);
    }
    expect((await GET(get(CRON_SECRET))).status).toBe(429);
  });

  it("answers 500 without naming the missing variable", async () => {
    getGraphCredentials.mockReturnValue(null);
    expect((await GET(get(CRON_SECRET))).status).toBe(500);

    getGraphCredentials.mockReturnValue(CREDENTIALS);
    getFitAgentConfiguration.mockReturnValue(null);
    const response = await GET(get(CRON_SECRET));
    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: "Server configuration error" });
  });

  it("asks for the leads of the last seven days and mails the table", async () => {
    const response = await GET(get(CRON_SECRET));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ sent: true, count: 1 });

    const [request] = requestRecentLeads.mock.calls[0] as [unknown, { since: string }];
    expect(request).toBe(CONFIGURATION);
    expect(requestRecentLeads.mock.calls[0][1].since).toMatch(/^\d{4}-\d{2}-\d{2}$/);

    const [, , mail] = sendMail.mock.calls[0] as [unknown, unknown, Record<string, string>];
    expect(mail.to).toBe(CREDENTIALS.smtpUser);
    expect(mail.subject).toContain("1 nieuwe vacatures");
    expect(mail.body).toContain("Senior frontend engineer");
    expect(mail.body).toContain("Freelance");
  });

  it("sends nothing when no vacancy came through", async () => {
    requestRecentLeads.mockResolvedValue([]);
    const response = await GET(get(CRON_SECRET));
    expect(await response.json()).toEqual({ sent: false, count: 0 });
    expect(sendMail).not.toHaveBeenCalled();
  });

  it("answers 500 when the agent or the mail fails", async () => {
    requestRecentLeads.mockRejectedValue(new Error("The fit agent answered 502"));
    const response = await GET(get(CRON_SECRET));
    expect(response.status).toBe(500);
    expect(JSON.stringify(await response.json())).not.toContain("502");
  });
});
