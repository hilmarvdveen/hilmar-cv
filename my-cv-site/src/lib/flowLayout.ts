import type { FlowEdgeData, FlowNodeData } from "@/features/blog/flow";

const NODE_PADDING = 8;
const LABEL_LINE_HEIGHT = 16;
const SUBTITLE_LINE_HEIGHT = 14;
const CHARACTER_WIDTH = 7;
const CANVAS_PADDING = 24;
const CURVE_OFFSET = 40;
const LABEL_CHARACTER_WIDTH = 6.5;
const LABEL_PADDING = 8;
const LABEL_HEIGHT = 18;

export type Point = { x: number; y: number };

export type NodeBox = FlowNodeData & { height: number };

export type EdgePath = {
  id: string;
  path: string;
  dashed: boolean;
  label?: string;
  labelBox?: { x: number; y: number; width: number; height: number };
};

export type FlowLayout = {
  viewBox: string;
  width: number;
  height: number;
  nodes: NodeBox[];
  edges: EdgePath[];
};

export const labelLineCount = (label: string, width: number): number => {
  const charactersPerLine = Math.max(8, Math.floor((width - 2 * NODE_PADDING) / CHARACTER_WIDTH));
  return Math.max(1, Math.ceil(label.length / charactersPerLine));
};

export const nodeHeight = (node: FlowNodeData): number =>
  2 * NODE_PADDING +
  labelLineCount(node.label, node.width) * LABEL_LINE_HEIGHT +
  (node.subtitle ? SUBTITLE_LINE_HEIGHT : 0);

const sourcePoint = (node: NodeBox): Point =>
  node.direction === "TB"
    ? { x: node.position.x + node.width / 2, y: node.position.y + node.height }
    : { x: node.position.x + node.width, y: node.position.y + node.height / 2 };

const targetPoint = (node: NodeBox): Point =>
  node.direction === "TB"
    ? { x: node.position.x + node.width / 2, y: node.position.y }
    : { x: node.position.x, y: node.position.y + node.height / 2 };

const round = (value: number) => Math.round(value * 10) / 10;

export const bezierPath = (start: Point, end: Point, sourceDirection: "LR" | "TB", targetDirection: "LR" | "TB") => {
  const firstControl = sourceDirection === "TB" ? { x: start.x, y: start.y + CURVE_OFFSET } : { x: start.x + CURVE_OFFSET, y: start.y };
  const secondControl = targetDirection === "TB" ? { x: end.x, y: end.y - CURVE_OFFSET } : { x: end.x - CURVE_OFFSET, y: end.y };
  const midpoint = {
    x: (start.x + 3 * firstControl.x + 3 * secondControl.x + end.x) / 8,
    y: (start.y + 3 * firstControl.y + 3 * secondControl.y + end.y) / 8,
  };
  const path = `M${round(start.x)} ${round(start.y)}C${round(firstControl.x)} ${round(firstControl.y)} ${round(secondControl.x)} ${round(secondControl.y)} ${round(end.x)} ${round(end.y)}`;
  return { path, midpoint };
};

export function layoutFlow(nodes: FlowNodeData[], edges: FlowEdgeData[]): FlowLayout {
  const boxes: NodeBox[] = nodes.map((node) => ({ ...node, height: nodeHeight(node) }));
  const byId = new Map(boxes.map((box) => [box.id, box]));
  const edgePaths: EdgePath[] = edges.flatMap((edge) => {
    const source = byId.get(edge.source);
    const target = byId.get(edge.target);
    if (!source || !target) return [];
    const { path, midpoint } = bezierPath(sourcePoint(source), targetPoint(target), source.direction, target.direction);
    const labelBox = edge.label
      ? {
          width: round(edge.label.length * LABEL_CHARACTER_WIDTH + 2 * LABEL_PADDING),
          height: LABEL_HEIGHT,
          x: round(midpoint.x - (edge.label.length * LABEL_CHARACTER_WIDTH + 2 * LABEL_PADDING) / 2),
          y: round(midpoint.y - LABEL_HEIGHT / 2),
        }
      : undefined;
    return [{ id: edge.id, path, dashed: edge.dashed, label: edge.label, labelBox }];
  });
  const xs = boxes.flatMap((box) => [box.position.x, box.position.x + box.width]);
  const ys = boxes.flatMap((box) => [box.position.y, box.position.y + box.height]);
  for (const edge of edgePaths) {
    if (edge.labelBox) {
      xs.push(edge.labelBox.x, edge.labelBox.x + edge.labelBox.width);
      ys.push(edge.labelBox.y, edge.labelBox.y + edge.labelBox.height);
    }
  }
  const minX = (xs.length ? Math.min(...xs) : 0) - CANVAS_PADDING;
  const minY = (ys.length ? Math.min(...ys) : 0) - CANVAS_PADDING;
  const maxX = (xs.length ? Math.max(...xs) : 0) + CANVAS_PADDING;
  const maxY = (ys.length ? Math.max(...ys) : 0) + CANVAS_PADDING;
  const width = Math.max(1, maxX - minX);
  const height = Math.max(1, maxY - minY);
  return { viewBox: `${round(minX)} ${round(minY)} ${round(width)} ${round(height)}`, width, height, nodes: boxes, edges: edgePaths };
}
