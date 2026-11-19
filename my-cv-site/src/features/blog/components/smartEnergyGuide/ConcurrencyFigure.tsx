import type { ReactNode } from "react";
import type { Locale } from "@/lib/seo";
import { CONCURRENCY_LABELS as LABELS, pick, pickAll } from "./labels";
import {
  Box,
  CONTENT_WIDTH,
  Connector,
  EMERALD_LINE,
  FigureFrame,
  LINE_HEIGHT,
  Label,
  MARGIN,
  SLATE_LINE,
  SMALL_SIZE,
  STROKE,
  WHITE,
  wrapText,
} from "./primitives";

const PREFIX = "concurrency";
const AXIS_Y = 14;
const FIRST_LANE_TOP = 40;
const LANE_GAP = 22;
const TRACK_HEIGHT = 30;
const TITLE_GAP = 4;
const NOTE_GAP = 6;
const BLOCK_WIDTH = 40;
const GATEWAY_BLOCKS = 6;
const TICK_COUNT = 29;
const TICK_HEIGHT = 18;
const DOT_RADIUS = 4;
const ANNOTATION_INDENT = 16;

type Lane = { title: string; note?: string; annotations: readonly string[]; track: (top: number) => ReactNode };

const noteLines = (note: string | undefined): number => (note === undefined ? 0 : wrapText(note, CONTENT_WIDTH, SMALL_SIZE).length);

const laneHeight = (lane: Lane): number =>
  LINE_HEIGHT +
  TITLE_GAP +
  TRACK_HEIGHT +
  (lane.note === undefined ? 0 : NOTE_GAP + noteLines(lane.note) * LINE_HEIGHT) +
  lane.annotations.length * LINE_HEIGHT;

function Baseline({ top }: { top: number }) {
  return <path d={`M${MARGIN} ${top + TRACK_HEIGHT / 2}H${MARGIN + CONTENT_WIDTH}`} stroke={SLATE_LINE} strokeWidth={1} strokeDasharray="2 4" fill="none" />;
}

function Block({ x, top, emphasised = false }: { x: number; top: number; emphasised?: boolean }) {
  return (
    <rect
      x={x}
      y={top}
      width={BLOCK_WIDTH}
      height={TRACK_HEIGHT}
      rx={8}
      fill={WHITE}
      stroke={emphasised ? EMERALD_LINE : SLATE_LINE}
      strokeWidth={STROKE}
    />
  );
}

const gatewayBlockStep = (CONTENT_WIDTH - BLOCK_WIDTH) / (GATEWAY_BLOCKS - 1);

const tickPath = (top: number): string =>
  Array.from({ length: TICK_COUNT }, (_, index) => {
    const x = MARGIN + (index * CONTENT_WIDTH) / (TICK_COUNT - 1);
    return `M${x} ${top + (TRACK_HEIGHT - TICK_HEIGHT) / 2}V${top + (TRACK_HEIGHT + TICK_HEIGHT) / 2}`;
  }).join("");

export function ConcurrencyFigure({ locale }: { locale: Locale }) {
  const lanes: Lane[] = [
    {
      title: pick(LABELS.devices, locale),
      annotations: [],
      track: (top) => <Box x={MARGIN} y={top} width={CONTENT_WIDTH} height={TRACK_HEIGHT} store title={pick(LABELS.devicesNote, locale)} />,
    },
    {
      title: pick(LABELS.gateway, locale),
      note: pick(LABELS.gatewayNote, locale),
      annotations: [],
      track: (top) => (
        <>
          <Baseline top={top} />
          {Array.from({ length: GATEWAY_BLOCKS }, (_, index) => (
            <Block key={index} x={MARGIN + index * gatewayBlockStep} top={top} />
          ))}
        </>
      ),
    },
    {
      title: pick(LABELS.steering, locale),
      note: pick(LABELS.steeringNote, locale),
      annotations: [pick(LABELS.steeringAnnotation, locale)],
      track: (top) => (
        <>
          <Baseline top={top} />
          <Block x={MARGIN} top={top} emphasised />
        </>
      ),
    },
    {
      title: pick(LABELS.dashboard, locale),
      note: pick(LABELS.dashboardNote, locale),
      annotations: pickAll(LABELS.dashboardAnnotations, locale),
      track: (top) => (
        <>
          <Baseline top={top} />
          <path d={tickPath(top)} stroke={SLATE_LINE} strokeWidth={STROKE} fill="none" />
        </>
      ),
    },
  ];

  let cursor = FIRST_LANE_TOP;
  const placed = lanes.map((lane) => {
    const top = cursor;
    cursor += laneHeight(lane) + LANE_GAP;
    return { lane, top };
  });
  const height = cursor - LANE_GAP + MARGIN;
  const middle = MARGIN + CONTENT_WIDTH / 2;

  return (
    <FigureFrame prefix={PREFIX} height={height} caption={pick(LABELS.caption, locale)} steps={pickAll(LABELS.steps, locale)}>
      <Connector prefix={PREFIX} points={[{ x: MARGIN, y: AXIS_Y }, { x: MARGIN + CONTENT_WIDTH, y: AXIS_Y }]} />
      <Label x={middle} y={AXIS_Y} text={pick(LABELS.axis, locale)} maxWidth={CONTENT_WIDTH} anchor="middle" />
      {placed.map(({ lane, top }) => {
        const trackTop = top + LINE_HEIGHT + TITLE_GAP;
        const noteTop = trackTop + TRACK_HEIGHT + NOTE_GAP;
        const annotationTop = lane.note === undefined ? noteTop - NOTE_GAP : noteTop + noteLines(lane.note) * LINE_HEIGHT;
        return (
          <g key={lane.title}>
            <Label x={MARGIN} y={top + LINE_HEIGHT / 2} text={lane.title} maxWidth={CONTENT_WIDTH} />
            {lane.track(trackTop)}
            {lane.note !== undefined && (
              <Label x={MARGIN} y={noteTop + (noteLines(lane.note) * LINE_HEIGHT) / 2} text={lane.note} maxWidth={CONTENT_WIDTH} />
            )}
            {lane.annotations.map((annotation, index) => {
              const centre = annotationTop + index * LINE_HEIGHT + LINE_HEIGHT / 2;
              return (
                <g key={annotation}>
                  <circle cx={MARGIN + DOT_RADIUS} cy={centre} r={DOT_RADIUS} fill={EMERALD_LINE} />
                  <Label x={MARGIN + ANNOTATION_INDENT} y={centre} text={annotation} maxWidth={CONTENT_WIDTH - ANNOTATION_INDENT} emphasised />
                </g>
              );
            })}
          </g>
        );
      })}
    </FigureFrame>
  );
}
