import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { __resetRateLimitStore } from "@/lib/security/rate-limit";

const getFitAgentConfiguration = vi.fn();
const requestTailoredCv = vi.fn();
const fetchTailoredCvDocument = vi.fn();

vi.mock("@/lib/fit", async () => {
  const actual = await vi.importActual<typeof import("@/lib/fit")>("@/lib/fit");
  return {
    ...actual,
    getFitAgentConfiguration: () => getFitAgentConfiguration(),
    requestTailoredCv: (...parameters: unknown[]) => requestTailoredCv(...parameters),
    fetchTailoredCvDocument: (...parameters: unknown[]) => fetchTailoredCvDocument(...parameters),
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

const pdfDocument = () => new Response("pdf-bytes", { status: 200 });

function get(parameters: Record<string, string>, headers: Record<string, string> = {}) {
  const query = new URLSearchParams(parameters).toString();
  return new NextRequest(`https://www.hilmarvanderveen.com/api/fit/cv?${query}`, {
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
  requestTailoredCv.mockReset().mockResolvedValue({ ready: true, pages: 2 });
  fetchTailoredCvDocument.mockReset().mockImplementation(async () => pdfDocument());
  vi.spyOn(console, "error").mockImplementation(() => undefined);
});

afterEach(() => {
  process.env = { ...originalEnvironment };
});

describe("GET /api/fit/cv", () => {
  it("refuses a cross-site origin with 403", async () => {
    const response = await GET(get(validQuery(), { origin: "https://evil.example.com" }));
    expect(response.status).toBe(403);
    expect(requestTailoredCv).not.toHaveBeenCalled();
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
    expect((await GET(get({ session: "short", key: "anything" }))).status).toBe(400);
    expect(requestTailoredCv).not.toHaveBeenCalled();
  });

  it("answers 500 without naming the missing variable", async () => {
    delete process.env.FIT_LINK_SECRET;
    expect((await GET(get(validQuery()))).status).toBe(500);

    process.env.FIT_LINK_SECRET = LINK_SECRET;
    getFitAgentConfiguration.mockReturnValue(null);
    expect((await GET(get(validQuery()))).status).toBe(500);
  });

  it("refuses a key that this site did not sign", async () => {
    const response = await GET(
      get({ session: SESSION, key: signSession(SESSION, "other"), locale: "nl" })
    );
    expect(response.status).toBe(403);
    expect(fetchTailoredCvDocument).not.toHaveBeenCalled();
  });

  it("builds the CV once and streams it as a download", async () => {
    const response = await GET(get(validQuery("en")));
    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("application/pdf");
    expect(response.headers.get("Content-Disposition")).toBe(
      'attachment; filename="cv-hilmar-van-der-veen-en.pdf"'
    );
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(await response.text()).toBe("pdf-bytes");

    expect(requestTailoredCv).toHaveBeenCalledWith(CONFIGURATION, {
      sessionId: SESSION,
      locale: "en",
      clientAddress: "203.0.113.9",
    });
    expect(fetchTailoredCvDocument).toHaveBeenCalledWith(CONFIGURATION, {
      sessionId: SESSION,
      locale: "en",
      clientAddress: "203.0.113.9",
    });
  });

  it("falls back to Dutch for an unknown locale", async () => {
    const response = await GET(get(validQuery("de")));
    expect(response.headers.get("Content-Disposition")).toContain("cv-hilmar-van-der-veen-nl.pdf");
  });

  it("passes the upstream 429 through with its seconds", async () => {
    requestTailoredCv.mockRejectedValue(new FitAgentRateLimitError(3600));
    const response = await GET(get(validQuery()));
    expect(response.status).toBe(429);
    expect(response.headers.get("Retry-After")).toBe("3600");
  });

  it("answers 500 with a generic message on anything else", async () => {
    fetchTailoredCvDocument.mockRejectedValue(new Error("The fit agent answered 502"));
    const response = await GET(get(validQuery()));
    expect(response.status).toBe(500);
    expect(JSON.stringify(await response.json())).not.toContain("502");
  });
});
