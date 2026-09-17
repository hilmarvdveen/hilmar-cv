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

import { FitAgentRateLimitError, FitCvNotReadyError } from "@/lib/fit";
import { signSession } from "@/lib/fit/resultLink";
import { GET, POST } from "./route";

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

function post(body: unknown, headers: Record<string, string> = {}) {
  return new NextRequest("https://www.hilmarvanderveen.com/api/fit/cv", {
    method: "POST",
    headers: {
      origin: "https://www.hilmarvanderveen.com",
      "content-type": "application/json",
      "x-forwarded-for": "203.0.113.9",
      ...headers,
    },
    body: JSON.stringify(body),
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
  requestTailoredCv.mockReset().mockResolvedValue({ ready: true, pages: 2, failed: false });
  fetchTailoredCvDocument.mockReset().mockImplementation(async () => pdfDocument());
  vi.spyOn(console, "error").mockImplementation(() => undefined);
});

afterEach(() => {
  process.env = { ...originalEnvironment };
});

describe("POST /api/fit/cv", () => {
  it("refuses a cross-site origin with 403", async () => {
    const response = await POST(post(validQuery(), { origin: "https://evil.example.com" }));
    expect(response.status).toBe(403);
    expect(requestTailoredCv).not.toHaveBeenCalled();
  });

  it("answers 429 with Retry-After once the fit bucket is empty", async () => {
    for (let attempt = 0; attempt < 10; attempt += 1) {
      expect((await POST(post(validQuery()))).status).toBe(200);
    }
    const response = await POST(post(validQuery()));
    expect(response.status).toBe(429);
    expect(response.headers.get("Retry-After")).toBeTruthy();
  });

  it("answers 400 on a session that is not a plausible identifier", async () => {
    expect((await POST(post({ session: "short", key: "anything" }))).status).toBe(400);
    expect(requestTailoredCv).not.toHaveBeenCalled();
  });

  it("refuses a key that this site did not sign", async () => {
    const response = await POST(
      post({ session: SESSION, key: signSession(SESSION, "other"), locale: "nl" })
    );
    expect(response.status).toBe(403);
    expect(requestTailoredCv).not.toHaveBeenCalled();
  });

  it("answers 500 without naming the missing variable", async () => {
    delete process.env.FIT_LINK_SECRET;
    expect((await POST(post(validQuery()))).status).toBe(500);

    process.env.FIT_LINK_SECRET = LINK_SECRET;
    getFitAgentConfiguration.mockReturnValue(null);
    expect((await POST(post(validQuery()))).status).toBe(500);
  });

  it("starts the build within its own budget and answers the state of the agent", async () => {
    requestTailoredCv.mockResolvedValue({ ready: false, pages: 0, failed: false });
    const response = await POST(post(validQuery("en")));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ready: false, pages: 0, failed: false });
    expect(requestTailoredCv).toHaveBeenCalledWith(
      { ...CONFIGURATION, timeoutMilliseconds: 15_000 },
      { sessionId: SESSION, locale: "en", clientAddress: "203.0.113.9" }
    );
  });

  it("passes the upstream 429 through with its seconds", async () => {
    requestTailoredCv.mockRejectedValue(new FitAgentRateLimitError(3600));
    const response = await POST(post(validQuery()));
    expect(response.status).toBe(429);
    expect(response.headers.get("Retry-After")).toBe("3600");
  });

  it("answers 500 with a generic message on anything else", async () => {
    requestTailoredCv.mockRejectedValue(new Error("The fit agent answered 502"));
    const response = await POST(post(validQuery()));
    expect(response.status).toBe(500);
    expect(JSON.stringify(await response.json())).not.toContain("502");
  });
});

describe("GET /api/fit/cv", () => {
  it("refuses a cross-site origin with 403", async () => {
    const response = await GET(get(validQuery(), { origin: "https://evil.example.com" }));
    expect(response.status).toBe(403);
    expect(fetchTailoredCvDocument).not.toHaveBeenCalled();
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
    expect(fetchTailoredCvDocument).not.toHaveBeenCalled();
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

  it("streams the document as a download without starting a build", async () => {
    const response = await GET(get(validQuery("en")));
    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("application/pdf");
    expect(response.headers.get("Content-Disposition")).toBe(
      'attachment; filename="cv-hilmar-van-der-veen-en.pdf"'
    );
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(await response.text()).toBe("pdf-bytes");

    expect(requestTailoredCv).not.toHaveBeenCalled();
    expect(fetchTailoredCvDocument).toHaveBeenCalledWith(
      { ...CONFIGURATION, timeoutMilliseconds: 45_000 },
      { sessionId: SESSION, locale: "en", clientAddress: "203.0.113.9" }
    );
  });

  it("falls back to Dutch for an unknown locale", async () => {
    const response = await GET(get(validQuery("de")));
    expect(response.headers.get("Content-Disposition")).toContain("cv-hilmar-van-der-veen-nl.pdf");
  });

  it("answers 409 with a body while the document is not ready", async () => {
    fetchTailoredCvDocument.mockRejectedValue(new FitCvNotReadyError());
    const response = await GET(get(validQuery()));
    expect(response.status).toBe(409);
    expect(await response.json()).toEqual({ ready: false });
  });

  it("passes the upstream 429 through with its seconds", async () => {
    fetchTailoredCvDocument.mockRejectedValue(new FitAgentRateLimitError(3600));
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
