import type { ReactNode } from "react";
import type { Point } from "@/lib/flowLayout";
import { pointAlongPolyline, polylinePath } from "@/lib/smartEnergyExplainer/drawing";
import type { FilmFrame } from "@/lib/smartEnergyFilm/film";
import {
  ARROWS,
  BLOCKS,
  FRAMES,
  JOURNEYS,
  POSTER_SIZE,
  SAFETY_CELLS,
  SAFETY_MECHANISMS,
  SAFETY_PANEL,
  SAFETY_ZOOM,
  SCALE_TAGS,
  SHIELDS,
  SMALL_SIZE,
  TITLE_SIZE,
  ZERO_BADGES,
  ZERO_BADGE_RADIUS,
  cameraHeight,
  rectangleVisibility,
  stageHeight,
  type Annotation as AnnotationPlace,
  type ArrowId,
  type Block,
  type BlockId,
  type LineKind,
  type PosterArrow,
  type PosterFrame,
  type Rectangle,
  type SafetyMechanism,
} from "@/lib/smartEnergyFilm/layout";
import type { SmartEnergyFilmLabels } from "../smartEnergyFilmLabels";

export type PosterChrome = "film" | "stage";

type PosterProps = { frame: FilmFrame; labels: SmartEnergyFilmLabels };

const NAVY = "#12314e";
const EMERALD_TEXT = "#047857";
const EMERALD_LINE = "#059669";
const GRAY = "#374151";
const GRAY_LINE = "#6b7280";
const STORE_FILL = "#f8fafc";
const STAGE_BACKGROUND = "#f9fafb";
const WHITE = "#ffffff";
const DIMMED = 0.55;
const DOT_RADIUS = 4;
const LABEL_GAP = 12;
const KNOCKOUT_WIDTH = 10;
const SAFETY_TITLE_SIZE = TITLE_SIZE / SAFETY_ZOOM;
const SAFETY_SMALL_SIZE = SMALL_SIZE / SAFETY_ZOOM;

export const ACTIVE_LINE_COLOUR = EMERALD_LINE;

export const LINE_STYLES: Record<LineKind, { colour: string; dash?: string }> = {
  telemetry: { colour: GRAY_LINE },
  reads: { colour: GRAY_LINE },
  commands: { colour: GRAY_LINE, dash: "14 14" },
  control: { colour: GRAY_LINE, dash: "2 12" },
};

const MARKERS = [
  { name: "slate", colour: GRAY_LINE },
  { name: "emerald", colour: EMERALD_LINE },
];

const activeArrows = (frame: FilmFrame): ReadonlySet<ArrowId> | null =>
  frame.journey ? new Set(JOURNEYS[frame.journey.id].map((hop) => hop.arrow)) : null;

const activeBlocks = (frame: FilmFrame): ReadonlySet<BlockId> | null => {
  const arrows = activeArrows(frame);
  if (arrows === null) {
    return null;
  }
  return new Set(ARROWS.filter((arrow) => arrows.has(arrow.id)).flatMap((arrow) => arrow.ends));
};

type LabelProps = { x: number; y: number; anchor: "start" | "end"; colour?: string; weight?: number; children: ReactNode };

function Label({ x, y, anchor, colour = GRAY, weight = 600, children }: LabelProps) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      dominantBaseline="central"
      fontSize={SMALL_SIZE}
      fontWeight={weight}
      fill={colour}
      stroke={STAGE_BACKGROUND}
      strokeWidth={KNOCKOUT_WIDTH}
      strokeLinejoin="round"
      paintOrder="stroke"
    >
      {children}
    </text>
  );
}

function Annotation({ place, text }: { place: AnnotationPlace; text: string }) {
  const start = place.side === "start";
  return (
    <g>
      <circle cx={place.at.x} cy={place.at.y} r={DOT_RADIUS} fill={EMERALD_LINE} />
      <Label x={start ? place.at.x + LABEL_GAP : place.at.x - LABEL_GAP} y={place.at.y} anchor={place.side}>
        {text}
      </Label>
    </g>
  );
}

