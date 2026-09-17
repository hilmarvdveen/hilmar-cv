import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  FIT_AGENT_DEFAULT_TIMEOUT_MILLISECONDS,
  FitAgentRateLimitError,
  FitAgentRefusalError,
  FitCvNotReadyError,
  agentBudget,
  agentStoredResultPath,
  fetchTailoredCvDocument,
  getFitAgentConfiguration,
  getFitLeadsToken,
  reportRequesterEmailDomain,
  requestFitAnswer,
  requestFitReport,
  requestLead,
  requestRecentLeads,
  requestStoredFitResult,
  requestTailoredCv,
  requestTailoredCvStatus,
} from "./agentClient";
import leadRecordFixture from "./fixtures/leadRecord.json";
import storedResultFixture from "./fixtures/storedResult.json";

const configuration = {
  url: "https://agent.example.com",
  token: "secret-token",
  timeoutMilliseconds: 1_000,
};

const originalEnvironment = { ...process.env };

beforeEach(() => {
  vi.restoreAllMocks();
  delete process.env.FIT_AGENT_URL;
  delete process.env.FIT_AGENT_TOKEN;
  delete process.env.FIT_AGENT_TIMEOUT_MS;
  delete process.env.FIT_LEADS_TOKEN;
});

afterEach(() => {
  process.env = { ...originalEnvironment };
});

describe("getFitAgentConfiguration", () => {
  it("returns null when either variable is missing", () => {
    expect(getFitAgentConfiguration()).toBeNull();
    process.env.FIT_AGENT_URL = "https://agent.example.com";
    expect(getFitAgentConfiguration()).toBeNull();
    delete process.env.FIT_AGENT_URL;
    process.env.FIT_AGENT_TOKEN = "secret-token";
    expect(getFitAgentConfiguration()).toBeNull();
  });

  it("strips a trailing slash and falls back to the default timeout", () => {
    process.env.FIT_AGENT_URL = "https://agent.example.com/";
    process.env.FIT_AGENT_TOKEN = "secret-token";
    expect(getFitAgentConfiguration()).toEqual({
      url: "https://agent.example.com",
      token: "secret-token",
      timeoutMilliseconds: FIT_AGENT_DEFAULT_TIMEOUT_MILLISECONDS,
    });
  });

  it("reads a configured timeout and ignores an unusable one", () => {
    process.env.FIT_AGENT_URL = "https://agent.example.com";
    process.env.FIT_AGENT_TOKEN = "secret-token";
    process.env.FIT_AGENT_TIMEOUT_MS = "12000";
    expect(getFitAgentConfiguration()?.timeoutMilliseconds).toBe(12_000);
    process.env.FIT_AGENT_TIMEOUT_MS = "nonsense";
    expect(getFitAgentConfiguration()?.timeoutMilliseconds).toBe(
      FIT_AGENT_DEFAULT_TIMEOUT_MILLISECONDS
    );
    process.env.FIT_AGENT_TIMEOUT_MS = "-5";
    expect(getFitAgentConfiguration()?.timeoutMilliseconds).toBe(
      FIT_AGENT_DEFAULT_TIMEOUT_MILLISECONDS
    );
  });
});

