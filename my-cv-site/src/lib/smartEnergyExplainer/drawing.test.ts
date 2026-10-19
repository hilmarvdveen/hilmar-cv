import {
  CONFIGURED_PORTS,
  EDGES,
  NODES,
  PORTS,
  RING_CENTRE,
  RING_RADIUS,
  SECURITY_CONTROLS,
  WRITING_STORES,
  edgeById,
  nodeById,
  pointAlongPolyline,
  polylinePath,
  portPosition,
} from "./drawing";

describe("drawing", () => {
  it("references existing nodes from every edge", () => {
    const nodeIds = new Set(NODES.map((node) => node.id));
    for (const edge of EDGES) {
      expect(nodeIds.has(edge.source)).toBe(true);
      expect(nodeIds.has(edge.target)).toBe(true);
      expect(edge.points.length).toBeGreaterThanOrEqual(2);
    }
  });

  it("keeps every node inside the square crop band from x 210 to 750", () => {
    for (const node of NODES) {
      expect(node.position.x).toBeGreaterThanOrEqual(210);
      expect(node.position.x + 100).toBeLessThanOrEqual(750);
    }
  });

  it("draws edges as orthogonal polylines", () => {
    for (const edge of EDGES) {
      edge.points.slice(1).forEach((point, index) => {
        const previous = edge.points[index];
        expect(point.x === previous.x || point.y === previous.y).toBe(true);
      });
    }
  });

  it("looks up nodes and edges by id", () => {
    expect(nodeById("database").layer).toBe("database");
    expect(edgeById("hubToGateway").target).toBe("gateway");
  });

  it("writes a polyline path", () => {
    expect(polylinePath([{ x: 0, y: 0 }, { x: 10, y: 0 }, { x: 10, y: 5 }])).toBe("M0 0 L10 0 L10 5");
  });

  it("finds points along a polyline at the start, a corner, the end and outside the range", () => {
    const points = [{ x: 0, y: 0 }, { x: 10, y: 0 }, { x: 10, y: 10 }];
    expect(pointAlongPolyline(points, 0)).toEqual({ x: 0, y: 0 });
    expect(pointAlongPolyline(points, 0.5)).toEqual({ x: 10, y: 0 });
    expect(pointAlongPolyline(points, 0.75)).toEqual({ x: 10, y: 5 });
    expect(pointAlongPolyline(points, 1)).toEqual({ x: 10, y: 10 });
    expect(pointAlongPolyline(points, -2)).toEqual({ x: 0, y: 0 });
    expect(pointAlongPolyline(points, 3)).toEqual({ x: 10, y: 10 });
  });

  it("returns the single point of a polyline without length", () => {
    expect(pointAlongPolyline([{ x: 4, y: 7 }], 0.5)).toEqual({ x: 4, y: 7 });
    expect(pointAlongPolyline([{ x: 4, y: 7 }, { x: 4, y: 7 }], 0.5)).toEqual({ x: 4, y: 7 });
  });

  it("skips a zero length segment at the start", () => {
    expect(pointAlongPolyline([{ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 10, y: 0 }], 0)).toEqual({ x: 0, y: 0 });
  });

  it("places ten ports on a ring with the clock as the only port without a configured adapter", () => {
    expect(PORTS).toHaveLength(10);
    expect(CONFIGURED_PORTS).not.toContain("clock");
    const top = portPosition("telemetrySource");
    expect(top.x).toBeCloseTo(RING_CENTRE.x);
    expect(top.y).toBeCloseTo(RING_CENTRE.y - RING_RADIUS);
  });

  it("writes to five stores and only reads sites", () => {
    expect(WRITING_STORES).toEqual(["telemetry", "commands", "plans", "prices", "switch"]);
  });

  it("lists eleven security controls in flow order", () => {
    expect(SECURITY_CONTROLS).toHaveLength(11);
    expect(SECURITY_CONTROLS[0].node).toBe("simulator");
    expect(SECURITY_CONTROLS.at(-1)?.node).toBeNull();
  });
});
