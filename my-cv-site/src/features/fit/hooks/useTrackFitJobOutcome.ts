"use client";

import { useEffect, useRef } from "react";
import { countFitVerdicts, trackFitEvent } from "@/lib/fit/client";
import type { FitJobView } from "./useFitJob";

export const useTrackFitJobOutcome = (
  view: FitJobView,
  enabled: boolean,
  onDone?: () => void
): void => {
  const previousState = useRef<FitJobView["state"]>(view.state);
  const onDoneRef = useRef(onDone);

  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    const previous = previousState.current;
    previousState.current = view.state;
    if (!enabled || previous !== "running") return;

    if (view.state === "done") {
      const counts = countFitVerdicts(view.report);
      trackFitEvent("fit_completed", {
        requirements: view.report.requirements.length,
        inRecord: counts.inRecord,
        partly: counts.partly,
        notInRecord: counts.notInRecord,
      });
      onDoneRef.current?.();
    }
    if (view.state === "failed") trackFitEvent("fit_failed", { status: view.status });
  }, [view, enabled]);
};
