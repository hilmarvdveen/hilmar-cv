import { TONE_STYLE, type FlowEdgeData, type FlowNodeData } from "../flow";
import { layoutFlow } from "@/lib/flowLayout";

type FlowDiagramProps = {
  nodes: FlowNodeData[];
  edges: FlowEdgeData[];
  height?: number;
  caption?: string;
  ariaLabel: string;
};

const EDGE_COLOR = "#94a3b8";
const LABEL_COLOR = "#475569";

const diagramIdFrom = (label: string) =>
  label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export function FlowDiagram({ nodes, edges, height = 340, caption, ariaLabel }: FlowDiagramProps) {
  const diagramId = diagramIdFrom(ariaLabel);
  const layout = layoutFlow(nodes, edges);
  const markerId = `${diagramId}-arrow`;

  return (
    <figure className="my-8">
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-gray-50 p-4">
        <svg
          role="img"
          aria-label={ariaLabel}
          viewBox={layout.viewBox}
          className="mx-auto block h-auto min-w-[640px] sm:min-w-0"
          style={{ maxHeight: height, width: "100%" }}
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <marker id={markerId} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="9" markerHeight="9" orient="auto-start-reverse">
              <path d="M0 0L10 5L0 10z" fill={EDGE_COLOR} />
            </marker>
          </defs>
          {layout.edges.map((edge) => (
            <g key={edge.id}>
              <path
                d={edge.path}
                fill="none"
                stroke={EDGE_COLOR}
                strokeWidth={1.5}
                strokeDasharray={edge.dashed ? "6 4" : undefined}
                markerEnd={`url(#${markerId})`}
              />
              {edge.label && edge.labelBox && (
                <>
                  <rect
                    x={edge.labelBox.x}
                    y={edge.labelBox.y}
                    width={edge.labelBox.width}
                    height={edge.labelBox.height}
                    rx={4}
                    fill="#ffffff"
                  />
                  <text
                    x={edge.labelBox.x + edge.labelBox.width / 2}
                    y={edge.labelBox.y + edge.labelBox.height / 2}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={12}
                    fill={LABEL_COLOR}
                  >
                    {edge.label}
                  </text>
                </>
              )}
            </g>
          ))}
          {layout.nodes.map((node) => {
            const tone = TONE_STYLE[node.tone];
            return (
              <g key={node.id}>
                <rect
                  x={node.position.x}
                  y={node.position.y}
                  width={node.width}
                  height={node.height}
                  rx={10}
                  fill={tone.background}
                  stroke={tone.border}
                  strokeWidth={1}
                />
                <foreignObject x={node.position.x} y={node.position.y} width={node.width} height={node.height}>
                  <div
                    style={{
                      boxSizing: "border-box",
                      width: node.width,
                      height: node.height,
                      padding: "8px 12px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      textAlign: "center",
                      lineHeight: 1.2,
                      fontSize: 13,
                      color: tone.color,
                    }}
                  >
                    <div style={{ fontWeight: 600 }}>{node.label}</div>
                    {node.subtitle && <div style={{ marginTop: 2, fontSize: 11 }}>{node.subtitle}</div>}
                  </div>
                </foreignObject>
              </g>
            );
          })}
        </svg>
      </div>
      {caption && (
        <figcaption className="mt-3 text-center text-sm text-gray-500">{caption}</figcaption>
      )}
    </figure>
  );
}
