import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NextRequest } from "next/server";
import { __resetRateLimitStore } from "@/lib/security/rate-limit";

const runGraphHealthChecks = vi.fn();
const sendMail = vi.fn();
const getGraphCredentials = vi.fn();
vi.mock("@/lib/graph", () => ({
  runGraphHealthChecks: () => runGraphHealthChecks(),
  getGraphCredentials: () => getGraphCredentials(),
  getAccessToken: vi.fn(async () => "token"),
  getGraphClient: vi.fn(() => ({})),
  sendMail: (...args: unknown[]) => sendMail(...args),
}));

import { GET } from "./route";

const CRON_SECRET = "test-cron-secret";
const credentials = {
  clientId: "id",
  clientSecret: "secret",
  tenantId: "tenant",
  smtpUser: "hilmar@hilmarvanderveen.com",
};
const healthySteps = [
  { step: "environment", ok: true, detail: "set" },
  { step: "token", ok: true, detail: "acquired" },
  { step: "mailbox", ok: true, detail: "reachable" },
  { step: "calendar", ok: true, detail: "readable" },
];

function get(token?: string): NextRequest {
  return new NextRequest("https://www.hilmarvanderveen.com/api/booking/watch", {
    method: "GET",
    headers: token ? { authorization: `Bearer ${token}` } : {},
  });
}

const farFuture = () => {
  const date = new Date();
  date.setUTCFullYear(date.getUTCFullYear() + 1);
  return date.toISOString().slice(0, 10);
};

beforeEach(() => {
  __resetRateLimitStore();
  process.env.CRON_SECRET = CRON_SECRET;
  process.env.MS_CLIENT_SECRET_EXPIRES_ON = farFuture();
  runGraphHealthChecks.mockReset().mockResolvedValue({ healthy: true, steps: healthySteps });
  getGraphCredentials.mockReset().mockReturnValue(credentials);
  sendMail.mockReset().mockResolvedValue(undefined);
});

afterEach(() => {
  delete process.env.CRON_SECRET;
  delete process.env.MS_CLIENT_SECRET_EXPIRES_ON;
});

describe("GET /api/booking/watch", () => {
  it("returns 404 without the cron secret", async () => {
    expect((await GET(get())).status).toBe(404);
    expect((await GET(get("wrong"))).status).toBe(404);
    expect(runGraphHealthChecks).not.toHaveBeenCalled();
  });

  it("stays silent when every stage passes and the secret is fine", async () => {
    const response = await GET(get(CRON_SECRET));
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ healthy: true, alerted: false, secretExpiry: { level: "fine" } });
    expect(sendMail).not.toHaveBeenCalled();
  });

  it("mails the owner when the secret expires within a month", async () => {
    const soon = new Date();
    soon.setUTCDate(soon.getUTCDate() + 10);
    process.env.MS_CLIENT_SECRET_EXPIRES_ON = soon.toISOString().slice(0, 10);
    const response = await GET(get(CRON_SECRET));
    expect(response.status).toBe(200);
    expect(sendMail).toHaveBeenCalledTimes(1);
    const [, mailbox, options] = sendMail.mock.calls[0] as [unknown, string, { to: string; subject: string; isHtml: boolean }];
    expect(mailbox).toBe(credentials.smtpUser);
    expect(options.to).toBe(credentials.smtpUser);
    expect(options.subject).toContain("verloopt over");
    expect(options.isHtml).toBe(true);
  });

  it("asks for the expiry date by mail when the variable is unset", async () => {
    delete process.env.MS_CLIENT_SECRET_EXPIRES_ON;
    const response = await GET(get(CRON_SECRET));
    expect(response.status).toBe(200);
    expect(sendMail).toHaveBeenCalledTimes(1);
    expect((sendMail.mock.calls[0][2] as { subject: string }).subject).toContain("vervaldatum");
  });

  it("mails the failed stage and answers 500 when the token still works", async () => {
    runGraphHealthChecks.mockResolvedValue({
      healthy: false,
      steps: [healthySteps[0], healthySteps[1], { step: "mailbox", ok: false, detail: "status 403" }],
    });
    const response = await GET(get(CRON_SECRET));
    expect(response.status).toBe(500);
    expect(await response.json()).toMatchObject({ healthy: false, alerted: true });
    expect((sendMail.mock.calls[0][2] as { subject: string }).subject).toContain("Mailbox");
  });

  it("cannot mail when the token itself fails, and says so with a 500", async () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => undefined);
    runGraphHealthChecks.mockResolvedValue({
      healthy: false,
      steps: [healthySteps[0], { step: "token", ok: false, detail: "AADSTS7000222 expired" }],
    });
    const response = await GET(get(CRON_SECRET));
    expect(response.status).toBe(500);
    expect(await response.json()).toMatchObject({ healthy: false, alerted: false });
    expect(sendMail).not.toHaveBeenCalled();
    expect(consoleError).toHaveBeenCalled();
    consoleError.mockRestore();
  });

  it("answers 500 through the shared error response when mailing throws", async () => {
    process.env.MS_CLIENT_SECRET_EXPIRES_ON = "2000-01-01";
    sendMail.mockRejectedValue(new Error("mail down"));
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const response = await GET(get(CRON_SECRET));
    expect(response.status).toBe(500);
    consoleError.mockRestore();
  });
});
