export type SceneId =
  | "title"
  | "layers"
  | "telemetry"
  | "command"
  | "ports"
  | "stores"
  | "consistency"
  | "assetKind"
  | "scale"
  | "security"
  | "closing";

export type Scene = {
  id: SceneId;
  startMilliseconds: number;
  lengthMilliseconds: number;
};

const SCENE_LENGTHS: ReadonlyArray<readonly [SceneId, number]> = [
  ["title", 3000],
  ["layers", 6000],
  ["telemetry", 8000],
  ["command", 10000],
  ["ports", 8000],
  ["stores", 9000],
  ["consistency", 14000],
  ["assetKind", 8000],
  ["scale", 10000],
  ["security", 10000],
  ["closing", 4000],
];

export const SCENES: readonly Scene[] = SCENE_LENGTHS.reduce<Scene[]>((scenes, [id, lengthMilliseconds]) => {
  const previous = scenes.at(-1);
  const startMilliseconds = previous ? previous.startMilliseconds + previous.lengthMilliseconds : 0;
  return [...scenes, { id, startMilliseconds, lengthMilliseconds }];
}, []);

export const TOTAL_DURATION_MILLISECONDS = SCENE_LENGTHS.reduce((total, [, length]) => total + length, 0);

export const FRAMES_PER_SECOND = 30;

export const frameCount = (TOTAL_DURATION_MILLISECONDS * FRAMES_PER_SECOND) / 1000;

export const millisecondsForFrame = (frame: number): number => (frame * 1000) / FRAMES_PER_SECOND;

export const wrapElapsed = (elapsed: number): number => {
  if (!Number.isFinite(elapsed)) {
    return 0;
  }
  return ((elapsed % TOTAL_DURATION_MILLISECONDS) + TOTAL_DURATION_MILLISECONDS) % TOTAL_DURATION_MILLISECONDS;
};

export const sceneIndexOf = (id: SceneId): number => SCENES.findIndex((scene) => scene.id === id);

export const sceneStartMilliseconds = (id: SceneId): number => SCENES[sceneIndexOf(id)].startMilliseconds;

export const sceneIndexAtMilliseconds = (elapsed: number): number => {
  const wrapped = wrapElapsed(elapsed);
  return SCENES.findLastIndex((scene) => scene.startMilliseconds <= wrapped);
};

export const sceneAtMilliseconds = (elapsed: number): Scene => SCENES[sceneIndexAtMilliseconds(elapsed)];

export const lastFrameMillisecondsOfScene = (id: SceneId): number => {
  const scene = SCENES[sceneIndexOf(id)];
  const endMilliseconds = scene.startMilliseconds + scene.lengthMilliseconds;
  return millisecondsForFrame(Math.ceil((endMilliseconds * FRAMES_PER_SECOND) / 1000) - 1);
};
