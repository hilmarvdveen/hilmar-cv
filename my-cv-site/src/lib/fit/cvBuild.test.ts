import { describe, expect, it } from "vitest";
import {
  CV_BUILD_BUDGET_MILLISECONDS,
  CV_POLL_BUDGET_MILLISECONDS,
  CV_POLL_INTERVAL_MILLISECONDS,
  CV_STATUS_BUDGET_MILLISECONDS,
  CV_STREAM_BUDGET_MILLISECONDS,
  hasPollBudgetLeft,
  pollAttemptsWithinBudget,
} from "./cvBuild";

describe("the budgets of the tailored CV", () => {
  it("polls every four seconds for at most three minutes", () => {
    expect(CV_POLL_INTERVAL_MILLISECONDS).toBe(4_000);
    expect(CV_POLL_BUDGET_MILLISECONDS).toBe(180_000);
    expect(pollAttemptsWithinBudget()).toBe(45);
  });

  it("keeps every route budget under its own maxDuration", () => {
    expect(CV_BUILD_BUDGET_MILLISECONDS).toBeLessThan(60_000);
    expect(CV_STREAM_BUDGET_MILLISECONDS).toBeLessThan(60_000);
    expect(CV_STATUS_BUDGET_MILLISECONDS).toBeLessThan(30_000);
  });

  it("stops asking once another interval would pass the budget", () => {
    expect(hasPollBudgetLeft(0)).toBe(true);
    expect(hasPollBudgetLeft(CV_POLL_BUDGET_MILLISECONDS - CV_POLL_INTERVAL_MILLISECONDS)).toBe(
      true
    );
    expect(hasPollBudgetLeft(CV_POLL_BUDGET_MILLISECONDS)).toBe(false);
  });
});
