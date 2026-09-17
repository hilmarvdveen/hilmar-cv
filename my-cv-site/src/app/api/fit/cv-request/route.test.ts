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
const requestStoredFitResult = vi.fn();
const requestTailoredCv = vi.fn();
const requestLead = vi.fn();
vi.mock("@/lib/fit", async () => {
  const actual = await vi.importActual<typeof import("@/lib/fit")>("@/lib/fit");
  return {
    ...actual,
    getFitAgentConfiguration: () => getFitAgentConfiguration(),
    reportRequesterEmailDomain: (...parameters: unknown[]) =>
      reportRequesterEmailDomain(...parameters),
    requestStoredFitResult: (...parameters: unknown[]) => requestStoredFitResult(...parameters),
    requestTailoredCv: (...parameters: unknown[]) => requestTailoredCv(...parameters),
    requestLead: (...parameters: unknown[]) => requestLead(...parameters),
  };
});

import { __resetSentResultLinks } from "@/lib/fit";
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

const STORED = {
  report: { summary: "A summary", requirements: [], technologies: [] },
  vacancy: "The vacancy text",
  locale: "en",
  title: "Senior Frontend Engineer",
  createdAt: "2026-09-17T09:12:44.000Z",
  hasCv: false,
};

const LEAD = {
  sessionId: SESSION,
  sessionIds: [SESSION],
  lead: {
    title: "Senior Frontend Engineer",
    endClient: "A government body",
    intermediary: "An agency",
    contractForm: "freelance",
    location: "Utrecht",
    workMode: "hybrid",
    hoursPerWeek: "36",
    startDate: "2026-10-01",
    durationMonths: "12",
    extensionOptions: "",
    closingDate: "2026-09-30",
    rate: { minimum: 95, maximum: 125, unit: "hour", currency: "€" },
    contact: { name: "A recruiter", email: "", phone: "", organisation: "An agency" },
  },
  verdictCounts: { inRecord: 4, partly: 4, notInRecord: 1 },
  notInRecord: [],
  requesterEmailDomain: "",
  seenCount: 1,
  firstSeenAt: "2026-09-17T09:12:44.000Z",
  lastSeenAt: "2026-09-17T09:12:44.000Z",
};

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

let addressCounter = 0;

const valid = () => {
  addressCounter += 1;
  return {
    sessionId: SESSION,
    name: "Jane Doe",
    email: `jane${addressCounter}@Example.com`,
    organisation: "Acme",
    locale: "nl",
    formStartedAt: Date.now() - 10_000,
  };
};

