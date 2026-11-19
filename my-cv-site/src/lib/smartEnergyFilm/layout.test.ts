import {
  ARROWS,
  BLOCKS,
  CHIPS,
  FOCUS_LAYOUTS,
  FRAMES,
  PLATE_INSET,
  SAFETY_PANELS,
  TEXT_SIZES,
  chipPoint,
  chipRectangle,
  framePlate,
  sceneGeometry,
  type ArrowId,
  type ChipId,
  type Rectangle,
  type Placement,
} from "./layout";

const whole = FOCUS_LAYOUTS.whole.landscape;

describe("whole layout", () => {
  it("is the current drawing of eleven blocks, thirteen arrows and two frames", () => {
    expect(Object.keys(whole.blocks)).toHaveLength(BLOCKS.length);
    expect(Object.keys(whole.arrows)).toHaveLength(ARROWS.length);
    expect(FRAMES.map((frame) => frame.id)).toEqual(["azure", "containerApps"]);
    expect(whole.frames.azure).toEqual({ x: 252, y: 40, width: 596, height: 795 });
  });

  it("enters the queue on the right so a chip can sit under it", () => {
    const arrow = ARROWS.find((candidate) => candidate.id === "steeringToQueue");
    expect(arrow?.points.at(-1)).toEqual({ x: 780, y: 210 });
  });
});

describe("focus layouts", () => {
  it("keeps every block, frame and arrow point inside its stage", () => {
    for (const [name, byOrientation] of Object.entries(FOCUS_LAYOUTS)) {
      for (const placement of Object.values(byOrientation)) {
        const { viewBox } = placement;
        for (const rectangle of [...Object.values(placement.blocks), ...Object.values(placement.frames)]) {
          expect(rectangle.x, name).toBeGreaterThanOrEqual(0);
          expect(rectangle.y, name).toBeGreaterThanOrEqual(0);
          expect(rectangle.x + rectangle.width, name).toBeLessThanOrEqual(viewBox.width);
          expect(rectangle.y + rectangle.height, name).toBeLessThanOrEqual(viewBox.height);
        }
        for (const points of Object.values(placement.arrows)) {
          for (const point of points) {
            expect(point.x).toBeGreaterThanOrEqual(0);
            expect(point.x).toBeLessThanOrEqual(viewBox.width);
            expect(point.y).toBeGreaterThanOrEqual(0);
            expect(point.y).toBeLessThanOrEqual(viewBox.height);
          }
        }
      }
    }
  });

  it("never lets two blocks of one layout overlap", () => {
    for (const byOrientation of Object.values(FOCUS_LAYOUTS)) {
      for (const placement of Object.values(byOrientation)) {
        const rectangles = Object.values(placement.blocks);
        rectangles.forEach((first, index) => {
          rectangles.slice(index + 1).forEach((second) => {
            const apart =
              first.x + first.width <= second.x ||
              second.x + second.width <= first.x ||
              first.y + first.height <= second.y ||
              second.y + second.height <= first.y;
            expect(apart).toBe(true);
          });
        });
      }
    }
  });

  it("nests Container Apps inside Azure where both frames exist", () => {
    for (const layout of [FOCUS_LAYOUTS.reading, FOCUS_LAYOUTS.command, FOCUS_LAYOUTS.customer]) {
      for (const placement of Object.values(layout)) {
        const azure = placement.frames.azure;
        const containers = placement.frames.containerApps;
        if (azure && containers) {
          expect(containers.x).toBeGreaterThan(azure.x);
          expect(containers.y).toBeGreaterThan(azure.y);
          expect(containers.x + containers.width).toBeLessThan(azure.x + azure.width);
          expect(containers.y + containers.height).toBeLessThan(azure.y + azure.height);
        }
      }
    }
    expect(FOCUS_LAYOUTS.reading.landscape.frames.azure).toBeDefined();
  });

  it("makes the focus layouts larger than the same blocks in the whole drawing", () => {
    const area = (rectangle?: { width: number; height: number }) => (rectangle ? rectangle.width * rectangle.height : 0);
    expect(area(FOCUS_LAYOUTS.reading.landscape.blocks.gateway)).toBeGreaterThan(area(whole.blocks.gateway));
    expect(area(FOCUS_LAYOUTS.customer.landscape.blocks.api)).toBeGreaterThan(area(whole.blocks.api));
  });

  it("gives the safety panel room for four cells in landscape and one in portrait", () => {
    expect(Object.keys(SAFETY_PANELS.landscape.origins)).toHaveLength(4);
    expect(SAFETY_PANELS.portrait.scale * 270).toBeLessThanOrEqual(320);
    expect(SAFETY_PANELS.portrait.origins.duplicate).toEqual(SAFETY_PANELS.portrait.origins.audit);
  });

  it("sets the portrait text at 14 or more", () => {
    expect(TEXT_SIZES.portrait.small).toBeGreaterThanOrEqual(14);
    expect(TEXT_SIZES.portrait.title).toBeGreaterThanOrEqual(14);
  });
});

