"use client";

import { ReactFlow, Background, Controls, type Node, type Edge } from "@xyflow/react";
import "@xyflow/react/dist/style.css";

type FlowDiagramProps = {
  nodes: Node[];
  edges: Edge[];
  /** Pixel height of the canvas. */
  height?: number;
  caption?: string;
  /** Accessible label describing what the diagram shows. */
  ariaLabel: string;
};

/**
 * Read-only ReactFlow canvas for explaining architecture in posts. Interactions
 * are limited (no node dragging/connecting, scroll stays with the page) so the
 * diagram reads like a figure rather than a playground. Node/edge objects are
 * built with the `flowNode`/`flowEdge` helpers in `../flow`.
 */
export function FlowDiagram({ nodes, edges, height = 340, caption, ariaLabel }: FlowDiagramProps) {
  return (
    <figure className="my-8">
      <div
        className="rounded-xl border border-gray-200 bg-gray-50"
        style={{ height }}
        role="img"
        aria-label={ariaLabel}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          zoomOnScroll={false}
          panOnDrag
          minZoom={0.2}
        >
          <Background gap={20} color="#e2e8f0" />
          <Controls showInteractive={false} position="bottom-right" />
        </ReactFlow>
      </div>
      {caption && (
        <figcaption className="mt-3 text-center text-sm text-gray-500">{caption}</figcaption>
      )}
    </figure>
  );
}
