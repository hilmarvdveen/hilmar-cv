import type { Point } from "@/lib/flowLayout";

export const POSTER_SIZE = 1080;

export type Rectangle = { x: number; y: number; width: number; height: number };

export const VIEWPORT_WIDTH = 1080;

export const VIEWPORT_HEIGHT = 960;

export type Camera = { x: number; y: number; width: number };

export const cameraHeight = (camera: Camera): number => (camera.width * VIEWPORT_HEIGHT) / VIEWPORT_WIDTH;

export const STAGE_BOTTOM = 860;

export const stageHeight = (camera: Camera): number => Math.min(cameraHeight(camera), STAGE_BOTTOM - camera.y);

export const VISIBILITY_FADE = 24;

export const rectangleVisibility = (rectangle: Rectangle, camera: Camera): number => {
  const overflow = Math.max(
    0,
    camera.x - rectangle.x,
    rectangle.x + rectangle.width - (camera.x + camera.width),
    camera.y - rectangle.y,
    rectangle.y + rectangle.height - (camera.y + cameraHeight(camera)),
  );
  return Math.max(0, 1 - overflow / VISIBILITY_FADE);
};

export const TITLE_SIZE = 32;

export const SMALL_SIZE = 26;

export type Tone = "compute" | "store";

export type BlockId =
  | "battery"
  | "prices"
  | "iotHub"
  | "serviceBus"
  | "gateway"
  | "api"
  | "planner"
  | "steering"
  | "dashboard"
  | "database"
  | "browser";

export type Block = Rectangle & { id: BlockId; tone: Tone; dashed?: boolean };

export const BLOCKS: readonly Block[] = [
  { id: "battery", x: 20, y: 110, width: 210, height: 90, tone: "store" },
  { id: "prices", x: 20, y: 470, width: 210, height: 110, tone: "store" },
  { id: "iotHub", x: 280, y: 110, width: 240, height: 90, tone: "store" },
  { id: "serviceBus", x: 580, y: 100, width: 250, height: 110, tone: "store", dashed: true },
  { id: "gateway", x: 290, y: 300, width: 240, height: 90, tone: "compute" },
  { id: "api", x: 570, y: 300, width: 240, height: 90, tone: "compute" },
  { id: "planner", x: 290, y: 480, width: 145, height: 100, tone: "compute" },
  { id: "steering", x: 455, y: 480, width: 145, height: 100, tone: "compute" },
  { id: "dashboard", x: 635, y: 480, width: 185, height: 100, tone: "compute" },
  { id: "database", x: 280, y: 680, width: 540, height: 120, tone: "store" },
  { id: "browser", x: 870, y: 470, width: 190, height: 120, tone: "store" },
];

export type FrameId = "azure" | "containerApps";

export type PosterFrame = Rectangle & { id: FrameId; labelAt: Point; labelAnchor: "start" | "end" };

export const FRAMES: readonly PosterFrame[] = [
  { id: "azure", x: 252, y: 40, width: 596, height: 795, labelAt: { x: 268, y: 40 }, labelAnchor: "start" },
  { id: "containerApps", x: 270, y: 255, width: 560, height: 345, labelAt: { x: 818, y: 600 }, labelAnchor: "end" },
];

export type LineKind = "telemetry" | "commands" | "reads" | "control";

export const LEGEND_KINDS: readonly LineKind[] = ["telemetry", "commands", "control"];

export type ArrowId =
  | "batteryToHub"
  | "hubToGateway"
  | "gatewayToDatabase"
  | "pricesToPlanner"
  | "plannerToDatabase"
  | "databaseToSteering"
  | "steeringToQueue"
  | "queueToGateway"
  | "gatewayToHub"
  | "hubToBattery"
  | "browserToDashboard"
  | "dashboardToApi"
  | "apiToDatabase";

export type PosterArrow = { id: ArrowId; kind: LineKind; ends: readonly [BlockId, BlockId]; points: readonly Point[]; hopAt?: Point };

