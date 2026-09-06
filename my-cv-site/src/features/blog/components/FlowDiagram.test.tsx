import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { FlowDiagram } from "./FlowDiagram";
import { flowNode, flowEdge } from "../flow";

describe("FlowDiagram", () => {
  const nodes = [
    flowNode("a", "Alpha", { x: 0, y: 0 }, { tone: "blue", subtitle: "start" }),
    flowNode("b", "Beta", { x: 220, y: 0 }, { direction: "TB" }),
  ];
  const edges = [flowEdge("a", "b", { label: "go", dashed: true, animated: true })];

  it("renders the diagram as an image with a caption, drawn on the server", () => {
    render(<FlowDiagram nodes={nodes} edges={edges} ariaLabel="example flow" caption="figure 1" />);
    const drawing = screen.getByRole("img", { name: "example flow" });
    expect(drawing.tagName).toBe("svg");
    expect(screen.getByText("figure 1")).toBeInTheDocument();
    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.getByText("start")).toBeInTheDocument();
    expect(screen.getByText("go")).toBeInTheDocument();
    expect(drawing.querySelector("path[stroke-dasharray]")).not.toBeNull();
  });

  it("renders without a caption and without edges", () => {
    render(<FlowDiagram nodes={[flowNode("x", "X", { x: 0, y: 0 })]} edges={[]} ariaLabel="solo" height={200} />);
    const drawing = screen.getByRole("img", { name: "solo" });
    expect(drawing).toHaveStyle({ maxHeight: "200px" });
    expect(drawing.querySelectorAll("rect")).toHaveLength(1);
    expect(screen.queryByRole("figure")).not.toBeNull();
  });
});
