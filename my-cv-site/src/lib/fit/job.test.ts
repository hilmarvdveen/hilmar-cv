import { describe, expect, it } from "vitest";
import {
  FINISHED_FIT_JOB_KEY,
  FINISHED_FIT_JOB_LIFETIME_MILLISECONDS,
  FIT_JOB_POLL_BUDGET_MILLISECONDS,
  FIT_JOB_POLL_INTERVAL_MILLISECONDS,
  PENDING_FIT_JOB_KEY,
  browserSessionStore,
  failedFitJob,
  forgetFinishedFitJob,
  forgetPendingFitJob,
  hasFitJobBudgetLeft,
  markFinishedFitJobSeen,
  readFinishedFitJob,
  readFitJobStatus,
  readPendingFitJob,
  rememberFinishedFitJob,
  rememberPendingFitJob,
  sanitizeJobId,
  type KeyValueStore,
} from "./job";
import type { FitReport } from "./types";

const report: FitReport = {
  summary: "React sits in the work history.",
  requirements: [
    {
      requirement: "React",
      verdict: "inRecord",
      note: "React at bol.com.",
      engagements: [
        { id: "bol", company: "bol.com" },
        { id: "invented", company: "Invented" },
      ],
    },
  ],
  technologies: [{ name: "React", years: 5, engagements: ["bol"] }],
};

type TestStore = KeyValueStore & { values: Map<string, string> };

function createStore(initial: Record<string, string> = {}): TestStore {
  const values = new Map(Object.entries(initial));
  return {
    values,
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => {
      values.set(key, value);
    },
    removeItem: (key) => {
      values.delete(key);
    },
  };
}

const brokenStore: KeyValueStore = {
  getItem: () => {
    throw new Error("blocked");
  },
  setItem: () => {
    throw new Error("blocked");
  },
  removeItem: () => {
    throw new Error("blocked");
  },
};

describe("sanitizeJobId", () => {
  it("keeps 32 hexadecimal characters and drops everything else", () => {
    expect(sanitizeJobId("a".repeat(32))).toBe("a".repeat(32));
    expect(sanitizeJobId("A".repeat(32))).toBe("");
    expect(sanitizeJobId("short")).toBe("");
    expect(sanitizeJobId(7)).toBe("");
  });
});

describe("readFitJobStatus", () => {
  it("reads a running job and falls back to the first phase for a phase it does not know", () => {
    expect(
      readFitJobStatus({ state: "running", phase: "verifying", toolCalls: 6, elapsedSeconds: 31 })
    ).toEqual({ state: "running", phase: "verifying", toolCalls: 6, elapsedSeconds: 31 });
    expect(readFitJobStatus({ state: "running", phase: "dreaming", toolCalls: -2 })).toEqual({
      state: "running",
      phase: "reading",
      toolCalls: 0,
      elapsedSeconds: 0,
    });
  });

  it("reads a finished job with a sanitised report and session id", () => {
    const status = readFitJobStatus({ state: "done", report, sessionId: "session-id-value" });
    expect(status).toMatchObject({ state: "done", sessionId: "session-id-value" });
    expect(status.state === "done" ? status.report.requirements[0].engagements : []).toEqual([
      { id: "bol", company: "bol.com" },
    ]);
  });

  it("answers a finished job with a report of another shape as failed", () => {
    expect(readFitJobStatus({ state: "done", report: { summary: 7 } })).toEqual(failedFitJob(502));
  });

  it("reads a failed job with its status, its reason and its wait, never its sentence", () => {
    expect(
      readFitJobStatus({
        state: "failed",
        status: 429,
        error: "daily cap",
        retryAfterSeconds: 28_800,
      })
    ).toEqual({ state: "failed", status: 429, reason: null, retryAfterSeconds: 28_800 });
    expect(readFitJobStatus({ state: "failed", status: 400, reason: "instruction" })).toEqual({
      state: "failed",
      status: 400,
      reason: "instruction",
      retryAfterSeconds: 0,
    });
  });

  it("answers anything unreadable as failed with 502", () => {
    expect(readFitJobStatus(null)).toEqual(failedFitJob(502));
    expect(readFitJobStatus({ state: "failed" })).toEqual(failedFitJob(502));
  });
});

describe("hasFitJobBudgetLeft", () => {
  it("stops polling when the next poll would pass the budget", () => {
    expect(hasFitJobBudgetLeft(0)).toBe(true);
    expect(
      hasFitJobBudgetLeft(FIT_JOB_POLL_BUDGET_MILLISECONDS - FIT_JOB_POLL_INTERVAL_MILLISECONDS)
    ).toBe(true);
    expect(hasFitJobBudgetLeft(FIT_JOB_POLL_BUDGET_MILLISECONDS)).toBe(false);
  });
});