const frameEmphasis = (frame: FilmFrame, box: PosterFrame) => {
  const inCloud = frame.sceneId === "cloud" || frame.sceneId === "end";
  return { inCloud, emphasised: inCloud && box.id === "containerApps" };
};

function FrameBox({ frame, box }: { frame: FilmFrame; box: PosterFrame }) {
  const { emphasised } = frameEmphasis(frame, box);
  return <rect x={box.x} y={box.y} width={box.width} height={box.height} rx={18} fill="none" stroke={emphasised ? EMERALD_LINE : GRAY_LINE} strokeWidth={2.5} />;
}

const PLATE_PADDING = 10;

const PLATE_CHARACTER_WIDTH = 0.6;

function FrameLabel({ frame, labels, box }: PosterProps & { box: PosterFrame }) {
  const { inCloud, emphasised } = frameEmphasis(frame, box);
  const text = inCloud ? labels.cloudFrames[box.id] : labels.frames[box.id];
  const width = text.length * SMALL_SIZE * PLATE_CHARACTER_WIDTH + PLATE_PADDING * 2;
  const height = SMALL_SIZE + PLATE_PADDING;
  const left = box.labelAnchor === "start" ? box.labelAt.x - PLATE_PADDING : box.labelAt.x - width + PLATE_PADDING;
  return (
    <g>
      <rect x={left} y={box.labelAt.y - height / 2} width={width} height={height} rx={height / 2} fill={STAGE_BACKGROUND} />
      <Label x={box.labelAt.x} y={box.labelAt.y} anchor={box.labelAnchor} colour={emphasised ? EMERALD_TEXT : GRAY} weight={700}>
        {text}
      </Label>
    </g>
  );
}

const FLOW_SPEED = 0.09;

const FLOW_PERIOD = 28;

type ArrowLineProps = { arrow: PosterArrow; active: boolean; dimmed: boolean; flowing: boolean; elapsed: number; visibility: number };

function ArrowLine({ arrow, active, dimmed, flowing, elapsed, visibility }: ArrowLineProps) {
  const style = LINE_STYLES[arrow.kind];
  const shift = -((elapsed * FLOW_SPEED) % FLOW_PERIOD);
  return (
    <g>
      <path
        d={polylinePath(arrow.points)}
        fill="none"
        stroke={active ? ACTIVE_LINE_COLOUR : style.colour}
        strokeWidth={5}
        strokeLinecap="round"
        strokeDasharray={style.dash}
        strokeDashoffset={style.dash && flowing ? shift : undefined}
        markerEnd={`url(#film-arrow-${active ? "emerald" : "slate"})`}
        opacity={(dimmed ? DIMMED : 1) * visibility}
      />
      {flowing && !style.dash && (
        <path
          d={polylinePath(arrow.points)}
          fill="none"
          stroke={WHITE}
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeDasharray={`6 ${FLOW_PERIOD - 6}`}
          strokeDashoffset={shift}
          opacity={0.9 * visibility}
        />
      )}
    </g>
  );
}

const LINE_HEIGHT = 38;

type BlockBoxProps = { block: Block; labels: SmartEnergyFilmLabels; dimmed: boolean; active: boolean; lit: boolean; visibility: number };

function BlockBox({ block, labels, dimmed, active, lit, visibility }: BlockBoxProps) {
  const text = labels.blocks[block.id];
  const lines = text.note ? [...text.title, text.note] : text.title;
  const top = block.y + block.height / 2 - ((lines.length - 1) * LINE_HEIGHT) / 2;
  return (
    <g opacity={(dimmed ? DIMMED : 1) * visibility}>
      <rect
        x={block.x}
        y={block.y}
        width={block.width}
        height={block.height}
        rx={14}
        fill={block.tone === "compute" ? WHITE : STORE_FILL}
        stroke={active ? EMERALD_LINE : GRAY_LINE}
        strokeWidth={lit ? 5 : 2.5}
        strokeDasharray={block.dashed ? "10 7" : undefined}
      />
      {lines.map((line, index) => {
        const isNote = Boolean(text.note) && index === lines.length - 1;
        return (
          <text
            key={line}
            x={block.x + block.width / 2}
            y={top + index * LINE_HEIGHT}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={isNote ? SMALL_SIZE : TITLE_SIZE}
            fontWeight={isNote ? 600 : 700}
            fill={isNote ? (active ? EMERALD_TEXT : GRAY) : NAVY}
          >
            {line}
          </text>
        );
      })}
    </g>
  );
}

