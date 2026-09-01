"use client";

import { ReactFlow, Background, Controls, type Node, type Edge } from "@xyflow/react";
import "@xyflow/react/dist/style.css";

type FlowDiagramProps = {
  nodes: Node[];
  edges: Edge[];
  height?: number;
  caption?: string;
  ariaLabel: string;
};

const diagramIdFrom = (label: string) =>
  label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export function FlowDiagram({ nodes, edges, height = 340, caption, ariaLabel }: FlowDiagramProps) {
  const diagramId = diagramIdFrom(ariaLabel);
  return (
    <figure className="my-8">
      <div
        className="rounded-xl border border-gray-200 bg-gray-50"
        style={{ height }}
        role="img"
        aria-label={ariaLabel}
      >
        <ReactFlow
          id={diagramId}
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
          <Background id={diagramId} gap={20} color="#e2e8f0" />
          <Controls showInteractive={false} position="bottom-right" />
        </ReactFlow>
      </div>
      {caption && (
        <figcaption className="mt-3 text-center text-sm text-gray-500">{caption}</figcaption>
      )}
    </figure>
  );
}
