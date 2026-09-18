import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import type { FitReport } from "@/lib/fit/types";
import type { FitJobView } from "./useFitJob";
import { useTrackFitJobOutcome } from "./useTrackFitJobOutcome";

const trackFitEvent = vi.fn();
vi.mock("@/lib/fit/client", async () => {
  const actual = await vi.importActual<typeof import("@/lib/fit/client")>("@/lib/fit/client");
  return { ...actual, trackFitEvent: (...parameters: unknown[]) => trackFitEvent(...parameters) };
});

const report: FitReport = {
  summary: "React sits in the work history.",
  requirements: [
    {
      requirement: "React",
      verdict: "inRecord",
      note: "React at bol.com.",
      engagements: [{ id: "bol", company: "bol.com" }],
    },
    {
      requirement: "Salesforce",
      verdict: "notInRecord",
      note: "The record holds no Salesforce work.",
      engagements: [],
    },
  ],
  technologies: [],
};

const runningView: FitJobView = {
  state: "running",
  phase: "reading",
  toolCalls: 0,
  elapsedSeconds: 0,
};

const doneView: FitJobView = {
  state: "done",
  report,
  sessionId: "session-id-value",
  seen: false,
};

const failedView: FitJobView = {
  state: "failed",
  status: 504,
  reason: null,
  retryAfterSeconds: 0,
};

type TrackedProps = { view: FitJobView; enabled: boolean; onDone?: () => void };

const renderTracker = (initialProps: TrackedProps) =>
  renderHook(
    ({ view, enabled, onDone }: TrackedProps) => useTrackFitJobOutcome(view, enabled, onDone),
    { initialProps }
  );

beforeEach(() => {
  trackFitEvent.mockReset();
});

describe("useTrackFitJobOutcome", () => {
  it("reports nothing on the first render", () => {
    renderTracker({ view: doneView, enabled: true });
    expect(trackFitEvent).not.toHaveBeenCalled();
  });

  it("reports the finished check with the verdict counts and calls back", () => {
    const onDone = vi.fn();
    const { rerender } = renderTracker({ view: runningView, enabled: true, onDone });
    rerender({ view: doneView, enabled: true, onDone });

    expect(trackFitEvent).toHaveBeenCalledWith("fit_completed", {
      requirements: 2,
      inRecord: 1,
      partly: 0,
      notInRecord: 1,
    });
    expect(onDone).toHaveBeenCalledTimes(1);
  });

  it("calls the callback the parent handed over last", () => {
    const first = vi.fn();
    const second = vi.fn();
    const { rerender } = renderTracker({ view: runningView, enabled: true, onDone: first });
    rerender({ view: runningView, enabled: true, onDone: second });
    rerender({ view: doneView, enabled: true, onDone: second });

    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);
  });

  it("reports the failed check with its status", () => {
    const { rerender } = renderTracker({ view: runningView, enabled: true });
    rerender({ view: failedView, enabled: true });
    expect(trackFitEvent).toHaveBeenCalledWith("fit_failed", { status: 504 });
  });

  it("reports nothing while the measurement is switched off", () => {
    const onDone = vi.fn();
    const { rerender } = renderTracker({ view: runningView, enabled: false, onDone });
    rerender({ view: doneView, enabled: false, onDone });

    expect(trackFitEvent).not.toHaveBeenCalled();
    expect(onDone).not.toHaveBeenCalled();
  });

  it("reports nothing when the check was never running", () => {
    const { rerender } = renderTracker({ view: { state: "idle" }, enabled: true });
    rerender({ view: doneView, enabled: true });
    expect(trackFitEvent).not.toHaveBeenCalled();
  });

  it("carries on without a callback", () => {
    const { rerender } = renderTracker({ view: runningView, enabled: true });
    rerender({ view: doneView, enabled: true });
    expect(trackFitEvent).toHaveBeenCalledWith("fit_completed", expect.any(Object));
  });
});