const hopLabelPoint = (arrow: PosterArrow, reverse: boolean): Point => {
  const middle = arrow.hopAt ?? pointAlongPolyline(arrow.points, 0.5);
  if (!reverse) {
    return middle;
  }
  const [first, second] = arrow.points;
  return first.y === second.y ? { x: middle.x, y: middle.y + 44 } : { x: middle.x + 44, y: middle.y };
};

function HopNumbers({ frame }: { frame: FilmFrame }) {
  const journey = frame.journey;
  if (journey === null) {
    return null;
  }
  return (
    <>
      {JOURNEYS[journey.id].slice(0, journey.hopsShown).map((hop, index) => {
        const arrow = ARROWS.find((candidate) => candidate.id === hop.arrow) as PosterArrow;
        const at = hopLabelPoint(arrow, Boolean(hop.reverse));
        const active = index === journey.activeHop;
        return (
          <g key={`${hop.arrow}-${index}`}>
            <circle cx={at.x} cy={at.y} r={21} fill={active ? EMERALD_TEXT : GRAY} stroke={WHITE} strokeWidth={3} />
            <text x={at.x} y={at.y} textAnchor="middle" dominantBaseline="central" fontSize={SMALL_SIZE} fontWeight={800} fill={WHITE}>
              {index + 1}
            </text>
          </g>
        );
      })}
    </>
  );
}

function Packet({ frame }: { frame: FilmFrame }) {
  const journey = frame.journey;
  if (journey === null) {
    return null;
  }
  const arrow = ARROWS.find((candidate) => candidate.id === journey.packet.arrow) as PosterArrow;
  const at = pointAlongPolyline(arrow.points, journey.packet.fraction);
  return <circle cx={at.x} cy={at.y} r={13} fill={ACTIVE_LINE_COLOUR} stroke={WHITE} strokeWidth={4} />;
}

const blockById = (id: BlockId): Block => BLOCKS.find((block) => block.id === id) as Block;

const NEXT_BLOCKS: readonly BlockId[] = ["planner", "gateway", "dashboard"];

function ScaleBehind({ frame }: { frame: FilmFrame }) {
  if (frame.scale?.beat !== "out") {
    return null;
  }
  const gateway = blockById("gateway");
  const ghosts = frame.scale.progress >= 0.6 ? 2 : frame.scale.progress >= 0.3 ? 1 : 0;
  return (
    <>
      {Array.from({ length: ghosts }, (_, index) => (
        <rect
          key={index}
          x={gateway.x + 16 * (ghosts - index)}
          y={gateway.y - 16 * (ghosts - index)}
          width={gateway.width}
          height={gateway.height}
          rx={14}
          fill={WHITE}
          stroke={EMERALD_LINE}
          strokeWidth={2.5}
          strokeDasharray="10 7"
        />
      ))}
    </>
  );
}

function ScaleFront({ frame, labels }: PosterProps) {
  const scale = frame.scale;
  if (scale === null) {
    return null;
  }
  if (scale.beat === "out") {
    const queue = blockById("serviceBus");
    return (
      <>
        <rect x={queue.x + 20} y={queue.y + queue.height - 16} width={(queue.width - 40) * scale.progress} height={8} rx={4} fill={EMERALD_LINE} />
        <Annotation place={SCALE_TAGS.queue} text={labels.scaleTags.queue} />
        <Annotation place={SCALE_TAGS.replicas} text={labels.scaleTags.replicas} />
      </>
    );
  }
  if (scale.beat === "up") {
    return (
      <g opacity={scale.progress}>
        <Annotation place={SCALE_TAGS.iotHub} text={labels.scaleTags.iotHub} />
        <Annotation place={SCALE_TAGS.serviceBus} text={labels.scaleTags.serviceBus} />
        <Annotation place={SCALE_TAGS.database} text={labels.scaleTags.database} />
      </g>
    );
  }
  if (scale.beat === "down") {
    return (
      <g opacity={scale.progress}>
        {Object.entries(ZERO_BADGES).map(([id, at]) => (
          <g key={id}>
            <circle cx={at.x} cy={at.y} r={ZERO_BADGE_RADIUS} fill={EMERALD_TEXT} stroke={WHITE} strokeWidth={3} />
            <text x={at.x} y={at.y} textAnchor="middle" dominantBaseline="central" fontSize={SMALL_SIZE} fontWeight={800} fill={WHITE}>
              {labels.scaleTags.zero}
            </text>
          </g>
        ))}
      </g>
    );
  }
  return (
    <g opacity={scale.progress}>
      {NEXT_BLOCKS.map((id) => {
        const block = blockById(id);
        return (
          <rect key={id} x={block.x - 9} y={block.y - 9} width={block.width + 18} height={block.height + 18} rx={18} fill="none" stroke={EMERALD_LINE} strokeWidth={4} strokeDasharray="12 8" />
        );
      })}
    </g>
  );
}

