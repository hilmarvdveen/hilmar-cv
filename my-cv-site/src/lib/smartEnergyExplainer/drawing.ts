import { TONE_STYLE, type FlowToneStyle } from "@/features/blog/flow";
import type { Point } from "@/lib/flowLayout";

export const VIEW_BOX = "0 0 960 540";

export const NODE_WIDTH = 100;

export const NODE_HEIGHT = 40;

export type DrawingLayer = "devices" | "hub" | "gateway" | "database" | "memory" | "serving" | "planning";

export const DRAWING_LAYERS: readonly DrawingLayer[] = ["devices", "hub", "gateway", "database", "memory", "serving", "planning"];

export type NodeId =
  | "simulator"
  | "battery"
  | "hub"
  | "gateway"
  | "database"
  | "memory"
  | "api"
  | "dashboard"
  | "browser"
  | "planner"
  | "steering"
  | "queue";

export type DrawingNode = {
  id: NodeId;
  layer: DrawingLayer;
  position: Point;
  tone: FlowToneStyle;
};

export const NODES: readonly DrawingNode[] = [
  { id: "simulator", layer: "devices", position: { x: 215, y: 70 }, tone: TONE_STYLE.slate },
  { id: "battery", layer: "devices", position: { x: 215, y: 170 }, tone: TONE_STYLE.slate },
  { id: "hub", layer: "hub", position: { x: 355, y: 120 }, tone: TONE_STYLE.blue },
  { id: "gateway", layer: "gateway", position: { x: 495, y: 120 }, tone: TONE_STYLE.blue },
  { id: "database", layer: "database", position: { x: 495, y: 225 }, tone: TONE_STYLE.emerald },
  { id: "memory", layer: "memory", position: { x: 355, y: 225 }, tone: TONE_STYLE.slate },
  { id: "api", layer: "serving", position: { x: 495, y: 340 }, tone: TONE_STYLE.slate },
  { id: "dashboard", layer: "serving", position: { x: 635, y: 340 }, tone: TONE_STYLE.slate },
  { id: "browser", layer: "serving", position: { x: 635, y: 440 }, tone: TONE_STYLE.slate },
  { id: "planner", layer: "planning", position: { x: 635, y: 238 }, tone: TONE_STYLE.emerald },
  { id: "steering", layer: "planning", position: { x: 635, y: 130 }, tone: TONE_STYLE.emerald },
  { id: "queue", layer: "planning", position: { x: 635, y: 40 }, tone: TONE_STYLE.emerald },
];

export const nodeById = (id: NodeId): DrawingNode => NODES.find((node) => node.id === id) as DrawingNode;

export type EdgeId =
  | "simulatorToHub"
  | "hubToGateway"
  | "gatewayToDatabase"
  | "databaseToApi"
  | "apiToDashboard"
  | "dashboardToBrowser"
  | "plannerToDatabase"
  | "databaseToSteering"
  | "steeringToQueue"
  | "queueToGateway"
  | "gatewayToHub"
  | "hubToBattery";

export type DrawingEdge = {
  id: EdgeId;
  source: NodeId;
  target: NodeId;
  points: readonly Point[];
};

export const EDGES: readonly DrawingEdge[] = [
  { id: "simulatorToHub", source: "simulator", target: "hub", points: [{ x: 315, y: 90 }, { x: 335, y: 90 }, { x: 335, y: 133 }, { x: 355, y: 133 }] },
  { id: "hubToGateway", source: "hub", target: "gateway", points: [{ x: 455, y: 133 }, { x: 495, y: 133 }] },
  { id: "gatewayToDatabase", source: "gateway", target: "database", points: [{ x: 545, y: 160 }, { x: 545, y: 225 }] },
  { id: "databaseToApi", source: "database", target: "api", points: [{ x: 545, y: 265 }, { x: 545, y: 340 }] },
  { id: "apiToDashboard", source: "api", target: "dashboard", points: [{ x: 595, y: 360 }, { x: 635, y: 360 }] },
  { id: "dashboardToBrowser", source: "dashboard", target: "browser", points: [{ x: 685, y: 380 }, { x: 685, y: 440 }] },
  { id: "plannerToDatabase", source: "planner", target: "database", points: [{ x: 635, y: 258 }, { x: 595, y: 258 }] },
  { id: "databaseToSteering", source: "database", target: "steering", points: [{ x: 595, y: 235 }, { x: 615, y: 235 }, { x: 615, y: 150 }, { x: 635, y: 150 }] },
  { id: "steeringToQueue", source: "steering", target: "queue", points: [{ x: 685, y: 130 }, { x: 685, y: 80 }] },
  { id: "queueToGateway", source: "queue", target: "gateway", points: [{ x: 635, y: 60 }, { x: 545, y: 60 }, { x: 545, y: 120 }] },
  { id: "gatewayToHub", source: "gateway", target: "hub", points: [{ x: 495, y: 147 }, { x: 455, y: 147 }] },
  { id: "hubToBattery", source: "hub", target: "battery", points: [{ x: 355, y: 147 }, { x: 335, y: 147 }, { x: 335, y: 190 }, { x: 315, y: 190 }] },
];

