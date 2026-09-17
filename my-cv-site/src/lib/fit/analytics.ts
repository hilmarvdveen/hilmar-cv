import { pushDataLayerEvent } from "@/lib/analytics/events";

export type FitEventName =
  | "fit_submitted"
  | "fit_completed"
  | "fit_failed"
  | "fit_question_submitted"
  | "fit_question_answered"
  | "fit_question_failed"
  | "fit_cv_requested"
  | "fit_cv_downloaded"
  | "fit_cv_failed";

export type FitEventParameters = Record<string, string | number | boolean>;

export const FIT_EVENT_CATEGORY = "fit";

export function trackFitEvent(
  name: FitEventName,
  parameters: FitEventParameters = {}
): void {
  pushDataLayerEvent(name, FIT_EVENT_CATEGORY, parameters);
}
