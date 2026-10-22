import { easeInOut, progressBetween } from "@/lib/smartEnergyExplainer/frame";
import { CAMERAS, JOURNEYS, SAFETY_MECHANISMS, SHIELDS, type ArrowId, type Camera, type JourneyId, type SafetyMechanism } from "./layout";

export type FilmSceneId = "title" | "overview" | "reading" | "command" | "customer" | "safety" | "cloud" | "end";

export type FilmScene = { id: FilmSceneId; startMilliseconds: number; lengthMilliseconds: number };

const SCENE_PLAN: ReadonlyArray<readonly [FilmSceneId, number]> = [
  ["title", 4000],
  ["overview", 6000],
  ["reading", 11000],
  ["command", 14000],
  ["customer", 10000],
  ["safety", 10000],
  ["cloud", 7000],
  ["end", 6000],
];

export const FILM_SCENES: readonly FilmScene[] = SCENE_PLAN.reduce<FilmScene[]>((scenes, [id, lengthMilliseconds]) => {
  const previous = scenes.at(-1);
  const startMilliseconds = previous ? previous.startMilliseconds + previous.lengthMilliseconds : 0;
  return [...scenes, { id, startMilliseconds, lengthMilliseconds }];
}, []);

export const FILM_DURATION_MILLISECONDS = SCENE_PLAN.reduce((total, [, length]) => total + length, 0);

export const FILM_FRAMES_PER_SECOND = 30;

export const filmFrameCount = (FILM_DURATION_MILLISECONDS * FILM_FRAMES_PER_SECOND) / 1000;

export const filmMillisecondsForFrame = (frame: number): number => (frame * 1000) / FILM_FRAMES_PER_SECOND;

export const wrapFilmElapsed = (elapsed: number): number => {
  if (!Number.isFinite(elapsed)) {
    return 0;
  }
  return ((elapsed % FILM_DURATION_MILLISECONDS) + FILM_DURATION_MILLISECONDS) % FILM_DURATION_MILLISECONDS;
};

export const filmSceneIndexAt = (elapsed: number): number => {
  const wrapped = wrapFilmElapsed(elapsed);
  return FILM_SCENES.findLastIndex((scene) => scene.startMilliseconds <= wrapped);
};

export const CAMERA_MOVE_MILLISECONDS = 1200;

const SCENE_CAMERA: Record<FilmSceneId, Camera> = {
  title: CAMERAS.overview,
  overview: CAMERAS.overview,
  reading: CAMERAS.reading,
  command: CAMERAS.command,
  customer: CAMERAS.customer,
  safety: CAMERAS.safety,
  cloud: CAMERAS.overview,
  end: CAMERAS.overview,
};

const SCENE_JOURNEY: Partial<Record<FilmSceneId, JourneyId>> = { reading: "reading", command: "command", customer: "customer" };

export const CAPTION_OF_HOP: Record<JourneyId, readonly number[]> = {
  reading: [0, 1, 2],
  command: [0, 0, 1, 1, 2, 2, 2, 3],
  customer: [0, 1, 1, 2, 2],
};

export const CAPTION_COUNT: Record<FilmSceneId, number> = {
  title: 0,
  overview: 1,
  reading: 3,
  command: 4,
  customer: 3,
  safety: 4,
  cloud: 2,
  end: 0,
};

export const interpolateCamera = (from: Camera, to: Camera, share: number): Camera => {
  const eased = easeInOut(share);
  return {
    x: from.x + (to.x - from.x) * eased,
    y: from.y + (to.y - from.y) * eased,
    width: from.width + (to.width - from.width) * eased,
  };
};

export type Packet = { arrow: ArrowId; fraction: number };

export type JourneyFrame = { id: JourneyId; hopsShown: number; activeHop: number; packet: Packet };

export type SafetyFrame = { mechanism: SafetyMechanism; progress: number; finished: readonly SafetyMechanism[] };

export const FILM_TABS: readonly FilmSceneId[] = ["overview", "reading", "command", "customer", "safety", "cloud"];

