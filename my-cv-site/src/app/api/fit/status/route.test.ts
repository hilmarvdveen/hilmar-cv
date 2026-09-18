import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { __resetRateLimitStore } from "@/lib/security/rate-limit";

const getFitAgentConfiguration = vi.fn();
const requestFitJobStatus = vi.fn();

vi.mock("@/lib/fit", async () => {
  const actual = await vi.importActual<typeof import("@/lib/fit")>("@/lib/fit");
  return {
    ...actual,
    getFitAgentConfiguration: () => getFitAgentConfiguration(),
    requestFitJobStatus: (...parameters: unknown[]) => requestFitJobStatus(...parameters),
  };
});

import { FitAgentRateLimitError } from "@/lib/fit";
import { GET } from "./route";

const CONFIGURATION = {
  url: "https://agent.example.com",
  token: "secret-token",
  timeoutMilliseconds: 50_000,
};

const jobId = "d".repeat(32);

function get(query: string, headers: Record<string, string> = {}) {
  return new NextRequest(`https://www.hilmarvanderveen.com/api/fit/status${query}`, {
    method: "GET",
    headers: {
      origin: "https://www.hilmarvanderveen.com",
      "x-forwarded-for": "203.0.113.7",
      ...headers,
    },
  });
}

beforeEach(() => {
  __resetRateLimitStore();
  getFitAgentConfiguration.mockReset().mockReturnValue(CONFIGURATION);
  requestFitJobStatus
    .mockReset()
    .mockResolvedValue({ state: "running", phase: "searching", toolCalls: 3, elapsedSeconds: 9 });
  vi.spyOn(console, "error").mockImplementation(() => undefined);
});

describe("GET /api/fit/status", () => {
  it("refuses a cross-site origin with 403", async () => {
    const response = await GET(get(`?job=${jobId}`, { origin: "https://evil.example.com" }));
    expect(response.status).toBe(403);
    expect(requestFitJobStatus).not.toHaveBeenCalled();
  });

  it("answers 400 for a job id of another shape and never asks the agent", async () => {
    expect((await GET(get("?job=not-a-job"))).status).toBe(400);
    expect((await GET(get(""))).status).toBe(400);
    expect(requestFitJobStatus).not.toHaveBeenCalled();
  });

  it("answers 500 when the agent is not configured", async () => {
    getFitAgentConfiguration.mockReturnValue(null);
    const response = await GET(get(`?job=${jobId}`));
    expect(response.status).toBe(500);
    expect(await response.json()).toMatchObject({ error: "Server configuration error" });
  });

  it("hands the status through without a cache, with a short budget and the address of the caller", async () => {
    const response = await GET(get(`?job=${jobId}`));
    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(await response.json()).toEqual({
      state: "running",
      phase: "searching",
      toolCalls: 3,
      elapsedSeconds: 9,
    });
    expect(requestFitJobStatus).toHaveBeenCalledWith(
      { ...CONFIGURATION, timeoutMilliseconds: 10_000 },
      { jobId, clientAddress: "203.0.113.7" }
    );
  });

  it("limits polling to sixty a minute from one address", async () => {
    for (let poll = 0; poll < 60; poll += 1) {
      expect((await GET(get(`?job=${jobId}`))).status).toBe(200);
    }
    const limited = await GET(get(`?job=${jobId}`));
    expect(limited.status).toBe(429);
    expect(limited.headers.get("Retry-After")).not.toBeNull();
  });

  it("passes an upstream refusal through as 429 with its wait", async () => {
    requestFitJobStatus.mockRejectedValue(new FitAgentRateLimitError(12));
    const response = await GET(get(`?job=${jobId}`));
    expect(response.status).toBe(429);
    expect(response.headers.get("Retry-After")).toBe("12");
  });

  it("answers a generic 500 without the upstream message when the agent fails", async () => {
    requestFitJobStatus.mockRejectedValue(new Error("The fit agent answered 503"));
    const response = await GET(get(`?job=${jobId}`));
    expect(response.status).toBe(500);
    expect(JSON.stringify(await response.json())).not.toContain("503");
  });
});
