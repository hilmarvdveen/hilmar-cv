import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { __resetRateLimitStore } from "@/lib/security/rate-limit";

const getFitAgentConfiguration = vi.fn();
const requestStoredFitResult = vi.fn();

vi.mock("@/lib/fit", async () => {
  const actual = await vi.importActual<typeof import("@/lib/fit")>("@/lib/fit");
  return {
    ...actual,
    getFitAgentConfiguration: () => getFitAgentConfiguration(),
    requestStoredFitResult: (...parameters: unknown[]) => requestStoredFitResult(...parameters),
  };
});

import { FitAgentRateLimitError } from "@/lib/fit";
import { signSession } from "@/lib/fit/resultLink";
import { GET } from "./route";

const CONFIGURATION = {
  url: "https://agent.example.com",
  token: "secret-token",
  timeoutMilliseconds: 50_000,
};

const LINK_SECRET = "a-long-random-signing-secret";
const SESSION = "session-id-value-1";

const STORED = {
  report: {
    summary: "React sits in the record",
    requirements: [],
    technologies: [{ name: "React", years: 7, engagements: [] }],
  },
  vacancy: "The vacancy text",
  locale: "nl",
  hasCv: true,
};

const originalEnvironment = { ...process.env };

function get(parameters: Record<string, string>, headers: Record<string, string> = {}) {
  const query = new URLSearchParams(parameters).toString();
  return new NextRequest(`https://www.hilmarvanderveen.com/api/fit/result?${query}`, {
    method: "GET",
    headers: {
      origin: "https://www.hilmarvanderveen.com",
      "x-forwarded-for": "203.0.113.8",
      ...headers,
    },
  });
}

const validQuery = () => ({ session: SESSION, key: signSession(SESSION, LINK_SECRET) });

beforeEach(() => {
  __resetRateLimitStore();
  process.env.FIT_LINK_SECRET = LINK_SECRET;
  getFitAgentConfiguration.mockReset().mockReturnValue(CONFIGURATION);
  requestStoredFitResult.mockReset().mockResolvedValue(STORED);
  vi.spyOn(console, "error").mockImplementation(() => undefined);
});

afterEach(() => {
  process.env = { ...originalEnvironment };
});

describe("GET /api/fit/result", () => {
  it("refuses a cross-site origin with 403", async () => {
    const response = await GET(get(validQuery(), { origin: "https://evil.example.com" }));
    expect(response.status).toBe(403);
    expect(requestStoredFitResult).not.toHaveBeenCalled();
  });

  it("answers 429 with Retry-After once the read bucket is empty", async () => {
    for (let attempt = 0; attempt < 30; attempt += 1) {
      expect((await GET(get(validQuery()))).status).toBe(200);
    }
    const response = await GET(get(validQuery()));
    expect(response.status).toBe(429);
    expect(response.headers.get("Retry-After")).toBeTruthy();
  });

  it("answers 400 on a session that is not a plausible identifier", async () => {
    const response = await GET(get({ session: "short", key: "anything" }));
    expect(response.status).toBe(400);
    expect(requestStoredFitResult).not.toHaveBeenCalled();
  });

  it("answers 500 without naming the missing variable", async () => {
    delete process.env.FIT_LINK_SECRET;
    expect((await GET(get(validQuery()))).status).toBe(500);

    process.env.FIT_LINK_SECRET = LINK_SECRET;
    getFitAgentConfiguration.mockReturnValue(null);
    const response = await GET(get(validQuery()));
    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: "Server configuration error" });
  });

  it("refuses a key that this site did not sign", async () => {
    const response = await GET(get({ session: SESSION, key: signSession(SESSION, "other") }));
    expect(response.status).toBe(403);
    expect(requestStoredFitResult).not.toHaveBeenCalled();
  });

  it("answers the stored report, the locale and the cv flag, never the vacancy text", async () => {
    const response = await GET(get(validQuery()));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      report: STORED.report,
      locale: "nl",
      hasCv: true,
    });
    expect(requestStoredFitResult).toHaveBeenCalledWith(CONFIGURATION, {
      sessionId: SESSION,
      clientAddress: "203.0.113.8",
    });
  });

  it("answers 404 when the session is gone", async () => {
    requestStoredFitResult.mockResolvedValue(null);
    expect((await GET(get(validQuery()))).status).toBe(404);
  });

  it("passes the upstream 429 through with its seconds", async () => {
    requestStoredFitResult.mockRejectedValue(new FitAgentRateLimitError(3600));
    const response = await GET(get(validQuery()));
    expect(response.status).toBe(429);
    expect(response.headers.get("Retry-After")).toBe("3600");
  });

  it("answers 500 with a generic message on anything else", async () => {
    requestStoredFitResult.mockRejectedValue(new Error("The fit agent answered 502"));
    const response = await GET(get(validQuery()));
    expect(response.status).toBe(500);
    expect(JSON.stringify(await response.json())).not.toContain("502");
  });
});