const scaledDown = (frame: FilmFrame, id: BlockId): boolean =>
  frame.scale?.beat === "down" && frame.scale.progress >= 0.5 && Object.hasOwn(ZERO_BADGES, id);

function Shields({ frame, labels }: PosterProps) {
  return (
    <>
      {SHIELDS.slice(0, frame.shieldsShown).map((shield) => (
        <Annotation key={shield.id} place={shield} text={labels.shields[shield.id]} />
      ))}
    </>
  );
}

type CellProps = { labels: SmartEnergyFilmLabels; cell: Rectangle; progress: number };

function DuplicateCell({ labels, cell, progress }: CellProps) {
  const first = cell.x + 22 + 108 * Math.min(1, progress / 0.4);
  const secondArrive = progress < 0.4 ? null : cell.x + 22 + 108 * Math.min(1, (progress - 0.4) / 0.3);
  const second = progress >= 0.7 ? cell.x + 130 - 80 * Math.min(1, (progress - 0.7) / 0.3) : secondArrive;
  return (
    <g>
      <rect x={cell.x + 140} y={cell.y + 44} width={120} height={84} rx={10} fill={STORE_FILL} stroke={GRAY_LINE} strokeWidth={2} />
      {labels.safety.duplicateKey.map((line, index) => (
        <text key={line} x={cell.x + 200} y={cell.y + 70 + index * 30} textAnchor="middle" dominantBaseline="central" fontSize={SAFETY_SMALL_SIZE} fontWeight={700} fill={NAVY}>
          {line}
        </text>
      ))}
      <circle cx={first} cy={cell.y + 70} r={10} fill={EMERALD_LINE} />
      {second !== null && <circle cx={second} cy={cell.y + 102} r={10} fill={GRAY} />}
      {progress >= 0.7 && (
        <text x={cell.x + 200} y={cell.y + 160} textAnchor="middle" dominantBaseline="central" fontSize={SAFETY_SMALL_SIZE} fontWeight={800} fill={EMERALD_TEXT}>
          {labels.safety.duplicateResult}
        </text>
      )}
    </g>
  );
}

function RaceCell({ labels, cell, progress }: CellProps) {
  return (
    <g>
      <text x={cell.x + 14} y={cell.y + 76} dominantBaseline="central" fontSize={SAFETY_SMALL_SIZE} fontWeight={700} fill={EMERALD_TEXT} opacity={progress >= 0.25 ? 1 : DIMMED}>
        {labels.safety.raceWinner}
      </text>
      <text x={cell.x + 14} y={cell.y + 124} dominantBaseline="central" fontSize={SAFETY_SMALL_SIZE} fontWeight={700} fill={GRAY} opacity={progress >= 0.6 ? 1 : DIMMED}>
        {labels.safety.raceLoser}
      </text>
      {progress >= 0.6 && <path d={`M${cell.x + 14} ${cell.y + 124} h214`} stroke={GRAY_LINE} strokeWidth={2} />}
    </g>
  );
}