export type FilmFrame = {
  sceneId: FilmSceneId;
  sceneIndex: number;
  elapsed: number;
  tabIndex: number | null;
  sceneProgress: number;
  camera: Camera;
  captionIndex: number | null;
  journey: JourneyFrame | null;
  safety: SafetyFrame | null;
  shieldsShown: number;
  titleCardOpacity: number;
  endCardOpacity: number;
};

const journeyFrame = (id: JourneyId, settledElapsed: number, playLength: number): JourneyFrame => {
  const hops = JOURNEYS[id];
  const hopLength = playLength / hops.length;
  const activeHop = Math.min(hops.length - 1, Math.floor(settledElapsed / hopLength));
  const travel = easeInOut(progressBetween(settledElapsed - activeHop * hopLength, 0, hopLength * 0.7));
  const hop = hops[activeHop];
  return {
    id,
    hopsShown: activeHop + 1,
    activeHop,
    packet: { arrow: hop.arrow, fraction: hop.reverse ? 1 - travel : travel },
  };
};

const safetyFrame = (settledElapsed: number, playLength: number): SafetyFrame => {
  const beatLength = playLength / SAFETY_MECHANISMS.length;
  const beat = Math.min(SAFETY_MECHANISMS.length - 1, Math.floor(settledElapsed / beatLength));
  return {
    mechanism: SAFETY_MECHANISMS[beat],
    progress: progressBetween(settledElapsed - beat * beatLength, 0, beatLength * 0.85),
    finished: SAFETY_MECHANISMS.slice(0, beat),
  };
};

const SHIELD_STEP_MILLISECONDS = 500;

export const filmFrameAtMilliseconds = (elapsed: number): FilmFrame => {
  const wrapped = wrapFilmElapsed(elapsed);
  const sceneIndex = filmSceneIndexAt(wrapped);
  const scene = FILM_SCENES[sceneIndex];
  const sceneElapsed = wrapped - scene.startMilliseconds;
  const previous = FILM_SCENES[(sceneIndex - 1 + FILM_SCENES.length) % FILM_SCENES.length];
  const camera = interpolateCamera(SCENE_CAMERA[previous.id], SCENE_CAMERA[scene.id], sceneElapsed / CAMERA_MOVE_MILLISECONDS);
  const settled = sceneElapsed >= CAMERA_MOVE_MILLISECONDS;
  const settledElapsed = sceneElapsed - CAMERA_MOVE_MILLISECONDS;
  const playLength = scene.lengthMilliseconds - CAMERA_MOVE_MILLISECONDS;
  const journeyId = SCENE_JOURNEY[scene.id];
  const journey = journeyId && settled ? journeyFrame(journeyId, settledElapsed, playLength) : null;
  const safety = scene.id === "safety" && settled ? safetyFrame(settledElapsed, playLength) : null;
  const captionCount = CAPTION_COUNT[scene.id];
  const captionIndex = (() => {
    if (journey) {
      return CAPTION_OF_HOP[journey.id][journey.activeHop];
    }
    if (captionCount === 0) {
      return null;
    }
    return Math.min(captionCount - 1, Math.floor((Math.max(0, settledElapsed) / playLength) * captionCount));
  })();
  const shieldsShown = (() => {
    if (scene.id === "end") {
      return SHIELDS.length;
    }
    if (scene.id !== "cloud") {
      return 0;
    }
    return Math.min(SHIELDS.length, Math.floor(Math.max(0, settledElapsed) / SHIELD_STEP_MILLISECONDS) + (settled ? 1 : 0));
  })();
  return {
    sceneId: scene.id,
    sceneIndex,
    elapsed: wrapped,
    tabIndex: FILM_TABS.includes(scene.id) ? FILM_TABS.indexOf(scene.id) : null,
    sceneProgress: sceneElapsed / scene.lengthMilliseconds,
    camera,
    captionIndex,
    journey,
    safety,
    shieldsShown,
    titleCardOpacity: scene.id === "title" ? 1 - progressBetween(sceneElapsed, 3400, 4000) : 0,
    endCardOpacity: scene.id === "end" ? progressBetween(sceneElapsed, 0, 600) : 0,
  };
};