describe("requestFitReport", () => {
  it("sends the bearer token, the forwarded address and an abort signal", async () => {
    const payload = { report: { summary: "", requirements: [], technologies: [] }, sessionId: "abc" };
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => payload });
    vi.stubGlobal("fetch", fetchMock);

    const result = await requestFitReport(configuration, {
      vacancy: "We are looking for a senior frontend engineer.",
      locale: "nl",
      clientAddress: "203.0.113.7",
    });

    expect(result).toEqual(payload);
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toBe("https://agent.example.com/fit");
    expect(options.headers.Authorization).toBe("Bearer secret-token");
    expect(options.headers["x-forwarded-for"]).toBe("203.0.113.7");
    expect(options.cache).toBe("no-store");
    expect(options.signal).toBeInstanceOf(AbortSignal);
    expect(JSON.parse(options.body)).toEqual({
      vacancy: "We are looking for a senior frontend engineer.",
      locale: "nl",
    });
  });

  it("throws with the status only when the agent refuses", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 503,
        json: async () => ({ error: "upstream detail that must not travel" }),
      })
    );

    await expect(
      requestFitReport(configuration, { vacancy: "x", locale: "en", clientAddress: "1.2.3.4" })
    ).rejects.toThrow("The fit agent answered 503");
  });

  it("throws a rate limit error carrying the seconds from the agent body", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 429,
        json: async () => ({ error: "daily cap", retryAfterSeconds: 28_800 }),
      })
    );

    await expect(
      requestFitReport(configuration, { vacancy: "x", locale: "en", clientAddress: "1.2.3.4" })
    ).rejects.toMatchObject({ name: "FitAgentRateLimitError", retryAfterSeconds: 28_800 });
  });

  it("falls back to zero seconds when the refusal carries no readable body", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 429,
        json: async () => {
          throw new Error("not json");
        },
      })
    );

    await expect(
      requestFitReport(configuration, { vacancy: "x", locale: "en", clientAddress: "1.2.3.4" })
    ).rejects.toBeInstanceOf(FitAgentRateLimitError);
    await expect(
      requestFitReport(configuration, { vacancy: "x", locale: "en", clientAddress: "1.2.3.4" })
    ).rejects.toMatchObject({ retryAfterSeconds: 0 });
  });
});

describe("getFitLeadsToken", () => {
  it("answers the second bearer only when it is set", () => {
    expect(getFitLeadsToken()).toBeNull();
    process.env.FIT_LEADS_TOKEN = "leads-token";
    expect(getFitLeadsToken()).toBe("leads-token");
  });
});

describe("agentBudget", () => {
  it("never raises the configured timeout and lowers it to the route budget", () => {
    expect(agentBudget(configuration, 500).timeoutMilliseconds).toBe(500);
    expect(agentBudget(configuration, 90_000).timeoutMilliseconds).toBe(1_000);
    expect(agentBudget(configuration, 500).token).toBe("secret-token");
  });
});

describe("the refusal of the input gate", () => {
  it("throws a typed refusal carrying the reason the agent named", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => ({ error: "refused", reason: "instruction" }),
      })
    );

    await expect(
      requestFitReport(configuration, { vacancy: "x", locale: "nl", clientAddress: "1.2.3.4" })
    ).rejects.toMatchObject({ name: "FitAgentRefusalError", reason: "instruction" });
  });

  it("throws with the status when a 400 carries no known reason", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => ({ error: "validation failed" }),
      })
    );

    const failure = requestFitReport(configuration, {
      vacancy: "x",
      locale: "nl",
      clientAddress: "1.2.3.4",
    });
    await expect(failure).rejects.toThrow("The fit agent answered 400");
    await expect(failure).rejects.not.toBeInstanceOf(FitAgentRefusalError);
  });
});

describe("requestFitAnswer", () => {
  it("posts the question, the session id and the locale", async () => {
    const payload = { answer: { answer: "Seven years.", engagements: [] } };
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => payload });
    vi.stubGlobal("fetch", fetchMock);

    const result = await requestFitAnswer(configuration, {
      question: "How many years of React?",
      sessionId: "session-id-value",
      locale: "en",
      clientAddress: "198.51.100.2",
    });

    expect(result).toEqual(payload);
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toBe("https://agent.example.com/fit/question");
    expect(options.headers["x-forwarded-for"]).toBe("198.51.100.2");
    expect(JSON.parse(options.body)).toEqual({
      question: "How many years of React?",
      sessionId: "session-id-value",
      locale: "en",
    });
  });

  it("throws with the status only when the agent refuses", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 429, json: async () => ({}) }));

    await expect(
      requestFitAnswer(configuration, {
        question: "How many years of React?",
        sessionId: "session-id-value",
        locale: "nl",
        clientAddress: "1.2.3.4",
      })
    ).rejects.toThrow("The fit agent answered 429");
  });
});

