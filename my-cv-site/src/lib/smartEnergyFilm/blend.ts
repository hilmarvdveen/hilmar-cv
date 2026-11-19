import type { Point } from "@/lib/flowLayout";
import type { Placement, Rectangle } from "./layout";

const mix = (from: number, to: number, share: number): number => from + (to - from) * share;

const blendRectangle = (from: Rectangle, to: Rectangle, share: number): Rectangle => ({
  x: mix(from.x, to.x, share),
  y: mix(from.y, to.y, share),
  width: mix(from.width, to.width, share),
  height: mix(from.height, to.height, share),
});

const blendPoints = (from: readonly Point[], to: readonly Point[], share: number): readonly Point[] =>
  from.length === to.length ? to.map((point, index) => ({ x: mix(from[index].x, point.x, share), y: mix(from[index].y, point.y, share) })) : to;

const blendRecord = <Key extends string, Value>(
  from: Partial<Record<Key, Value>>,
  to: Partial<Record<Key, Value>>,
  blend: (start: Value, end: Value) => Value,
): Partial<Record<Key, Value>> => {
  const keys = [...new Set([...Object.keys(from), ...Object.keys(to)])] as Key[];
  return Object.fromEntries(
    keys.map((key) => {
      const start = from[key];
      const end = to[key];
      return [key, start !== undefined && end !== undefined ? blend(start, end) : (end ?? start)];
    }),
  ) as Partial<Record<Key, Value>>;
};

export const blendPlacement = (from: Placement, to: Placement, share: number): Placement => ({
  viewBox: to.viewBox,
  blocks: blendRecord(from.blocks, to.blocks, (start, end) => blendRectangle(start, end, share)),
  arrows: blendRecord(from.arrows, to.arrows, (start, end) => blendPoints(start, end, share)),
  frames: blendRecord(from.frames, to.frames, (start, end) => blendRectangle(start, end, share)),
});

export const separateRectangles = (
  rectangles: readonly Rectangle[],
  bounds: Rectangle,
  margin: number,
  obstacles: readonly Rectangle[] = [],
): readonly Rectangle[] => {
  const placed: Rectangle[] = [...obstacles];
  for (const rectangle of rectangles) {
    const left = Math.min(Math.max(rectangle.x, bounds.x + margin), bounds.x + bounds.width - margin - rectangle.width);
    let top = rectangle.y;
    for (const other of placed) {
      const overlapsHorizontally = left < other.x + other.width + margin && left + rectangle.width + margin > other.x;
      const overlapsVertically = top < other.y + other.height + margin && top + rectangle.height + margin > other.y;
      if (overlapsHorizontally && overlapsVertically) {
        top = other.y + other.height + margin;
      }
    }
    placed.push({ ...rectangle, x: left, y: Math.min(Math.max(top, bounds.y + margin), bounds.y + bounds.height - margin - rectangle.height) });
  }
  return placed.slice(obstacles.length);
};
