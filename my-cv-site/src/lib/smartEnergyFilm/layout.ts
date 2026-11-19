import type { Point } from "@/lib/flowLayout";
import { pointAlongPolyline } from "@/lib/smartEnergyExplainer/drawing";
import { BADGE_STYLE, CHIP_STYLE, PLATE_STYLE, STROKE_UNIT } from "./tokens";

export const POSTER_SIZE = 1080;

export type Rectangle = { x: number; y: number; width: number; height: number };

export type Orientation = "landscape" | "portrait";

export const STAGE_VIEWBOX: Record<Orientation, Rectangle> = {
  landscape: { x: 0, y: 0, width: 1080, height: 860 },
  portrait: { x: 0, y: 0, width: 320, height: 480 },
};

export const TEXT_SIZES: Record<Orientation, { title: number; small: number; chip: number }> = {
  landscape: { title: 32, small: 26, chip: 21 },
  portrait: { title: 15, small: 14, chip: 12 },
};

export const TITLE_SIZE = TEXT_SIZES.landscape.title;

export const SMALL_SIZE = TEXT_SIZES.landscape.small;

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
  { id: "battery", x: 10, y: 110, width: 180, height: 90, tone: "store" },
  { id: "prices", x: 10, y: 470, width: 200, height: 110, tone: "store" },
  { id: "iotHub", x: 280, y: 110, width: 240, height: 90, tone: "store" },
  { id: "serviceBus", x: 580, y: 100, width: 250, height: 110, tone: "store", dashed: true },
  { id: "gateway", x: 290, y: 300, width: 240, height: 90, tone: "compute" },
  { id: "api", x: 570, y: 300, width: 240, height: 90, tone: "compute" },
  { id: "planner", x: 290, y: 480, width: 145, height: 100, tone: "compute" },
  { id: "steering", x: 455, y: 480, width: 145, height: 100, tone: "compute" },
  { id: "dashboard", x: 635, y: 480, width: 185, height: 100, tone: "compute" },
  { id: "database", x: 280, y: 700, width: 540, height: 100, tone: "store" },
  { id: "browser", x: 900, y: 470, width: 160, height: 120, tone: "store" },
];

export type FrameId = "azure" | "containerApps";

export type PosterFrame = Rectangle & { id: FrameId };

export const FRAMES: readonly PosterFrame[] = [
  { id: "azure", x: 252, y: 40, width: 596, height: 795 },
  { id: "containerApps", x: 270, y: 255, width: 560, height: 345 },
];

export type LineKind = "telemetry" | "commands" | "reads" | "control";

export const LEGEND_KINDS: readonly LineKind[] = ["telemetry", "commands", "control", "reads"];

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

export type PosterArrow = { id: ArrowId; kind: LineKind; ends: readonly [BlockId, BlockId]; points: readonly Point[] };

export const ARROWS: readonly PosterArrow[] = [
  { id: "batteryToHub", ends: ["battery", "iotHub"], kind: "telemetry", points: [{ x: 190, y: 145 }, { x: 280, y: 145 }] },
  { id: "hubToGateway", ends: ["iotHub", "gateway"], kind: "telemetry", points: [{ x: 400, y: 200 }, { x: 400, y: 300 }] },
  { id: "gatewayToDatabase", ends: ["gateway", "database"], kind: "telemetry", points: [{ x: 445, y: 390 }, { x: 445, y: 700 }] },
  { id: "pricesToPlanner", ends: ["prices", "planner"], kind: "control", points: [{ x: 210, y: 530 }, { x: 290, y: 530 }] },
  { id: "plannerToDatabase", ends: ["planner", "database"], kind: "control", points: [{ x: 367, y: 580 }, { x: 367, y: 700 }] },
  { id: "databaseToSteering", ends: ["database", "steering"], kind: "control", points: [{ x: 537, y: 700 }, { x: 537, y: 580 }] },
  { id: "steeringToQueue", ends: ["steering", "serviceBus"], kind: "commands", points: [{ x: 550, y: 480 }, { x: 550, y: 240 }, { x: 780, y: 240 }, { x: 780, y: 210 }] },
  { id: "queueToGateway", ends: ["serviceBus", "gateway"], kind: "commands", points: [{ x: 620, y: 210 }, { x: 620, y: 280 }, { x: 480, y: 280 }, { x: 480, y: 300 }] },
  { id: "gatewayToHub", ends: ["gateway", "iotHub"], kind: "commands", points: [{ x: 330, y: 300 }, { x: 330, y: 200 }] },
  { id: "hubToBattery", ends: ["iotHub", "battery"], kind: "commands", points: [{ x: 280, y: 180 }, { x: 190, y: 180 }] },
  { id: "browserToDashboard", ends: ["browser", "dashboard"], kind: "reads", points: [{ x: 900, y: 530 }, { x: 820, y: 530 }] },
  { id: "dashboardToApi", ends: ["dashboard", "api"], kind: "reads", points: [{ x: 722, y: 480 }, { x: 722, y: 390 }] },
  { id: "apiToDatabase", ends: ["api", "database"], kind: "reads", points: [{ x: 617, y: 390 }, { x: 617, y: 700 }] },
];

export type Hop = { arrow: ArrowId; reverse?: boolean };

export type FocusLayoutId = "whole" | "reading" | "command" | "customer" | "safety" | "cloud";

export type Placement = {
  viewBox: Rectangle;
  blocks: Partial<Record<BlockId, Rectangle>>;
  arrows: Partial<Record<ArrowId, readonly Point[]>>;
  frames: Partial<Record<FrameId, Rectangle>>;
};

type Fit = { source: Rectangle; target: Rectangle };

