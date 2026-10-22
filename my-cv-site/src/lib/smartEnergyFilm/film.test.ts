import { ARROWS, BLOCKS, CAMERAS, FRAMES, GATES_ROW, JOURNEYS, SAFETY_CELLS, SAFETY_PANEL, SHIELDS, VIEWPORT_HEIGHT, cameraHeight } from "./layout";
import {
  CAMERA_MOVE_MILLISECONDS,
  CAPTION_COUNT,
  CAPTION_OF_HOP,
  FILM_DURATION_MILLISECONDS,
  FILM_FRAMES_PER_SECOND,
  FILM_SCENES,
  FILM_TABS,
  filmFrameAtMilliseconds,
  filmFrameCount,
  filmMillisecondsForFrame,
  filmSceneIndexAt,
  interpolateCamera,
  wrapFilmElapsed,
  type FilmSceneId,
} from "./film";

const sceneOf = (id: FilmSceneId) => FILM_SCENES.find((scene) => scene.id === id) ?? FILM_SCENES[0];

const frameIn = (id: FilmSceneId, offset: number) => filmFrameAtMilliseconds(sceneOf(id).startMilliseconds + offset);

const settledShare = (id: FilmSceneId, share: number) => frameIn(id, CAMERA_MOVE_MILLISECONDS + share * (sceneOf(id).lengthMilliseconds - CAMERA_MOVE_MILLISECONDS));

describe("film timeline", () => {
  it("runs nine steps for 80 seconds at 30 frames per second with seven tabs", () => {
    expect(FILM_SCENES.map((scene) => scene.id)).toEqual(["title", "overview", "reading", "command", "customer", "safety", "scale", "cloud", "end"]);
    expect(FILM_TABS).toEqual(["overview", "reading", "command", "customer", "safety", "scale", "cloud"]);
    expect(FILM_DURATION_MILLISECONDS).toBe(80000);
    expect(FILM_FRAMES_PER_SECOND).toBe(30);
    expect(filmFrameCount).toBe(2400);
    expect(filmMillisecondsForFrame(0)).toBe(0);
  });

  it("wraps negative, not a number and past the end, and loops to the first frame", () => {
    expect(wrapFilmElapsed(-1000)).toBe(79000);
    expect(wrapFilmElapsed(Number.NaN)).toBe(0);
    expect(filmSceneIndexAt(FILM_DURATION_MILLISECONDS)).toBe(0);
    expect(filmFrameAtMilliseconds(FILM_DURATION_MILLISECONDS)).toEqual(filmFrameAtMilliseconds(0));
  });

  it("interpolates a camera with easing", () => {
    expect(interpolateCamera({ x: 0, y: 0, width: 100 }, { x: 100, y: 50, width: 50 }, 0.5)).toEqual({ x: 50, y: 25, width: 75 });
  });

  it("maps every hop to a caption that exists", () => {
    for (const [journey, captions] of Object.entries(CAPTION_OF_HOP)) {
      expect(captions).toHaveLength(JOURNEYS[journey as keyof typeof JOURNEYS].length);
      expect(Math.max(...captions)).toBe(CAPTION_COUNT[journey as FilmSceneId] - 1);
    }
  });
});

describe("film layout", () => {
  it("keeps every block, frame and safety cell on the poster and inside its panel", () => {
    for (const box of [...BLOCKS, ...FRAMES]) {
      expect(box.x + box.width).toBeLessThanOrEqual(1080);
      expect(box.y + box.height).toBeLessThanOrEqual(1080);
    }
    for (const cell of Object.values(SAFETY_CELLS)) {
      expect(cell.x).toBeGreaterThanOrEqual(SAFETY_PANEL.x);
      expect(cell.y + cell.height).toBeLessThanOrEqual(SAFETY_PANEL.y + SAFETY_PANEL.height);
    }
  });

  it("joins every arrow to two blocks that exist and keeps eleven blocks", () => {
    const blockIds = new Set(BLOCKS.map((block) => block.id));
    expect(BLOCKS).toHaveLength(11);
    for (const arrow of ARROWS) {
      expect(arrow.ends.every((end) => blockIds.has(end))).toBe(true);
    }
    expect(SHIELDS).toHaveLength(7);
  });

  it("frames every zoom inside the poster", () => {
    for (const camera of Object.values(CAMERAS)) {
      expect(camera.x + camera.width).toBeLessThanOrEqual(1080);
      expect(camera.y + cameraHeight(camera)).toBeLessThanOrEqual(1080);
    }
    expect(cameraHeight(CAMERAS.overview)).toBe(VIEWPORT_HEIGHT);
    expect(GATES_ROW.y + GATES_ROW.height).toBeLessThanOrEqual(VIEWPORT_HEIGHT);
    expect(CAMERAS.safety.x).toBeLessThanOrEqual(SAFETY_PANEL.x);
    expect(CAMERAS.safety.y + cameraHeight(CAMERAS.safety)).toBeGreaterThanOrEqual(SAFETY_PANEL.y + SAFETY_PANEL.height);
  });
});

