import type { FrameId, LineKind, Orientation } from "./layout";

export const COLOURS = {
  navy: "#12314e",
  emeraldText: "#065f46",
  emeraldLine: "#059669",
  gray: "#374151",
  grayLine: "#6b7280",
  storeFill: "#f8fafc",
  computeFill: "#ffffff",
  stage: "#f9fafb",
  white: "#ffffff",
} as const;

export const FADED_OPACITY = 0.8;

export const STROKE_UNIT: Record<Orientation, number> = { landscape: 2, portrait: 1.2 };

export const FRAME_STYLES: Record<FrameId, { fill: string; stroke: string; strokeWidthRatio: number }> = {
  azure: { fill: "#f3f4f6", stroke: COLOURS.grayLine, strokeWidthRatio: 1.5 },
  containerApps: { fill: "#ecfdf5", stroke: COLOURS.emeraldLine, strokeWidthRatio: 1 },
};

export const LINE_STYLES: Record<LineKind, { colour: string; dashRatio?: readonly number[] }> = {
  telemetry: { colour: COLOURS.grayLine },
  commands: { colour: COLOURS.grayLine, dashRatio: [2.8, 2.8] },
  control: { colour: COLOURS.grayLine, dashRatio: [0.4, 2.4] },
  reads: { colour: COLOURS.grayLine, dashRatio: [2.8, 1.4, 0.4, 1.4] },
};

export const dashPattern = (kind: LineKind, strokeWidth: number): string | undefined =>
  LINE_STYLES[kind].dashRatio?.map((ratio) => Number((ratio * strokeWidth).toFixed(2))).join(" ");

export const ACTIVE_LINE_COLOUR = COLOURS.emeraldLine;

export const BLOCK_STYLE = {
  computeFill: COLOURS.computeFill,
  storeFill: COLOURS.storeFill,
  stroke: COLOURS.grayLine,
  outline: COLOURS.emeraldLine,
  titleColour: COLOURS.navy,
  noteColour: COLOURS.gray,
  radiusRatio: 7,
  strokeRatio: 1.25,
  outlineRatio: 2.5,
  dashRatio: [5, 3.5],
} as const;

export const CHIP_STYLE = {
  fill: COLOURS.white,
  stroke: COLOURS.emeraldLine,
  textColour: COLOURS.emeraldText,
  radiusRatio: 0.5,
  paddingRatio: 0.5,
  strokeRatio: 1,
} as const;

export const PLATE_STYLE = {
  fill: COLOURS.white,
  textColour: COLOURS.gray,
  emphasisedTextColour: COLOURS.emeraldText,
  radiusRatio: 0.5,
  paddingRatio: 0.45,
} as const;

export const BADGE_STYLE = {
  strongFill: COLOURS.emeraldText,
  weakFill: COLOURS.grayLine,
  textColour: COLOURS.white,
  ringColour: COLOURS.white,
  radiusRatio: 0.8,
} as const;