const roundTenth = (value: number): number => Math.round(value * 10) / 10;

const boundsOf = (rectangles: readonly Rectangle[]): Rectangle => {
  const left = Math.min(...rectangles.map((rectangle) => rectangle.x));
  const top = Math.min(...rectangles.map((rectangle) => rectangle.y));
  const right = Math.max(...rectangles.map((rectangle) => rectangle.x + rectangle.width));
  const bottom = Math.max(...rectangles.map((rectangle) => rectangle.y + rectangle.height));
  return { x: left, y: top, width: right - left, height: bottom - top };
};

const fitPoint = (fit: Fit, point: Point): Point => ({
  x: roundTenth(fit.target.x + ((point.x - fit.source.x) * fit.target.width) / fit.source.width),
  y: roundTenth(fit.target.y + ((point.y - fit.source.y) * fit.target.height) / fit.source.height),
});

const fitRectangle = (fit: Fit, rectangle: Rectangle): Rectangle => {
  const corner = fitPoint(fit, rectangle);
  const opposite = fitPoint(fit, { x: rectangle.x + rectangle.width, y: rectangle.y + rectangle.height });
  return { x: corner.x, y: corner.y, width: roundTenth(opposite.x - corner.x), height: roundTenth(opposite.y - corner.y) };
};

const enclose = (rectangles: readonly Rectangle[], padding: number, top: number): Rectangle => {
  const bounds = boundsOf(rectangles);
  return { x: bounds.x - padding, y: bounds.y - top, width: bounds.width + padding * 2, height: bounds.height + top + padding };
};

const PLATE_ROOM = 38;

const FRAME_PADDING = 26;

const framesAround = (azure: readonly Rectangle[], containers: readonly Rectangle[], padding = FRAME_PADDING): Placement["frames"] => {
  const containerFrame = enclose(containers, padding - 8, PLATE_ROOM);
  return { azure: enclose([...azure, containerFrame], padding, PLATE_ROOM + 6), containerApps: containerFrame };
};

const COMPUTE_BLOCKS: readonly BlockId[] = ["gateway", "api", "planner", "steering", "dashboard"];

const AZURE_BLOCKS: readonly BlockId[] = ["iotHub", "serviceBus", "database", ...COMPUTE_BLOCKS];

const arrowPointsOf = (id: ArrowId): readonly Point[] => (ARROWS.find((arrow) => arrow.id === id) as PosterArrow).points;

const WHOLE_LANDSCAPE: Placement = {
  viewBox: STAGE_VIEWBOX.landscape,
  blocks: Object.fromEntries(BLOCKS.map(({ id, x, y, width, height }) => [id, { x, y, width, height }])),
  arrows: Object.fromEntries(ARROWS.map((arrow) => [arrow.id, arrow.points])),
  frames: Object.fromEntries(FRAMES.map(({ id, x, y, width, height }) => [id, { x, y, width, height }])),
};

const fitPlacement = (blockIds: readonly BlockId[], arrowIds: readonly ArrowId[], target: Rectangle): Placement => {
  const sources = blockIds.map((id) => WHOLE_LANDSCAPE.blocks[id] as Rectangle);
  const fit: Fit = { source: boundsOf(sources), target };
  const blocks = Object.fromEntries(blockIds.map((id, index) => [id, fitRectangle(fit, sources[index])]));
  const placedOf = (members: readonly BlockId[]) => blockIds.filter((id) => members.includes(id)).map((id) => blocks[id] as Rectangle);
  return {
    viewBox: STAGE_VIEWBOX.landscape,
    blocks,
    arrows: Object.fromEntries(arrowIds.map((id) => [id, arrowPointsOf(id).map((point) => fitPoint(fit, point))])),
    frames: framesAround(placedOf(AZURE_BLOCKS), placedOf(COMPUTE_BLOCKS)),
  };
};

const COMMAND_BLOCKS: readonly BlockId[] = ["battery", "prices", "iotHub", "serviceBus", "gateway", "planner", "steering", "database"];

const COMMAND_ARROWS: readonly ArrowId[] = [
  "pricesToPlanner",
  "plannerToDatabase",
  "databaseToSteering",
  "steeringToQueue",
  "queueToGateway",
  "gatewayToHub",
  "hubToBattery",
  "gatewayToDatabase",
];

const CUSTOMER_BLOCKS: readonly BlockId[] = ["browser", "dashboard", "api", "database"];

const CUSTOMER_ARROWS: readonly ArrowId[] = ["browserToDashboard", "dashboardToApi", "apiToDatabase"];

const READING_LANDSCAPE: Placement = (() => {
  const battery = { x: 40, y: 150, width: 200, height: 130 };
  const iotHub = { x: 350, y: 150, width: 260, height: 130 };
  const gateway = { x: 690, y: 150, width: 300, height: 130 };
  const database = { x: 350, y: 520, width: 640, height: 150 };
  return {
    viewBox: STAGE_VIEWBOX.landscape,
    blocks: { battery, iotHub, gateway, database },
    arrows: {
      batteryToHub: [{ x: 240, y: 215 }, { x: 350, y: 215 }],
      hubToGateway: [{ x: 610, y: 215 }, { x: 690, y: 215 }],
      gatewayToDatabase: [{ x: 850, y: 280 }, { x: 850, y: 520 }],
    },
    frames: framesAround([iotHub, gateway, database], [gateway]),
  };
})();

const SAFETY_LANDSCAPE: Placement = {
  viewBox: STAGE_VIEWBOX.landscape,
  blocks: {
    gateway: { x: 100, y: 36, width: 250, height: 90 },
    steering: { x: 415, y: 36, width: 250, height: 90 },
    database: { x: 730, y: 36, width: 250, height: 90 },
  },
  arrows: {},
  frames: {},
};

