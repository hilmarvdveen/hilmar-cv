export type FlowTone = "blue" | "emerald" | "amber" | "violet" | "slate" | "rose";

export type FlowDirection = "LR" | "TB";

export type FlowToneStyle = {
  background: string;
  border: string;
  color: string;
};

export const TONE_STYLE: Record<FlowTone, FlowToneStyle> = {
  blue: { background: "#eff6ff", border: "#93c5fd", color: "#1e3a8a" },
  emerald: { background: "#ecfdf5", border: "#6ee7b7", color: "#065f46" },
  amber: { background: "#fffbeb", border: "#fcd34d", color: "#92400e" },
  violet: { background: "#f5f3ff", border: "#c4b5fd", color: "#5b21b6" },
  slate: { background: "#f8fafc", border: "#cbd5e1", color: "#334155" },
  rose: { background: "#fff1f2", border: "#fda4af", color: "#9f1239" },
};

export type FlowNodeData = {
  id: string;
  label: string;
  subtitle?: string;
  position: { x: number; y: number };
  width: number;
  tone: FlowTone;
  direction: FlowDirection;
};

export type FlowEdgeData = {
  id: string;
  source: string;
  target: string;
  label?: string;
  dashed: boolean;
};

type NodeOptions = {
  tone?: FlowTone;
  subtitle?: string;
  direction?: FlowDirection;
  width?: number;
};

export function flowNode(
  id: string,
  label: string,
  position: { x: number; y: number },
  options: NodeOptions = {}
): FlowNodeData {
  const { tone = "slate", subtitle, direction = "LR", width = 170 } = options;
  return { id, label, subtitle, position, width, tone, direction };
}

type EdgeOptions = { label?: string; animated?: boolean; dashed?: boolean };

export function flowEdge(source: string, target: string, options: EdgeOptions = {}): FlowEdgeData {
  const { label, animated = false, dashed = false } = options;
  return { id: `${source}->${target}`, source, target, label, dashed: dashed || animated };
}
