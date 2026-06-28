import { describe, it, expect } from "vitest";
import { flowNode, flowEdge } from "./flow";

describe("flow helpers", () => {
  it("builds a node with left/right handles by default", () => {
    const node = flowNode("a", "Alpha", { x: 1, y: 2 });
    expect(node.id).toBe("a");
    expect(node.position).toEqual({ x: 1, y: 2 });
    expect(node.sourcePosition).toBe("right");
    expect(node.targetPosition).toBe("left");
  });

  it("builds a node with top/bottom handles and a subtitle when requested", () => {
    const node = flowNode("b", "Beta", { x: 0, y: 0 }, { dir: "TB", tone: "emerald", sub: "note", width: 200 });
    expect(node.sourcePosition).toBe("bottom");
    expect(node.targetPosition).toBe("top");
    expect(node.style?.width).toBe(200);
  });

  it("builds edges with defaults and with options", () => {
    const plain = flowEdge("a", "b");
    expect(plain.id).toBe("a->b");
    expect(plain.animated).toBe(false);

    const fancy = flowEdge("a", "b", { label: "go", dashed: true, animated: true });
    expect(fancy.label).toBe("go");
    expect(fancy.animated).toBe(true);
    expect((fancy.style as { strokeDasharray?: string }).strokeDasharray).toBe("6 4");
  });
});