const COLUMN_LEFT = 12;

const COLUMN_RIGHT = 183;

const COLUMN_WIDTH = 125;

const CHAIN_X = 40;

const CHAIN_WIDTH = 240;

const CHAIN_ARROW_X = 110;

const chainBlock = (y: number, height = 56): Rectangle => ({ x: CHAIN_X, y, width: CHAIN_WIDTH, height });

const verticalLine = (x: number, from: number, to: number): readonly Point[] => [{ x, y: from }, { x, y: to }];

const horizontalLine = (y: number, from: number, to: number): readonly Point[] => [{ x: from, y }, { x: to, y }];

const READING_PORTRAIT: Placement = (() => {
  const battery = chainBlock(24);
  const iotHub = chainBlock(142);
  const gateway = chainBlock(268);
  const database = chainBlock(386);
  return {
    viewBox: STAGE_VIEWBOX.portrait,
    blocks: { battery, iotHub, gateway, database },
    arrows: {
      batteryToHub: verticalLine(CHAIN_ARROW_X, 80, 142),
      hubToGateway: verticalLine(CHAIN_ARROW_X, 198, 268),
      gatewayToDatabase: verticalLine(CHAIN_ARROW_X, 324, 386),
    },
    frames: framesAround([iotHub, gateway, database], [gateway], 18),
  };
})();

const COMMAND_PORTRAIT: Placement = (() => {
  const left = (y: number): Rectangle => ({ x: COLUMN_LEFT, y, width: COLUMN_WIDTH, height: 56 });
  const right = (y: number): Rectangle => ({ x: COLUMN_RIGHT, y, width: COLUMN_WIDTH, height: 56 });
  return {
    viewBox: STAGE_VIEWBOX.portrait,
    blocks: {
      prices: left(20),
      planner: left(140),
      database: left(260),
      steering: left(380),
      battery: right(20),
      iotHub: right(140),
      gateway: right(260),
      serviceBus: right(380),
    },
    arrows: {
      pricesToPlanner: verticalLine(40, 76, 140),
      plannerToDatabase: verticalLine(40, 196, 260),
      databaseToSteering: verticalLine(40, 316, 380),
      steeringToQueue: horizontalLine(408, 137, 183),
      queueToGateway: verticalLine(245, 380, 316),
      gatewayToHub: verticalLine(245, 260, 196),
      hubToBattery: verticalLine(245, 140, 76),
      gatewayToDatabase: horizontalLine(288, 183, 137),
    },
    frames: {},
  };
})();

const CUSTOMER_PORTRAIT: Placement = (() => {
  const browser = chainBlock(16, 52);
  const dashboard = chainBlock(150);
  const api = chainBlock(262);
  const database = chainBlock(374);
  return {
    viewBox: STAGE_VIEWBOX.portrait,
    blocks: { browser, dashboard, api, database },
    arrows: {
      browserToDashboard: verticalLine(CHAIN_ARROW_X, 68, 150),
      dashboardToApi: verticalLine(CHAIN_ARROW_X, 206, 262),
      apiToDatabase: verticalLine(CHAIN_ARROW_X, 318, 374),
    },
    frames: framesAround([dashboard, api, database], [dashboard, api], 18),
  };
})();

const SAFETY_PORTRAIT: Placement = {
  viewBox: STAGE_VIEWBOX.portrait,
  blocks: {
    gateway: { x: 8, y: 12, width: 92, height: 40 },
    steering: { x: 112, y: 12, width: 92, height: 40 },
    database: { x: 216, y: 12, width: 96, height: 40 },
  },
  arrows: {},
  frames: {},
};

const WHOLE_PORTRAIT: Placement = {
  viewBox: STAGE_VIEWBOX.portrait,
  blocks: {
    battery: { x: 10, y: 6, width: 130, height: 28 },
    iotHub: { x: 10, y: 68, width: 130, height: 28 },
    gateway: { x: 10, y: 130, width: 130, height: 28 },
    serviceBus: { x: 180, y: 130, width: 130, height: 28 },
    steering: { x: 180, y: 192, width: 130, height: 28 },
    database: { x: 10, y: 254, width: 300, height: 32 },
    planner: { x: 10, y: 320, width: 130, height: 28 },
    api: { x: 180, y: 320, width: 130, height: 28 },
    prices: { x: 10, y: 382, width: 160, height: 28 },
    dashboard: { x: 180, y: 382, width: 130, height: 28 },
    browser: { x: 180, y: 444, width: 130, height: 28 },
  },
  arrows: {
    batteryToHub: verticalLine(128, 34, 68),
    hubToBattery: verticalLine(40, 68, 34),
    hubToGateway: verticalLine(128, 96, 130),
    gatewayToHub: verticalLine(40, 130, 96),
    gatewayToDatabase: verticalLine(60, 158, 254),
    queueToGateway: horizontalLine(144, 180, 140),
    steeringToQueue: verticalLine(245, 192, 158),
    databaseToSteering: verticalLine(245, 254, 220),
    plannerToDatabase: verticalLine(75, 320, 286),
    apiToDatabase: verticalLine(280, 320, 286),
    pricesToPlanner: verticalLine(75, 382, 348),
    dashboardToApi: verticalLine(245, 382, 348),
    browserToDashboard: verticalLine(245, 444, 410),
  },
  frames: {},
};

