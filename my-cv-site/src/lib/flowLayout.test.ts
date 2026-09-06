import { describe, it, expect } from "vitest";
import { flowEdge, flowNode } from "@/features/blog/flow";
import { bezierPath, labelLineCount, layoutFlow, nodeHeight } from "./flowLayout";

describe("flowLayout", () => {
  it("sizes a node by its label lines and subtitle", () => {
    expect(labelLineCount("Alpha", 170)).toBe(1);
    expect(labelLineCount("A label that certainly needs two lines", 170)).toBe(2);
    expect(nodeHeight(flowNode("a", "Alpha", { x: 0, y: 0 }))).toBe(32);
    expect(nodeHeight(flowNode("b", "Beta", { x: 0, y: 0 }, { subtitle: "sub" }))).toBe(46);
  });

  it("draws a left-to-right edge from the right side to the left side", () => {
    const { path, midpoint } = bezierPath({ x: 170, y: 16 }, { x: 220, y: 16 }, "LR", "LR");
    expect(path).toBe("M170 16C210 16 180 16 220 16");
    expect(midpoint).toEqual({ x: 195, y: 16 });
  });

  it("lays out nodes, edges and labels inside one padded view box", () => {
    const nodes = [
      flowNode("a", "Alpha", { x: 0, y: 0 }, { direction: "TB" }),
      flowNode("b", "Beta", { x: 0, y: 120 }, { direction: "TB", subtitle: "second" }),
    ];
    const layout = layoutFlow(nodes, [flowEdge("a", "b", { label: "go" }), flowEdge("a", "missing")]);
    expect(layout.nodes[1].height).toBe(46);
    expect(layout.edges).toHaveLength(1);
    expect(layout.edges[0].path.startsWith("M85 32C85 72")).toBe(true);
    expect(layout.edges[0].labelBox).toEqual({ width: 29, height: 18, x: 70.5, y: 67 });
    expect(layout.viewBox).toBe("-24 -24 218 214");
  });

  it("returns a unit view box when there are no nodes", () => {
    const layout = layoutFlow([], []);
    expect(layout.viewBox).toBe("-24 -24 48 48");
  });
});
