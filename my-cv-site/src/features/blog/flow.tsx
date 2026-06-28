import type { CSSProperties, ReactNode } from "react";
import type { Node, Edge } from "@xyflow/react";

/**
 * Diagram authoring helpers. These run on the server (post bodies are server
 * components), so they must NOT live in the `"use client"` FlowDiagram module —
 * functions exported from a client module become unusable client references on
 * the server. We use string literals for positions/markers (cast to the
 * ReactFlow types, which are erased at runtime) to avoid importing any runtime
 * value from `@xyflow/react` here.
 */

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
  /** Smaller secondary line under the title. */
  sub?: string;
  /** Edge attachment orientation: left↔right (default) or top↔bottom. */
  dir?: "LR" | "TB";
  width?: number;
};

/** Build a styled ReactFlow node from concise arguments. */
export function flowNode(
  id: string,
  label: string,
  position: { x: number; y: number },
  options: NodeOptions = {}
): Node {
  const { tone = "slate", sub, dir = "LR", width = 170 } = options;
  const labelNode: ReactNode = (
    <div className="text-center leading-tight">
      <div className="font-semibold">{label}</div>
      {sub && <div className="mt-0.5 text-[0.7rem] font-normal opacity-70">{sub}</div>}
    </div>
  );
  return {
    id,
    position,
    data: { label: labelNode },
    targetPosition: dir === "TB" ? "top" : "left",
    sourcePosition: dir === "TB" ? "bottom" : "right",
    style: { ...TONE_STYLE[tone], borderRadius: 10, padding: "8px 12px", fontSize: 13, width },
  } as Node;
}

type EdgeOptions = { label?: string; animated?: boolean; dashed?: boolean };

/** Build a directed edge with an arrow head between two node ids. */
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