export const FOCUS_LAYOUTS: Record<FocusLayoutId, Record<Orientation, Placement>> = {
  whole: { landscape: WHOLE_LANDSCAPE, portrait: WHOLE_PORTRAIT },
  reading: { landscape: READING_LANDSCAPE, portrait: READING_PORTRAIT },
  command: {
    landscape: fitPlacement(COMMAND_BLOCKS, COMMAND_ARROWS, { x: 30, y: 96, width: 900, height: 670 }),
    portrait: COMMAND_PORTRAIT,
  },
  customer: {
    landscape: fitPlacement(CUSTOMER_BLOCKS, CUSTOMER_ARROWS, { x: 60, y: 130, width: 1000, height: 690 }),
    portrait: CUSTOMER_PORTRAIT,
  },
  safety: { landscape: SAFETY_LANDSCAPE, portrait: SAFETY_PORTRAIT },
  cloud: { landscape: WHOLE_LANDSCAPE, portrait: WHOLE_PORTRAIT },
};

export type PlateSpot = { edge: "top" | "bottom"; anchor: "start" | "end"; inset: number };

export type FramePlate = { at: Point; anchor: "start" | "end" };

export const PLATE_INSET = 24;

export const framePlate = (frame: Rectangle, anchor: "start" | "end", edge: "top" | "bottom" = "top", inset = PLATE_INSET): FramePlate => ({
  at: { x: anchor === "start" ? frame.x + inset : frame.x + frame.width - inset, y: edge === "top" ? frame.y : frame.y + frame.height },
  anchor,
});

type Segment = { from: Point; to: Point };

const segmentLength = (segment: Segment): number => Math.hypot(segment.to.x - segment.from.x, segment.to.y - segment.from.y);

const segmentsOf = (points: readonly Point[]): readonly Segment[] => points.slice(1).map((point, index) => ({ from: points[index], to: point }));

const segmentAt = (points: readonly Point[], share: number): Segment => {
  const segments = segmentsOf(points);
  const target = Math.min(1, Math.max(0, share)) * segments.reduce((total, segment) => total + segmentLength(segment), 0);
  let travelled = 0;
  const found = segments.find((segment) => {
    travelled += segmentLength(segment);
    return travelled >= target;
  });
  return found ?? segments[segments.length - 1];
};

const unitNormal = (segment: Segment): Point => {
  const length = segmentLength(segment) || 1;
  return { x: -(segment.to.y - segment.from.y) / length, y: (segment.to.x - segment.from.x) / length };
};

export type ChipId =
  | "keyVault"
  | "blobCheckpoints"
  | "idempotencyKey"
  | "queueProOnly"
  | "kedaProOnly"
  | "deviceKey"
  | "hubIdentity"
  | "parameterised"
  | "contentPolicy"
  | "token"
  | "internalIngress"
  | "entraQueue"
  | "replicasLever"
  | "queueLengthLever"
  | "iotHubTier"
  | "serviceBusPremium"
  | "databaseTier";

export type ChipAnchor = { block: BlockId } | { arrow: ArrowId; share: number } | { frame: FrameId };

export type ChipPlace = { anchor: ChipAnchor; side: "start" | "end" | "above" | "below" };

export const CHIPS: Record<ChipId, ChipPlace> = {
  keyVault: { anchor: { frame: "azure" }, side: "end" },
  blobCheckpoints: { anchor: { arrow: "hubToGateway", share: 0.7 }, side: "end" },
  idempotencyKey: { anchor: { arrow: "databaseToSteering", share: 0.5 }, side: "end" },
  queueProOnly: { anchor: { block: "serviceBus" }, side: "above" },
  kedaProOnly: { anchor: { block: "gateway" }, side: "start" },
  deviceKey: { anchor: { arrow: "batteryToHub", share: 0.5 }, side: "above" },
  hubIdentity: { anchor: { arrow: "hubToGateway", share: 0.4 }, side: "start" },
  parameterised: { anchor: { arrow: "gatewayToDatabase", share: 0.85 }, side: "start" },
  contentPolicy: { anchor: { arrow: "browserToDashboard", share: 0.5 }, side: "below" },
  token: { anchor: { arrow: "dashboardToApi", share: 0.5 }, side: "end" },
  internalIngress: { anchor: { arrow: "apiToDatabase", share: 0.85 }, side: "end" },
  entraQueue: { anchor: { block: "serviceBus" }, side: "above" },
  replicasLever: { anchor: { block: "gateway" }, side: "start" },
  queueLengthLever: { anchor: { block: "serviceBus" }, side: "end" },
  iotHubTier: { anchor: { block: "iotHub" }, side: "above" },
  serviceBusPremium: { anchor: { block: "serviceBus" }, side: "above" },
  databaseTier: { anchor: { block: "database" }, side: "end" },
};

const blockEdgePoint = (rectangle: Rectangle, side: ChipPlace["side"]): Point => {
  const centreY = rectangle.y + rectangle.height / 2;
  if (side === "start") {
    return { x: rectangle.x, y: centreY };
  }
  if (side === "end") {
    return { x: rectangle.x + rectangle.width, y: centreY };
  }
  return { x: rectangle.x + rectangle.width / 2, y: side === "above" ? rectangle.y : rectangle.y + rectangle.height };
};

export const chipPoint = (chip: ChipId, placement: Placement): Point | null => {
  const { anchor, side } = CHIPS[chip];
  if ("block" in anchor) {
    const rectangle = placement.blocks[anchor.block];
    return rectangle ? blockEdgePoint(rectangle, side) : null;
  }
  if ("arrow" in anchor) {
    const points = placement.arrows[anchor.arrow];
    return points ? pointAlongPolyline(points, anchor.share) : null;
  }
  const frame = placement.frames[anchor.frame];
  return frame ? { x: frame.x + frame.width - PLATE_INSET, y: frame.y + frame.height } : null;
};

