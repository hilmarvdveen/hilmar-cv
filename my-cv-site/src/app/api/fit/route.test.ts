import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { __resetRateLimitStore } from "@/lib/security/rate-limit";

const getFitAgentConfiguration = vi.fn();
const requestFitReport = vi.fn();

vi.mock("@/lib/fit", async () => {
  const actual = await vi.importActual<typeof import("@/lib/fit")>("@/lib/fit");
  return {
    ...actual,
    getFitAgentConfiguration: () => getFitAgentConfiguration(),
    requestFitReport: (...parameters: unknown[]) => requestFitReport(...parameters),
  };
});

import { POST } from "./route";

const CONFIGURATION = {
  url: "https://agent.example.com",
  token: "secret-token",
  timeoutMilliseconds: 50_000,
};

const REPORT = {
  summary: "React and a reversible cut-over sit in the record.",
  requirements: [
    {
      requirement: "Five years of React",
      verdict: "inRecord",
      note: "React since 2017.",
      engagements: [
        { id: "bol", company: "bol.com" },
        { id: "invented", company: "Invented" },
      ],
    },
  ],
  technologies: [{ name: "React", years: 7, engagements: ["bol"] }],
};

const vacancy = "We are looking for a senior frontend engineer with React experience.";

function post(body: unknown, headers: Record<string, string> = {}) {
  return new NextRequest("https://www.hilmarvanderveen.com/api/fit", {
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

const valid = () => ({ vacancy, locale: "nl", formStartedAt: Date.now() - 10_000 });

beforeEach(() => {
  __resetRateLimitStore();
  getFitAgentConfiguration.mockReset().mockReturnValue(CONFIGURATION);
  requestFitReport.mockReset().mockResolvedValue({ report: REPORT, sessionId: "session-id-value" });
  vi.spyOn(console, "error").mockImplementation(() => undefined);
});

describe("POST /api/fit", () => {
  it("refuses a cross-site origin with 403", async () => {
    const response = await POST(post(valid(), { origin: "https://evil.example.com" }));
    expect(response.status).toBe(403);
    expect(requestFitReport).not.toHaveBeenCalled();
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
    expect(await response.json()).toEqual({
      report: { summary: "", requirements: [], technologies: [] },
      sessionId: "",
    });
    expect(requestFitReport).not.toHaveBeenCalled();
  });

  it("succeeds silently when the form was submitted within two seconds", async () => {
    const response = await POST(post({ ...valid(), formStartedAt: Date.now() }));
    expect(response.status).toBe(200);
    expect(requestFitReport).not.toHaveBeenCalled();
  });

  it("answers 400 on an empty vacancy", async () => {
    const response = await POST(post({ ...valid(), vacancy: "" }));
    expect(response.status).toBe(400);
  });

  it("answers 400 on a vacancy over ten thousand characters", async () => {
    const response = await POST(post({ ...valid(), vacancy: "x".repeat(10_001) }));
    expect(response.status).toBe(400);
    expect(await response.json()).toMatchObject({
      error: 'Field "vacancy" exceeds maximum length.',
    });
  });

  it("answers 400 on a vacancy under twenty characters", async () => {
    const response = await POST(post({ ...valid(), vacancy: "React please" }));
    expect(response.status).toBe(400);
    expect(await response.json()).toMatchObject({
      error: 'Field "vacancy" is shorter than the minimum length.',
    });
  });

  it("answers 500 when the agent is not configured", async () => {
    getFitAgentConfiguration.mockReturnValue(null);
    const response = await POST(post(valid()));
    expect(response.status).toBe(500);
    expect(await response.json()).toMatchObject({ error: "Server configuration error" });
  });

  it("forwards the trimmed vacancy, the locale and the caller's address", async () => {
    await POST(post({ ...valid(), vacancy: `  ${vacancy}  `, locale: "en" }));
    expect(requestFitReport).toHaveBeenCalledWith(CONFIGURATION, {
      vacancy,
      locale: "en",
      clientAddress: "203.0.113.7",
    });
  });

  it("treats an unknown locale as Dutch", async () => {
    await POST(post({ ...valid(), locale: "de" }));
    expect(requestFitReport.mock.calls[0][1].locale).toBe("nl");
  });

  it("returns the sanitised report and drops an engagement outside the record", async () => {
    const response = await POST(post(valid()));
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.sessionId).toBe("session-id-value");
    expect(body.report.requirements[0].engagements).toEqual([{ id: "bol", company: "bol.com" }]);
  });

  it("drops a session id that is not plausible", async () => {
    requestFitReport.mockResolvedValue({ report: REPORT, sessionId: "nope" });
    const body = await (await POST(post(valid()))).json();
    expect(body.sessionId).toBe("");
  });

  it("answers a generic 500 when the agent returns an unexpected shape", async () => {
    requestFitReport.mockResolvedValue({ report: { summary: 7 }, sessionId: "session-id-value" });
    const response = await POST(post(valid()));
    expect(response.status).toBe(500);
    expect(await response.json()).toMatchObject({
      error: "The fit check is not available right now",
    });
  });

  it("answers a generic 500 without the upstream message when the agent fails", async () => {
    requestFitReport.mockRejectedValue(new Error("The fit agent answered 503"));
    const response = await POST(post(valid()));
    expect(response.status).toBe(500);
    expect(JSON.stringify(await response.json())).not.toContain("503");
  });
});
