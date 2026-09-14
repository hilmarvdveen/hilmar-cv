import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { __resetRateLimitStore } from "@/lib/security/rate-limit";

const getFitAgentConfiguration = vi.fn();
const requestFitAnswer = vi.fn();

vi.mock("@/lib/fit", async () => {
  const actual = await vi.importActual<typeof import("@/lib/fit")>("@/lib/fit");
  return {
    ...actual,
    getFitAgentConfiguration: () => getFitAgentConfiguration(),
    requestFitAnswer: (...parameters: unknown[]) => requestFitAnswer(...parameters),
  };
});

import { POST } from "./route";

const CONFIGURATION = {
  url: "https://agent.example.com",
  token: "secret-token",
  timeoutMilliseconds: 50_000,
};

const ANSWER = {
  answer: "React runs through the record since 2017.",
  engagements: [
    { id: "bol", company: "bol.com" },
    { id: "invented", company: "Invented" },
  ],
};

function post(body: unknown, headers: Record<string, string> = {}) {
  return new NextRequest("https://www.hilmarvanderveen.com/api/fit/question", {
    method: "POST",
    headers: {
      origin: "https://www.hilmarvanderveen.com",
      "content-type": "application/json",
      "x-forwarded-for": "198.51.100.2",
      ...headers,
    },
    body: JSON.stringify(body),
  });
}

const valid = () => ({
  question: "How many years of React?",
  sessionId: "session-id-value",
  locale: "en",
});

beforeEach(() => {
  __resetRateLimitStore();
  getFitAgentConfiguration.mockReset().mockReturnValue(CONFIGURATION);
  requestFitAnswer.mockReset().mockResolvedValue({ answer: ANSWER });
  vi.spyOn(console, "error").mockImplementation(() => undefined);
});

describe("POST /api/fit/question", () => {
  it("refuses a cross-site origin with 403", async () => {
    const response = await POST(post(valid(), { origin: "https://evil.example.com" }));
    expect(response.status).toBe(403);
  });

  it("answers 429 with Retry-After once the fit bucket is empty", async () => {
    for (let attempt = 0; attempt < 10; attempt += 1) {
      expect((await POST(post(valid()))).status).toBe(200);
    }
    const response = await POST(post(valid()));
    expect(response.status).toBe(429);
    expect(response.headers.get("Retry-After")).toBeTruthy();
  });

  it("succeeds silently on the honeypot without calling the agent", async () => {
    const response = await POST(post({ ...valid(), company_website: "bot" }));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ answer: { answer: "", engagements: [] } });
    expect(requestFitAnswer).not.toHaveBeenCalled();
  });

  it("answers 400 on a missing question or session id", async () => {
    expect((await POST(post({ ...valid(), question: "" }))).status).toBe(400);
    expect((await POST(post({ ...valid(), sessionId: "" }))).status).toBe(400);
  });

  it("answers 400 on a question over five hundred characters", async () => {
    const response = await POST(post({ ...valid(), question: "x".repeat(501) }));
    expect(response.status).toBe(400);
  });

  it("answers 400 on a question under five characters", async () => {
    const response = await POST(post({ ...valid(), question: "why" }));
    expect(response.status).toBe(400);
    expect(await response.json()).toMatchObject({
      error: 'Field "question" is shorter than the minimum length.',
    });
  });

  it("answers 400 on a session id that is not plausible", async () => {
    const response = await POST(post({ ...valid(), sessionId: "not valid at all here" }));
    expect(response.status).toBe(400);
    expect(await response.json()).toMatchObject({
      error: 'Field "sessionId" is not an allowed value.',
    });
  });

  it("answers 500 when the agent is not configured", async () => {
    getFitAgentConfiguration.mockReturnValue(null);
    const response = await POST(post(valid()));
    expect(response.status).toBe(500);
    expect(await response.json()).toMatchObject({ error: "Server configuration error" });
  });

  it("forwards the trimmed question, the session id and the caller's address", async () => {
    await POST(post({ ...valid(), question: "  How many years of React?  " }));
    expect(requestFitAnswer).toHaveBeenCalledWith(CONFIGURATION, {
      question: "How many years of React?",
      sessionId: "session-id-value",
      locale: "en",
      clientAddress: "198.51.100.2",
    });
  });

  it("treats an unknown locale as Dutch", async () => {
    await POST(post({ ...valid(), locale: "fr" }));
    expect(requestFitAnswer.mock.calls[0][1].locale).toBe("nl");
  });

  it("returns the sanitised answer without an engagement outside the record", async () => {
    const body = await (await POST(post(valid()))).json();
    expect(body.answer.engagements).toEqual([{ id: "bol", company: "bol.com" }]);
  });

  it("answers a generic 500 when the agent returns an unexpected shape", async () => {
    requestFitAnswer.mockResolvedValue({ answer: { answer: 7 } });
    const response = await POST(post(valid()));
    expect(response.status).toBe(500);
    expect(await response.json()).toMatchObject({
      error: "The fit check is not available right now",
    });
  });

  it("answers a generic 500 without the upstream message when the agent fails", async () => {
    requestFitAnswer.mockRejectedValue(new Error("The fit agent answered 503"));
    const response = await POST(post(valid()));
    expect(response.status).toBe(500);
    expect(JSON.stringify(await response.json())).not.toContain("503");
  });
});
