import { ARROWS, CAMERAS, FRAMES, NODES, ROUTES } from "./layout";
import {
  CAMERA_MOVE_MILLISECONDS,
  FILM_DURATION_MILLISECONDS,
  FILM_FRAMES_PER_SECOND,
  FILM_SCENES,
  filmFrameAtMilliseconds,
  filmFrameCount,
  filmMillisecondsForFrame,
  filmSceneIndexAt,
  interpolateCamera,
  wrapFilmElapsed,
  type FilmSceneId,
} from "./film";

const startOf = (id: FilmSceneId) => FILM_SCENES.find((scene) => scene.id === id)?.startMilliseconds ?? Number.NaN;

const frameIn = (id: FilmSceneId, offset: number) => filmFrameAtMilliseconds(startOf(id) + offset);

const beatLengthOf = (id: FilmSceneId) => {
  const scene = FILM_SCENES.find((candidate) => candidate.id === id);
  return scene ? (scene.lengthMilliseconds - CAMERA_MOVE_MILLISECONDS) / scene.beatCount : Number.NaN;
};

const beatMiddle = (id: FilmSceneId, beatIndex: number, share = 0.5) =>
  frameIn(id, CAMERA_MOVE_MILLISECONDS + (beatIndex + share) * beatLengthOf(id));

describe("film timeline", () => {
  it("runs five scenes in the story order for 62 seconds at 30 frames per second", () => {
    expect(FILM_SCENES.map((scene) => scene.id)).toEqual(["overview", "frontend", "backend", "cloud", "running"]);
    expect(FILM_DURATION_MILLISECONDS).toBe(62000);
    expect(FILM_FRAMES_PER_SECOND).toBe(30);
    expect(filmFrameCount).toBe(1860);
    expect(filmMillisecondsForFrame(0)).toBe(0);
    expect(filmMillisecondsForFrame(filmFrameCount - 1)).toBeLessThan(FILM_DURATION_MILLISECONDS);
  });

  it("wraps negative, not a number and past the end", () => {
    expect(wrapFilmElapsed(-1000)).toBe(61000);
    expect(wrapFilmElapsed(Number.NaN)).toBe(0);
    expect(wrapFilmElapsed(FILM_DURATION_MILLISECONDS + 5)).toBe(5);
    expect(filmSceneIndexAt(FILM_DURATION_MILLISECONDS)).toBe(0);
  });

  it("loops back to the first frame", () => {
    expect(filmFrameAtMilliseconds(FILM_DURATION_MILLISECONDS)).toEqual(filmFrameAtMilliseconds(0));
  });

  it("interpolates a camera with easing", () => {
    expect(interpolateCamera({ x: 0, y: 0, size: 100 }, { x: 100, y: 50, size: 50 }, 0.5)).toEqual({ x: 50, y: 25, size: 75 });
  });
});

describe("film layout", () => {
  it("keeps every node, frame and arrow on the poster", () => {
    for (const box of [...NODES, ...FRAMES]) {
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(1080);
      expect(box.y + box.height).toBeLessThanOrEqual(1080);
    }
    for (const arrow of ARROWS) {
      expect(arrow.points.length).toBeGreaterThanOrEqual(2);
    }
    for (const route of Object.values(ROUTES)) {
      expect(route.length).toBeGreaterThanOrEqual(2);
    }
  });

  it("uses square cameras inside the poster", () => {
    for (const camera of Object.values(CAMERAS)) {
      expect(camera.x + camera.size).toBeLessThanOrEqual(1080);
      expect(camera.y + camera.size).toBeLessThanOrEqual(1080);
    }
  });
});

