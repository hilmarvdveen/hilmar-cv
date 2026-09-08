import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("./client", () => ({
  getGraphCredentials: vi.fn(),
  getAccessToken: vi.fn(),
  getGraphClient: vi.fn(),
}));

import { getGraphCredentials, getAccessToken, getGraphClient } from "./client";
import { describeGraphError, runGraphHealthChecks } from "./health";

const credentials = {
  clientId: "client-id",
  clientSecret: "client-secret",
  tenantId: "tenant-id",
  smtpUser: "owner@example.com",
};

function graphClient(calendarError?: unknown) {
  const api = vi.fn((path: string) => {
    const chain = {
      select: vi.fn(() => chain),
      query: vi.fn(() => chain),
      get: vi.fn(async () => {
        if (path.endsWith("/calendarview") && calendarError) throw calendarError;
        return path.endsWith("/calendarview") ? { value: [] } : { id: "mailbox-id" };
      }),
    };
    return chain;
  });
  return { api } as unknown as ReturnType<typeof getGraphClient>;
}

beforeEach(() => {
  vi.resetAllMocks();
  process.env.MS_CLIENT_ID = "client-id";
  process.env.MS_CLIENT_SECRET = "client-secret";
  process.env.MS_TENANT_ID = "tenant-id";
  process.env.SMTP_USER = "owner@example.com";
  vi.mocked(getGraphCredentials).mockReturnValue(credentials);
  vi.mocked(getAccessToken).mockResolvedValue("token");
});

describe("runGraphHealthChecks", () => {
  it("reports a failed calendar read with the permission hint", async () => {
    vi.mocked(getGraphClient).mockReturnValue(graphClient({ statusCode: 403, message: "Forbidden" }));
    const report = await runGraphHealthChecks();
    expect(report.healthy).toBe(false);
    const calendarStep = report.steps.find((step) => step.step === "calendar");
    expect(calendarStep?.ok).toBe(false);
    expect(calendarStep?.detail).toContain("status 403");
    expect(calendarStep?.detail).toContain("Calendars.ReadWrite");
  });

  it("reports every stage healthy when Graph answers", async () => {
    vi.mocked(getGraphClient).mockReturnValue(graphClient());
    const report = await runGraphHealthChecks();
    expect(report.healthy).toBe(true);
    expect(report.steps.map((step) => step.ok)).toEqual([true, true, true, true]);
  });
});

describe("describeGraphError", () => {
  it("falls back to the string form of an error without Graph fields", () => {
    expect(describeGraphError("boom", "Hint.")).toBe("boom. Hint.");
    expect(describeGraphError({}, "Hint.")).toBe("[object Object]. Hint.");
  });
});
