import type { Point } from "@/lib/flowLayout";

export const POSTER_SIZE = 1080;

export type Rectangle = { x: number; y: number; width: number; height: number };

export type Camera = { x: number; y: number; size: number };

export type Tone = "white" | "navy" | "emerald" | "gray";

export type NodeId =
  | "battery"
  | "evCharger"
  | "pvInverter"
  | "heatPump"
  | "prices"
  | "browser"
  | "iotHub"
  | "blob"
  | "budget"
  | "keyVault"
  | "gateway"
  | "api"
  | "dashboard"
  | "planner"
  | "steering"
  | "retention"
  | "simulator"
  | "serviceBus"
  | "logAnalytics"
  | "identities";

export type PosterNode = Rectangle & { id: NodeId; tone: Tone; dashed?: boolean; group: RevealGroup };

export type RevealGroup = "header" | "edges" | "cloud" | "containers" | "database" | "arrows" | "security";

export const REVEAL_GROUPS: readonly RevealGroup[] = ["header", "edges", "cloud", "containers", "database", "arrows", "security"];

export const NODES: readonly PosterNode[] = [
  { id: "battery", x: 30, y: 140, width: 148, height: 48, tone: "emerald", group: "edges" },
  { id: "evCharger", x: 30, y: 200, width: 148, height: 48, tone: "white", group: "edges" },
  { id: "pvInverter", x: 30, y: 260, width: 148, height: 48, tone: "white", group: "edges" },
  { id: "heatPump", x: 30, y: 320, width: 148, height: 48, tone: "white", group: "edges" },
  { id: "prices", x: 30, y: 640, width: 148, height: 56, tone: "gray", group: "edges" },
  { id: "browser", x: 912, y: 417, width: 140, height: 70, tone: "navy", group: "edges" },
  { id: "iotHub", x: 236, y: 172, width: 170, height: 58, tone: "navy", group: "cloud" },
  { id: "blob", x: 440, y: 172, width: 120, height: 58, tone: "white", group: "cloud" },
  { id: "budget", x: 576, y: 172, width: 130, height: 58, tone: "white", group: "cloud" },
  { id: "keyVault", x: 730, y: 172, width: 130, height: 58, tone: "white", group: "cloud" },
  { id: "serviceBus", x: 730, y: 286, width: 130, height: 100, tone: "gray", dashed: true, group: "cloud" },
  { id: "logAnalytics", x: 730, y: 510, width: 130, height: 56, tone: "white", group: "cloud" },
  { id: "identities", x: 730, y: 580, width: 130, height: 56, tone: "white", group: "cloud" },
  { id: "gateway", x: 250, y: 312, width: 170, height: 64, tone: "emerald", group: "containers" },
  { id: "api", x: 526, y: 312, width: 170, height: 64, tone: "emerald", group: "containers" },
  { id: "dashboard", x: 526, y: 420, width: 170, height: 64, tone: "emerald", group: "containers" },
  { id: "planner", x: 250, y: 552, width: 106, height: 54, tone: "white", group: "containers" },
  { id: "steering", x: 364, y: 552, width: 106, height: 54, tone: "white", group: "containers" },
  { id: "retention", x: 478, y: 552, width: 106, height: 54, tone: "white", group: "containers" },
  { id: "simulator", x: 592, y: 552, width: 106, height: 54, tone: "white", group: "containers" },
];

export type FrameId = "sources" | "consumer" | "subscription" | "resourceGroup" | "containerApps" | "security";

export type PosterFrame = Rectangle & { id: FrameId; tone: "navy" | "gray" | "emerald"; group: RevealGroup };

export const FRAMES: readonly PosterFrame[] = [
  { id: "sources", x: 16, y: 110, width: 176, height: 730, tone: "gray", group: "edges" },
  { id: "consumer", x: 900, y: 110, width: 164, height: 730, tone: "gray", group: "edges" },
  { id: "subscription", x: 204, y: 110, width: 684, height: 730, tone: "navy", group: "cloud" },
  { id: "resourceGroup", x: 218, y: 146, width: 656, height: 680, tone: "navy", group: "cloud" },
  { id: "containerApps", x: 232, y: 282, width: 480, height: 360, tone: "emerald", group: "containers" },
  { id: "security", x: 16, y: 868, width: 1048, height: 200, tone: "emerald", group: "security" },
];

export const DATABASE: Rectangle = { x: 236, y: 672, width: 624, height: 140 };

export type ChipId = "readings" | "rollup" | "currentState" | "command" | "audit" | "plans";

export const CHIPS: ReadonlyArray<{ id: ChipId; at: Point; tone: "emerald" | "navy" }> = [
  { id: "readings", at: { x: 252, y: 712 }, tone: "emerald" },
  { id: "rollup", at: { x: 486, y: 712 }, tone: "emerald" },
  { id: "currentState", at: { x: 656, y: 712 }, tone: "emerald" },
  { id: "command", at: { x: 252, y: 744 }, tone: "navy" },
  { id: "audit", at: { x: 500, y: 744 }, tone: "navy" },
  { id: "plans", at: { x: 614, y: 744 }, tone: "navy" },
];

