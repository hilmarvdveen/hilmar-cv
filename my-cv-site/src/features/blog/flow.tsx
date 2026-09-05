import type { CSSProperties, ReactNode } from "react";
import type { Node, Edge } from "@xyflow/react";

export type FlowTone = "blue" | "emerald" | "amber" | "violet" | "slate" | "rose";

const TONE_STYLE: Record<FlowTone, CSSProperties> = {
  blue: { background: "#eff6ff", border: "1px solid #93c5fd", color: "#1e3a8a" },
  emerald: { background: "#ecfdf5", border: "1px solid #6ee7b7", color: "#065f46" },
  amber: { background: "#fffbeb", border: "1px solid #fcd34d", color: "#92400e" },
  violet: { background: "#f5f3ff", border: "1px solid #c4b5fd", color: "#5b21b6" },
  slate: { background: "#f8fafc", border: "1px solid #cbd5e1", color: "#334155" },
  rose: { background: "#fff1f2", border: "1px solid #fda4af", color: "#9f1239" },
};

type NodeOptions = {
  tone?: FlowTone;
  subtitle?: string;
  direction?: "LR" | "TB";
  width?: number;
};

export function flowNode(
  id: string,
  label: string,
  position: { x: number; y: number },
  options: NodeOptions = {}
): Node {
  const { tone = "slate", subtitle, direction = "LR", width = 170 } = options;
  const labelNode: ReactNode = (
    <div className="text-center leading-tight">
      <div className="font-semibold">{label}</div>
      {subtitle && <div className="mt-0.5 text-[0.7rem] font-normal">{subtitle}</div>}
    </div>
  );
  return {
    id,
    position,
    data: { label: labelNode },
    targetPosition: direction === "TB" ? "top" : "left",
    sourcePosition: direction === "TB" ? "bottom" : "right",
    style: { ...TONE_STYLE[tone], borderRadius: 10, padding: "8px 12px", fontSize: 13, width },
  } as Node;
}

type EdgeOptions = { label?: string; animated?: boolean; dashed?: boolean };

export function flowEdge(source: string, target: string, options: EdgeOptions = {}): Edge {
  const { label, animated = false, dashed = false } = options;
  return {
    id: `${source}->${target}`,
    source,
    target,
    label,
    animated,
    markerEnd: { type: "arrowclosed", width: 18, height: 18 },
    style: { stroke: "#94a3b8", strokeWidth: 1.5, ...(dashed ? { strokeDasharray: "6 4" } : {}) },
    labelStyle: { fontSize: 12, fill: "#475569" },
    labelBgStyle: { fill: "#ffffff" },
  } as Edge;
}
