import { beforeEach, describe, expect, it, vi } from "vitest";
import { pushDataLayerEvent } from "@/lib/analytics/events";
import { FIT_EVENT_CATEGORY, trackFitEvent } from "./analytics";

vi.mock("@/lib/analytics/events", () => ({ pushDataLayerEvent: vi.fn() }));

beforeEach(() => {
  vi.mocked(pushDataLayerEvent).mockClear();
});

describe("trackFitEvent", () => {
  it("pushes the event under the fit category with its parameters", () => {
    trackFitEvent("fit_completed", { requirements: 9, inRecord: 6 });
    expect(pushDataLayerEvent).toHaveBeenCalledWith("fit_completed", FIT_EVENT_CATEGORY, {
      requirements: 9,
      inRecord: 6,
    });
  });

  it("defaults to no parameters", () => {
    trackFitEvent("fit_question_submitted");
    expect(pushDataLayerEvent).toHaveBeenCalledWith("fit_question_submitted", "fit", {});
  });
});
