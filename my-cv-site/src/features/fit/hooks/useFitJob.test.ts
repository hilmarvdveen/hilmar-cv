import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import {
  finishedFitJobSnapshot,
  pendingFitJobSnapshot,
  showFinishedFitJob,
  startPendingFitJob,
} from "@/lib/fit/jobStore";
import type { FitReport } from "@/lib/fit/types";
import { FIT_JOB_OUT_OF_TIME_STATUS, useFitJob } from "./useFitJob";

const JOB_ID = "a".repeat(32);
const SESSION_ID = "session-id-value";

const report: FitReport = {
  summary: "React sits in the work history.",
  requirements: [
    {
      requirement: "React",
      verdict: "inRecord",
      note: "React at bol.com.",
      engagements: [{ id: "bol", company: "bol.com" }],
    },
  ],
  technologies: [{ name: "React", years: 5, engagements: ["bol"] }],
};

const answer = (body: unknown, ok = true) =>
  ({ ok, status: ok ? 200 : 500, json: async () => body }) as unknown as Response;

const runningAnswer = (phase = "reading", toolCalls = 0) =>
  answer({ state: "running", phase, toolCalls });

const doneAnswer = () => answer({ state: "done", report, sessionId: SESSION_ID });

const startJob = (startedAt = Date.now()) => {
  act(() => startPendingFitJob({ jobId: JOB_ID, startedAt, locale: "nl" }));
};

const standingResultInTheSession = () => {
  act(() =>
    showFinishedFitJob({ report, sessionId: SESSION_ID, finishedAt: Date.now(), seen: true })
  );
};

const letTimePass = async (milliseconds: number) => {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(milliseconds);
  });
};

beforeEach(() => {
  window.sessionStorage.clear();
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(runningAnswer()));
});

afterEach(() => {
  vi.useRealTimers();
  window.sessionStorage.clear();
});

