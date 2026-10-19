import {
  CONFIGURED_PORTS,
  DRAWING_LAYERS,
  MAXIMUM_CHUNKS,
  PORTS,
  SECURITY_CONTROLS,
  TOUCH_POINT_COUNT,
  WRITING_STORES,
  HOSTS,
  type DrawingLayer,
  type EdgeId,
  type PortId,
  type StoreId,
} from "./drawing";
import { SCENES, sceneIndexAtMilliseconds, wrapElapsed, type SceneId } from "./timeline";

export type Stage = "title" | "system" | "ports" | "stores" | "consistency" | "closing";

export type Mover = { edge: EdgeId; fraction: number };

export type TelemetryBadgeId = "checkpoint" | "hypertable" | "currentState" | "rollup" | "etag" | "cache" | "notModified";

export type CommandStateId = "created" | "sent" | "acknowledged" | "confirmed";

export type TerminalStateId = "failed" | "expired" | "rejected";

export type AdapterSide = "none" | "inMemory" | "configured";

export type ConsistencyBeatId = "duplicate" | "lateReading" | "idempotency" | "compareAndSet" | "sessions" | "migrationLock";

export const CONSISTENCY_BEATS: readonly ConsistencyBeatId[] = [
  "duplicate",
  "lateReading",
  "idempotency",
  "compareAndSet",
  "sessions",
  "migrationLock",
];

export type DuplicateBeat = { firstFraction: number; secondFraction: number | null; bounced: boolean };

export type LateReadingBeat = { lateFraction: number; arrived: boolean; currentStateMovesBack: boolean };

export type IdempotencyBeat = { firstRunIssued: boolean; secondRunAlreadyIssued: boolean };

export type CompareAndSetBeat = { racing: boolean; winnerRowsChanged: number | null; loserRowsChanged: number | null };

export type SessionsBeat = { laneFractions: readonly [number, number]; duplicateDropped: boolean; deadLettered: boolean };

export type MigrationLockBeat = { firstHostHoldsLock: boolean; secondHostWaiting: boolean; schemaCurrent: boolean };

export type ConsistencyFrame = {
  beat: ConsistencyBeatId | "hold";
  beatsShown: number;
  auditOpacity: number;
  duplicate: DuplicateBeat | null;
  lateReading: LateReadingBeat | null;
  idempotency: IdempotencyBeat | null;
  compareAndSet: CompareAndSetBeat | null;
  sessions: SessionsBeat | null;
  migrationLock: MigrationLockBeat | null;
};

export type StoresFrame = {
  activeStore: StoreId | null;
  transactionOpen: boolean;
  lockHolder: 1 | 2 | null;
  waitingThreads: number;
  hostsLit: number;
};

export type PortsFrame = {
  ringOpacity: number;
  adapters: Record<PortId, AdapterSide>;
  assistantOpacity: number;
};

export type HubTier = "F1" | "S1";

export type ScaleFrame = {
  queueDepth: number;
  replicas: 0 | 1 | 3;
  hubTier: HubTier;
  chunks: number;
  runOnceOpacity: number;
};

export type ExplainerFrame = {
  sceneId: SceneId;
  sceneIndex: number;
  stage: Stage;
  title: { claimOpacity: number; questionsShown: number };
  layerOpacity: Record<DrawingLayer, number>;
  packet: Mover | null;
  telemetryBadges: readonly TelemetryBadgeId[];
  command: Mover | null;
  commandState: CommandStateId | null;
  idempotencyKeyShown: boolean;
  terminalStates: readonly TerminalStateId[];
  ports: PortsFrame;
  stores: StoresFrame;
  consistency: ConsistencyFrame;
  assetKind: { fifthAssetOpacity: number; touchPointsLit: number; activeTouchPoint: number | null };
  scale: ScaleFrame | null;
  security: { shieldsLit: number; activeShield: number | null; gateOpacity: number };
  closingOpacity: number;
};

const clamp = (value: number): number => Math.min(1, Math.max(0, value));

export const easeInOut = (value: number): number => {
  const clamped = clamp(value);
  return clamped < 0.5 ? 2 * clamped * clamped : 1 - (-2 * clamped + 2) ** 2 / 2;
};

export const progressBetween = (value: number, start: number, end: number): number => clamp((value - start) / (end - start));

const stepsReached = (elapsed: number, start: number, step: number, count: number): number =>
  elapsed < start ? 0 : Math.min(count, Math.floor((elapsed - start) / step) + 1);

const activeStep = (elapsed: number, start: number, step: number, count: number): number | null =>
  elapsed >= start && elapsed < start + step * count ? Math.floor((elapsed - start) / step) : null;

