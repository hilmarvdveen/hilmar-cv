import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  FIT_AGENT_DEFAULT_TIMEOUT_MILLISECONDS,
  FitAgentRateLimitError,
  agentStoredResultPath,
  fetchTailoredCvDocument,
  getFitAgentConfiguration,
  reportRequesterEmailDomain,
  requestFitAnswer,
  requestFitReport,
  requestRecentLeads,
  requestStoredFitResult,
  requestTailoredCv,
} from "./agentClient";

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
  it("reads the stored report, the vacancy and the locale", async () => {
    const stored = {
      report: { summary: "A summary", requirements: [], technologies: [] },
      vacancy: "The vacancy text",
      locale: "nl",
      hasCv: true,
    };
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => stored });
    vi.stubGlobal("fetch", fetchMock);

    const result = await requestStoredFitResult(configuration, {
      sessionId: "session-id-value",
      clientAddress: "198.51.100.9",
    });

    expect(result).toEqual(stored);
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

  it("throws with the status on any other refusal", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, status: 404, json: async () => ({}) })
    );
    await expect(
      requestStoredFitResult(configuration, {
        sessionId: "session-id-value",
        clientAddress: "1.2.3.4",
      })
    ).rejects.toThrow("The fit agent answered 404");
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

    expect(status).toEqual({ ready: true, pages: 2 });
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toBe("https://agent.example.com/fit/session-id-value/cv");
    expect(JSON.parse(options.body)).toEqual({ locale: "en" });
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
  it("posts the domain to the lead register", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => ({}) });
    vi.stubGlobal("fetch", fetchMock);

    await reportRequesterEmailDomain(configuration, {
      sessionId: "session-id-value",
      emailDomain: "example.com",
      clientAddress: "1.2.3.4",
    });

    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toBe("https://agent.example.com/leads/session-id-value/requester");
    expect(JSON.parse(options.body)).toEqual({ emailDomain: "example.com" });
  });
});

describe("requestRecentLeads", () => {
  it("asks for the leads since a date and normalizes them", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ leads: [{ sessionId: "session-id-value", title: "A vacancy" }] }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const leads = await requestRecentLeads(configuration, {
      since: "2026-09-14",
      clientAddress: "1.2.3.4",
    });

    expect(leads).toHaveLength(1);
    expect(leads[0].title).toBe("A vacancy");
    expect(fetchMock.mock.calls[0][0]).toBe("https://agent.example.com/leads?since=2026-09-14");
  });
});
