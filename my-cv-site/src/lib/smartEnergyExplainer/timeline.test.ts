import {
  FRAMES_PER_SECOND,
  SCENES,
  TOTAL_DURATION_MILLISECONDS,
  frameCount,
  lastFrameMillisecondsOfScene,
  millisecondsForFrame,
  sceneAtMilliseconds,
  sceneIndexOf,
  sceneStartMilliseconds,
  wrapElapsed,
} from "./timeline";

describe("timeline", () => {
  it("has eleven scenes whose lengths sum to the total of ninety seconds", () => {
    expect(SCENES).toHaveLength(11);
    expect(SCENES.reduce((total, scene) => total + scene.lengthMilliseconds, 0)).toBe(TOTAL_DURATION_MILLISECONDS);
    expect(TOTAL_DURATION_MILLISECONDS).toBe(90000);
  });

  it("orders the scenes as the spec lists them with stores and consistency after ports", () => {
    expect(SCENES.map((scene) => scene.id)).toEqual([
      "title",
      "layers",
      "telemetry",
      "command",
      "ports",
      "stores",
      "consistency",
      "assetKind",
      "scale",
      "security",
      "closing",
    ]);
    expect(sceneStartMilliseconds("stores")).toBe(35000);
    expect(sceneStartMilliseconds("consistency")).toBe(44000);
    expect(sceneStartMilliseconds("closing")).toBe(86000);
  });

  it("counts 2700 frames at 30 frames per second", () => {
    expect(FRAMES_PER_SECOND).toBe(30);
    expect(frameCount).toBe(2700);
  });

  it("wraps negative, not a number, inside and past the total", () => {
    expect(wrapElapsed(-1000)).toBe(89000);
    expect(wrapElapsed(Number.NaN)).toBe(0);
    expect(wrapElapsed(Number.POSITIVE_INFINITY)).toBe(0);
    expect(wrapElapsed(1234)).toBe(1234);
    expect(wrapElapsed(TOTAL_DURATION_MILLISECONDS + 500)).toBe(500);
  });

  it("finds the scene at zero, at each start and one millisecond before each end", () => {
    expect(sceneAtMilliseconds(0).id).toBe("title");
    for (const scene of SCENES) {
      expect(sceneAtMilliseconds(scene.startMilliseconds).id).toBe(scene.id);
      expect(sceneAtMilliseconds(scene.startMilliseconds + scene.lengthMilliseconds - 1).id).toBe(scene.id);
    }
  });

  it("wraps to the title scene at the total", () => {
    expect(sceneAtMilliseconds(TOTAL_DURATION_MILLISECONDS).id).toBe("title");
  });

  it("maps frame zero to zero milliseconds and keeps the last frame below the total", () => {
    expect(millisecondsForFrame(0)).toBe(0);
    expect(millisecondsForFrame(frameCount - 1)).toBeLessThan(TOTAL_DURATION_MILLISECONDS);
  });

  it("puts the last frame of each scene inside that scene", () => {
    for (const scene of SCENES) {
      const last = lastFrameMillisecondsOfScene(scene.id);
      expect(sceneAtMilliseconds(last).id).toBe(scene.id);
      expect(last + 1000 / FRAMES_PER_SECOND).toBeGreaterThanOrEqual(scene.startMilliseconds + scene.lengthMilliseconds);
    }
    expect(sceneIndexOf("closing")).toBe(10);
  });
});
