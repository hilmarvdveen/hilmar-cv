export const CV_POLL_INTERVAL_MILLISECONDS = 4_000;

export const CV_POLL_BUDGET_MILLISECONDS = 180_000;

export const CV_BUILD_BUDGET_MILLISECONDS = 15_000;

export const CV_STATUS_BUDGET_MILLISECONDS = 10_000;

export const CV_STREAM_BUDGET_MILLISECONDS = 45_000;

export function hasPollBudgetLeft(elapsedMilliseconds: number): boolean {
  return elapsedMilliseconds + CV_POLL_INTERVAL_MILLISECONDS <= CV_POLL_BUDGET_MILLISECONDS;
}

export function pollAttemptsWithinBudget(): number {
  return Math.floor(CV_POLL_BUDGET_MILLISECONDS / CV_POLL_INTERVAL_MILLISECONDS);
}