export type ChipSize = { width: number; height: number; gap: number };

const isVertical = (segment: Segment): boolean => Math.abs(segment.to.x - segment.from.x) < Math.abs(segment.to.y - segment.from.y);

export const chipRectangle = (chip: ChipId, placement: Placement, size: ChipSize): Rectangle | null => {
  const point = chipPoint(chip, placement);
  if (point === null) {
    return null;
  }
  const { anchor, side } = CHIPS[chip];
  const { width, height, gap } = size;
  if ("frame" in anchor) {
    return { x: point.x - width, y: point.y - height / 2, width, height };
  }
  const sideways = "block" in anchor ? side === "start" || side === "end" : isVertical(segmentAt(placement.arrows[anchor.arrow] as readonly Point[], anchor.share));
  const towardEnd = side === "end" || side === "below";
  if (sideways) {
    return { x: towardEnd ? point.x + gap : point.x - gap - width, y: point.y - height / 2, width, height };
  }
  return { x: point.x - width / 2, y: towardEnd ? point.y + gap : point.y - gap - height, width, height };
};

export type SafetyMechanism = "duplicate" | "race" | "lock" | "audit";

export const SAFETY_MECHANISMS: readonly SafetyMechanism[] = ["duplicate", "race", "lock", "audit"];

export const SAFETY_CELL_SIZE = { width: 270, height: 190 };

export type SafetyPanelLayout = { title: Point; scale: number; origins: Record<SafetyMechanism, Point>; listStart: Point; listPitch: number };

export const SAFETY_PANELS: Record<Orientation, SafetyPanelLayout> = {
  landscape: {
    title: { x: 540, y: 168 },
    scale: 1.6,
    origins: { duplicate: { x: 104, y: 200 }, race: { x: 544, y: 200 }, lock: { x: 104, y: 520 }, audit: { x: 544, y: 520 } },
    listStart: { x: 104, y: 260 },
    listPitch: 80,
  },
  portrait: {
    title: { x: 160, y: 88 },
    scale: 1.1,
    origins: { duplicate: { x: 11, y: 120 }, race: { x: 11, y: 120 }, lock: { x: 11, y: 120 }, audit: { x: 11, y: 120 } },
    listStart: { x: 30, y: 150 },
    listPitch: 44,
  },
};

export const GATE_COUNT = 7;

const CHARACTER_WIDTH = 0.56;

export const textWidth = (text: string, fontSize: number): number => text.length * fontSize * CHARACTER_WIDTH;

export type PlateGeometry = { id: FrameId; rect: Rectangle; text: string; at: Point; anchor: "start" | "end"; fontSize: number };

export type BadgeRequest = { arrow: ArrowId; reverse: boolean };

export type SceneGeometryInput = {
  placement: Placement;
  settled: Placement;
  orientation: Orientation;
  frameTexts: Record<FrameId, string>;
  chips: readonly { id: ChipId; text: string }[];
  badges: readonly BadgeRequest[];
};

export type SceneGeometry = {
  plates: readonly PlateGeometry[];
  chips: Partial<Record<ChipId, Rectangle>>;
  chipLines: Partial<Record<ChipId, readonly string[]>>;
  badges: readonly Point[];
  badgeRadius: number;
};

const BADGE_SHARES = Array.from({ length: 49 }, (_, index) => (index === 0 ? 0.5 : 0.5 + (index % 2 === 1 ? 1 : -1) * Math.ceil(index / 2) * 0.02));

const BADGE_REACH = [1, 1.6, 2.2, 2.8];

const distanceToRectangle = (point: Point, rectangle: Rectangle): number =>
  Math.hypot(
    Math.max(rectangle.x - point.x, 0, point.x - rectangle.x - rectangle.width),
    Math.max(rectangle.y - point.y, 0, point.y - rectangle.y - rectangle.height),
  );

const distanceToBorder = (point: Point, rectangle: Rectangle): number => {
  const inside = point.x >= rectangle.x && point.x <= rectangle.x + rectangle.width && point.y >= rectangle.y && point.y <= rectangle.y + rectangle.height;
  return inside
    ? Math.min(point.x - rectangle.x, rectangle.x + rectangle.width - point.x, point.y - rectangle.y, rectangle.y + rectangle.height - point.y)
    : distanceToRectangle(point, rectangle);
};

const distanceToSegment = (point: Point, segment: Segment): number => {
  const dx = segment.to.x - segment.from.x;
  const dy = segment.to.y - segment.from.y;
  const lengthSquared = dx * dx + dy * dy;
  const share = lengthSquared === 0 ? 0 : Math.min(1, Math.max(0, ((point.x - segment.from.x) * dx + (point.y - segment.from.y) * dy) / lengthSquared));
  return Math.hypot(point.x - (segment.from.x + dx * share), point.y - (segment.from.y + dy * share));
};

const distanceToPolyline = (point: Point, points: readonly Point[]): number => Math.min(...segmentsOf(points).map((segment) => distanceToSegment(point, segment)));

const PREFERRED_ANCHOR: Record<FrameId, PlateSpot["anchor"]> = { azure: "start", containerApps: "end" };

const PLATE_SWEEP = 16;

const PLATE_CLEARANCE = 4;

const BLOCK_CLEARANCE = 6;

const FRAME_IDS: readonly FrameId[] = ["azure", "containerApps"];

type PlateMeasure = { fontSize: number; height: number; padding: number };

const plateMeasureOf = (orientation: Orientation): PlateMeasure => {
  const small = TEXT_SIZES[orientation].small;
  const fontSize = orientation === "landscape" ? small * 0.85 : small;
  return { fontSize, height: fontSize * 1.5, padding: fontSize * PLATE_STYLE.paddingRatio };
};

