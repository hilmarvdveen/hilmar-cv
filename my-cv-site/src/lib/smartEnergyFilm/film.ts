import { easeInOut, progressBetween } from "@/lib/smartEnergyExplainer/frame";
import {
  CAMERAS,
  REVEAL_GROUPS,
  SECURITY_CONTROL_COUNT,
  type Camera,
  type ChipId,
  type FrameId,
  type NodeId,
  type RevealGroup,
  type RouteId,
} from "./layout";

export type FilmSceneId = "overview" | "frontend" | "backend" | "cloud" | "running";

export type FilmScene = { id: FilmSceneId; startMilliseconds: number; lengthMilliseconds: number; beatCount: number };

const SCENE_PLAN: ReadonlyArray<readonly [FilmSceneId, number, number]> = [
  ["overview", 9000, 0],
  ["frontend", 12000, 4],
  ["backend", 16000, 6],
  ["cloud", 12000, 5],
  ["running", 13000, 0],
];

export const FILM_SCENES: readonly FilmScene[] = SCENE_PLAN.reduce<FilmScene[]>((scenes, [id, lengthMilliseconds, beatCount]) => {
  const previous = scenes.at(-1);
  const startMilliseconds = previous ? previous.startMilliseconds + previous.lengthMilliseconds : 0;
  return [...scenes, { id, startMilliseconds, lengthMilliseconds, beatCount }];
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

export const CAMERA_MOVE_MILLISECONDS = 1500;

const SCENE_CAMERA: Record<FilmSceneId, Camera> = {
  overview: CAMERAS.overview,
  frontend: CAMERAS.frontend,
  backend: CAMERAS.backend,
  cloud: CAMERAS.cloud,
  running: CAMERAS.overview,
};

export const interpolateCamera = (from: Camera, to: Camera, share: number): Camera => {
  const eased = easeInOut(share);
  return {
    x: from.x + (to.x - from.x) * eased,
    y: from.y + (to.y - from.y) * eased,
    size: from.size + (to.size - from.size) * eased,
  };
};

export type Packet = { route: RouteId; fraction: number; tone: "emerald" | "navy" };

export type Highlight = { nodes: readonly NodeId[]; frames: readonly FrameId[]; chips: readonly ChipId[]; database: boolean };

export type FilmFrame = {
  sceneId: FilmSceneId;
  sceneIndex: number;
  camera: Camera;
  reveal: Record<RevealGroup, number>;
  beatIndex: number | null;
  highlight: Highlight | null;
  packets: readonly Packet[];
  shieldsLit: number;
  gateOpacity: number;
  closingOpacity: number;
};

const NO_HIGHLIGHT: Highlight = { nodes: [], frames: [], chips: [], database: false };

const highlightOf = (partial: Partial<Highlight>): Highlight => ({ ...NO_HIGHLIGHT, ...partial });

const FRONTEND_HIGHLIGHTS: readonly Highlight[] = [
  highlightOf({ nodes: ["browser", "dashboard"] }),
  highlightOf({ nodes: ["dashboard", "api"] }),
  highlightOf({ nodes: ["browser", "dashboard", "api"] }),
  highlightOf({ nodes: ["dashboard"] }),
];

const BACKEND_HIGHLIGHTS: readonly Highlight[] = [
  highlightOf({ nodes: ["gateway", "api", "planner", "steering"], database: true }),
  highlightOf({ nodes: ["gateway"], chips: ["readings"] }),
  highlightOf({ nodes: ["gateway"], chips: ["currentState"] }),
  highlightOf({ nodes: ["steering"], chips: ["command"] }),
  highlightOf({ nodes: ["gateway"], chips: ["command", "audit"] }),
  highlightOf({ nodes: ["gateway", "api"], database: true }),
];

const CLOUD_HIGHLIGHTS: readonly Highlight[] = [
  highlightOf({ frames: ["subscription", "resourceGroup"] }),
  highlightOf({ frames: ["containerApps"], nodes: ["gateway", "api", "dashboard"] }),
  highlightOf({ nodes: ["planner", "steering", "retention", "simulator"] }),
  highlightOf({ nodes: ["iotHub", "serviceBus"], database: true }),
  highlightOf({ nodes: ["keyVault", "identities", "logAnalytics", "budget", "blob"] }),
];

const SCENE_HIGHLIGHTS: Record<FilmSceneId, readonly Highlight[]> = {
  overview: [],
  frontend: FRONTEND_HIGHLIGHTS,
  backend: BACKEND_HIGHLIGHTS,
  cloud: CLOUD_HIGHLIGHTS,
  running: [],
};

const looping = (elapsed: number, period: number, offset: number): number => ((elapsed + offset) % period) / period;

const runningPackets = (elapsed: number): readonly Packet[] => [
  { route: "telemetry", fraction: looping(elapsed, 4000, 0), tone: "emerald" },
  { route: "telemetry", fraction: looping(elapsed, 4000, 2000), tone: "emerald" },
  { route: "pollRequest", fraction: looping(elapsed, 3000, 500), tone: "navy" },
  { route: "commandsOut", fraction: looping(elapsed, 6000, 1000), tone: "navy" },
  { route: "pricesIn", fraction: looping(elapsed, 5000, 2500), tone: "emerald" },
];

const frontendPackets = (beatIndex: number, progress: number): readonly Packet[] => {
  switch (beatIndex) {
    case 0:
      return [{ route: "pollRequest", fraction: easeInOut(progressBetween(progress, 0, 0.5)) * 0.62, tone: "navy" }];
    case 1:
      return [{ route: "pollRequest", fraction: 0.62 + 0.38 * easeInOut(progressBetween(progress, 0, 0.5)), tone: "navy" }];
    case 2:
      return [{ route: "pollRequest", fraction: 1 - easeInOut(progressBetween(progress, 0, 0.8)), tone: "emerald" }];
    default:
      return [];
  }
};

const backendPackets = (beatIndex: number, progress: number): readonly Packet[] => {
  const arrive = easeInOut(progressBetween(progress, 0, 0.45));
  switch (beatIndex) {
    case 1:
      return [
        { route: "batch", fraction: arrive, tone: "emerald" },
        { route: "batch", fraction: progress < 0.7 ? easeInOut(progressBetween(progress, 0.3, 0.7)) : 1 - 0.5 * easeInOut(progressBetween(progress, 0.7, 1)), tone: "navy" },
      ];
    case 2:
      return [{ route: "batch", fraction: arrive, tone: "navy" }];
    case 5:
      return [
        { route: "batch", fraction: arrive, tone: "emerald" },
        { route: "apiRead", fraction: progress < 0.75 ? 0.7 * arrive : 0.7 + 0.3 * easeInOut(progressBetween(progress, 0.75, 1)), tone: "navy" },
      ];
    default:
      return [];
  }
};

const fullReveal = (): Record<RevealGroup, number> =>
  Object.fromEntries(REVEAL_GROUPS.map((group) => [group, 1])) as Record<RevealGroup, number>;

const REVEAL_STEP_MILLISECONDS = 650;

const OVERVIEW_PACKETS_START = REVEAL_GROUPS.length * REVEAL_STEP_MILLISECONDS;

const SHIELD_MILLISECONDS = 550;

const beatOf = (scene: FilmScene, sceneElapsed: number): { beatIndex: number; progress: number } | null => {
  if (scene.beatCount === 0 || sceneElapsed < CAMERA_MOVE_MILLISECONDS) {
    return null;
  }
  const beatLength = (scene.lengthMilliseconds - CAMERA_MOVE_MILLISECONDS) / scene.beatCount;
  const beatIndex = Math.min(scene.beatCount - 1, Math.floor((sceneElapsed - CAMERA_MOVE_MILLISECONDS) / beatLength));
  return { beatIndex, progress: (sceneElapsed - CAMERA_MOVE_MILLISECONDS - beatIndex * beatLength) / beatLength };
};

export const filmFrameAtMilliseconds = (elapsed: number): FilmFrame => {
  const wrapped = wrapFilmElapsed(elapsed);
  const sceneIndex = filmSceneIndexAt(wrapped);
  const scene = FILM_SCENES[sceneIndex];
  const sceneElapsed = wrapped - scene.startMilliseconds;
  const previousCamera = SCENE_CAMERA[FILM_SCENES[(sceneIndex - 1 + FILM_SCENES.length) % FILM_SCENES.length].id];
  const camera =
    scene.id === "overview" ? CAMERAS.overview : interpolateCamera(previousCamera, SCENE_CAMERA[scene.id], sceneElapsed / CAMERA_MOVE_MILLISECONDS);
  const beat = beatOf(scene, sceneElapsed);
  const base: FilmFrame = {
    sceneId: scene.id,
    sceneIndex,
    camera,
    reveal: fullReveal(),
    beatIndex: beat?.beatIndex ?? null,
    highlight: beat ? SCENE_HIGHLIGHTS[scene.id][beat.beatIndex] : null,
    packets: [],
    shieldsLit: 0,
    gateOpacity: 0,
    closingOpacity: 0,
  };
  switch (scene.id) {
    case "overview":
      return {
        ...base,
        reveal: Object.fromEntries(
          REVEAL_GROUPS.map((group, index) => [
            group,
            progressBetween(sceneElapsed, index * REVEAL_STEP_MILLISECONDS, (index + 1) * REVEAL_STEP_MILLISECONDS),
          ])
        ) as Record<RevealGroup, number>,
        packets: sceneElapsed >= OVERVIEW_PACKETS_START ? runningPackets(sceneElapsed - OVERVIEW_PACKETS_START) : [],
      };
    case "frontend":
      return { ...base, packets: beat ? frontendPackets(beat.beatIndex, beat.progress) : [] };
    case "backend":
      return { ...base, packets: beat ? backendPackets(beat.beatIndex, beat.progress) : [] };
    case "cloud":
      return base;
    case "running":
      return {
        ...base,
        packets: runningPackets(sceneElapsed),
        shieldsLit: sceneElapsed < CAMERA_MOVE_MILLISECONDS ? 0 : Math.min(SECURITY_CONTROL_COUNT, Math.floor((sceneElapsed - CAMERA_MOVE_MILLISECONDS) / SHIELD_MILLISECONDS) + 1),
        gateOpacity: progressBetween(sceneElapsed, 8400, 9000),
        closingOpacity: progressBetween(sceneElapsed, 10000, 10800),
      };
  }
};
