import { BEATS, FILM_TABS, beatEndState, hopNumbers } from "@/lib/smartEnergyFilm/film";
import { FOCUS_LAYOUTS, chipPoint, sceneGeometry, type ArrowId, type ChipId, type Orientation, type Point, type Rectangle } from "@/lib/smartEnergyFilm/layout";
import { smartEnergyFilmLabels } from "../smartEnergyFilmLabels";

const distanceToRectangle = (point: Point, rectangle: Rectangle): number =>
  Math.hypot(
    Math.max(rectangle.x - point.x, 0, point.x - rectangle.x - rectangle.width),
    Math.max(rectangle.y - point.y, 0, point.y - rectangle.y - rectangle.height),
  );

const intersects = (first: Rectangle, second: Rectangle): boolean =>
  first.x < second.x + second.width && first.x + first.width > second.x && first.y < second.y + second.height && first.y + first.height > second.y;

const grown = (rectangle: Rectangle, amount: number): Rectangle => ({
  x: rectangle.x - amount,
  y: rectangle.y - amount,
  width: rectangle.width + amount * 2,
  height: rectangle.height + amount * 2,
});

const contains = (outer: Rectangle, inner: Rectangle): boolean =>
  inner.x >= outer.x && inner.y >= outer.y && inner.x + inner.width <= outer.x + outer.width && inner.y + inner.height <= outer.y + outer.height;

const distanceToBorder = (point: Point, rectangle: Rectangle): number => {
  const inside = point.x >= rectangle.x && point.x <= rectangle.x + rectangle.width && point.y >= rectangle.y && point.y <= rectangle.y + rectangle.height;
  return inside
    ? Math.min(point.x - rectangle.x, rectangle.x + rectangle.width - point.x, point.y - rectangle.y, rectangle.y + rectangle.height - point.y)
    : distanceToRectangle(point, rectangle);
};

const batteryArrows: readonly ArrowId[] = ["batteryToHub", "hubToBattery"];

const maximumChipDistance: Record<Orientation, number> = { landscape: 160, portrait: 100 };

const orientations: readonly Orientation[] = ["landscape", "portrait"];

const violationsOf = (locale: "en" | "nl", orientation: Orientation): string[] => {
  const labels = smartEnergyFilmLabels(locale);
  const found: string[] = [];
  for (const tab of FILM_TABS) {
    BEATS[tab].forEach((beat, beatIndex) => {
      const where = `${locale} ${orientation} ${tab}/${beat.id}`;
      const state = beatEndState(tab, beatIndex);
      const placement = FOCUS_LAYOUTS[beat.layout][orientation];
      const badges = hopNumbers(tab, beatIndex).filter((item) => placement.arrows[item.arrow]);
      const geometry = sceneGeometry({
        placement,
        settled: placement,
        orientation,
        frameTexts: tab === "cloud" ? labels.cloudFrames : labels.frames,
        chips: state.chips.map((id) => ({ id, text: labels.chips[id] })),
        badges,
      });
      const radius = geometry.badgeRadius;
      const required = radius + radius / 2;
      const blocks = Object.entries(placement.blocks) as [string, Rectangle][];
      const plates = geometry.plates;
      const chips = Object.entries(geometry.chips) as [string, Rectangle][];
      geometry.badges.forEach((badge, index) => {
        const name = `badge ${badges[index].number}`;
        for (const [id, block] of blocks) {
          if (distanceToRectangle(badge, block) < required) {
            found.push(`${where} ${name} too close to block ${id}`);
          }
        }
        for (const plate of plates) {
          if (distanceToRectangle(badge, plate.rect) < required) {
            found.push(`${where} ${name} too close to plate ${plate.id}`);
          }
        }
        for (const [id, chip] of chips) {
          if (distanceToRectangle(badge, chip) < required) {
            found.push(`${where} ${name} too close to chip ${id}`);
          }
        }
        geometry.badges.slice(index + 1).forEach((other, offset) => {
          if (Math.hypot(badge.x - other.x, badge.y - other.y) < radius * 2 + radius / 2) {
            found.push(`${where} ${name} too close to badge ${badges[index + offset + 1].number}`);
          }
        });
      });
      const gap = radius / 2;
      const frames = Object.entries(placement.frames) as [string, Rectangle][];
      geometry.badges.forEach((badge, index) => {
        for (const [id, frame] of frames) {
          if (batteryArrows.includes(badges[index].arrow) && distanceToBorder(badge, frame) < radius) {
            found.push(`${where} badge ${badges[index].number} sits on the ${id} frame line`);
          }
        }
      });
      chips.forEach(([id, chip], index) => {
        for (const [blockId, block] of blocks) {
          if (intersects(chip, grown(block, gap))) {
            found.push(`${where} chip ${id} too close to block ${blockId}`);
          }
        }
        for (const plate of plates) {
          if (intersects(chip, grown(plate.rect, gap))) {
            found.push(`${where} chip ${id} too close to plate ${plate.id}`);
          }
        }
        for (const [otherId, other] of chips.slice(index + 1)) {
          if (intersects(chip, grown(other, gap))) {
            found.push(`${where} chip ${id} too close to chip ${otherId}`);
          }
        }
        for (const [frameId, frame] of frames) {
          if (!contains(grown(frame, -gap), chip) && intersects(chip, grown(frame, gap))) {
            found.push(`${where} chip ${id} crosses the ${frameId} frame line`);
          }
        }
        const anchor = chipPoint(id as ChipId, placement) as Point;
        if (distanceToRectangle(anchor, chip) > maximumChipDistance[orientation]) {
          found.push(`${where} chip ${id} sits too far from its anchor`);
        }
      });
      plates.forEach((plate) => {
        for (const [id, block] of blocks) {
          if (intersects(plate.rect, block)) {
            found.push(`${where} plate ${plate.id} overlaps block ${id}`);
          }
        }
        for (const [id, chip] of chips) {
          if (intersects(plate.rect, chip)) {
            found.push(`${where} plate ${plate.id} overlaps chip ${id}`);
          }
        }
        for (const other of plates.filter((candidate) => candidate.id !== plate.id)) {
          if (intersects(plate.rect, other.rect)) {
            found.push(`${where} plate ${plate.id} overlaps plate ${other.id}`);
          }
        }
        const frame = placement.frames[plate.id] as Rectangle;
        const onBorder = Math.abs(plate.at.y - frame.y) < 0.001 || Math.abs(plate.at.y - (frame.y + frame.height)) < 0.001;
        if (!onBorder) {
          found.push(`${where} plate ${plate.id} is off its frame border`);
        }
        if (plate.rect.x < placement.viewBox.x || plate.rect.x + plate.rect.width > placement.viewBox.x + placement.viewBox.width) {
          found.push(`${where} plate ${plate.id} leaves the stage`);
        }
      });
    });
  }
  return found;
};

describe("poster scene geometry", () => {
  for (const locale of ["en", "nl"] as const) {
    for (const orientation of orientations) {
      it(`keeps badges, chips and plates apart in ${locale} ${orientation}`, () => {
        expect(violationsOf(locale, orientation)).toEqual([]);
      });
    }
  }
});