const plateAt = (id: FrameId, frame: Rectangle, text: string, spot: PlateSpot, measure: PlateMeasure): PlateGeometry => {
  const { at, anchor } = framePlate(frame, spot.anchor, spot.edge, spot.inset);
  const width = textWidth(text, measure.fontSize) + measure.padding * 2;
  const left = anchor === "start" ? at.x - measure.padding : at.x - width + measure.padding;
  return { id, rect: { x: left, y: at.y - measure.height / 2, width, height: measure.height }, text, at, anchor, fontSize: measure.fontSize };
};

const spotCandidates = (id: FrameId, frame: Rectangle, width: number): readonly PlateSpot[] => {
  const preferred = PREFERRED_ANCHOR[id];
  const other: PlateSpot["anchor"] = preferred === "start" ? "end" : "start";
  const room = frame.width - PLATE_INSET * 2 - width;
  const sweeps = Array.from({ length: Math.max(0, Math.floor(room / PLATE_SWEEP)) }, (_, index) => PLATE_INSET + (index + 1) * PLATE_SWEEP);
  return (["top", "bottom"] as const).flatMap((edge) => [
    { edge, anchor: preferred, inset: PLATE_INSET },
    { edge, anchor: other, inset: PLATE_INSET },
    ...sweeps.map((inset) => ({ edge, anchor: preferred, inset })),
    ...sweeps.map((inset) => ({ edge, anchor: other, inset })),
  ]);
};

const grown = (rectangle: Rectangle, amount: number): Rectangle => ({
  x: rectangle.x - amount,
  y: rectangle.y - amount,
  width: rectangle.width + amount * 2,
  height: rectangle.height + amount * 2,
});

const crossings = (rectangle: Rectangle, arrows: readonly (readonly Point[])[]): number => {
  const box = grown(rectangle, PLATE_CLEARANCE);
  return arrows.filter((points) =>
    segmentsOf(points).some((segment) => {
      const steps = Math.max(1, Math.ceil(segmentLength(segment) / 2));
      return Array.from({ length: steps + 1 }, (_, step) => step / steps).some((share) => {
        const x = segment.from.x + (segment.to.x - segment.from.x) * share;
        const y = segment.from.y + (segment.to.y - segment.from.y) * share;
        return x >= box.x && x <= box.x + box.width && y >= box.y && y <= box.y + box.height;
      });
    }),
  ).length;
};

const overlapping = (first: Rectangle, second: Rectangle): boolean =>
  first.x < second.x + second.width && first.x + first.width > second.x && first.y < second.y + second.height && first.y + first.height > second.y;

const platesOf = (input: SceneGeometryInput): readonly PlateGeometry[] => {
  const { placement, settled, orientation, frameTexts } = input;
  const measure = plateMeasureOf(orientation);
  const blocks = Object.values(settled.blocks);
  const arrows = Object.values(settled.arrows);
  const chosen: PlateGeometry[] = [];
  const settledSpots = new Map<FrameId, PlateSpot>();
  for (const id of FRAME_IDS) {
    const frame = settled.frames[id];
    if (frame === undefined) {
      continue;
    }
    const candidates = spotCandidates(id, frame, textWidth(frameTexts[id], measure.fontSize) + measure.padding * 2)
      .map((spot) => ({ spot, plate: plateAt(id, frame, frameTexts[id], spot, measure) }))
      .filter(({ plate }) => !blocks.some((block) => overlapping(grown(plate.rect, BLOCK_CLEARANCE), block)) && !chosen.some((other) => overlapping(grown(plate.rect, PLATE_CLEARANCE), other.rect)));
    const scored = candidates.map((candidate) => ({ ...candidate, score: crossings(candidate.plate.rect, arrows) }));
    const best = scored.reduce<(typeof scored)[number] | null>((leader, candidate) => (leader === null || candidate.score < leader.score ? candidate : leader), null);
    settledSpots.set(id, best?.spot ?? { edge: "top", anchor: PREFERRED_ANCHOR[id], inset: PLATE_INSET });
    chosen.push(plateAt(id, frame, frameTexts[id], settledSpots.get(id) as PlateSpot, measure));
  }
  return (Object.keys(placement.frames) as FrameId[]).map((id) => plateAt(id, placement.frames[id] as Rectangle, frameTexts[id], settledSpots.get(id) ?? { edge: "top", anchor: PREFERRED_ANCHOR[id], inset: PLATE_INSET }, measure));
};

const CHIP_ANGLES = 32;

export const LINE_PITCH = 1.2;

const CHIP_STEP = 6;

const CHIP_REACH = 420;

const CHIP_ANGLE_WEIGHT = 36;

const CHIP_CROSSING_WEIGHT = 50;

const chipDirection = (chip: ChipId, placement: Placement): Point => {
  const { anchor, side } = CHIPS[chip];
  if ("frame" in anchor) {
    return { x: 0, y: -1 };
  }
  const sideways = "block" in anchor ? side === "start" || side === "end" : isVertical(segmentAt(placement.arrows[anchor.arrow] as readonly Point[], anchor.share));
  const sign = side === "end" || side === "below" ? 1 : -1;
  return sideways ? { x: sign, y: 0 } : { x: 0, y: sign };
};

const containedIn = (inner: Rectangle, outer: Rectangle): boolean =>
  inner.x >= outer.x && inner.y >= outer.y && inner.x + inner.width <= outer.x + outer.width && inner.y + inner.height <= outer.y + outer.height;

type ChipLayout = { rectangle: Rectangle; lines: readonly string[] };

const CHIP_WRAP_PENALTY = 150;

