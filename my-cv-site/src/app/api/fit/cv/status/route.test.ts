import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { __resetRateLimitStore } from "@/lib/security/rate-limit";

const getFitAgentConfiguration = vi.fn();
const requestTailoredCvStatus = vi.fn();

vi.mock("@/lib/fit", async () => {
  const actual = await vi.importActual<typeof import("@/lib/fit")>("@/lib/fit");
  return {
    ...actual,
    getFitAgentConfiguration: () => getFitAgentConfiguration(),
    requestTailoredCvStatus: (...parameters: unknown[]) => requestTailoredCvStatus(...parameters),
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

const originalEnvironment = { ...process.env };

function get(parameters: Record<string, string>, headers: Record<string, string> = {}) {
  const query = new URLSearchParams(parameters).toString();
  return new NextRequest(`https://www.hilmarvanderveen.com/api/fit/cv/status?${query}`, {
    method: "GET",
    headers: {
      origin: "https://www.hilmarvanderveen.com",
      "x-forwarded-for": "203.0.113.9",
      ...headers,
    },
  });
}

const validQuery = (locale = "nl") => ({
  session: SESSION,
  key: signSession(SESSION, LINK_SECRET),
  locale,
});

beforeEach(() => {
  __resetRateLimitStore();
  process.env.FIT_LINK_SECRET = LINK_SECRET;
  getFitAgentConfiguration.mockReset().mockReturnValue(CONFIGURATION);
  requestTailoredCvStatus
    .mockReset()
    .mockResolvedValue({ ready: false, pages: 0, failed: false });
  vi.spyOn(console, "error").mockImplementation(() => undefined);
});

afterEach(() => {
  process.env = { ...originalEnvironment };
});

describe("GET /api/fit/cv/status", () => {
  it("refuses a cross-site origin with 403", async () => {
    const response = await GET(get(validQuery(), { origin: "https://evil.example.com" }));
    expect(response.status).toBe(403);
    expect(requestTailoredCvStatus).not.toHaveBeenCalled();
  });

  it("answers 429 once the read bucket is empty", async () => {
    for (let attempt = 0; attempt < 30; attempt += 1) {
      expect((await GET(get(validQuery()))).status).toBe(200);
    }
    const response = await GET(get(validQuery()));
    expect(response.status).toBe(429);
    expect(response.headers.get("Retry-After")).toBeTruthy();
  });

  it("answers 400 on a session that is not a plausible identifier", async () => {
    expect((await GET(get({ session: "short", key: "anything" }))).status).toBe(400);
    expect(requestTailoredCvStatus).not.toHaveBeenCalled();
  });

  it("refuses a key that this site did not sign", async () => {
    const response = await GET(
      get({ session: SESSION, key: signSession(SESSION, "other"), locale: "nl" })
    );
    expect(response.status).toBe(403);
    expect(requestTailoredCvStatus).not.toHaveBeenCalled();
  });

  it("answers 500 without naming the missing variable", async () => {
    delete process.env.FIT_LINK_SECRET;
    expect((await GET(get(validQuery()))).status).toBe(500);

    process.env.FIT_LINK_SECRET = LINK_SECRET;
    getFitAgentConfiguration.mockReturnValue(null);
    expect((await GET(get(validQuery()))).status).toBe(500);
  });

  it("answers the state of the build within its own budget", async () => {
    requestTailoredCvStatus.mockResolvedValue({ ready: true, pages: 2, failed: false });
    const response = await GET(get(validQuery("en")));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ready: true, pages: 2, failed: false });
    expect(requestTailoredCvStatus).toHaveBeenCalledWith(
      { ...CONFIGURATION, timeoutMilliseconds: 10_000 },
      { sessionId: SESSION, locale: "en", clientAddress: "203.0.113.9" }
    );
  });

  it("passes a failed build through", async () => {
    requestTailoredCvStatus.mockResolvedValue({ ready: false, pages: 0, failed: true });
    expect(await (await GET(get(validQuery()))).json()).toEqual({
      ready: false,
      pages: 0,
      failed: true,
    });
  });

  it("passes the upstream 429 through with its seconds", async () => {
    requestTailoredCvStatus.mockRejectedValue(new FitAgentRateLimitError(3600));
    const response = await GET(get(validQuery()));
    expect(response.status).toBe(429);
    expect(response.headers.get("Retry-After")).toBe("3600");
  });

  it("answers 500 with a generic message on anything else", async () => {
    requestTailoredCvStatus.mockRejectedValue(new Error("The fit agent answered 502"));
    const response = await GET(get(validQuery()));
    expect(response.status).toBe(500);
    expect(JSON.stringify(await response.json())).not.toContain("502");
  });
});
