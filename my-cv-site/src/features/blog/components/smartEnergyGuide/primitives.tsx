import type { ReactNode } from "react";
import type { Point } from "@/lib/flowLayout";
import { polylinePath } from "@/lib/smartEnergyExplainer/drawing";

export const NAVY = "#12314e";
export const EMERALD_TEXT = "#047857";
export const EMERALD_LINE = "#059669";
export const GRAY = "#374151";
export const SLATE_LINE = "#6b7280";
export const STORE_FILL = "#f9fafb";
export const WHITE = "#ffffff";

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

const TONE_COLOUR: Record<Tone, string> = { slate: SLATE_LINE, emerald: EMERALD_LINE };

type BoxContent = { title?: string; notes?: readonly string[]; highlights?: readonly string[] };

type BoxLine = { text: string; size: number; weight: number; colour: string };

const boxLines = (width: number, { title, notes = [], highlights = [] }: BoxContent): BoxLine[] => {
  const inner = width - BOX_PADDING * 2;
  const titleLines = (title === undefined ? [] : wrapText(title, inner, TITLE_SIZE)).map((text) => ({ text, size: TITLE_SIZE, weight: 700, colour: NAVY }));
  const noteLines = notes.flatMap((note) => wrapText(note, inner, SMALL_SIZE)).map((text) => ({ text, size: SMALL_SIZE, weight: 500, colour: GRAY }));
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
        rx={12}
        fill={store ? STORE_FILL : WHITE}
        stroke={emphasised ? EMERALD_LINE : SLATE_LINE}
        strokeWidth={STROKE}
        strokeDasharray={dashed ? "6 4" : undefined}
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
  wrapText(title, width - FRAME_INSET * 2, TITLE_SIZE).length * LINE_HEIGHT + BOX_PADDING * 2;

type FrameProps = { x: number; y: number; width: number; height: number; title: string; dashed?: boolean };

export function Frame({ x, y, width, height, title, dashed = false }: FrameProps) {
  const lines = wrapText(title, width - FRAME_INSET * 2, TITLE_SIZE);
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={16}
        fill="none"
        stroke={SLATE_LINE}
        strokeWidth={STROKE}
        strokeDasharray={dashed ? "6 4" : undefined}
      />
      {lines.map((line, index) => (
        <text
          key={`${line}-${index}`}
          x={x + FRAME_INSET}
          y={y + BOX_PADDING + LINE_HEIGHT / 2 + index * LINE_HEIGHT}
          dominantBaseline="central"
          fontSize={TITLE_SIZE}
          fontWeight={700}
          fill={GRAY}
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
      strokeDasharray={dashed ? "6 4" : undefined}
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
      <rect x={left} y={y - height / 2} width={width} height={height} rx={4} fill={WHITE} />
      {lines.map((line, index) => (
        <text
          key={`${line}-${index}`}
          x={x}
          y={first + index * LINE_HEIGHT}
          textAnchor={anchor}
          dominantBaseline="central"
          fontSize={SMALL_SIZE}
          fontWeight={600}
          fill={emphasised ? EMERALD_TEXT : GRAY}
        >
          {line}
        </text>
      ))}
    </g>
  );
}

type FigureFrameProps = { prefix: string; height: number; caption: string; steps: readonly string[]; children: ReactNode };

export function FigureFrame({ prefix, height, caption, steps, children }: FigureFrameProps) {
  return (
    <figure className="my-10">
      <svg aria-hidden="true" viewBox={`0 0 ${VIEW_WIDTH} ${height}`} width="100%" className="mx-auto block h-auto w-full max-w-md">
        <ArrowMarkers prefix={prefix} />
        {children}
      </svg>
      <figcaption className="mt-4 text-left text-sm text-gray-600">{caption}</figcaption>
      <ol className="sr-only">
        {steps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
    </figure>
  );
}
