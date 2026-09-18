import {
  isFitReport,
  readFitRefusalReason,
  retryAfterSecondsFromBody,
  sanitizeFitReport,
  sanitizeSessionId,
} from "./report";
import type { FitLocale, FitRefusalReason, FitReport } from "./types";

export const FIT_JOB_PHASES = ["reading", "searching", "writing", "verifying", "saving"] as const;

export type FitJobPhase = (typeof FIT_JOB_PHASES)[number];

export type FitJobStatus =
  | { state: "running"; phase: FitJobPhase; toolCalls: number; elapsedSeconds: number }
  | { state: "done"; report: FitReport; sessionId: string }
  | {
      state: "failed";
      status: number;
      reason: FitRefusalReason | null;
      retryAfterSeconds: number;
    };

export const FIT_JOB_POLL_INTERVAL_MILLISECONDS = 2_500;
export const FIT_JOB_POLL_BUDGET_MILLISECONDS = 240_000;
export const FIT_JOB_START_BUDGET_MILLISECONDS = 50_000;
export const FIT_JOB_STATUS_BUDGET_MILLISECONDS = 10_000;
export const FIT_JOB_LONG_RUN_SECONDS = 60;
export const FIT_JOB_VERY_LONG_RUN_SECONDS = 120;
export const FIT_JOB_LOST_STATUS = 404;

const JOB_ID_PATTERN = /^[0-9a-f]{32}$/;

export function sanitizeJobId(value: unknown): string {
  return typeof value === "string" && JOB_ID_PATTERN.test(value) ? value : "";
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const readCount = (value: unknown): number => {
  const count = Number(value);
  return Number.isFinite(count) && count > 0 ? Math.floor(count) : 0;
};

export function failedFitJob(status: number, body: unknown = null): FitJobStatus {
  return {
    state: "failed",
    status,
    reason: readFitRefusalReason(body),
    retryAfterSeconds: retryAfterSecondsFromBody(body),
  };
}

export function readFitJobStatus(body: unknown): FitJobStatus {
  if (!isRecord(body)) return failedFitJob(502);

  if (body.state === "running") {
    const phase = FIT_JOB_PHASES.find((known) => known === body.phase) ?? "reading";
    return {
      state: "running",
      phase,
      toolCalls: readCount(body.toolCalls),
      elapsedSeconds: readCount(body.elapsedSeconds),
    };
  }

  if (body.state === "done") {
    if (!isFitReport(body.report)) return failedFitJob(502);
    return {
      state: "done",
      report: sanitizeFitReport(body.report),
      sessionId: sanitizeSessionId(body.sessionId),
    };
  }

  const status = readCount(body.status);
  return failedFitJob(status === 0 ? 502 : status, body);
}

export function hasFitJobBudgetLeft(elapsedMilliseconds: number): boolean {
  return elapsedMilliseconds + FIT_JOB_POLL_INTERVAL_MILLISECONDS <= FIT_JOB_POLL_BUDGET_MILLISECONDS;
}

export type PendingFitJob = {
  jobId: string;
  startedAt: number;
  locale: FitLocale;
};

export type FinishedFitJob = {
  report: FitReport;
  sessionId: string;
  finishedAt: number;
  seen: boolean;
};

export type KeyValueStore = Pick<Storage, "getItem" | "setItem" | "removeItem">;

export const PENDING_FIT_JOB_KEY = "fit.job";
export const FINISHED_FIT_JOB_KEY = "fit.result";
export const FINISHED_FIT_JOB_LIFETIME_MILLISECONDS = 60 * 60_000;

function readJson(store: KeyValueStore, key: string): unknown {
  try {
    const stored = store.getItem(key);
    return stored === null ? null : (JSON.parse(stored) as unknown);
  } catch {
    return null;
  }
}

function writeJson(store: KeyValueStore, key: string, value: unknown): boolean {
  try {
    store.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

function removeKey(store: KeyValueStore, key: string): boolean {
  try {
    store.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

export function rememberPendingFitJob(store: KeyValueStore, job: PendingFitJob): void {
  writeJson(store, PENDING_FIT_JOB_KEY, job);
}

export function forgetPendingFitJob(store: KeyValueStore): void {
  removeKey(store, PENDING_FIT_JOB_KEY);
}

export function readPendingFitJob(store: KeyValueStore, now: number): PendingFitJob | null {
  const stored = readJson(store, PENDING_FIT_JOB_KEY);
  if (!isRecord(stored)) return null;
  const jobId = sanitizeJobId(stored.jobId);
  const startedAt = Number(stored.startedAt);
  if (jobId === "" || !Number.isFinite(startedAt)) return null;
  if (now - startedAt > FIT_JOB_POLL_BUDGET_MILLISECONDS) {
    forgetPendingFitJob(store);
    return null;
  }
  return { jobId, startedAt, locale: stored.locale === "en" ? "en" : "nl" };
}

export function rememberFinishedFitJob(store: KeyValueStore, finished: FinishedFitJob): void {
  writeJson(store, FINISHED_FIT_JOB_KEY, finished);
}

export function forgetFinishedFitJob(store: KeyValueStore): void {
  removeKey(store, FINISHED_FIT_JOB_KEY);
}

export function readFinishedFitJob(store: KeyValueStore, now: number): FinishedFitJob | null {
  const stored = readJson(store, FINISHED_FIT_JOB_KEY);
  if (!isRecord(stored) || !isFitReport(stored.report)) return null;
  const finishedAt = Number(stored.finishedAt);
  if (!Number.isFinite(finishedAt) || now - finishedAt > FINISHED_FIT_JOB_LIFETIME_MILLISECONDS) {
    forgetFinishedFitJob(store);
    return null;
  }
  return {
    report: sanitizeFitReport(stored.report),
    sessionId: sanitizeSessionId(stored.sessionId),
    finishedAt,
    seen: stored.seen === true,
  };
}

export function markFinishedFitJobSeen(store: KeyValueStore, now: number): void {
  const finished = readFinishedFitJob(store, now);
  if (finished !== null && !finished.seen) {
    rememberFinishedFitJob(store, { ...finished, seen: true });
  }
}

export function browserSessionStore(): KeyValueStore | null {
  try {
    return typeof window === "undefined" ? null : window.sessionStorage;
  } catch {
    return null;
  }
}