describe("filmFrameAtMilliseconds", () => {
  it("reveals the overview group by group and then starts the packets", () => {
    const first = frameIn("overview", 0);
    expect(first.camera).toEqual(CAMERAS.overview);
    expect(first.reveal.header).toBe(0);
    expect(first.packets).toEqual([]);
    expect(first.beatIndex).toBeNull();
    const middle = frameIn("overview", 1000);
    expect(middle.reveal.header).toBe(1);
    expect(middle.reveal.security).toBe(0);
    const running = frameIn("overview", 8000);
    expect(Object.values(running.reveal).every((opacity) => opacity === 1)).toBe(true);
    expect(running.packets.map((packet) => packet.route)).toContain("commandsOut");
  });

  it("zooms into the frontend and walks the poll, the ETag, the 304 and the cache", () => {
    expect(frameIn("frontend", 0).camera).toEqual(CAMERAS.overview);
    expect(frameIn("frontend", 0).beatIndex).toBeNull();
    expect(frameIn("frontend", 0).packets).toEqual([]);
    expect(frameIn("frontend", CAMERA_MOVE_MILLISECONDS).camera).toEqual(CAMERAS.frontend);
    const poll = beatMiddle("frontend", 0, 0.9);
    expect(poll.beatIndex).toBe(0);
    expect(poll.highlight?.nodes).toEqual(["browser", "dashboard"]);
    expect(poll.packets[0].fraction).toBeCloseTo(0.62);
    expect(beatMiddle("frontend", 1, 0.9).packets[0].fraction).toBeCloseTo(1);
    const notModified = beatMiddle("frontend", 2, 0.9);
    expect(notModified.packets[0]).toMatchObject({ fraction: 0, tone: "emerald" });
    expect(beatMiddle("frontend", 3).packets).toEqual([]);
    expect(frameIn("frontend", 11999).beatIndex).toBe(3);
  });

  it("zooms into the backend and walks the six patterns with their packets", () => {
    expect(frameIn("backend", CAMERA_MOVE_MILLISECONDS).camera).toEqual(CAMERAS.backend);
    expect(beatMiddle("backend", 0).highlight).toMatchObject({ database: true });
    expect(beatMiddle("backend", 0).packets).toEqual([]);
    const duplicateEarly = beatMiddle("backend", 1, 0.5);
    expect(duplicateEarly.highlight?.chips).toEqual(["readings"]);
    expect(duplicateEarly.packets).toHaveLength(2);
    const bounced = beatMiddle("backend", 1, 0.95);
    expect(bounced.packets[1].fraction).toBeLessThan(1);
    expect(bounced.packets[1].fraction).toBeGreaterThan(0.5);
    expect(beatMiddle("backend", 2).highlight?.chips).toEqual(["currentState"]);
    expect(beatMiddle("backend", 2).packets).toHaveLength(1);
    expect(beatMiddle("backend", 3).highlight?.chips).toEqual(["command"]);
    expect(beatMiddle("backend", 4).highlight?.chips).toEqual(["command", "audit"]);
    const waiting = beatMiddle("backend", 5, 0.5);
    expect(waiting.packets[1].fraction).toBeLessThanOrEqual(0.7);
    const through = beatMiddle("backend", 5, 0.99);
    expect(through.packets[1].fraction).toBeGreaterThan(0.95);
  });

  it("zooms into the cloud and lights its five groups", () => {
    expect(frameIn("cloud", CAMERA_MOVE_MILLISECONDS).camera).toEqual(CAMERAS.cloud);
    expect(beatMiddle("cloud", 0).highlight?.frames).toEqual(["subscription", "resourceGroup"]);
    expect(beatMiddle("cloud", 3).highlight?.nodes).toEqual(["iotHub", "serviceBus"]);
    expect(beatMiddle("cloud", 4).highlight?.nodes).toContain("identities");
    expect(beatMiddle("cloud", 4).packets).toEqual([]);
  });

  it("returns to the overview with everything running, the shields, the gates and the closing", () => {
    const start = frameIn("running", 0);
    expect(start.camera).toEqual(CAMERAS.cloud);
    expect(start.shieldsLit).toBe(0);
    expect(start.packets.length).toBeGreaterThan(0);
    const settled = frameIn("running", CAMERA_MOVE_MILLISECONDS);
    expect(settled.camera).toEqual(CAMERAS.overview);
    expect(settled.shieldsLit).toBe(1);
    const end = frameIn("running", 12900);
    expect(end).toMatchObject({ shieldsLit: 12, gateOpacity: 1, closingOpacity: 1, highlight: null });
  });
});
