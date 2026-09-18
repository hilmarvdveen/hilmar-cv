import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { FINISHED_FIT_JOB_KEY, PENDING_FIT_JOB_KEY } from "./job";
import type { FinishedFitJob, PendingFitJob } from "./job";
import type { FitReport } from "./types";

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

const pendingJob: PendingFitJob = {
  jobId: "a".repeat(32),
  startedAt: Date.now(),
  locale: "nl",
};

const finishedJob: FinishedFitJob = {
  report,
  sessionId: "session-id-value",
  finishedAt: Date.now(),
  seen: false,
};

const loadStore = async () => {
  vi.resetModules();
  return import("./jobStore");
};

const sessionStorageDescriptor = Object.getOwnPropertyDescriptor(window, "sessionStorage");

const restoreSessionStorage = () => {
  if (sessionStorageDescriptor) {
    Object.defineProperty(window, "sessionStorage", sessionStorageDescriptor);
    return;
  }
  Reflect.deleteProperty(window, "sessionStorage");
};

const replaceSessionStorage = (replacement: PropertyDescriptor) => {
  Object.defineProperty(window, "sessionStorage", { configurable: true, ...replacement });
};

beforeEach(() => {
  restoreSessionStorage();
  window.sessionStorage.clear();
});

afterEach(() => {
  restoreSessionStorage();
  window.sessionStorage.clear();
});

describe("the fit job store", () => {
  it("reports no job at all when the session holds nothing", async () => {
    const store = await loadStore();
    expect(store.pendingFitJobSnapshot()).toBeNull();
    expect(store.finishedFitJobSnapshot()).toBeNull();
    expect(store.noFitJobOnTheServer()).toBeNull();
  });

  it("keeps a started job and gives the same snapshot back while nothing changes", async () => {
    const store = await loadStore();
    store.startPendingFitJob(pendingJob);

    const first = store.pendingFitJobSnapshot();
    expect(first).toEqual(pendingJob);
    expect(store.pendingFitJobSnapshot()).toBe(first);
    expect(window.sessionStorage.getItem(PENDING_FIT_JOB_KEY)).not.toBeNull();
  });

  it("forgets a started job", async () => {
    const store = await loadStore();
    store.startPendingFitJob(pendingJob);
    store.dropPendingFitJob();
    expect(store.pendingFitJobSnapshot()).toBeNull();
  });

  it("swaps the started job for the finished result, unseen", async () => {
    const store = await loadStore();
    store.startPendingFitJob(pendingJob);
    store.finishPendingFitJob(finishedJob);

    expect(store.pendingFitJobSnapshot()).toBeNull();
    expect(store.finishedFitJobSnapshot()).toEqual(finishedJob);
    expect(store.finishedFitJobSnapshot()?.seen).toBe(false);
  });

  it("shows a finished result that never had a pending job", async () => {
    const store = await loadStore();
    store.showFinishedFitJob({ ...finishedJob, seen: true });

    expect(store.finishedFitJobSnapshot()?.seen).toBe(true);
    expect(window.sessionStorage.getItem(FINISHED_FIT_JOB_KEY)).not.toBeNull();
  });

  it("marks a finished result as seen and forgets it on request", async () => {
    const store = await loadStore();
    store.finishPendingFitJob(finishedJob);
    store.markFinishedFitJobAsSeen();
    expect(store.finishedFitJobSnapshot()?.seen).toBe(true);

    store.dropFinishedFitJob();
    expect(store.finishedFitJobSnapshot()).toBeNull();
  });

  it("tells every listener about a change until it unsubscribes", async () => {
    const store = await loadStore();
    const listener = vi.fn();
    const unsubscribe = store.subscribeToFitJobs(listener);

    store.startPendingFitJob(pendingJob);
    expect(listener).toHaveBeenCalledTimes(1);

    store.dropPendingFitJob();
    expect(listener).toHaveBeenCalledTimes(2);

    unsubscribe();
    store.startPendingFitJob(pendingJob);
    expect(listener).toHaveBeenCalledTimes(2);
  });

  it("reads nothing and writes nothing when the session store is unreachable", async () => {
    replaceSessionStorage({
      get() {
        throw new Error("blocked");
      },
    });
    const store = await loadStore();
    const listener = vi.fn();
    store.subscribeToFitJobs(listener);

    store.startPendingFitJob(pendingJob);
    store.finishPendingFitJob(finishedJob);
    store.showFinishedFitJob(finishedJob);
    store.markFinishedFitJobAsSeen();
    store.dropPendingFitJob();
    store.dropFinishedFitJob();

    expect(store.pendingFitJobSnapshot()).toBeNull();
    expect(store.finishedFitJobSnapshot()).toBeNull();
    expect(listener).not.toHaveBeenCalled();
  });

  it("reads nothing when the session store refuses to hand over a value", async () => {
    replaceSessionStorage({
      value: {
        getItem: () => {
          throw new Error("blocked");
        },
        setItem: () => undefined,
        removeItem: () => undefined,
      },
    });
    const store = await loadStore();

    expect(store.pendingFitJobSnapshot()).toBeNull();
    expect(store.finishedFitJobSnapshot()).toBeNull();
  });
});
