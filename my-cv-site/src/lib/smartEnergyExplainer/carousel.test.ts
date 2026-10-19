import { CAROUSEL_PAGES } from "./carousel";
import { explainerFrameAtMilliseconds } from "./frame";
import { TOTAL_DURATION_MILLISECONDS } from "./timeline";

describe("carousel pages", () => {
  it("lists thirteen pages in the post order", () => {
    expect(CAROUSEL_PAGES.map((page) => page.id)).toEqual([
      "title",
      "drawing",
      "telemetry",
      "command",
      "stores",
      "consistency",
      "assetKind",
      "caching",
      "diagrams",
      "assistantPort",
      "scale",
      "security",
      "closing",
    ]);
  });

  it("keeps every page frame inside the loop", () => {
    for (const page of CAROUSEL_PAGES) {
      expect(page.frameMilliseconds).toBeGreaterThanOrEqual(0);
      expect(page.frameMilliseconds).toBeLessThan(TOTAL_DURATION_MILLISECONDS);
    }
  });

  it("picks frames that show what each page is about", () => {
    const frameOf = (id: string) =>
      explainerFrameAtMilliseconds(CAROUSEL_PAGES.find((page) => page.id === id)?.frameMilliseconds ?? Number.NaN);
    expect(frameOf("stores").stores).toMatchObject({ transactionOpen: true, lockHolder: 1 });
    expect(frameOf("consistency").consistency.beat).toBe("hold");
    expect(frameOf("caching").telemetryBadges).toContain("notModified");
    expect(frameOf("assistantPort").ports.assistantOpacity).toBe(1);
    expect(frameOf("closing").sceneId).toBe("closing");
  });
});