const chipLinesOf = (text: string): readonly (readonly string[])[] => {
  const words = text.split(" ");
  const single = [[text]];
  if (words.length < 2) {
    return single;
  }
  const splits = words.slice(1).map((_, index) => [words.slice(0, index + 1).join(" "), words.slice(index + 1).join(" ")]);
  const widest = (lines: readonly string[]): number => Math.max(...lines.map((line) => line.length));
  const balanced = splits.reduce((leader, candidate) => (widest(candidate) < widest(leader) ? candidate : leader));
  return [...single, balanced];
};

const clampTo = (point: Point, rectangle: Rectangle): Point => ({
  x: Math.min(Math.max(point.x, rectangle.x), rectangle.x + rectangle.width),
  y: Math.min(Math.max(point.y, rectangle.y), rectangle.y + rectangle.height),
});

const LEADER_SAMPLE = 3;

const leaderHits = (leader: Segment, rectangle: Rectangle): boolean => {
  const steps = Math.max(1, Math.ceil(segmentLength(leader) / LEADER_SAMPLE));
  return Array.from({ length: steps + 1 }, (_, step) => step / steps).some((share) => {
    const x = leader.from.x + (leader.to.x - leader.from.x) * share;
    const y = leader.from.y + (leader.to.y - leader.from.y) * share;
    return x > rectangle.x && x < rectangle.x + rectangle.width && y > rectangle.y && y < rectangle.y + rectangle.height;
  });
};

const chipsOf = (input: SceneGeometryInput, plates: readonly PlateGeometry[], badges: readonly Point[]): { layouts: Partial<Record<ChipId, ChipLayout>>; complete: boolean } => {
  const { placement, orientation, chips } = input;
  const small = TEXT_SIZES[orientation].small;
  const chipSize = TEXT_SIZES[orientation].chip;
  const padding = chipSize * CHIP_STYLE.paddingRatio;
  const badgeRadius = small * BADGE_STYLE.radiusRatio;
  const gap = badgeRadius / 2;
  const margin = STROKE_UNIT[orientation] * 3;
  const bounds = placement.viewBox;
  const stage = { x: bounds.x + margin, y: bounds.y + margin, width: bounds.width - margin * 2, height: bounds.height - margin * 2 };
  const frames = Object.values(placement.frames);
  const arrows = Object.values(placement.arrows);
  const solid: Rectangle[] = [...Object.values(placement.blocks), ...plates.map((plate) => plate.rect)];
  const solidChips: Rectangle[] = [];
  const placed: Partial<Record<ChipId, ChipLayout>> = {};
  const leaders: Segment[] = [];
  let complete = true;
  for (const chip of chips) {
    const anchor = chipPoint(chip.id, placement);
    if (anchor === null) {
      continue;
    }
    const preferred = chipDirection(chip.id, placement);
    const home = CHIPS[chip.id].anchor;
    const crossable = Object.entries(placement.blocks)
      .filter(([id]) => !("block" in home && home.block === id))
      .map(([, block]) => grown(block as Rectangle, -2));
    const leaderClear = (rectangle: Rectangle): boolean => {
      const leader = { from: anchor, to: clampTo(anchor, rectangle) };
      return (
        !crossable.some((block) => leaderHits(leader, block)) &&
        !solidChips.some((other) => leaderHits(leader, grown(other, 2))) &&
        !leaders.some((other) => leaderHits(other, grown(rectangle, 2)))
      );
    };
    const clear = (rectangle: Rectangle): boolean =>
      containedIn(rectangle, stage) &&
      solid.every((other) => !overlapping(rectangle, grown(other, gap))) &&
      badges.every((badge) => distanceToRectangle(badge, rectangle) >= badgeRadius + gap) &&
      frames.every((frame) => containedIn(rectangle, grown(frame, -gap)) || !overlapping(rectangle, grown(frame, gap)));
    let best: { layout: ChipLayout; cost: number } | null = null;
    for (const lines of chipLinesOf(chip.text)) {
      const width = Math.max(...lines.map((line) => textWidth(line, chipSize))) + padding * 2;
      const height = lines.length === 1 ? chipSize * 1.5 : lines.length * chipSize * LINE_PITCH + chipSize * 0.3;
      const penalty = lines.length === 1 ? 0 : CHIP_WRAP_PENALTY;
      for (let step = 0; step * CHIP_STEP <= CHIP_REACH; step += 1) {
        const distance = small * 0.6 + step * CHIP_STEP;
        for (let index = 0; index < CHIP_ANGLES; index += 1) {
          const angle = (index / CHIP_ANGLES) * Math.PI * 2;
          const direction = { x: Math.cos(angle), y: Math.sin(angle) };
          const support = Math.min(width / 2 / Math.max(Math.abs(direction.x), 0.001), height / 2 / Math.max(Math.abs(direction.y), 0.001));
          const centre = { x: anchor.x + direction.x * (distance + support), y: anchor.y + direction.y * (distance + support) };
          const rectangle = { x: centre.x - width / 2, y: centre.y - height / 2, width, height };
          const turn = Math.acos(Math.min(1, Math.max(-1, direction.x * preferred.x + direction.y * preferred.y)));
          const base = distance + turn * CHIP_ANGLE_WEIGHT + penalty;
          if ((best !== null && base >= best.cost) || !clear(rectangle) || !leaderClear(rectangle)) {
            continue;
          }
          const cost = base + crossings(rectangle, arrows) * CHIP_CROSSING_WEIGHT;
          if (best === null || cost < best.cost) {
            best = { layout: { rectangle, lines }, cost };
          }
        }
      }
    }
    const fallback = chipRectangle(chip.id, placement, { width: textWidth(chip.text, chipSize) + padding * 2, height: chipSize * 1.5, gap: small * 1.3 }) as Rectangle;
    complete = complete && best !== null;
    const layout = best?.layout ?? { rectangle: fallback, lines: [chip.text] };
    placed[chip.id] = layout;
    solid.push(layout.rectangle);
    solidChips.push(layout.rectangle);
    leaders.push({ from: anchor, to: clampTo(anchor, layout.rectangle) });
  }
  return { layouts: placed, complete };
};