export const ARROWS: readonly PosterArrow[] = [
  { id: "batteryToHub", ends: ["battery", "iotHub"], kind: "telemetry", points: [{ x: 230, y: 145 }, { x: 280, y: 145 }], hopAt: { x: 255, y: 122 } },
  { id: "hubToGateway", ends: ["iotHub", "gateway"], kind: "telemetry", points: [{ x: 400, y: 200 }, { x: 400, y: 300 }] },
  { id: "gatewayToDatabase", ends: ["gateway", "database"], kind: "telemetry", points: [{ x: 445, y: 390 }, { x: 445, y: 680 }], hopAt: { x: 445, y: 630 } },
  { id: "pricesToPlanner", ends: ["prices", "planner"], kind: "control", points: [{ x: 230, y: 530 }, { x: 290, y: 530 }] },
  { id: "plannerToDatabase", ends: ["planner", "database"], kind: "control", points: [{ x: 367, y: 580 }, { x: 367, y: 680 }], hopAt: { x: 367, y: 630 } },
  { id: "databaseToSteering", ends: ["database", "steering"], kind: "control", points: [{ x: 537, y: 680 }, { x: 537, y: 580 }], hopAt: { x: 537, y: 630 } },
  { id: "steeringToQueue", ends: ["steering", "serviceBus"], kind: "commands", points: [{ x: 550, y: 480 }, { x: 550, y: 240 }, { x: 705, y: 240 }, { x: 705, y: 210 }], hopAt: { x: 550, y: 410 } },
  { id: "queueToGateway", ends: ["serviceBus", "gateway"], kind: "commands", points: [{ x: 620, y: 210 }, { x: 620, y: 280 }, { x: 480, y: 280 }, { x: 480, y: 300 }], hopAt: { x: 515, y: 280 } },
  { id: "gatewayToHub", ends: ["gateway", "iotHub"], kind: "commands", points: [{ x: 330, y: 300 }, { x: 330, y: 200 }] },
  { id: "hubToBattery", ends: ["iotHub", "battery"], kind: "commands", points: [{ x: 280, y: 180 }, { x: 230, y: 180 }], hopAt: { x: 255, y: 204 } },
  { id: "browserToDashboard", ends: ["browser", "dashboard"], kind: "reads", points: [{ x: 870, y: 530 }, { x: 820, y: 530 }] },
  { id: "dashboardToApi", ends: ["dashboard", "api"], kind: "reads", points: [{ x: 722, y: 480 }, { x: 722, y: 390 }] },
  { id: "apiToDatabase", ends: ["api", "database"], kind: "reads", points: [{ x: 617, y: 390 }, { x: 617, y: 680 }], hopAt: { x: 617, y: 630 } },
];

export type JourneyId = "reading" | "command" | "customer";

export type Hop = { arrow: ArrowId; reverse?: boolean };

export const JOURNEYS: Record<JourneyId, readonly Hop[]> = {
  reading: [{ arrow: "batteryToHub" }, { arrow: "hubToGateway" }, { arrow: "gatewayToDatabase" }],
  command: [
    { arrow: "pricesToPlanner" },
    { arrow: "plannerToDatabase" },
    { arrow: "databaseToSteering" },
    { arrow: "steeringToQueue" },
    { arrow: "queueToGateway" },
    { arrow: "gatewayToHub" },
    { arrow: "hubToBattery" },
    { arrow: "batteryToHub" },
  ],
  customer: [
    { arrow: "browserToDashboard" },
    { arrow: "dashboardToApi" },
    { arrow: "apiToDatabase" },
    { arrow: "dashboardToApi", reverse: true },
    { arrow: "browserToDashboard", reverse: true },
  ],
};

export type ShieldId = "deviceKey" | "hubIdentity" | "parameterised" | "contentPolicy" | "token" | "internalIngress" | "entraQueue";

export type Side = "start" | "end";

export type Annotation = { at: Point; side: Side };

export const SHIELDS: ReadonlyArray<Annotation & { id: ShieldId }> = [
  { id: "deviceKey", at: { x: 255, y: 92 }, side: "end" },
  { id: "hubIdentity", at: { x: 412, y: 224 }, side: "start" },
  { id: "parameterised", at: { x: 244, y: 660 }, side: "end" },
  { id: "contentPolicy", at: { x: 858, y: 620 }, side: "start" },
  { id: "token", at: { x: 708, y: 435 }, side: "end" },
  { id: "internalIngress", at: { x: 858, y: 420 }, side: "start" },
  { id: "entraQueue", at: { x: 632, y: 76 }, side: "start" },
];

export type ScaleTagId = "replicas" | "queue" | "iotHub" | "serviceBus" | "database";

export const SCALE_TAGS: Record<ScaleTagId, Annotation> = {
  replicas: { at: { x: 416, y: 232 }, side: "start" },
  queue: { at: { x: 632, y: 76 }, side: "start" },
  iotHub: { at: { x: 292, y: 78 }, side: "start" },
  serviceBus: { at: { x: 632, y: 76 }, side: "start" },
  database: { at: { x: 292, y: 818 }, side: "start" },
};

export const ZERO_BADGE_RADIUS = 22;

export const ZERO_BADGES: Record<"gateway" | "api" | "dashboard", Point> = {
  gateway: { x: 508, y: 418 },
  api: { x: 788, y: 418 },
  dashboard: { x: 798, y: 452 },
};

export const SAFETY_PANEL: Rectangle = { x: 266, y: 400, width: 568, height: 450 };

export type SafetyMechanism = "duplicate" | "race" | "lock" | "audit";

export const SAFETY_MECHANISMS: readonly SafetyMechanism[] = ["duplicate", "race", "lock", "audit"];

export const SAFETY_CELLS: Record<SafetyMechanism, Rectangle> = {
  duplicate: { x: 276, y: 450, width: 270, height: 190 },
  race: { x: 554, y: 450, width: 270, height: 190 },
  lock: { x: 276, y: 650, width: 270, height: 190 },
  audit: { x: 554, y: 650, width: 270, height: 190 },
};

export const CAMERAS = {
  overview: { x: 0, y: 0, width: 1080 },
  reading: { x: 0, y: 0, width: 934 },
  command: { x: 0, y: 0, width: 934 },
  customer: { x: 262, y: 160, width: 818 },
  safety: { x: 234, y: 350, width: 632 },
} satisfies Record<string, Camera>;

export const GATE_COUNT = 7;

export const SAFETY_ZOOM = VIEWPORT_WIDTH / CAMERAS.safety.width;