describe("the pending job in the session", () => {
  it("remembers a job, reads it back and forgets it", () => {
    const store = createStore();
    rememberPendingFitJob(store, { jobId: "e".repeat(32), startedAt: 1_000, locale: "en" });
    expect(readPendingFitJob(store, 2_000)).toEqual({
      jobId: "e".repeat(32),
      startedAt: 1_000,
      locale: "en",
    });
    forgetPendingFitJob(store);
    expect(readPendingFitJob(store, 2_000)).toBeNull();
  });

  it("drops a job older than the polling budget and anything of another shape", () => {
    const store = createStore();
    rememberPendingFitJob(store, { jobId: "e".repeat(32), startedAt: 0, locale: "nl" });
    expect(readPendingFitJob(store, FIT_JOB_POLL_BUDGET_MILLISECONDS + 1)).toBeNull();
    expect(store.values.has(PENDING_FIT_JOB_KEY)).toBe(false);

    expect(readPendingFitJob(createStore({ [PENDING_FIT_JOB_KEY]: "not json" }), 1)).toBeNull();
    expect(readPendingFitJob(createStore({ [PENDING_FIT_JOB_KEY]: '"text"' }), 1)).toBeNull();
    expect(
      readPendingFitJob(
        createStore({ [PENDING_FIT_JOB_KEY]: JSON.stringify({ jobId: "x", startedAt: 1 }) }),
        1
      )
    ).toBeNull();
    expect(
      readPendingFitJob(
        createStore({
          [PENDING_FIT_JOB_KEY]: JSON.stringify({ jobId: "e".repeat(32), startedAt: "soon" }),
        }),
        1
      )
    ).toBeNull();
  });

  it("reads an unknown locale as Dutch", () => {
    const store = createStore({
      [PENDING_FIT_JOB_KEY]: JSON.stringify({ jobId: "e".repeat(32), startedAt: 1, locale: "de" }),
    });
    expect(readPendingFitJob(store, 2)?.locale).toBe("nl");
  });
});

describe("the finished report in the session", () => {
  it("remembers a report, reads it back sanitised and forgets it", () => {
    const store = createStore();
    rememberFinishedFitJob(store, { report, sessionId: "session-id-value", finishedAt: 5_000, seen: false });
    const finished = readFinishedFitJob(store, 6_000);
    expect(finished?.sessionId).toBe("session-id-value");
    expect(finished?.report.requirements[0].engagements).toEqual([
      { id: "bol", company: "bol.com" },
    ]);
    expect(finished?.seen).toBe(false);
    markFinishedFitJobSeen(store, 6_000);
    expect(readFinishedFitJob(store, 6_000)?.seen).toBe(true);
    markFinishedFitJobSeen(store, 6_000);
    forgetFinishedFitJob(store);
    markFinishedFitJobSeen(store, 6_000);
    expect(readFinishedFitJob(store, 6_000)).toBeNull();
  });

  it("drops a report after an hour and anything of another shape", () => {
    const store = createStore();
    rememberFinishedFitJob(store, { report, sessionId: "session-id-value", finishedAt: 0, seen: false });
    expect(readFinishedFitJob(store, FINISHED_FIT_JOB_LIFETIME_MILLISECONDS + 1)).toBeNull();
    expect(store.values.has(FINISHED_FIT_JOB_KEY)).toBe(false);
    expect(
      readFinishedFitJob(createStore({ [FINISHED_FIT_JOB_KEY]: JSON.stringify({ report: 7 }) }), 1)
    ).toBeNull();
    expect(
      readFinishedFitJob(
        createStore({ [FINISHED_FIT_JOB_KEY]: JSON.stringify({ report, finishedAt: "x" }) }),
        1
      )
    ).toBeNull();
  });

  it("never throws when the browser blocks the storage", () => {
    rememberPendingFitJob(brokenStore, { jobId: "e".repeat(32), startedAt: 1, locale: "nl" });
    rememberFinishedFitJob(brokenStore, { report, sessionId: "session-id-value", finishedAt: 1, seen: false });
    forgetPendingFitJob(brokenStore);
    forgetFinishedFitJob(brokenStore);
    expect(readPendingFitJob(brokenStore, 2)).toBeNull();
    expect(readFinishedFitJob(brokenStore, 2)).toBeNull();
  });
});

describe("browserSessionStore", () => {
  it("answers the session storage of the window", () => {
    expect(browserSessionStore()).toBe(window.sessionStorage);
  });
});
