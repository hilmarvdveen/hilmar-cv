import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NextRequest } from "next/server";
import { GET } from "./route";

vi.mock("@/lib/graph/client", () => ({
  getGraphCredentials: vi.fn(),
  getAccessToken: vi.fn(),
  getGraphClient: vi.fn(),
}));

import {
  getGraphCredentials,
  getAccessToken,
  getGraphClient,
} from "@/lib/graph/client";

const DIAGNOSTICS_TOKEN = "test-diagnostics-token";

function makeRequest(token?: string): NextRequest {
  return new NextRequest("http://localhost/api/booking/health", {
    headers: token ? { "x-diagnostics-token": token } : {},
  });
}

function mockGraphClient(overrides: {
  mailboxError?: unknown;
  calendarError?: unknown;
} = {}) {
  const get = vi.fn(async function (this: { path?: string }) {
    return {};
  });
  const api = vi.fn((path: string) => {
    const chain = {
      select: vi.fn(() => chain),
      query: vi.fn(() => chain),
      header: vi.fn(() => chain),
      get: vi.fn(async () => {
        if (path.endsWith("/calendarview")) {
          if (overrides.calendarError) throw overrides.calendarError;
          return { value: [] };
        }
        if (overrides.mailboxError) throw overrides.mailboxError;
        return { id: "mailbox-id" };
      }),
    };
    return chain;
  });
  return { api, get };
}

const credentials = {
  clientId: "client-id",
  clientSecret: "client-secret",
  tenantId: "tenant-id",
  smtpUser: "owner@example.com",
};

beforeEach(() => {
  vi.resetAllMocks();
  process.env.DIAGNOSTICS_TOKEN = DIAGNOSTICS_TOKEN;
  process.env.MS_CLIENT_ID = "client-id";
  process.env.MS_CLIENT_SECRET = "client-secret";
  process.env.MS_TENANT_ID = "tenant-id";
  process.env.SMTP_USER = "owner@example.com";
});

afterEach(() => {
  delete process.env.DIAGNOSTICS_TOKEN;
});

describe("GET /api/booking/health", () => {
  it("returns 404 when DIAGNOSTICS_TOKEN is not configured", async () => {
    delete process.env.DIAGNOSTICS_TOKEN;
    const response = await GET(makeRequest(DIAGNOSTICS_TOKEN));
    expect(response.status).toBe(404);
  });

  it("returns 404 when the header token does not match", async () => {
    const response = await GET(makeRequest("wrong-token"));
    expect(response.status).toBe(404);
  });

  it("reports missing environment variables by name", async () => {
    delete process.env.MS_CLIENT_SECRET;
    vi.mocked(getGraphCredentials).mockReturnValue(null);

    const response = await GET(makeRequest(DIAGNOSTICS_TOKEN));
    const body = await response.json();

    expect(body.healthy).toBe(false);
    expect(body.steps[0].step).toBe("environment");
    expect(body.steps[0].ok).toBe(false);
    expect(body.steps[0].detail).toContain("MS_CLIENT_SECRET");
  });

  it("reports a failed token acquisition with the expired-secret hint", async () => {
    vi.mocked(getGraphCredentials).mockReturnValue(credentials);
    vi.mocked(getAccessToken).mockRejectedValue(
      new Error("AADSTS7000222: The provided client secret keys are expired")
    );

    const response = await GET(makeRequest(DIAGNOSTICS_TOKEN));
    const body = await response.json();

    expect(body.healthy).toBe(false);
    const tokenStep = body.steps.find(
      (step: { step: string }) => step.step === "token"
    );
    expect(tokenStep.ok).toBe(false);
    expect(tokenStep.detail).toContain("AADSTS7000222");
    expect(tokenStep.detail).toContain("EXPIRED");
  });

  it("reports an unreachable mailbox with the permissions hint", async () => {
    vi.mocked(getGraphCredentials).mockReturnValue(credentials);
    vi.mocked(getAccessToken).mockResolvedValue("token");
    const client = mockGraphClient({
      mailboxError: { statusCode: 403, code: "Authorization_RequestDenied" },
    });
    vi.mocked(getGraphClient).mockReturnValue(
      client as unknown as ReturnType<typeof getGraphClient>
    );

    const response = await GET(makeRequest(DIAGNOSTICS_TOKEN));
    const body = await response.json();

    expect(body.healthy).toBe(false);
    const mailboxStep = body.steps.find(
      (step: { step: string }) => step.step === "mailbox"
    );
    expect(mailboxStep.ok).toBe(false);
    expect(mailboxStep.detail).toContain("status 403");
    expect(mailboxStep.detail).toContain("admin");
  });

  it("reports healthy when every stage succeeds", async () => {
    vi.mocked(getGraphCredentials).mockReturnValue(credentials);
    vi.mocked(getAccessToken).mockResolvedValue("token");
    const client = mockGraphClient();
    vi.mocked(getGraphClient).mockReturnValue(
      client as unknown as ReturnType<typeof getGraphClient>
    );

    const response = await GET(makeRequest(DIAGNOSTICS_TOKEN));
    const body = await response.json();

    expect(body.healthy).toBe(true);
    expect(body.steps.map((step: { step: string }) => step.step)).toEqual([
      "environment",
      "token",
      "mailbox",
      "calendar",
    ]);
    expect(
      body.steps.every((step: { ok: boolean }) => step.ok)
    ).toBe(true);
  });

  it("reads the mailbox calendar instead of the bare user endpoint", async () => {
    vi.mocked(getGraphCredentials).mockReturnValue(credentials);
    vi.mocked(getAccessToken).mockResolvedValue("token");
    const client = mockGraphClient();
    vi.mocked(getGraphClient).mockReturnValue(
      client as unknown as ReturnType<typeof getGraphClient>
    );

    await GET(makeRequest(DIAGNOSTICS_TOKEN));

    expect(client.api).toHaveBeenCalledWith(`/users/${credentials.smtpUser}/calendar`);
    expect(client.api).not.toHaveBeenCalledWith(`/users/${credentials.smtpUser}`);
  });

  it("reports a missing or unlicensed mailbox on a 404", async () => {
    vi.mocked(getGraphCredentials).mockReturnValue(credentials);
    vi.mocked(getAccessToken).mockResolvedValue("token");
    const client = mockGraphClient({
      mailboxError: { statusCode: 404, code: "ErrorItemNotFound" },
    });
    vi.mocked(getGraphClient).mockReturnValue(
      client as unknown as ReturnType<typeof getGraphClient>
    );

    const response = await GET(makeRequest(DIAGNOSTICS_TOKEN));
    const body = await response.json();

    const mailboxStep = body.steps.find(
      (step: { step: string }) => step.step === "mailbox"
    );
    expect(mailboxStep.ok).toBe(false);
    expect(mailboxStep.detail).toContain("status 404");
    expect(mailboxStep.detail).toContain("unlicensed");
  });
});