function LockCell({ labels, cell, progress }: CellProps) {
  const done = progress >= 0.75;
  return (
    <g>
      <rect x={cell.x + 60} y={cell.y + 44} width={150} height={44} rx={22} fill={WHITE} stroke={EMERALD_LINE} strokeWidth={2} />
      <text x={cell.x + 135} y={cell.y + 66} textAnchor="middle" dominantBaseline="central" fontSize={SAFETY_SMALL_SIZE} fontWeight={700} fill={EMERALD_TEXT}>
        {labels.safety.lockName}
      </text>
      <rect x={cell.x + 14} y={cell.y + 110} width={110} height={44} rx={10} fill={WHITE} stroke={done ? GRAY_LINE : EMERALD_LINE} strokeWidth={done ? 1.5 : 3} />
      <text x={cell.x + 69} y={cell.y + 132} textAnchor="middle" dominantBaseline="central" fontSize={SAFETY_SMALL_SIZE} fontWeight={700} fill={NAVY}>
        {labels.safety.lockFirst}
      </text>
      <rect x={cell.x + 146} y={cell.y + 110} width={110} height={44} rx={10} fill={WHITE} stroke={done ? EMERALD_LINE : GRAY_LINE} strokeWidth={done ? 3 : 2} strokeDasharray={done ? undefined : "6 4"} />
      <text x={cell.x + 201} y={cell.y + 132} textAnchor="middle" dominantBaseline="central" fontSize={SAFETY_SMALL_SIZE} fontWeight={700} fill={NAVY}>
        {labels.safety.lockSecond}
      </text>
      <text x={cell.x + 201} y={cell.y + 176} textAnchor="middle" dominantBaseline="central" fontSize={SAFETY_SMALL_SIZE} fontWeight={600} fill={done ? EMERALD_TEXT : GRAY}>
        {done ? labels.safety.lockDone : labels.safety.lockWaits}
      </text>
    </g>
  );
}

function AuditCell({ labels, cell, progress }: CellProps) {
  return (
    <g>
      <rect x={cell.x + 14} y={cell.y + 40} width={242} height={112} rx={12} fill="none" stroke={EMERALD_LINE} strokeWidth={3} strokeDasharray="8 6" opacity={progress >= 0.1 ? 1 : DIMMED} />
      <text x={cell.x + 135} y={cell.y + 72} textAnchor="middle" dominantBaseline="central" fontSize={SAFETY_SMALL_SIZE} fontWeight={700} fill={NAVY} opacity={progress >= 0.2 ? 1 : DIMMED}>
        {labels.safety.auditChange}
      </text>
      <text x={cell.x + 135} y={cell.y + 118} textAnchor="middle" dominantBaseline="central" fontSize={SAFETY_SMALL_SIZE} fontWeight={700} fill={NAVY} opacity={progress >= 0.5 ? 1 : DIMMED}>
        {labels.safety.auditRow}
      </text>
      <text x={cell.x + 135} y={cell.y + 176} textAnchor="middle" dominantBaseline="central" fontSize={SAFETY_SMALL_SIZE} fontWeight={700} fill={EMERALD_TEXT} opacity={progress >= 0.8 ? 1 : DIMMED}>
        {labels.safety.auditTransaction}
      </text>
    </g>
  );
}

const CELLS: Record<SafetyMechanism, (props: CellProps) => ReactNode> = {
  duplicate: DuplicateCell,
  race: RaceCell,
  lock: LockCell,
  audit: AuditCell,
};