const fullLayers = (): Record<DrawingLayer, number> =>
  Object.fromEntries(DRAWING_LAYERS.map((layer) => [layer, 1])) as Record<DrawingLayer, number>;

const adaptersAll = (side: AdapterSide): Record<PortId, AdapterSide> =>
  Object.fromEntries(PORTS.map((port) => [port, side])) as Record<PortId, AdapterSide>;

const restingConsistency = (): ConsistencyFrame => ({
  beat: "hold",
  beatsShown: CONSISTENCY_BEATS.length,
  auditOpacity: 1,
  duplicate: null,
  lateReading: null,
  idempotency: null,
  compareAndSet: null,
  sessions: null,
  migrationLock: null,
});

const restingFrame = (sceneId: SceneId, sceneIndex: number, stage: Stage): ExplainerFrame => ({
  sceneId,
  sceneIndex,
  stage,
  title: { claimOpacity: 1, questionsShown: 5 },
  layerOpacity: fullLayers(),
  packet: null,
  telemetryBadges: [],
  command: null,
  commandState: null,
  idempotencyKeyShown: false,
  terminalStates: [],
  ports: { ringOpacity: 1, adapters: adaptersAll("none"), assistantOpacity: 0 },
  stores: { activeStore: null, transactionOpen: false, lockHolder: null, waitingThreads: 0, hostsLit: 0 },
  consistency: restingConsistency(),
  assetKind: { fifthAssetOpacity: 0, touchPointsLit: 0, activeTouchPoint: null },
  scale: null,
  security: { shieldsLit: 0, activeShield: null, gateOpacity: 0 },
  closingOpacity: 1,
});

const TITLE_QUESTION_COUNT = 5;

const titleFrame = (base: ExplainerFrame, elapsed: number): ExplainerFrame => ({
  ...base,
  title: {
    claimOpacity: progressBetween(elapsed, 400, 900),
    questionsShown: stepsReached(elapsed, 1000, 300, TITLE_QUESTION_COUNT),
  },
});

const LAYER_STEP_MILLISECONDS = 800;

const layersFrame = (base: ExplainerFrame, elapsed: number): ExplainerFrame => ({
  ...base,
  layerOpacity: Object.fromEntries(
    DRAWING_LAYERS.map((layer, index) => [
      layer,
      progressBetween(elapsed, index * LAYER_STEP_MILLISECONDS, (index + 1) * LAYER_STEP_MILLISECONDS),
    ])
  ) as Record<DrawingLayer, number>,
});

export const TELEMETRY_HOPS: readonly EdgeId[] = [
  "simulatorToHub",
  "hubToGateway",
  "gatewayToDatabase",
  "databaseToApi",
  "apiToDashboard",
  "dashboardToBrowser",
];

const HOP_MILLISECONDS = 1100;

const TELEMETRY_BADGE_TIMES: ReadonlyArray<readonly [TelemetryBadgeId, number]> = [
  ["checkpoint", 2200],
  ["hypertable", 3300],
  ["currentState", 3500],
  ["rollup", 3700],
  ["etag", 4400],
  ["cache", 5500],
  ["notModified", 6600],
];

const telemetryFrame = (base: ExplainerFrame, elapsed: number): ExplainerFrame => {
  const hop = activeStep(elapsed, 0, HOP_MILLISECONDS, TELEMETRY_HOPS.length);
  return {
    ...base,
    packet: hop === null ? null : { edge: TELEMETRY_HOPS[hop], fraction: easeInOut((elapsed - hop * HOP_MILLISECONDS) / HOP_MILLISECONDS) },
    telemetryBadges: TELEMETRY_BADGE_TIMES.filter(([, time]) => elapsed >= time).map(([badge]) => badge),
  };
};

export const COMMAND_MOVES: readonly EdgeId[] = [
  "plannerToDatabase",
  "databaseToSteering",
  "steeringToQueue",
  "queueToGateway",
  "gatewayToHub",
  "hubToBattery",
];

const COMMAND_STEP_MILLISECONDS = 1000;

const COMMAND_STATE_TIMES: ReadonlyArray<readonly [CommandStateId, number]> = [
  ["confirmed", 8000],
  ["acknowledged", 7000],
  ["sent", 5000],
  ["created", 1000],
];

const TERMINAL_STATE_TIMES: ReadonlyArray<readonly [TerminalStateId, number]> = [
  ["failed", 8200],
  ["expired", 8600],
  ["rejected", 9000],
];

const commandMover = (elapsed: number): Mover | null => {
  const move = activeStep(elapsed, 0, COMMAND_STEP_MILLISECONDS, COMMAND_MOVES.length);
  if (move !== null) {
    return { edge: COMMAND_MOVES[move], fraction: easeInOut((elapsed - move * COMMAND_STEP_MILLISECONDS) / COMMAND_STEP_MILLISECONDS) };
  }
  if (elapsed >= 6000 && elapsed < 7000) {
    return { edge: "hubToBattery", fraction: 1 - easeInOut((elapsed - 6000) / COMMAND_STEP_MILLISECONDS) };
  }
  return null;
};