describe("useFitJob", () => {
  it("sits idle and asks nothing while the session holds no job", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const { result } = renderHook(() => useFitJob(true));

    expect(result.current.view).toEqual({ state: "idle" });
    expect(result.current.standingResult).toBeNull();
    await letTimePass(5_000);
    expect(fetch).not.toHaveBeenCalled();
  });

  it("asks the status route for the job the session remembers", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    renderHook(() => useFitJob(true));
    startJob();
    await letTimePass(1_000);

    expect(fetch).toHaveBeenCalledWith(`/api/fit/status?job=${JOB_ID}`, { cache: "no-store" });
  });

  it("reports the phase and the lookups the agent reports", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    vi.mocked(fetch).mockResolvedValue(runningAnswer("searching", 3));
    const { result } = renderHook(() => useFitJob(true));
    startJob();

    expect(result.current.view).toMatchObject({
      state: "running",
      phase: "reading",
      toolCalls: 0,
    });

    await letTimePass(1_000);
    expect(result.current.view).toMatchObject({
      state: "running",
      phase: "searching",
      toolCalls: 3,
    });
  });

  it("counts the seconds while the job runs", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const { result } = renderHook(() => useFitJob(true));
    startJob();

    expect(result.current.view).toMatchObject({ elapsedSeconds: 0 });
    await letTimePass(4_000);
    expect(result.current.view).toMatchObject({ state: "running", elapsedSeconds: 4 });
  });

  it("stores the finished report unseen and drops the pending job", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    vi.mocked(fetch).mockResolvedValue(doneAnswer());
    const { result } = renderHook(() => useFitJob(true));
    startJob();
    await letTimePass(1_000);

    expect(result.current.view).toMatchObject({ state: "done", sessionId: SESSION_ID, seen: false });
    expect(result.current.standingResult).toMatchObject({ sessionId: SESSION_ID, seen: false });
    expect(pendingFitJobSnapshot()).toBeNull();
    expect(finishedFitJobSnapshot()?.report.summary).toBe(report.summary);
  });

  it("keeps polling when a poll throws or comes back refused", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    vi.mocked(fetch)
      .mockRejectedValueOnce(new Error("offline"))
      .mockResolvedValueOnce(answer(null, false))
      .mockResolvedValue(doneAnswer());
    const { result } = renderHook(() => useFitJob(true));
    startJob();

    await letTimePass(1_000);
    expect(result.current.view).toMatchObject({ state: "running" });

    await letTimePass(2_500);
    expect(result.current.view).toMatchObject({ state: "running" });

    await letTimePass(2_500);
    expect(result.current.view).toMatchObject({ state: "done" });
    expect(fetch).toHaveBeenCalledTimes(3);
  });

  it("treats an unreadable answer as a failure of its own", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => {
        throw new Error("not json");
      },
    } as unknown as Response);
    const { result } = renderHook(() => useFitJob(true));
    startJob();
    await letTimePass(1_000);

    expect(result.current.view).toMatchObject({ state: "failed", status: 502 });
  });

  it("carries the reason of a refused job", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    vi.mocked(fetch).mockResolvedValue(
      answer({ state: "failed", status: 400, reason: "instruction" })
    );
    const { result } = renderHook(() => useFitJob(true));
    startJob();
    await letTimePass(1_000);

    expect(result.current.view).toEqual({
      state: "failed",
      status: 400,
      reason: "instruction",
      retryAfterSeconds: 0,
    });
    expect(pendingFitJobSnapshot()).toBeNull();
  });

  it("carries the wait of a job the daily cap refused", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    vi.mocked(fetch).mockResolvedValue(
      answer({ state: "failed", status: 429, retryAfterSeconds: 28_800 })
    );
    const { result } = renderHook(() => useFitJob(true));
    startJob();
    await letTimePass(1_000);

    expect(result.current.view).toMatchObject({
      state: "failed",
      status: 429,
      retryAfterSeconds: 28_800,
    });
  });

  it("gives up once the four minute budget is spent", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const { result } = renderHook(() => useFitJob(true));
    startJob(Date.now() - 238_000);
    await letTimePass(1_000);

    expect(result.current.view).toMatchObject({
      state: "failed",
      status: FIT_JOB_OUT_OF_TIME_STATUS,
    });
    expect(fetch).not.toHaveBeenCalled();
    expect(pendingFitJobSnapshot()).toBeNull();
  });

  it("asks nothing at all when the caller switched the polling off", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const { result } = renderHook(() => useFitJob(false));
    startJob();
    await letTimePass(6_000);

    expect(fetch).not.toHaveBeenCalled();
    expect(result.current.view).toMatchObject({ state: "running" });
  });

  it("keeps a standing result in reach while a new job runs", () => {
    standingResultInTheSession();
    const { result } = renderHook(() => useFitJob(true));
    expect(result.current.view).toMatchObject({ state: "done", seen: true });

    startJob();
    expect(result.current.view).toMatchObject({ state: "running" });
    expect(result.current.standingResult).toMatchObject({ sessionId: SESSION_ID });
  });

  it("shows a fresh failure before the older standing result, until it is forgotten", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    standingResultInTheSession();
    vi.mocked(fetch).mockResolvedValue(
      answer({ state: "failed", status: 400, reason: "instruction" })
    );
    const { result } = renderHook(() => useFitJob(true));
    startJob();
    await letTimePass(1_000);

    expect(result.current.view).toMatchObject({ state: "failed" });
    expect(result.current.standingResult).toMatchObject({ sessionId: SESSION_ID });

    act(() => result.current.forgetFailure());
    expect(result.current.view).toMatchObject({ state: "done" });
  });

  it("falls back to idle when a failure is forgotten and nothing stands", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    vi.mocked(fetch).mockResolvedValue(answer({ state: "failed", status: 500 }));
    const { result } = renderHook(() => useFitJob(true));
    startJob();
    await letTimePass(1_000);
    expect(result.current.view).toMatchObject({ state: "failed", status: 500 });

    act(() => result.current.forgetFailure());
    expect(result.current.view).toEqual({ state: "idle" });
  });
});