export type ArrowId =
  | "mqtt"
  | "eventHubs"
  | "checkpoint"
  | "batch"
  | "reads"
  | "calls"
  | "poll"
  | "prices"
  | "commands"
  | "sessions"
  | "cloudToDevice";

export type PosterArrow = {
  id: ArrowId;
  points: readonly Point[];
  tone: "gray" | "emerald" | "navy";
  dashed?: boolean;
  labelAt?: Point;
};

export const ARROWS: readonly PosterArrow[] = [
  { id: "mqtt", points: [{ x: 178, y: 290 }, { x: 222, y: 290 }, { x: 222, y: 205 }, { x: 236, y: 205 }], tone: "emerald" },
  { id: "eventHubs", points: [{ x: 320, y: 230 }, { x: 320, y: 312 }], tone: "emerald", labelAt: { x: 320, y: 262 } },
  { id: "checkpoint", points: [{ x: 420, y: 342 }, { x: 500, y: 342 }, { x: 500, y: 230 }], tone: "gray", labelAt: { x: 500, y: 300 } },
  { id: "batch", points: [{ x: 335, y: 376 }, { x: 335, y: 420 }, { x: 300, y: 420 }, { x: 300, y: 672 }], tone: "emerald", labelAt: { x: 300, y: 650 } },
  { id: "reads", points: [{ x: 611, y: 376 }, { x: 611, y: 400 }, { x: 560, y: 400 }, { x: 560, y: 672 }], tone: "gray", labelAt: { x: 560, y: 650 } },
  { id: "calls", points: [{ x: 611, y: 420 }, { x: 611, y: 376 }], tone: "gray", labelAt: { x: 640, y: 398 } },
  { id: "poll", points: [{ x: 912, y: 452 }, { x: 696, y: 452 }], tone: "navy", labelAt: { x: 805, y: 452 } },
  { id: "prices", points: [{ x: 178, y: 668 }, { x: 216, y: 668 }, { x: 216, y: 579 }, { x: 250, y: 579 }], tone: "gray", labelAt: { x: 214, y: 630 } },
  { id: "commands", points: [{ x: 417, y: 552 }, { x: 417, y: 530 }, { x: 714, y: 530 }, { x: 714, y: 350 }, { x: 730, y: 350 }], tone: "navy", dashed: true, labelAt: { x: 560, y: 530 } },
  { id: "sessions", points: [{ x: 795, y: 290 }, { x: 795, y: 252 }, { x: 380, y: 252 }, { x: 380, y: 312 }], tone: "navy", dashed: true, labelAt: { x: 640, y: 252 } },
  { id: "cloudToDevice", points: [{ x: 236, y: 222 }, { x: 210, y: 222 }, { x: 210, y: 164 }, { x: 178, y: 164 }], tone: "navy", labelAt: { x: 104, y: 128 } },
];

export type RouteId = "telemetry" | "pollRequest" | "apiRead" | "commandsOut" | "pricesIn" | "batch";

export const ROUTES: Record<RouteId, readonly Point[]> = {
  telemetry: [{ x: 178, y: 290 }, { x: 222, y: 290 }, { x: 222, y: 205 }, { x: 320, y: 205 }, { x: 320, y: 420 }, { x: 300, y: 420 }, { x: 300, y: 690 }],
  pollRequest: [{ x: 982, y: 452 }, { x: 611, y: 452 }, { x: 611, y: 344 }],
  apiRead: [{ x: 611, y: 376 }, { x: 611, y: 400 }, { x: 560, y: 400 }, { x: 560, y: 690 }],
  commandsOut: [
    { x: 417, y: 552 },
    { x: 417, y: 530 },
    { x: 714, y: 530 },
    { x: 714, y: 350 },
    { x: 795, y: 350 },
    { x: 795, y: 252 },
    { x: 380, y: 252 },
    { x: 380, y: 300 },
    { x: 340, y: 300 },
    { x: 340, y: 222 },
    { x: 210, y: 222 },
    { x: 210, y: 164 },
    { x: 104, y: 164 },
  ],
  pricesIn: [{ x: 104, y: 668 }, { x: 216, y: 668 }, { x: 216, y: 579 }, { x: 303, y: 579 }, { x: 303, y: 690 }],
  batch: [{ x: 335, y: 376 }, { x: 335, y: 420 }, { x: 300, y: 420 }, { x: 300, y: 712 }],
};

export const CAMERAS = {
  overview: { x: 0, y: 0, size: POSTER_SIZE },
  frontend: { x: 470, y: 250, size: 600 },
  backend: { x: 208, y: 230, size: 660 },
  cloud: { x: 190, y: 96, size: 760 },
} satisfies Record<string, Camera>;

export type StepBadge = { step: number; at: Point };

export const STEP_BADGES: readonly StepBadge[] = [
  { step: 2, at: { x: 884, y: 482 } },
  { step: 3, at: { x: 224, y: 672 } },
  { step: 4, at: { x: 204, y: 110 } },
];

export const SECURITY_CONTROL_COUNT = 12;

export const SECURITY_GATE_COUNT = 7;