const commandFrame = (base: ExplainerFrame, elapsed: number): ExplainerFrame => ({
  ...base,
  command: commandMover(elapsed),
  packet: elapsed >= 7000 && elapsed < 8000 ? { edge: "simulatorToHub", fraction: easeInOut((elapsed - 7000) / 1000) } : null,
  commandState: COMMAND_STATE_TIMES.find(([, time]) => elapsed >= time)?.[0] ?? null,
  idempotencyKeyShown: elapsed >= 2000 && elapsed < 4000,
  terminalStates: TERMINAL_STATE_TIMES.filter(([, time]) => elapsed >= time).map(([state]) => state),
});

const portsFrame = (base: ExplainerFrame, elapsed: number): ExplainerFrame => ({
  ...base,
  ports: {
    ringOpacity: progressBetween(elapsed, 0, 1500),
    adapters: Object.fromEntries(
      PORTS.map((port, index) => {
        const configuredIndex = CONFIGURED_PORTS.indexOf(port);
        if (configuredIndex !== -1 && elapsed >= 4000 + configuredIndex * 250) {
          return [port, "configured"];
        }
        return [port, elapsed >= 1500 + index * 200 ? "inMemory" : "none"];
      })
    ) as Record<PortId, AdapterSide>,
    assistantOpacity: progressBetween(elapsed, 6500, 7500),
  },
});

const STORE_WRITE_START = 300;

const STORE_WRITE_MILLISECONDS = 900;

const HOST_ROW_START = 5000;

const HOST_STEP_MILLISECONDS = 550;

const storesFrame = (base: ExplainerFrame, elapsed: number): ExplainerFrame => {
  const store = activeStep(elapsed, STORE_WRITE_START, STORE_WRITE_MILLISECONDS, WRITING_STORES.length);
  const cycle = ((elapsed - STORE_WRITE_START) % STORE_WRITE_MILLISECONDS) / STORE_WRITE_MILLISECONDS;
  const insideWrite = store !== null && cycle >= 0.1 && cycle < 0.9;
  const firstThreadHolds = insideWrite && cycle < 0.5;
  return {
    ...base,
    stores: {
      activeStore: store === null ? null : WRITING_STORES[store],
      transactionOpen: insideWrite,
      lockHolder: insideWrite ? (firstThreadHolds ? 1 : 2) : null,
      waitingThreads: firstThreadHolds ? 1 : 0,
      hostsLit: stepsReached(elapsed, HOST_ROW_START, HOST_STEP_MILLISECONDS, HOSTS.length),
    },
  };
};

const BEAT_MILLISECONDS = 2000;

const duplicateBeat = (progress: number): DuplicateBeat => {
  const bounced = progress >= 0.7;
  return {
    firstFraction: easeInOut(progressBetween(progress, 0, 0.35)),
    secondFraction: progress < 0.4 ? null : bounced ? 1 - 0.6 * easeInOut(progressBetween(progress, 0.7, 1)) : easeInOut(progressBetween(progress, 0.4, 0.7)),
    bounced,
  };
};

const lateReadingBeat = (progress: number): LateReadingBeat => ({
  lateFraction: easeInOut(progressBetween(progress, 0.1, 0.7)),
  arrived: progress >= 0.7,
  currentStateMovesBack: false,
});

const idempotencyBeat = (progress: number): IdempotencyBeat => ({
  firstRunIssued: progress >= 0.3,
  secondRunAlreadyIssued: progress >= 0.7,
});

const compareAndSetBeat = (progress: number): CompareAndSetBeat => {
  const settled = progress >= 0.5;
  return { racing: !settled, winnerRowsChanged: settled ? 1 : null, loserRowsChanged: settled ? 0 : null };
};

const sessionsBeat = (progress: number): SessionsBeat => ({
  laneFractions: [easeInOut(progressBetween(progress, 0, 0.6)), easeInOut(progressBetween(progress, 0.2, 0.8))],
  duplicateDropped: progress >= 0.4,
  deadLettered: progress >= 0.75,
});

const migrationLockBeat = (progress: number): MigrationLockBeat => ({
  firstHostHoldsLock: progress >= 0.15 && progress < 0.8,
  secondHostWaiting: progress >= 0.25 && progress < 0.8,
  schemaCurrent: progress >= 0.8,
});

