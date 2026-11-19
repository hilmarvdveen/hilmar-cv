import type { ReactNode } from "react";
import type { Point } from "@/lib/flowLayout";
import { polylinePath } from "@/lib/smartEnergyExplainer/drawing";
import type { FrameId } from "@/lib/smartEnergyFilm/layout";
import {
  ACTIVE_LINE_COLOUR,
  BLOCK_STYLE,
  COLOURS,
  FRAME_STYLES,
  LINE_STYLES,
  PLATE_STYLE,
  dashPattern,
} from "@/lib/smartEnergyFilm/tokens";

export const NAVY = COLOURS.navy;
export const EMERALD_TEXT = COLOURS.emeraldText;
export const EMERALD_LINE = COLOURS.emeraldLine;
export const GRAY = COLOURS.gray;
export const SLATE_LINE = COLOURS.grayLine;
export const STORE_FILL = COLOURS.storeFill;
export const WHITE = COLOURS.white;

export const VIEW_WIDTH = 360;
export const MARGIN = 6;
export const CONTENT_WIDTH = VIEW_WIDTH - MARGIN * 2;
export const SMALL_SIZE = 12;
export const TITLE_SIZE = 13;
export const LINE_HEIGHT = 17;
export const BOX_PADDING = 10;
export const STROKE = 2;
export const PHONE_WIDTH = 358;
export const MINIMUM_RENDERED_SIZE = 11;

const CHARACTER_WIDTH = 0.6;
const FRAME_INSET = 12;
const LABEL_PADDING = 4;
const PLATE_GAP = 8;

export const renderedSize = (fontUnits: number, viewBoxWidth: number, renderedWidth: number = PHONE_WIDTH): number =>
  (fontUnits * renderedWidth) / viewBoxWidth;

export const minimumFontUnits = (viewBoxWidth: number): number => (viewBoxWidth * MINIMUM_RENDERED_SIZE) / PHONE_WIDTH;

export const textWidth = (text: string, size: number): number => text.length * size * CHARACTER_WIDTH;

export const wrapText = (text: string, maxWidth: number, size: number): string[] => {
  const lines: string[] = [];
  let current = "";
  for (const word of text.split(" ")) {
    const candidate = current === "" ? word : `${current} ${word}`;
    if (current !== "" && textWidth(candidate, size) > maxWidth) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  lines.push(current);
  return lines;
};

type Tone = "slate" | "emerald";

const TONE_COLOUR: Record<Tone, string> = { slate: LINE_STYLES.telemetry.colour, emerald: ACTIVE_LINE_COLOUR };

type BoxContent = { title?: string; notes?: readonly string[]; highlights?: readonly string[] };

type BoxLine = { text: string; size: number; weight: number; colour: string };

const boxLines = (width: number, { title, notes = [], highlights = [] }: BoxContent): BoxLine[] => {
  const inner = width - BOX_PADDING * 2;
  const titleLines = (title === undefined ? [] : wrapText(title, inner, TITLE_SIZE)).map((text) => ({ text, size: TITLE_SIZE, weight: 700, colour: BLOCK_STYLE.titleColour }));
  const noteLines = notes.flatMap((note) => wrapText(note, inner, SMALL_SIZE)).map((text) => ({ text, size: SMALL_SIZE, weight: 500, colour: BLOCK_STYLE.noteColour }));
  const highlightLines = highlights
    .flatMap((note) => wrapText(note, inner, SMALL_SIZE))
    .map((text) => ({ text, size: SMALL_SIZE, weight: 600, colour: EMERALD_TEXT }));
  return [...titleLines, ...noteLines, ...highlightLines];
};

export const boxHeight = (width: number, content: BoxContent): number => boxLines(width, content).length * LINE_HEIGHT + BOX_PADDING * 2;

type BoxProps = BoxContent & {
  x: number;
  y: number;
  width: number;
  height?: number;
  store?: boolean;
  dashed?: boolean;
  emphasised?: boolean;
};

export function Box({ x, y, width, height, store = false, dashed = false, emphasised = false, ...content }: BoxProps) {
  const lines = boxLines(width, content);
  const fullHeight = height ?? boxHeight(width, content);
  const first = y + (fullHeight - lines.length * LINE_HEIGHT) / 2 + LINE_HEIGHT / 2;
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={fullHeight}
        rx={STROKE * BLOCK_STYLE.radiusRatio}
        fill={store ? BLOCK_STYLE.storeFill : BLOCK_STYLE.computeFill}
        stroke={emphasised ? BLOCK_STYLE.outline : BLOCK_STYLE.stroke}
        strokeWidth={BLOCK_STYLE.strokeRatio * STROKE}
        strokeDasharray={dashed ? BLOCK_STYLE.dashRatio.map((ratio) => ratio * STROKE).join(" ") : undefined}
      />
      {lines.map((line, index) => (
        <text
          key={`${line.text}-${index}`}
          x={x + width / 2}
          y={first + index * LINE_HEIGHT}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={line.size}
          fontWeight={line.weight}
          fill={line.colour}
        >
          {line.text}
        </text>
      ))}
    </g>
  );
}