beforeEach(() => {
  __resetRateLimitStore();
  __resetSentResultLinks();
  addressCounter = 0;
  process.env.FIT_LINK_SECRET = LINK_SECRET;
  process.env.FIT_LEADS_TOKEN = "leads-token";
  getGraphCredentials.mockReset().mockReturnValue(CREDENTIALS);
  getFitAgentConfiguration.mockReset().mockReturnValue(CONFIGURATION);
  reportRequesterEmailDomain.mockReset().mockResolvedValue(undefined);
  requestStoredFitResult.mockReset().mockResolvedValue(STORED);
  requestTailoredCv.mockReset().mockResolvedValue({ ready: false, pages: 0, failed: false });
  requestLead.mockReset().mockResolvedValue(LEAD);
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

  it("answers 429 with Retry-After once the mail bucket is empty", async () => {
    for (let attempt = 0; attempt < 5; attempt += 1) {
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

    process.env.FIT_LINK_SECRET = LINK_SECRET;
    getFitAgentConfiguration.mockReturnValue(null);
    expect((await POST(post(valid()))).status).toBe(500);
    expect(sendMail).not.toHaveBeenCalled();
  });

  it("answers the same success without sending when the session is gone", async () => {
    requestStoredFitResult.mockResolvedValue(null);
    const response = await POST(post(valid()));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ sent: true });
    expect(sendMail).not.toHaveBeenCalled();
    expect(requestTailoredCv).not.toHaveBeenCalled();
  });

  it("sends one link per session and address", async () => {
    const body = valid();
    expect((await POST(post(body))).status).toBe(200);
    expect(sendMail).toHaveBeenCalledTimes(2);

    const again = await POST(post(body));
    expect(again.status).toBe(200);
    expect(await again.json()).toEqual({ sent: true });
    expect(sendMail).toHaveBeenCalledTimes(2);

    await POST(post({ ...body, email: "someone.else@example.com" }));
    expect(sendMail).toHaveBeenCalledTimes(4);
  });

  it("starts the CV build in the language of the stored check", async () => {
    await POST(post(valid()));
    expect(requestTailoredCv).toHaveBeenCalledWith(
      { ...CONFIGURATION, timeoutMilliseconds: 15_000 },
      { sessionId: SESSION, locale: "en", clientAddress: "203.0.113.7" }
    );
  });

  it("still sends the mails when the build call fails", async () => {
    requestTailoredCv.mockRejectedValue(new Error("The fit agent answered 503"));
    expect((await POST(post(valid()))).status).toBe(200);
    expect(sendMail).toHaveBeenCalledTimes(2);
  });

  it("mails the visitor the signed link and the owner the lead", async () => {
    const body = valid();
    const response = await POST(post(body));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ sent: true });
    expect(sendMail).toHaveBeenCalledTimes(2);

    const expectedLink = `https://www.hilmarvanderveen.com/nl/fit?result=${SESSION}&amp;key=${signSession(
      SESSION,
      LINK_SECRET
    )}`;

    const [, , visitorMail] = sendMail.mock.calls[0] as [unknown, unknown, Record<string, string>];
    expect(visitorMail.to).toBe(body.email);
    expect(visitorMail.body).toContain(expectedLink);
    expect(visitorMail.body).toContain("Senior Frontend Engineer");

    const [, , ownerMail] = sendMail.mock.calls[1] as [unknown, unknown, Record<string, string>];
    expect(ownerMail.to).toBe(CREDENTIALS.smtpUser);
    expect(ownerMail.replyTo).toBe(body.email);
    expect(ownerMail.subject).toBe("CV gevraagd: Jane Doe, Acme");
    expect(ownerMail.body).toContain("A government body");
    expect(ownerMail.body).toContain("4 in, 4 deels, 1 niet");
    expect(ownerMail.body).toContain("2026-09-30");
    expect(ownerMail.body).toContain(SESSION);
  });

  it("reads the lead with the leads token", async () => {
    await POST(post(valid()));
    expect(requestLead).toHaveBeenCalledWith(CONFIGURATION, {
      sessionId: SESSION,
      clientAddress: "203.0.113.7",
      leadsToken: "leads-token",
    });
  });

  it("mails the owner without the vacancy rows when the leads token is absent", async () => {
    delete process.env.FIT_LEADS_TOKEN;
    requestStoredFitResult.mockResolvedValue({ ...STORED, title: "" });
    await POST(post(valid()));
    expect(requestLead).not.toHaveBeenCalled();
    expect(reportRequesterEmailDomain).not.toHaveBeenCalled();
    const [, , ownerMail] = sendMail.mock.calls[1] as [unknown, unknown, Record<string, string>];
    expect(ownerMail.body).toContain("Onbekend");
  });

  it("still sends the mails when the lead read fails", async () => {
    requestLead.mockRejectedValue(new Error("The fit agent answered 503"));
    expect((await POST(post(valid()))).status).toBe(200);
    expect(sendMail).toHaveBeenCalledTimes(2);
  });

  it("tells the agent the requester domain without the address", async () => {
    const body = valid();
    await POST(post(body));
    expect(reportRequesterEmailDomain).toHaveBeenCalledWith(CONFIGURATION, {
      sessionId: SESSION,
      emailDomain: "example.com",
      clientAddress: "203.0.113.7",
      leadsToken: "leads-token",
    });
  });

  it("still answers sent when the requester call fails", async () => {
    reportRequesterEmailDomain.mockRejectedValue(new Error("The fit agent answered 500"));
    const response = await POST(post(valid()));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ sent: true });
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

describe("the optional challenge on the CV request", () => {
  it("verifies the token before mailing and refuses a failed challenge", async () => {
    process.env.TURNSTILE_SECRET_KEY = "secret-key";
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY = "site-key";
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, json: async () => ({ success: false }) })
    );

    const refused = await POST(post({ ...valid(), turnstileToken: "token" }));
    expect(refused.status).toBe(403);
    expect(sendMail).not.toHaveBeenCalled();

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, json: async () => ({ success: true }) })
    );
    const accepted = await POST(post({ ...valid(), turnstileToken: "token" }));
    expect(accepted.status).toBe(200);
    expect(sendMail).toHaveBeenCalledTimes(2);
  });
});
