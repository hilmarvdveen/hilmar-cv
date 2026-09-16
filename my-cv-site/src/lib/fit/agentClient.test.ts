import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  FIT_AGENT_DEFAULT_TIMEOUT_MILLISECONDS,
  FitAgentRateLimitError,
  getFitAgentConfiguration,
  requestFitAnswer,
  requestFitReport,
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