describe("frame plate", () => {
  it("sits on the border line at the start or the end", () => {
    const frame = { x: 100, y: 50, width: 400, height: 300 };
    expect(framePlate(frame, "start")).toEqual({ at: { x: 100 + PLATE_INSET, y: 50 }, anchor: "start" });
    expect(framePlate(frame, "end")).toEqual({ at: { x: 500 - PLATE_INSET, y: 50 }, anchor: "end" });
  });
});

describe("frame plate spots", () => {
  const texts = { azure: "Azure", containerApps: "Container Apps" };
  const geometryOf = (placement: Placement, badges: readonly { arrow: ArrowId; reverse: boolean }[] = []) =>
    sceneGeometry({ placement, settled: placement, orientation: "landscape", frameTexts: texts, chips: [], badges });

  it("keeps each plate on its own frame border", () => {
    for (const placement of [whole, FOCUS_LAYOUTS.command.landscape, FOCUS_LAYOUTS.reading.landscape]) {
      for (const plate of geometryOf(placement).plates) {
        const frame = placement.frames[plate.id] as Rectangle;
        expect([frame.y, frame.y + frame.height]).toContain(plate.at.y);
      }
    }
  });

  it("still places every badge when an arrow holds more badges than it has room for", () => {
    const crowded = Array.from({ length: 12 }, () => ({ arrow: "gatewayToDatabase" as ArrowId, reverse: false }));
    const { badges } = geometryOf(whole, crowded);
    expect(badges).toHaveLength(12);
    for (const badge of badges) {
      expect(Number.isFinite(badge.x) && Number.isFinite(badge.y)).toBe(true);
    }
  });

  it("places a badge beside its arrow and apart from a block", () => {
    const { badges, badgeRadius } = geometryOf(whole, [{ arrow: "gatewayToDatabase", reverse: false }]);
    expect(Math.abs(badges[0].x - 445)).toBeGreaterThan(badgeRadius);
    expect(badges[0].y).toBeGreaterThan(390 + badgeRadius * 1.5);
    expect(badges[0].y).toBeLessThan(700 - badgeRadius * 1.5);
  });

  it("puts two hops on one arrow on different sides when there is room", () => {
    const { badges } = geometryOf(whole, [
      { arrow: "gatewayToDatabase", reverse: false },
      { arrow: "gatewayToDatabase", reverse: true },
    ]);
    expect(Math.hypot(badges[0].x - badges[1].x, badges[0].y - badges[1].y)).toBeGreaterThan(TEXT_SIZES.landscape.small * 1.6);
  });
});

describe("chips", () => {
  it("anchors the seventeen frozen chips", () => {
    expect(Object.keys(CHIPS) as ChipId[]).toHaveLength(17);
  });

  it("resolves an anchor point whenever the anchor is drawn and null when it is not", () => {
    expect(chipPoint("queueProOnly", whole)).toEqual({ x: 705, y: 100 });
    expect(chipPoint("kedaProOnly", whole)).toEqual({ x: 290, y: 345 });
    expect(chipPoint("queueLengthLever", whole)).toEqual({ x: 830, y: 155 });
    expect(chipPoint("databaseTier", whole)).toEqual({ x: 820, y: 750 });
    expect(chipPoint("keyVault", whole)).toEqual({ x: 848 - PLATE_INSET, y: 835 });
    expect(chipPoint("deviceKey", whole)).toEqual({ x: 235, y: 145 });
    expect(chipPoint("queueProOnly", FOCUS_LAYOUTS.reading.landscape)).toBeNull();
    expect(chipPoint("deviceKey", FOCUS_LAYOUTS.customer.landscape)).toBeNull();
    expect(chipPoint("keyVault", FOCUS_LAYOUTS.safety.landscape)).toBeNull();
  });

  it("places a chip beside a vertical arrow and above or below a horizontal one", () => {
    const size = { width: 100, height: 20, gap: 10 };
    expect(chipRectangle("token", whole, size)).toEqual({ x: 732, y: 425, width: 100, height: 20 });
    expect(chipRectangle("hubIdentity", whole, size)).toEqual({ x: 290, y: 230, width: 100, height: 20 });
    expect(chipRectangle("deviceKey", whole, size)).toEqual({ x: 185, y: 115, width: 100, height: 20 });
    expect(chipRectangle("contentPolicy", whole, size)).toEqual({ x: 810, y: 540, width: 100, height: 20 });
  });

  it("places a chip on a block at its side and on a frame at its bottom border", () => {
    const size = { width: 100, height: 20, gap: 10 };
    expect(chipRectangle("replicasLever", whole, size)).toEqual({ x: 180, y: 335, width: 100, height: 20 });
    expect(chipRectangle("serviceBusPremium", whole, size)).toEqual({ x: 655, y: 70, width: 100, height: 20 });
    expect(chipRectangle("databaseTier", whole, size)).toEqual({ x: 830, y: 740, width: 100, height: 20 });
    expect(chipRectangle("keyVault", whole, size)).toEqual({ x: 724, y: 825, width: 100, height: 20 });
    const empty: Placement = { viewBox: whole.viewBox, blocks: {}, arrows: {}, frames: {} };
    expect(chipRectangle("token", empty, size)).toBeNull();
  });
});
