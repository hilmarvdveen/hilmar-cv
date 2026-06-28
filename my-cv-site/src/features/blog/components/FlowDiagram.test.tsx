import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { FlowDiagram } from "./FlowDiagram";
import { flowNode, flowEdge } from "../flow";

describe("FlowDiagram", () => {
  const nodes = [
    flowNode("a", "Alpha", { x: 0, y: 0 }, { tone: "blue", sub: "start" }),
    flowNode("b", "Beta", { x: 220, y: 0 }, { dir: "TB" }),
  ];
  const edges = [flowEdge("a", "b", { label: "go", dashed: true, animated: true })];

  it("renders an accessible canvas with a caption", () => {
    render(<FlowDiagram nodes={nodes} edges={edges} ariaLabel="example flow" caption="figure 1" />);
    expect(screen.getByLabelText("example flow")).toBeInTheDocument();
    expect(screen.getByText("figure 1")).toBeInTheDocument();
  });

  it("renders without a caption", () => {
    const { container } = render(
      <FlowDiagram nodes={[flowNode("x", "X", { x: 0, y: 0 })]} edges={[]} ariaLabel="solo" />
    );
    expect(container.querySelector(".react-flow")).toBeTruthy();
  });
});