describe("agentStoredResultPath", () => {
  it("names the one path the stored result is read from", () => {
    expect(agentStoredResultPath("session-id-value")).toBe("/fit/session-id-value");
    expect(agentStoredResultPath("a b")).toBe("/fit/a%20b");
  });
});

describe("requestStoredFitResult", () => {
  it("reads the stored report, the vacancy, the locale, the title and the date", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue({ ok: true, status: 200, json: async () => storedResultFixture });
    vi.stubGlobal("fetch", fetchMock);

    const result = await requestStoredFitResult(configuration, {
      sessionId: "session-id-value",
      clientAddress: "198.51.100.9",
    });

    expect(result?.title).toBe("Senior frontend engineer InnovatieLab");
    expect(result?.createdAt).toBe("2026-09-17T08:12:44.000Z");
    expect(result?.locale).toBe("nl");
    expect(result?.hasCv).toBe(true);
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toBe("https://agent.example.com/fit/session-id-value");
    expect(options.method).toBe("GET");
    expect(options.headers.Authorization).toBe("Bearer secret-token");
    expect(options.headers["x-forwarded-for"]).toBe("198.51.100.9");
  });

  it("answers null when the agent returns something else", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => ({ found: false }) })
    );
    expect(
      await requestStoredFitResult(configuration, {
        sessionId: "session-id-value",
        clientAddress: "1.2.3.4",
      })
    ).toBeNull();
  });

  it("turns a 429 into the rate limit error with the seconds from the body", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 429,
        json: async () => ({ retryAfterSeconds: 3600 }),
      })
    );

    await expect(
      requestStoredFitResult(configuration, {
        sessionId: "session-id-value",
        clientAddress: "1.2.3.4",
      })
    ).rejects.toBeInstanceOf(FitAgentRateLimitError);
  });

  it("answers null on a session the agent does not hold", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, status: 404, json: async () => ({}) })
    );
    expect(
      await requestStoredFitResult(configuration, {
        sessionId: "session-id-value",
        clientAddress: "1.2.3.4",
      })
    ).toBeNull();
  });

  it("throws with the status on any other refusal", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, status: 503, json: async () => ({}) })
    );
    await expect(
      requestStoredFitResult(configuration, {
        sessionId: "session-id-value",
        clientAddress: "1.2.3.4",
      })
    ).rejects.toThrow("The fit agent answered 503");
  });
});

describe("requestTailoredCv and fetchTailoredCvDocument", () => {
  it("asks the agent to build the CV once and reads the page count", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue({ ok: true, status: 200, json: async () => ({ ready: true, pages: 2 }) });
    vi.stubGlobal("fetch", fetchMock);

    const status = await requestTailoredCv(configuration, {
      sessionId: "session-id-value",
      locale: "en",
      clientAddress: "1.2.3.4",
    });

    expect(status).toEqual({ ready: true, pages: 2, failed: false });
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toBe("https://agent.example.com/fit/session-id-value/cv");
    expect(JSON.parse(options.body)).toEqual({ locale: "en" });
  });

  it("reads a session the agent no longer holds as a failed build", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, status: 404, json: async () => ({}) })
    );

    expect(
      await requestTailoredCv(configuration, {
        sessionId: "session-id-value",
        locale: "nl",
        clientAddress: "1.2.3.4",
      })
    ).toEqual({ ready: false, pages: 0, failed: true });
  });

  it("reads a build that is still running from the 202 answer", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, status: 202, json: async () => ({ ready: false }) })
    );

    expect(
      await requestTailoredCv(configuration, {
        sessionId: "session-id-value",
        locale: "nl",
        clientAddress: "1.2.3.4",
      })
    ).toEqual({ ready: false, pages: 0, failed: false });
  });

  it("reads the status of a build from the locale specific path", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue({ ok: true, status: 200, json: async () => ({ ready: true, pages: 2 }) });
    vi.stubGlobal("fetch", fetchMock);

    const status = await requestTailoredCvStatus(configuration, {
      sessionId: "session-id-value",
      locale: "nl",
      clientAddress: "1.2.3.4",
    });

    expect(status).toEqual({ ready: true, pages: 2, failed: false });
    expect(fetchMock.mock.calls[0][0]).toBe(
      "https://agent.example.com/fit/session-id-value/cv?locale=nl"
    );
  });

  it("reads a status the agent never started as a failed build", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, status: 404, json: async () => ({}) })
    );

    expect(
      await requestTailoredCvStatus(configuration, {
        sessionId: "session-id-value",
        locale: "nl",
        clientAddress: "1.2.3.4",
      })
    ).toEqual({ ready: false, pages: 0, failed: true });
  });

  it("throws the not ready error when the document is not stored yet", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, status: 409, json: async () => ({}) })
    );

    await expect(
      fetchTailoredCvDocument(configuration, {
        sessionId: "session-id-value",
        locale: "nl",
        clientAddress: "1.2.3.4",
      })
    ).rejects.toBeInstanceOf(FitCvNotReadyError);
  });

  it("streams the document from the locale specific path", async () => {
    const document = { ok: true, status: 200, body: "pdf-bytes", json: async () => ({}) };
    const fetchMock = vi.fn().mockResolvedValue(document);
    vi.stubGlobal("fetch", fetchMock);

    const response = await fetchTailoredCvDocument(configuration, {
      sessionId: "session-id-value",
      locale: "nl",
      clientAddress: "1.2.3.4",
    });

    expect(response).toBe(document);
    expect(fetchMock.mock.calls[0][0]).toBe(
      "https://agent.example.com/fit/session-id-value/cv.pdf?locale=nl"
    );
  });
});

