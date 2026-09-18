"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import {
  FIT_JOB_POLL_INTERVAL_MILLISECONDS,
  hasFitJobBudgetLeft,
  readFitJobStatus,
  type FitJobPhase,
  type FitJobStatus,
} from "@/lib/fit/job";
import {
  dropPendingFitJob,
  finishPendingFitJob,
  finishedFitJobSnapshot,
  noFitJobOnTheServer,
  pendingFitJobSnapshot,
  subscribeToFitJobs,
} from "@/lib/fit/jobStore";
import type { FitRefusalReason, FitReport } from "@/lib/fit/types";

export const FIT_JOB_FIRST_POLL_MILLISECONDS = 1_000;
export const FIT_JOB_CLOCK_MILLISECONDS = 1_000;
export const FIT_JOB_OUT_OF_TIME_STATUS = 504;

export type FitJobView =
  | { state: "idle" }
  | { state: "running"; phase: FitJobPhase; toolCalls: number; elapsedSeconds: number }
  | { state: "done"; report: FitReport; sessionId: string; seen: boolean }
  | {
      state: "failed";
      status: number;
      reason: FitRefusalReason | null;
      retryAfterSeconds: number;
    };

type JobProgress = { jobId: string; phase: FitJobPhase; toolCalls: number };

type JobFailure = Extract<FitJobStatus, { state: "failed" }> & { jobId: string };

async function readStatus(jobId: string): Promise<FitJobStatus | null> {
  const response = await fetch(`/api/fit/status?job=${jobId}`, { cache: "no-store" }).catch(
    () => null
  );
  if (!response?.ok) return null;
  return readFitJobStatus(await response.json().catch(() => null));
}

export type FitJobResult = { report: FitReport; sessionId: string; seen: boolean };

export type FitJobHandle = {
  view: FitJobView;
  standingResult: FitJobResult | null;
  forgetFailure: () => void;
};

export const useFitJob = (enabled: boolean): FitJobHandle => {
  const pending = useSyncExternalStore(
    subscribeToFitJobs,
    pendingFitJobSnapshot,
    noFitJobOnTheServer
  );
  const finished = useSyncExternalStore(
    subscribeToFitJobs,
    finishedFitJobSnapshot,
    noFitJobOnTheServer
  );
  const [progress, setProgress] = useState<JobProgress | null>(null);
  const [failure, setFailure] = useState<JobFailure | null>(null);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!enabled || pending === null) return;

    let stopped = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const failWith = (status: Extract<FitJobStatus, { state: "failed" }>) => {
      setFailure({ ...status, jobId: pending.jobId });
      dropPendingFitJob();
    };

    const poll = async () => {
      if (stopped) return;
      if (!hasFitJobBudgetLeft(Date.now() - pending.startedAt)) {
        failWith({
          state: "failed",
          status: FIT_JOB_OUT_OF_TIME_STATUS,
          reason: null,
          retryAfterSeconds: 0,
        });
        return;
      }

      const status = await readStatus(pending.jobId);
      if (stopped) return;

      if (status?.state === "done") {
        setFailure(null);
        finishPendingFitJob({
          report: status.report,
          sessionId: status.sessionId,
          finishedAt: Date.now(),
          seen: false,
        });
        return;
      }
      if (status?.state === "failed") {
        failWith(status);
        return;
      }
      if (status?.state === "running") {
        setProgress({ jobId: pending.jobId, phase: status.phase, toolCalls: status.toolCalls });
      }
      timer = setTimeout(poll, FIT_JOB_POLL_INTERVAL_MILLISECONDS);
    };

    timer = setTimeout(poll, FIT_JOB_FIRST_POLL_MILLISECONDS);
    const clock = setInterval(() => setNow(Date.now()), FIT_JOB_CLOCK_MILLISECONDS);

    return () => {
      stopped = true;
      clearTimeout(timer);
      clearInterval(clock);
    };
  }, [enabled, pending]);

  const forgetFailure = () => setFailure(null);
  const standingResult: FitJobResult | null =
    finished === null
      ? null
      : { report: finished.report, sessionId: finished.sessionId, seen: finished.seen };

  const viewOf = (): FitJobView => {
    if (pending !== null) {
      const known = progress?.jobId === pending.jobId ? progress : null;
      return {
        state: "running",
        phase: known?.phase ?? "reading",
        toolCalls: known?.toolCalls ?? 0,
        elapsedSeconds: Math.max(0, Math.floor((now - pending.startedAt) / 1000)),
      };
    }
    if (failure !== null) {
      return {
        state: "failed",
        status: failure.status,
        reason: failure.reason,
        retryAfterSeconds: failure.retryAfterSeconds,
      };
    }
    if (standingResult !== null) return { state: "done", ...standingResult };
    return { state: "idle" };
  };

  return { view: viewOf(), standingResult, forgetFailure };
};