export const frameHeader = (width: number, title: string): number =>
  (wrapText(title, width - FRAME_INSET * 2, TITLE_SIZE).length - 0.5) * LINE_HEIGHT + PLATE_GAP;

type FrameProps = { x: number; y: number; width: number; height: number; title: string; dashed?: boolean; frame?: FrameId };

export function Frame({ x, y, width, height, title, dashed = false, frame = "azure" }: FrameProps) {
  const lines = wrapText(title, width - FRAME_INSET * 2, TITLE_SIZE);
  const style = FRAME_STYLES[frame];
  const strokeWidth = STROKE * style.strokeWidthRatio;
  const plateWidth = Math.max(...lines.map((line) => textWidth(line, TITLE_SIZE))) + TITLE_SIZE * PLATE_STYLE.paddingRatio * 2;
  const plateHeight = lines.length * LINE_HEIGHT;
  const plateTop = y - LINE_HEIGHT / 2;
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={BLOCK_STYLE.radiusRatio * STROKE + 2}
        fill={style.fill}
        stroke={style.stroke}
        strokeWidth={strokeWidth}
        strokeDasharray={dashed ? BLOCK_STYLE.dashRatio.map((ratio) => ratio * STROKE).join(" ") : undefined}
      />
      <rect
        x={x + FRAME_INSET - TITLE_SIZE * PLATE_STYLE.paddingRatio}
        y={plateTop}
        width={plateWidth}
        height={plateHeight}
        rx={LINE_HEIGHT * PLATE_STYLE.radiusRatio}
        fill={PLATE_STYLE.fill}
      />
      {lines.map((line, index) => (
        <text
          key={`${line}-${index}`}
          x={x + FRAME_INSET}
          y={plateTop + LINE_HEIGHT / 2 + index * LINE_HEIGHT}
          dominantBaseline="central"
          fontSize={TITLE_SIZE}
          fontWeight={700}
          fill={PLATE_STYLE.textColour}
        >
          {line}
        </text>
      ))}
    </g>
  );
}

export function ArrowMarkers({ prefix }: { prefix: string }) {
  return (
    <defs>
      {(Object.keys(TONE_COLOUR) as Tone[]).map((tone) => (
        <marker key={tone} id={`${prefix}-arrow-${tone}`} viewBox="0 0 10 10" refX="10" refY="5" markerWidth="5" markerHeight="5" orient="auto">
          <path d="M0 0L10 5L0 10z" fill={TONE_COLOUR[tone]} />
        </marker>
      ))}
    </defs>
  );
}

type ConnectorProps = { prefix: string; points: readonly Point[]; tone?: Tone; arrow?: boolean; dashed?: boolean };

export function Connector({ prefix, points, tone = "slate", arrow = true, dashed = false }: ConnectorProps) {
  return (
    <path
      d={polylinePath(points)}
      fill="none"
      stroke={TONE_COLOUR[tone]}
      strokeWidth={STROKE}
      strokeLinejoin="round"
      strokeDasharray={dashed ? dashPattern("commands", STROKE) : undefined}
      markerEnd={arrow ? `url(#${prefix}-arrow-${tone})` : undefined}
    />
  );
}

type LabelProps = {
  x: number;
  y: number;
  text: string;
  maxWidth: number;
  anchor?: "start" | "middle" | "end";
  emphasised?: boolean;
};

export function Label({ x, y, text, maxWidth, anchor = "start", emphasised = false }: LabelProps) {
  const lines = wrapText(text, maxWidth, SMALL_SIZE);
  const width = Math.max(...lines.map((line) => textWidth(line, SMALL_SIZE))) + LABEL_PADDING * 2;
  const height = lines.length * LINE_HEIGHT;
  const left = anchor === "start" ? x - LABEL_PADDING : anchor === "end" ? x - width + LABEL_PADDING : x - width / 2;
  const first = y - height / 2 + LINE_HEIGHT / 2;
  return (
    <g>
      <rect x={left} y={y - height / 2} width={width} height={height} rx={height * PLATE_STYLE.radiusRatio} fill={PLATE_STYLE.fill} />
      {lines.map((line, index) => (
        <text
          key={`${line}-${index}`}
          x={x}
          y={first + index * LINE_HEIGHT}
          textAnchor={anchor}
          dominantBaseline="central"
          fontSize={SMALL_SIZE}
          fontWeight={600}
          fill={emphasised ? PLATE_STYLE.emphasisedTextColour : PLATE_STYLE.textColour}
        >
          {line}
        </text>
      ))}
    </g>
  );
}

type FigureFrameProps = { prefix: string; height: number; width?: number; caption: string; steps: readonly string[]; stepsLabel?: string; children: ReactNode };

export function FigureFrame({ prefix, height, width = VIEW_WIDTH, caption, steps, stepsLabel, children }: FigureFrameProps) {
  return (
    <figure className="my-10">
      <svg aria-hidden="true" viewBox={`0 0 ${width} ${height}`} width="100%" className="mx-auto block h-auto w-full max-w-md">
        <ArrowMarkers prefix={prefix} />
        {children}
      </svg>
      <figcaption className="mt-4 text-left text-sm text-gray-600">{caption}</figcaption>
      <ol aria-label={stepsLabel} className="sr-only">
        {steps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
    </figure>
  );
}