describe("filmFrameAtMilliseconds", () => {
  it("opens on the title card over the overview and fades it out", () => {
    const first = filmFrameAtMilliseconds(0);
    expect(first).toMatchObject({ sceneId: "title", camera: CAMERAS.overview, titleCardOpacity: 1, captionIndex: null, journey: null, tabIndex: null });
    expect(frameIn("title", 3999).titleCardOpacity).toBeLessThan(0.01);
  });

  it("shows the overview tab with its caption and its progress", () => {
    const overview = frameIn("overview", 3000);
    expect(overview).toMatchObject({ tabIndex: 0, captionIndex: 0, sceneProgress: 0.5, journey: null });
    expect(overview.elapsed).toBe(7000);
    expect(frameIn("reading", 0).tabIndex).toBe(1);
  });

  it("walks journey A hop by hop with its captions", () => {
    expect(frameIn("reading", 0).journey).toBeNull();
    expect(frameIn("reading", 0).captionIndex).toBe(0);
    expect(frameIn("reading", CAMERA_MOVE_MILLISECONDS).camera).toEqual(CAMERAS.reading);
    const first = settledShare("reading", 0.1);
    expect(first.journey).toMatchObject({ id: "reading", hopsShown: 1, activeHop: 0, packet: { arrow: "batteryToHub" } });
    const last = settledShare("reading", 0.95);
    expect(last.journey).toMatchObject({ hopsShown: 3, activeHop: 2, packet: { arrow: "gatewayToDatabase", fraction: 1 } });
    expect(last.captionIndex).toBe(2);
  });

  it("walks journey B to the battery and back to the confirming reading", () => {
    const fifth = settledShare("command", 4.5 / 8);
    expect(fifth.journey?.packet.arrow).toBe("queueToGateway");
    expect(fifth.captionIndex).toBe(2);
    const confirm = settledShare("command", 7.9 / 8);
    expect(confirm.journey).toMatchObject({ hopsShown: 8, packet: { arrow: "batteryToHub" } });
    expect(confirm.captionIndex).toBe(3);
  });

  it("walks journey C forward and back with the packet reversed", () => {
    const back = settledShare("customer", 3.65 / 5);
    expect(back.journey?.packet).toMatchObject({ arrow: "dashboardToApi" });
    expect(back.journey?.packet.fraction).toBeLessThan(0.1);
    expect(back.captionIndex).toBe(2);
  });

  it("animates the four safety mechanisms in order", () => {
    expect(frameIn("safety", 0).safety).toBeNull();
    expect(frameIn("safety", 0).captionIndex).toBe(0);
    expect(settledShare("safety", 0.1).safety).toMatchObject({ mechanism: "duplicate", finished: [] });
    const audit = settledShare("safety", 0.99);
    expect(audit.safety).toMatchObject({ mechanism: "audit", progress: 1, finished: ["duplicate", "race", "lock"] });
    expect(audit.captionIndex).toBe(3);
  });

  it("walks the four scale beats over the overview", () => {
    expect(frameIn("scale", 0).scale).toBeNull();
    expect(frameIn("scale", 0).captionIndex).toBe(0);
    expect(settledShare("scale", 0.1).scale).toMatchObject({ beat: "out" });
    expect(settledShare("scale", 0.3).scale?.beat).toBe("up");
    expect(settledShare("scale", 0.6).scale?.beat).toBe("down");
    const next = settledShare("scale", 0.99);
    expect(next.scale).toMatchObject({ beat: "next", progress: 1 });
    expect(next).toMatchObject({ captionIndex: 3, tabIndex: 5, camera: CAMERAS.overview });
  });

  it("lights the shields one by one in the cloud and keeps them on the end card", () => {
    expect(frameIn("cloud", 0).shieldsShown).toBe(0);
    expect(frameIn("cloud", CAMERA_MOVE_MILLISECONDS).shieldsShown).toBe(1);
    expect(frameIn("cloud", 5999).shieldsShown).toBe(7);
    expect(frameIn("cloud", 5999).captionIndex).toBe(1);
    const end = frameIn("end", 1000);
    expect(end).toMatchObject({ shieldsShown: 7, endCardOpacity: 1, captionIndex: null });
  });
});