const consistencyFrame = (base: ExplainerFrame, elapsed: number): ExplainerFrame => {
  const beatIndex = activeStep(elapsed, 0, BEAT_MILLISECONDS, CONSISTENCY_BEATS.length);
  if (beatIndex === null) {
    return { ...base, consistency: { ...restingConsistency(), auditOpacity: progressBetween(elapsed, 12000, 12600) } };
  }
  const beat = CONSISTENCY_BEATS[beatIndex];
  const progress = (elapsed - beatIndex * BEAT_MILLISECONDS) / BEAT_MILLISECONDS;
  return {
    ...base,
    consistency: {
      ...restingConsistency(),
      beat,
      beatsShown: beatIndex + 1,
      auditOpacity: 0,
      duplicate: beat === "duplicate" ? duplicateBeat(progress) : null,
      lateReading: beat === "lateReading" ? lateReadingBeat(progress) : null,
      idempotency: beat === "idempotency" ? idempotencyBeat(progress) : null,
      compareAndSet: beat === "compareAndSet" ? compareAndSetBeat(progress) : null,
      sessions: beat === "sessions" ? sessionsBeat(progress) : null,
      migrationLock: beat === "migrationLock" ? migrationLockBeat(progress) : null,
    },
  };
};

const TOUCH_POINT_START = 1000;

const TOUCH_POINT_MILLISECONDS = 800;

const assetKindFrame = (base: ExplainerFrame, elapsed: number): ExplainerFrame => ({
  ...base,
  assetKind: {
    fifthAssetOpacity: progressBetween(elapsed, 0, 1000),
    touchPointsLit: stepsReached(elapsed, TOUCH_POINT_START, TOUCH_POINT_MILLISECONDS, TOUCH_POINT_COUNT),
    activeTouchPoint: activeStep(elapsed, TOUCH_POINT_START, TOUCH_POINT_MILLISECONDS, TOUCH_POINT_COUNT),
  },
});

const replicasAt = (elapsed: number): 0 | 1 | 3 => {
  if (elapsed >= 5000) {
    return 3;
  }
  return elapsed >= 3000 ? 1 : 0;
};

const scaleFrame = (base: ExplainerFrame, elapsed: number): ExplainerFrame => ({
  ...base,
  scale: {
    queueDepth: easeInOut(progressBetween(elapsed, 0, 3000)),
    replicas: replicasAt(elapsed),
    hubTier: elapsed >= 5500 ? "S1" : "F1",
    chunks: stepsReached(elapsed, 6000, 500, MAXIMUM_CHUNKS),
    runOnceOpacity: progressBetween(elapsed, 8000, 8600),
  },
});

const SHIELD_MILLISECONDS = 700;

const securityFrame = (base: ExplainerFrame, elapsed: number): ExplainerFrame => ({
  ...base,
  security: {
    shieldsLit: stepsReached(elapsed, 0, SHIELD_MILLISECONDS, SECURITY_CONTROLS.length),
    activeShield: activeStep(elapsed, 0, SHIELD_MILLISECONDS, SECURITY_CONTROLS.length),
    gateOpacity: progressBetween(elapsed, 8000, 8600),
  },
});

const closingFrame = (base: ExplainerFrame, elapsed: number): ExplainerFrame => ({
  ...base,
  closingOpacity: progressBetween(elapsed, 0, 600),
});

const STAGE_OF_SCENE: Record<SceneId, Stage> = {
  title: "title",
  layers: "system",
  telemetry: "system",
  command: "system",
  ports: "ports",
  stores: "stores",
  consistency: "consistency",
  assetKind: "system",
  scale: "system",
  security: "system",
  closing: "closing",
};

const sceneFrame = (base: ExplainerFrame, elapsed: number): ExplainerFrame => {
  switch (base.sceneId) {
    case "title":
      return titleFrame(base, elapsed);
    case "layers":
      return layersFrame(base, elapsed);
    case "telemetry":
      return telemetryFrame(base, elapsed);
    case "command":
      return commandFrame(base, elapsed);
    case "ports":
      return portsFrame(base, elapsed);
    case "stores":
      return storesFrame(base, elapsed);
    case "consistency":
      return consistencyFrame(base, elapsed);
    case "assetKind":
      return assetKindFrame(base, elapsed);
    case "scale":
      return scaleFrame(base, elapsed);
    case "security":
      return securityFrame(base, elapsed);
    case "closing":
      return closingFrame(base, elapsed);
  }
};

export const explainerFrameAtMilliseconds = (elapsed: number): ExplainerFrame => {
  const wrapped = wrapElapsed(elapsed);
  const sceneIndex = sceneIndexAtMilliseconds(wrapped);
  const scene = SCENES[sceneIndex];
  const base = restingFrame(scene.id, sceneIndex, STAGE_OF_SCENE[scene.id]);
  return sceneFrame(base, wrapped - scene.startMilliseconds);
};