const SEARCH_BUDGET = 1500;

const UNTIDY_PENALTY = 1.5;

const FRAME_PENALTY = 1.2;

type Candidate = { at: Point; tier: number };

const badgesOf = (input: SceneGeometryInput, solid: readonly Rectangle[]): { points: readonly Point[]; solved: boolean } => {
  const { placement, orientation, badges } = input;
  const unit = STROKE_UNIT[orientation];
  const radius = TEXT_SIZES[orientation].small * BADGE_STYLE.radiusRatio;
  const gap = radius / 2;
  const obstacles = [...Object.values(placement.blocks), ...solid];
  const borders = Object.values(placement.frames);
  const lines = Object.values(placement.arrows);
  const bounds = placement.viewBox;
  const candidatesOf = (badge: BadgeRequest): readonly Candidate[] => {
    const points = placement.arrows[badge.arrow] as readonly Point[];
    const direction = badge.reverse ? 1 : -1;
    return BADGE_REACH.flatMap((reach, tier) =>
      BADGE_SHARES.flatMap((share) => {
        const normal = unitNormal(segmentAt(points, share));
        const middle = pointAlongPolyline(points, share);
        const offset = (radius + unit * 3) * reach;
        return [direction, -direction].map((side) => ({ at: { x: middle.x + normal.x * offset * side, y: middle.y + normal.y * offset * side }, tier }));
      }),
    );
  };
  const freeOf = (candidate: Point, badge: BadgeRequest, placed: readonly Point[]): boolean =>
    candidate.x - radius >= bounds.x &&
    candidate.x + radius <= bounds.x + bounds.width &&
    candidate.y - radius >= bounds.y &&
    candidate.y + radius <= bounds.y + bounds.height &&
    distanceToPolyline(candidate, placement.arrows[badge.arrow] as readonly Point[]) >= radius + unit * 2.5 &&
    obstacles.every((rectangle) => distanceToRectangle(candidate, rectangle) >= radius + gap) &&
    placed.every((other) => Math.hypot(candidate.x - other.x, candidate.y - other.y) >= radius * 2 + gap);
  const onFrame = (candidate: Point): boolean => borders.some((rectangle) => distanceToBorder(candidate, rectangle) < radius + unit * 1.5);
  const tidy = (candidate: Point, badge: BadgeRequest): boolean =>
    borders.every((rectangle) => distanceToBorder(candidate, rectangle) >= radius + gap) &&
    lines.every((line) => line === placement.arrows[badge.arrow] || distanceToPolyline(candidate, line) >= radius + unit * 3);
  const budget = { left: SEARCH_BUDGET };
  const search = (index: number, placed: readonly Point[]): readonly Point[] | null => {
    if (index === badges.length) {
      return placed;
    }
    const badge = badges[index];
    const ranked = candidatesOf(badge)
      .filter((candidate) => freeOf(candidate.at, badge, placed))
      .map((candidate) => ({ at: candidate.at, rank: candidate.tier + (tidy(candidate.at, badge) ? 0 : UNTIDY_PENALTY) + (onFrame(candidate.at) ? FRAME_PENALTY : 0) }));
    const ordered = ranked.sort((first, second) => first.rank - second.rank).map((candidate) => candidate.at);
    for (const candidate of ordered) {
      budget.left -= 1;
      if (budget.left < 0) {
        return null;
      }
      const found = search(index + 1, [...placed, candidate]);
      if (found !== null) {
        return found;
      }
    }
    return null;
  };
  const solved = search(0, []);
  if (solved !== null) {
    return { points: solved, solved: true };
  }
  const points = badges.reduce<readonly Point[]>((placed, badge) => {
    const candidates = candidatesOf(badge).map((candidate) => candidate.at);
    return [...placed, candidates.find((candidate) => freeOf(candidate, badge, placed)) ?? candidates[0]];
  }, []);
  return { points, solved: false };
};

export const sceneGeometry = (input: SceneGeometryInput): SceneGeometry => {
  const plates = platesOf(input);
  const plateRectangles = plates.map((plate) => plate.rect);
  const badgesFirst = badgesOf(input, plateRectangles);
  const afterBadges = chipsOf(input, plates, badgesFirst.points);
  const chipsFirst = chipsOf(input, plates, []);
  const afterChips = badgesOf(input, [...plateRectangles, ...Object.values(chipsFirst.layouts).map((layout) => (layout as ChipLayout).rectangle)]);
  const useChipsFirst = !(badgesFirst.solved && afterBadges.complete) && afterChips.solved && chipsFirst.complete;
  const layouts = useChipsFirst ? chipsFirst.layouts : afterBadges.layouts;
  const badges = useChipsFirst ? afterChips.points : badgesFirst.points;
  const entries = Object.entries(layouts) as [ChipId, ChipLayout][];
  const chips = Object.fromEntries(entries.map(([id, layout]) => [id, layout.rectangle]));
  const chipLines = Object.fromEntries(entries.map(([id, layout]) => [id, layout.lines]));
  return { plates, chips, chipLines, badges, badgeRadius: TEXT_SIZES[input.orientation].small * BADGE_STYLE.radiusRatio };
};
