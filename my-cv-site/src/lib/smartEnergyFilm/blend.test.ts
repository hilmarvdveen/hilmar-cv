import { blendPlacement, separateRectangles } from "./blend";
import type { Placement } from "./layout";

const viewBox = { x: 0, y: 0, width: 100, height: 100 };

const from: Placement = {
  viewBox,
  blocks: { battery: { x: 0, y: 0, width: 10, height: 10 }, gateway: { x: 0, y: 0, width: 10, height: 10 } },
  arrows: { batteryToHub: [{ x: 0, y: 0 }, { x: 10, y: 0 }], hubToGateway: [{ x: 0, y: 0 }, { x: 10, y: 0 }] },
  frames: { azure: { x: 0, y: 0, width: 50, height: 50 } },
};

const to: Placement = {
  viewBox: { x: 0, y: 0, width: 200, height: 100 },
  blocks: { battery: { x: 20, y: 40, width: 30, height: 50 } },
  arrows: { batteryToHub: [{ x: 20, y: 20 }, { x: 40, y: 20 }], gatewayToHub: [{ x: 1, y: 1 }, { x: 2, y: 2 }, { x: 3, y: 3 }] },
  frames: { containerApps: { x: 5, y: 5, width: 5, height: 5 } },
};

describe("blendPlacement", () => {
  it("takes the target stage and mixes what both layouts hold", () => {
    const half = blendPlacement(from, to, 0.5);
    expect(half.viewBox).toBe(to.viewBox);
    expect(half.blocks.battery).toEqual({ x: 10, y: 20, width: 20, height: 30 });
    expect(half.arrows.batteryToHub).toEqual([{ x: 10, y: 10 }, { x: 25, y: 10 }]);
  });

  it("keeps what only one layout holds where it is", () => {
    const half = blendPlacement(from, to, 0.5);
    expect(half.blocks.gateway).toEqual(from.blocks.gateway);
    expect(half.frames.azure).toEqual(from.frames.azure);
    expect(half.frames.containerApps).toEqual(to.frames.containerApps);
    expect(half.arrows.gatewayToHub).toBe(to.arrows.gatewayToHub);
  });

  it("uses the target points when the point counts differ", () => {
    const mismatch = blendPlacement({ ...from, arrows: { batteryToHub: [{ x: 0, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 2 }] } }, to, 0.5);
    expect(mismatch.arrows.batteryToHub).toBe(to.arrows.batteryToHub);
  });
});

describe("separateRectangles", () => {
  const bounds = { x: 0, y: 0, width: 100, height: 100 };

  it("pushes a rectangle below one it overlaps", () => {
    const placed = separateRectangles([{ x: 10, y: 10, width: 30, height: 10 }, { x: 15, y: 12, width: 30, height: 10 }], bounds, 2);
    expect(placed[0].y).toBe(10);
    expect(placed[1].y).toBe(22);
  });

  it("keeps rectangles that do not touch in place", () => {
    const placed = separateRectangles([{ x: 10, y: 10, width: 10, height: 10 }, { x: 60, y: 10, width: 10, height: 10 }], bounds, 2);
    expect(placed.map((rectangle) => rectangle.y)).toEqual([10, 10]);
  });

  it("keeps a rectangle inside the bounds with the margin", () => {
    const placed = separateRectangles([{ x: -50, y: 300, width: 40, height: 10 }, { x: 95, y: -20, width: 40, height: 10 }], bounds, 4);
    expect(placed[0]).toEqual({ x: 4, y: 86, width: 40, height: 10 });
    expect(placed[1]).toEqual({ x: 56, y: 4, width: 40, height: 10 });
  });

  it("avoids obstacles without returning them", () => {
    const placed = separateRectangles([{ x: 10, y: 10, width: 30, height: 10 }], bounds, 2, [{ x: 0, y: 5, width: 50, height: 10 }]);
    expect(placed).toHaveLength(1);
    expect(placed[0].y).toBe(17);
  });
});