export const edgeById = (id: EdgeId): DrawingEdge => EDGES.find((edge) => edge.id === id) as DrawingEdge;

export const polylinePath = (points: readonly Point[]): string =>
  points.map((point, index) => `${index === 0 ? "M" : "L"}${point.x} ${point.y}`).join(" ");

const distance = (from: Point, to: Point): number => Math.hypot(to.x - from.x, to.y - from.y);

export const pointAlongPolyline = (points: readonly Point[], fraction: number): Point => {
  const segments = points.slice(1).map((point, index) => ({ from: points[index], to: point, length: distance(points[index], point) }));
  const totalLength = segments.reduce((total, segment) => total + segment.length, 0);
  if (totalLength === 0) {
    return points[0];
  }
  const target = Math.min(1, Math.max(0, fraction)) * totalLength;
  const segmentEnds = segments.map((_, index) => segments.slice(0, index + 1).reduce((total, segment) => total + segment.length, 0));
  const segmentIndex = segmentEnds.findIndex((end) => end >= target);
  const segment = segments[segmentIndex];
  const travelled = segmentEnds[segmentIndex] - segment.length;
  const share = segment.length === 0 ? 0 : (target - travelled) / segment.length;
  return { x: segment.from.x + (segment.to.x - segment.from.x) * share, y: segment.from.y + (segment.to.y - segment.from.y) * share };
};

export type PortId =
  | "telemetrySource"
  | "telemetryStore"
  | "siteReader"
  | "dayAheadPrices"
  | "priceStore"
  | "planStore"
  | "commandStore"
  | "commandSender"
  | "steeringSwitch"
  | "clock";

export const PORTS: readonly PortId[] = [
  "telemetrySource",
  "telemetryStore",
  "siteReader",
  "dayAheadPrices",
  "priceStore",
  "planStore",
  "commandStore",
  "commandSender",
  "steeringSwitch",
  "clock",
];

export const CONFIGURED_PORTS: readonly PortId[] = PORTS.filter((port) => port !== "clock");

export const RING_CENTRE: Point = { x: 480, y: 270 };

export const RING_RADIUS = 195;

export const portPosition = (port: PortId): Point => {
  const angle = (PORTS.indexOf(port) / PORTS.length) * 2 * Math.PI - Math.PI / 2;
  return { x: RING_CENTRE.x + RING_RADIUS * Math.cos(angle), y: RING_CENTRE.y + RING_RADIUS * Math.sin(angle) };
};

export const ASSISTANT_PORT_POSITION: Point = { x: 480, y: 515 };

export type StoreId = "telemetry" | "commands" | "plans" | "prices" | "switch" | "sites";

export const STORES: readonly StoreId[] = ["telemetry", "commands", "plans", "prices", "switch", "sites"];

export const WRITING_STORES: readonly StoreId[] = STORES.filter((store) => store !== "sites");

export type HostId = "api" | "gateway" | "planner" | "steering" | "simulator" | "tests";

export const HOSTS: readonly HostId[] = ["api", "gateway", "planner", "steering", "simulator", "tests"];

export type SecurityControlId =
  | "deviceKey"
  | "hubIdentity"
  | "parserCaps"
  | "parameterisedWrites"
  | "internalIngress"
  | "jwtAuthorisedParty"
  | "bearerStaysOnServer"
  | "nonceContentPolicy"
  | "entraQueue"
  | "commandReloaded"
  | "pinnedDeploys";

export const SECURITY_CONTROLS: ReadonlyArray<{ id: SecurityControlId; node: NodeId | null }> = [
  { id: "deviceKey", node: "simulator" },
  { id: "hubIdentity", node: "hub" },
  { id: "parserCaps", node: "gateway" },
  { id: "parameterisedWrites", node: "database" },
  { id: "internalIngress", node: "api" },
  { id: "jwtAuthorisedParty", node: "api" },
  { id: "bearerStaysOnServer", node: "dashboard" },
  { id: "nonceContentPolicy", node: "browser" },
  { id: "entraQueue", node: "queue" },
  { id: "commandReloaded", node: "gateway" },
  { id: "pinnedDeploys", node: null },
];

export const TOUCH_POINT_COUNT = 7;

export const SECURITY_GATE_COUNT = 7;

export const MAXIMUM_CHUNKS = 4;
