import { describe, it, expect } from "vitest";
import { flowNode, flowEdge, TONE_STYLE } from "./flow";

describe("flow helpers", () => {
  it("builds a left-to-right slate node of the default width", () => {
    const node = flowNode("a", "Alpha", { x: 10, y: 20 });
    expect(node).toEqual({
      id: "a",
      label: "Alpha",
      subtitle: undefined,
      position: { x: 10, y: 20 },
      width: 170,
      tone: "slate",
      direction: "LR",
    });
  });

  it("builds a top-to-bottom node with a subtitle, a tone and a width when asked", () => {
    const node = flowNode("b", "Beta", { x: 0, y: 0 }, { direction: "TB", subtitle: "second", tone: "emerald", width: 240 });
    expect(node.direction).toBe("TB");
    expect(node.subtitle).toBe("second");
    expect(node.width).toBe(240);
    expect(TONE_STYLE[node.tone].border).toBe("#6ee7b7");
  });

  it("builds edges with defaults and treats animated edges as dashed", () => {
    expect(flowEdge("a", "b")).toEqual({ id: "a->b", source: "a", target: "b", label: undefined, dashed: false });
    expect(flowEdge("a", "b", { label: "go", dashed: true })).toMatchObject({ label: "go", dashed: true });
    expect(flowEdge("a", "b", { animated: true }).dashed).toBe(true);
  });
});