function SafetyPanel({ frame, labels }: PosterProps) {
  if (frame.sceneId !== "safety") {
    return null;
  }
  return (
    <g>
      <rect x={0} y={0} width={POSTER_SIZE} height={POSTER_SIZE} fill={STAGE_BACKGROUND} opacity={0.8} />
      <rect x={SAFETY_PANEL.x} y={SAFETY_PANEL.y} width={SAFETY_PANEL.width} height={SAFETY_PANEL.height} rx={18} fill={WHITE} stroke={GRAY_LINE} strokeWidth={2.5} />
      <text x={SAFETY_PANEL.x + 20} y={SAFETY_PANEL.y + 28} dominantBaseline="central" fontSize={SAFETY_TITLE_SIZE} fontWeight={800} fill={NAVY}>
        {labels.safety.title}
      </text>
      {SAFETY_MECHANISMS.map((mechanism, index) => {
        const cell = SAFETY_CELLS[mechanism];
        const safety = frame.safety;
        const finished = safety?.finished.includes(mechanism) ?? false;
        const active = safety?.mechanism === mechanism;
        const progress = finished ? 1 : active ? (safety?.progress ?? 0) : 0;
        const Cell = CELLS[mechanism];
        return (
          <g key={mechanism} opacity={finished || active ? 1 : DIMMED}>
            <rect x={cell.x} y={cell.y} width={cell.width} height={cell.height} rx={12} fill={WHITE} stroke={active ? EMERALD_LINE : GRAY_LINE} strokeWidth={active ? 3 : 1.5} />
            <text x={cell.x + 14} y={cell.y + 20} dominantBaseline="central" fontSize={SAFETY_SMALL_SIZE} fontWeight={800} fill={GRAY}>
              {`${index + 1}. ${labels.safety.mechanisms[index]}`}
            </text>
            <Cell labels={labels} cell={cell} progress={progress} />
          </g>
        );
      })}
    </g>
  );
}

const arrowVisibility = (arrow: PosterArrow, frame: FilmFrame): number =>
  Math.min(...arrow.ends.map((end) => rectangleVisibility(blockById(end), frame.camera)));

export function SmartEnergyFilmPoster({ frame, labels, chrome = "film" }: PosterProps & { chrome?: PosterChrome }) {
  const { camera } = frame;
  const arrows = activeArrows(frame);
  const blocks = activeBlocks(frame);
  const journey = frame.journey;
  const staged = chrome === "stage";
  const viewHeight = staged ? stageHeight(camera) : cameraHeight(camera);
  const clipIdentifier = `film-stage-${chrome}`;
  const accessibility = staged ? { "aria-hidden": true } : { role: "img", "aria-label": labels.titleCard.headline };
  return (
    <svg {...accessibility} viewBox={`${camera.x} ${camera.y} ${camera.width} ${viewHeight}`} className="block h-full w-full">
      <defs>
        {MARKERS.map((marker) => (
          <marker key={marker.name} id={`film-arrow-${marker.name}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
            <path d="M0 0L10 5L0 10z" fill={marker.colour} />
          </marker>
        ))}
        <clipPath id={clipIdentifier}>
          <rect x={camera.x} y={camera.y} width={camera.width} height={viewHeight} />
        </clipPath>
      </defs>
      <rect x={-POSTER_SIZE} y={-POSTER_SIZE} width={POSTER_SIZE * 3} height={POSTER_SIZE * 3} fill={STAGE_BACKGROUND} />
      <g clipPath={`url(#${clipIdentifier})`}>
      {FRAMES.map((box) => (
        <FrameBox key={box.id} frame={frame} box={box} />
      ))}
      {ARROWS.map((arrow) => {
        const active = arrows !== null && arrows.has(arrow.id);
        return (
          <ArrowLine key={arrow.id} arrow={arrow} active={active} dimmed={arrows !== null && !active} flowing={arrows === null || active} elapsed={frame.elapsed} visibility={arrowVisibility(arrow, frame)} />
        );
      })}
      {FRAMES.map((box) => (
        <FrameLabel key={box.id} frame={frame} labels={labels} box={box} />
      ))}
      <Packet frame={frame} />
      <ScaleBehind frame={frame} />
      {BLOCKS.map((block) => (
        <BlockBox
          key={block.id}
          block={block}
          labels={labels}
          dimmed={(blocks !== null && !blocks.has(block.id)) || scaledDown(frame, block.id)}
          active={blocks !== null && blocks.has(block.id)}
          lit={journey !== null && ARROWS.find((arrow) => arrow.id === JOURNEYS[journey.id][journey.activeHop].arrow)?.ends.includes(block.id) === true}
          visibility={rectangleVisibility(block, camera)}
        />
      ))}
      <HopNumbers frame={frame} />
      <ScaleFront frame={frame} labels={labels} />
      <Shields frame={frame} labels={labels} />
      <SafetyPanel frame={frame} labels={labels} />
      </g>
    </svg>
  );
}