describe("reportRequesterEmailDomain", () => {
  it("posts the domain to the lead register with the leads token", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => ({}) });
    vi.stubGlobal("fetch", fetchMock);

    await reportRequesterEmailDomain(configuration, {
      sessionId: "session-id-value",
      emailDomain: "example.com",
      clientAddress: "1.2.3.4",
      leadsToken: "leads-token",
    });

    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toBe("https://agent.example.com/leads/session-id-value/requester");
    expect(options.headers.Authorization).toBe("Bearer leads-token");
    expect(JSON.parse(options.body)).toEqual({ emailDomain: "example.com" });
  });
});

describe("requestRecentLeads", () => {
  it("asks for the leads since a date with the leads token and normalizes them", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        leads: [{ sessionId: "session-id-value", lead: { title: "A vacancy" } }],
      }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const leads = await requestRecentLeads(configuration, {
      since: "2026-09-14",
      clientAddress: "1.2.3.4",
      leadsToken: "leads-token",
    });

    expect(leads).toHaveLength(1);
    expect(leads[0]!.lead.title).toBe("A vacancy");
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toBe("https://agent.example.com/leads?since=2026-09-14");
    expect(options.headers.Authorization).toBe("Bearer leads-token");
  });
});

describe("requestLead", () => {
  it("reads one lead record with the leads token and never the vacancy text", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        lead: leadRecordFixture,
        report: storedResultFixture.report,
        vacancy: storedResultFixture.vacancy,
        locale: "nl",
      }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const record = await requestLead(configuration, {
      sessionId: "hR2m9QpLtVwXyZ04",
      clientAddress: "1.2.3.4",
      leadsToken: "leads-token",
    });

    expect(record?.lead.title).toBe("Senior frontend engineer InnovatieLab");
    expect(record?.verdictCounts).toEqual({ inRecord: 2, partly: 1, notInRecord: 1 });
    expect(JSON.stringify(record)).not.toContain(storedResultFixture.vacancy.slice(0, 40));
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toBe("https://agent.example.com/leads/hR2m9QpLtVwXyZ04");
    expect(options.headers.Authorization).toBe("Bearer leads-token");
  });

  it("answers null on a session the register does not hold", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, status: 404, json: async () => ({}) })
    );

    expect(
      await requestLead(configuration, {
        sessionId: "session-id-value",
        clientAddress: "1.2.3.4",
        leadsToken: "leads-token",
      })
    ).toBeNull();
  });
});
