import { useId, type ReactNode } from "react";
import type { Point } from "@/lib/flowLayout";
import { pointAlongPolyline, polylinePath } from "@/lib/smartEnergyExplainer/drawing";
import { easeInOut, progressBetween } from "@/lib/smartEnergyExplainer/frame";
import { blendPlacement } from "@/lib/smartEnergyFilm/blend";
import { arrowsAtFullStrength, hopNumbers, type BeatRenderState } from "@/lib/smartEnergyFilm/film";
import {
  ARROWS,
  LINE_PITCH,
  BLOCKS,
  FOCUS_LAYOUTS,
  SAFETY_CELL_SIZE,
  SAFETY_MECHANISMS,
  SAFETY_PANELS,
  TEXT_SIZES,
  chipPoint,
  sceneGeometry,
  type ArrowId,
  type BlockId,
  type FrameId,
  type Orientation,
  type Placement,
  type Rectangle,
  type SceneGeometry,
  type SafetyMechanism,
} from "@/lib/smartEnergyFilm/layout";
import {
  ACTIVE_LINE_COLOUR,
  BADGE_STYLE,
  BLOCK_STYLE,
  CHIP_STYLE,
  COLOURS,
  FADED_OPACITY,
  FRAME_STYLES,
  LINE_STYLES,
  PLATE_STYLE,
  STROKE_UNIT,
  dashPattern,
} from "@/lib/smartEnergyFilm/tokens";
import type { SmartEnergyFilmLabels } from "../smartEnergyFilmLabels";

export type SmartEnergyFilmPosterProps = {
  state: BeatRenderState;
  labels: SmartEnergyFilmLabels;
  orientation: Orientation;
  reducedMotion?: boolean;
  still?: boolean;
  accessibleLabel?: string;
};

const MARKERS = [
  { name: "slate", colour: LINE_STYLES.telemetry.colour },
  { name: "emerald", colour: ACTIVE_LINE_COLOUR },
];

const FLOW_SPEED = 0.09;

const FLOW_PERIOD = 28;

const LINE_HEIGHT = 1.2;

const BLOCK_PADDING = 6;

const CHIP_APPEAR_FROM = 0.1;

const CHIP_APPEAR_TO = 0.3;

const rectangleOf = (box: Rectangle | undefined): Rectangle => box as Rectangle;

type Look = {
  orientation: Orientation;
  unit: number;
  title: number;
  small: number;
  chip: number;
  motion: boolean;
  reducedMotion: boolean;
  transition: string | undefined;
};

type Scene = {
  state: BeatRenderState;
  labels: SmartEnergyFilmLabels;
  placement: Placement;
  look: Look;
  markerPrefix: string;
  presence: (id: BlockId) => number;
  framePresence: (id: FrameId) => number;
  arrowFactor: (id: ArrowId) => number;
  geometry: SceneGeometry;
  badgeItems: ReturnType<typeof hopNumbers>;
};

const arrowPresence = (scene: Scene, arrowId: ArrowId): number => {
  const arrow = ARROWS.find((candidate) => candidate.id === arrowId) as (typeof ARROWS)[number];
  return Math.min(...arrow.ends.map((end) => scene.presence(end))) * scene.arrowFactor(arrowId);
};

function FrameLayer({ scene }: { scene: Scene }) {
  const { state, placement, look } = scene;
  const inCloud = state.tab === "cloud";
  const emphasised = inCloud && state.beat.kind === "step";
  return (
    <>
      {(Object.keys(placement.frames) as FrameId[]).map((id) => {
        const box = rectangleOf(placement.frames[id]);
        const style = FRAME_STYLES[id];
        const strokeWidth = style.strokeWidthRatio * look.unit * (id === "containerApps" && emphasised ? 2 : 1);
        return (
          <rect
            key={id}
            x={box.x}
            y={box.y}
            width={box.width}
            height={box.height}
            rx={BLOCK_STYLE.radiusRatio * look.unit * 2}
            fill={style.fill}
            stroke={style.stroke}
            strokeWidth={strokeWidth}
            opacity={scene.framePresence(id)}
            style={{ transition: look.transition }}
          />
        );
      })}
    </>
  );
}

function PlateLayer({ scene }: { scene: Scene }) {
  const { state, look } = scene;
  return (
    <>
      {scene.geometry.plates.map(({ id, rect, text, at, anchor, fontSize }) => {
        const emphasised = state.tab === "cloud" && id === "containerApps" && state.beat.kind === "step";
        return (
          <g key={id} opacity={scene.framePresence(id)}>
            <rect
              x={rect.x}
              y={rect.y}
              width={rect.width}
              height={rect.height}
              rx={rect.height * PLATE_STYLE.radiusRatio}
              fill={PLATE_STYLE.fill}
              stroke={FRAME_STYLES[id].stroke}
              strokeWidth={look.unit}
            />
            <text
              x={at.x}
              y={at.y}
              textAnchor={anchor}
              dominantBaseline="central"
              fontSize={fontSize}
              fontWeight={700}
              fill={emphasised ? PLATE_STYLE.emphasisedTextColour : PLATE_STYLE.textColour}
            >
              {text}
            </text>
          </g>
        );
      })}
    </>
  );
}

function ArrowLayer({ scene }: { scene: Scene }) {
  const { state, placement, look } = scene;
  const fullStrength = arrowsAtFullStrength(state.tab, state.beatIndex);
  const hops = state.beat.hops.slice(0, state.hopsShown);
  const width = look.unit * 2.5;
  const shift = look.motion ? -((state.elapsedInBeat * FLOW_SPEED) % FLOW_PERIOD) : 0;
  return (
    <>
      {ARROWS.filter((arrow) => placement.arrows[arrow.id] && arrowPresence(scene, arrow.id) > 0).map((arrow) => {
        const points = placement.arrows[arrow.id] as readonly Point[];
        const traversed = hops.filter((hop) => hop.arrow === arrow.id);
        const active = traversed.length > 0;
        const reversed = traversed.some((hop) => hop.reverse);
        const strokeWidth = active && look.reducedMotion ? width * 1.8 : active ? width * 1.3 : width;
        const dash = dashPattern(arrow.kind, strokeWidth);
        const flowing = active && look.motion;
        const markers = {
          markerEnd: `url(#${scene.markerPrefix}-${active ? "emerald" : "slate"})`,
          ...(reversed ? { markerStart: `url(#${scene.markerPrefix}-emerald)` } : {}),
        };
        return (
          <g key={arrow.id} opacity={arrowPresence(scene, arrow.id) * (fullStrength.has(arrow.id) ? 1 : FADED_OPACITY)} style={{ transition: look.transition }}>
            <path
              d={polylinePath(points)}
              fill="none"
              stroke={active ? ACTIVE_LINE_COLOUR : LINE_STYLES[arrow.kind].colour}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={dash}
              strokeDashoffset={dash && flowing ? shift : undefined}
              {...markers}
            />
            {flowing && !dash && (
              <path
                d={polylinePath(points)}
                fill="none"
                stroke={COLOURS.white}
                strokeWidth={strokeWidth / 2}
                strokeLinecap="round"
                strokeDasharray={`${look.unit * 3} ${FLOW_PERIOD - look.unit * 3}`}
                strokeDashoffset={shift}
                opacity={0.9}
              />
            )}
          </g>
        );
      })}
    </>
  );
}

const fitsInside = (lineCount: number, noteCount: number, look: Look, box: Rectangle): boolean =>
  lineCount * look.title * LINE_HEIGHT + noteCount * look.small * LINE_HEIGHT + BLOCK_PADDING * look.unit <= box.height;

function BlockLayer({ scene }: { scene: Scene }) {
  const { state, labels, placement, look } = scene;
  const { beat } = state;
  const outlined = beat.kind === "orient" && beat.emphasised.size < beat.visible.size;
  const dimmedBySale = (id: BlockId): boolean => state.scale?.step === "down" && state.scale.progress >= 0.5 && beat.emphasised.has(id);
  return (
    <>
      {BLOCKS.filter((block) => placement.blocks[block.id] && scene.presence(block.id) > 0).map((block) => {
        const box = rectangleOf(placement.blocks[block.id]);
        const text = labels.blocks[block.id];
        const emphasised = beat.emphasised.has(block.id);
        const strength = beat.visible.has(block.id) && emphasised && !dimmedBySale(block.id) ? 1 : FADED_OPACITY;
        const withNote = text.note !== "" && fitsInside(text.title.length, 1, look, box);
        const stacked = fitsInside(text.title.length, withNote ? 1 : 0, look, box);
        const titles = stacked ? text.title : [text.title.join(" ")];
        const lines = withNote ? [...titles, text.note] : titles;
        const total = titles.length * look.title * LINE_HEIGHT + (withNote ? look.small * LINE_HEIGHT : 0);
        const lit = outlined && emphasised;
        let cursor = box.y + (box.height - total) / 2;
        return (
          <g key={block.id} opacity={scene.presence(block.id) * strength} style={{ transition: look.transition }}>
            <rect
              x={box.x}
              y={box.y}
              width={box.width}
              height={box.height}
              rx={BLOCK_STYLE.radiusRatio * look.unit}
              fill={block.tone === "compute" ? BLOCK_STYLE.computeFill : BLOCK_STYLE.storeFill}
              stroke={lit ? BLOCK_STYLE.outline : BLOCK_STYLE.stroke}
              strokeWidth={(lit ? BLOCK_STYLE.outlineRatio : BLOCK_STYLE.strokeRatio) * look.unit}
              strokeDasharray={block.dashed ? BLOCK_STYLE.dashRatio.map((ratio) => ratio * look.unit).join(" ") : undefined}
            />
            {lines.map((line, index) => {
              const isNote = withNote && index === lines.length - 1;
              const fontSize = isNote ? look.small : look.title;
              const y = cursor + (fontSize * LINE_HEIGHT) / 2;
              cursor += fontSize * LINE_HEIGHT;
              return (
                <text
                  key={`${line}-${index}`}
                  x={box.x + box.width / 2}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={fontSize}
                  fontWeight={isNote ? 600 : 700}
                  fill={isNote ? BLOCK_STYLE.noteColour : BLOCK_STYLE.titleColour}
                >
                  {line}
                </text>
              );
            })}
          </g>
        );
      })}
    </>
  );
}

function BadgeLayer({ scene }: { scene: Scene }) {
  const { state, look, geometry, badgeItems } = scene;
  const radius = geometry.badgeRadius;
  return (
    <>
      {badgeItems.map((item, index) => {
        if (item.current && item.indexInBeat >= state.hopsShown) {
          return null;
        }
        const at = geometry.badges[index];
        return (
          <g key={`${item.arrow}-${item.number}`} opacity={arrowPresence(scene, item.arrow)}>
            <circle cx={at.x} cy={at.y} r={radius} fill={item.current ? BADGE_STYLE.strongFill : BADGE_STYLE.weakFill} stroke={BADGE_STYLE.ringColour} strokeWidth={look.unit * 1.5} />
            <text x={at.x} y={at.y} textAnchor="middle" dominantBaseline="central" fontSize={look.small} fontWeight={800} fill={BADGE_STYLE.textColour}>
              {item.number}
            </text>
          </g>
        );
      })}
    </>
  );
}

function PacketLayer({ scene }: { scene: Scene }) {
  const { state, placement, look } = scene;
  const points = state.packet ? placement.arrows[state.packet.arrow] : undefined;
  if (!state.packet || !points || !look.motion) {
    return null;
  }
  const at = pointAlongPolyline(points, state.packet.fraction);
  return <circle cx={at.x} cy={at.y} r={look.small * 0.5} fill={ACTIVE_LINE_COLOUR} stroke={COLOURS.white} strokeWidth={look.unit * 2} />;
}

function ChipLayer({ scene }: { scene: Scene }) {
  const { state, placement, look, geometry } = scene;
  const opacity = look.motion ? easeInOut(progressBetween(state.progress, CHIP_APPEAR_FROM, CHIP_APPEAR_TO)) : 1;
  const anchored = state.chips.filter((chip) => geometry.chips[chip] !== undefined);
  return (
    <g opacity={opacity}>
      {anchored.map((chip) => {
        const box = geometry.chips[chip] as Rectangle;
        const lines = geometry.chipLines[chip] as readonly string[];
        const anchor = chipPoint(chip, placement) as Point;
        const edge = { x: Math.min(Math.max(anchor.x, box.x), box.x + box.width), y: Math.min(Math.max(anchor.y, box.y), box.y + box.height) };
        return (
          <g key={chip}>
            <path d={polylinePath([anchor, edge])} stroke={CHIP_STYLE.stroke} strokeWidth={look.unit * CHIP_STYLE.strokeRatio} fill="none" />
            <circle cx={anchor.x} cy={anchor.y} r={look.unit * 2.5} fill={CHIP_STYLE.stroke} />
            <rect
              x={box.x}
              y={box.y}
              width={box.width}
              height={box.height}
              rx={box.height * CHIP_STYLE.radiusRatio}
              fill={CHIP_STYLE.fill}
              stroke={CHIP_STYLE.stroke}
              strokeWidth={look.unit * CHIP_STYLE.strokeRatio}
            />
            {lines.map((line, index) => (
              <text
                key={line}
                x={box.x + box.width / 2}
                y={box.y + box.height / 2 + (index - (lines.length - 1) / 2) * look.chip * LINE_PITCH}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={look.chip}
                fontWeight={600}
                fill={CHIP_STYLE.textColour}
              >
                {line}
              </text>
            ))}
          </g>
        );
      })}
    </g>
  );
}

const GHOST_STEPS = [0.3, 0.6];

function ScaleLayer({ scene, behind }: { scene: Scene; behind: boolean }) {
  const { state, labels, placement, look } = scene;
  const scale = state.scale;
  if (scale === null) {
    return null;
  }
  const gateway = placement.blocks.gateway;
  const queue = placement.blocks.serviceBus;
  if (behind) {
    const ghosts = scale.step === "out" && gateway ? GHOST_STEPS.filter((threshold) => scale.progress >= threshold).length : 0;
    return (
      <>
        {Array.from({ length: ghosts }, (_, index) => (
          <rect
            key={index}
            x={(gateway as Rectangle).x + look.unit * 8 * (ghosts - index)}
            y={(gateway as Rectangle).y - look.unit * 8 * (ghosts - index)}
            width={(gateway as Rectangle).width}
            height={(gateway as Rectangle).height}
            rx={BLOCK_STYLE.radiusRatio * look.unit}
            fill={COLOURS.white}
            stroke={COLOURS.emeraldLine}
            strokeWidth={look.unit * BLOCK_STYLE.strokeRatio}
            strokeDasharray={BLOCK_STYLE.dashRatio.map((ratio) => ratio * look.unit).join(" ")}
          />
        ))}
      </>
    );
  }
  if (scale.step === "out" && queue) {
    return (
      <rect
        x={queue.x + look.unit * 10}
        y={queue.y + queue.height - look.unit * 8}
        width={(queue.width - look.unit * 20) * scale.progress}
        height={look.unit * 4}
        rx={look.unit * 2}
        fill={COLOURS.emeraldLine}
      />
    );
  }
  if (scale.step === "down") {
    return (
      <g opacity={scale.progress}>
        {(["gateway", "api", "dashboard"] as const)
          .filter((id) => placement.blocks[id])
          .map((id) => {
            const box = rectangleOf(placement.blocks[id]);
            const radius = look.small * 0.85;
            const at = { x: box.x + box.width - radius * 0.4, y: box.y + radius * 0.4 };
            return (
              <g key={id}>
                <circle cx={at.x} cy={at.y} r={radius} fill={BADGE_STYLE.strongFill} stroke={BADGE_STYLE.ringColour} strokeWidth={look.unit * 1.5} />
                <text x={at.x} y={at.y} textAnchor="middle" dominantBaseline="central" fontSize={look.small} fontWeight={800} fill={BADGE_STYLE.textColour}>
                  {labels.zero}
                </text>
              </g>
            );
          })}
      </g>
    );
  }
  if (scale.step === "next") {
    return (
      <g opacity={scale.progress}>
        {BLOCKS.filter((block) => state.beat.emphasised.has(block.id) && placement.blocks[block.id]).map((block) => {
          const box = rectangleOf(placement.blocks[block.id]);
          const grow = look.unit * 4;
          return (
            <rect
              key={block.id}
              x={box.x - grow}
              y={box.y - grow}
              width={box.width + grow * 2}
              height={box.height + grow * 2}
              rx={BLOCK_STYLE.radiusRatio * look.unit * 1.5}
              fill="none"
              stroke={COLOURS.emeraldLine}
              strokeWidth={look.unit * 2}
              strokeDasharray={BLOCK_STYLE.dashRatio.map((ratio) => ratio * look.unit * 1.5).join(" ")}
            />
          );
        })}
      </g>
    );
  }
  return null;
}

type CellProps = { labels: SmartEnergyFilmLabels; progress: number; size: number };

const CELL = SAFETY_CELL_SIZE;

function DuplicateCell({ labels, progress, size }: CellProps) {
  const first = 22 + 108 * Math.min(1, progress / 0.4);
  const secondArrive = progress < 0.4 ? null : 22 + 108 * Math.min(1, (progress - 0.4) / 0.3);
  const second = progress >= 0.7 ? 130 - 80 * Math.min(1, (progress - 0.7) / 0.3) : secondArrive;
  return (
    <g>
      <rect x={140} y={44} width={120} height={84} rx={10} fill={BLOCK_STYLE.storeFill} stroke={BLOCK_STYLE.stroke} strokeWidth={2} />
      {labels.safety.duplicateKey.map((line, index) => (
        <text key={line} x={200} y={70 + index * 30} textAnchor="middle" dominantBaseline="central" fontSize={size} fontWeight={700} fill={COLOURS.navy}>
          {line}
        </text>
      ))}
      <circle cx={first} cy={70} r={10} fill={COLOURS.emeraldLine} />
      {second !== null && <circle cx={second} cy={102} r={10} fill={COLOURS.gray} />}
      {progress >= 0.7 && (
        <text x={135} y={160} textAnchor="middle" dominantBaseline="central" fontSize={size} fontWeight={800} fill={COLOURS.emeraldText}>
          {labels.safety.duplicateResult}
        </text>
      )}
    </g>
  );
}

function RaceCell({ labels, progress, size }: CellProps) {
  return (
    <g>
      <text x={14} y={76} dominantBaseline="central" fontSize={size} fontWeight={700} fill={COLOURS.emeraldText} opacity={progress >= 0.25 ? 1 : FADED_OPACITY}>
        {labels.safety.raceWinner}
      </text>
      <text x={14} y={124} dominantBaseline="central" fontSize={size} fontWeight={700} fill={COLOURS.gray} opacity={progress >= 0.6 ? 1 : FADED_OPACITY}>
        {labels.safety.raceLoser}
      </text>
      {progress >= 0.6 && <path d="M14 124 h214" stroke={COLOURS.grayLine} strokeWidth={2} />}
    </g>
  );
}

function LockCell({ labels, progress, size }: CellProps) {
  const done = progress >= 0.75;
  return (
    <g>
      <rect x={60} y={44} width={150} height={44} rx={22} fill={COLOURS.white} stroke={COLOURS.emeraldLine} strokeWidth={2} />
      <text x={135} y={66} textAnchor="middle" dominantBaseline="central" fontSize={size} fontWeight={700} fill={COLOURS.emeraldText}>
        {labels.safety.lockName}
      </text>
      <rect x={14} y={110} width={110} height={44} rx={10} fill={COLOURS.white} stroke={done ? COLOURS.grayLine : COLOURS.emeraldLine} strokeWidth={done ? 1.5 : 3} />
      <text x={69} y={132} textAnchor="middle" dominantBaseline="central" fontSize={size} fontWeight={700} fill={COLOURS.navy}>
        {labels.safety.lockFirst}
      </text>
      <rect x={146} y={110} width={110} height={44} rx={10} fill={COLOURS.white} stroke={done ? COLOURS.emeraldLine : COLOURS.grayLine} strokeWidth={done ? 3 : 2} strokeDasharray={done ? undefined : "6 4"} />
      <text x={201} y={132} textAnchor="middle" dominantBaseline="central" fontSize={size} fontWeight={700} fill={COLOURS.navy}>
        {labels.safety.lockSecond}
      </text>
      <text x={201} y={176} textAnchor="middle" dominantBaseline="central" fontSize={size} fontWeight={600} fill={done ? COLOURS.emeraldText : COLOURS.gray}>
        {done ? labels.safety.lockDone : labels.safety.lockWaits}
      </text>
    </g>
  );
}

function AuditCell({ labels, progress, size }: CellProps) {
  return (
    <g>
      <rect x={14} y={40} width={242} height={112} rx={12} fill="none" stroke={COLOURS.emeraldLine} strokeWidth={3} strokeDasharray="8 6" opacity={progress >= 0.1 ? 1 : FADED_OPACITY} />
      <text x={135} y={72} textAnchor="middle" dominantBaseline="central" fontSize={size} fontWeight={700} fill={COLOURS.navy} opacity={progress >= 0.2 ? 1 : FADED_OPACITY}>
        {labels.safety.auditChange}
      </text>
      <text x={135} y={118} textAnchor="middle" dominantBaseline="central" fontSize={size} fontWeight={700} fill={COLOURS.navy} opacity={progress >= 0.5 ? 1 : FADED_OPACITY}>
        {labels.safety.auditRow}
      </text>
      <text x={135} y={176} textAnchor="middle" dominantBaseline="central" fontSize={size} fontWeight={700} fill={COLOURS.emeraldText} opacity={progress >= 0.8 ? 1 : FADED_OPACITY}>
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

function SafetyLayer({ scene }: { scene: Scene }) {
  const { state, labels, look } = scene;
  if (state.beat.layout !== "safety") {
    return null;
  }
  const panel = SAFETY_PANELS[look.orientation];
  const safety = state.safety;
  const landscape = look.orientation === "landscape";
  const size = look.small / panel.scale;
  return (
    <g opacity={scene.presence("database") > 0 ? 1 : 0}>
      <text x={panel.title.x} y={panel.title.y} textAnchor="middle" dominantBaseline="central" fontSize={look.title} fontWeight={800} fill={COLOURS.navy}>
        {labels.safety.title}
      </text>
      {!landscape && safety === null &&
        SAFETY_MECHANISMS.map((mechanism, index) => (
          <text
            key={mechanism}
            x={panel.listStart.x}
            y={panel.listStart.y + index * panel.listPitch}
            dominantBaseline="central"
            fontSize={look.title}
            fontWeight={700}
            fill={COLOURS.gray}
          >
            {`${index + 1}. ${labels.safety.mechanisms[index]}`}
          </text>
        ))}
      {SAFETY_MECHANISMS.map((mechanism, index) => {
        const finished = safety?.finished.includes(mechanism) ?? false;
        const active = safety?.mechanism === mechanism;
        const shown = landscape ? true : active;
        const progress = finished ? 1 : active ? (safety?.progress ?? 0) : 0;
        const Cell = CELLS[mechanism];
        const origin = panel.origins[mechanism];
        return (
          shown && (
            <g key={mechanism} transform={`translate(${origin.x} ${origin.y}) scale(${panel.scale})`} opacity={finished || active ? 1 : FADED_OPACITY}>
              <rect
                x={0}
                y={0}
                width={CELL.width}
                height={CELL.height}
                rx={12}
                fill={COLOURS.white}
                stroke={active ? COLOURS.emeraldLine : COLOURS.grayLine}
                strokeWidth={active ? 3 : 1.5}
              />
              <text x={14} y={20} dominantBaseline="central" fontSize={size} fontWeight={800} fill={COLOURS.gray}>
                {`${index + 1}. ${labels.safety.mechanisms[index]}`}
              </text>
              <Cell labels={labels} progress={progress} size={size} />
            </g>
          )
        );
      })}
    </g>
  );
}

export function SmartEnergyFilmPoster({ state, labels, orientation, reducedMotion = false, still = false, accessibleLabel }: SmartEnergyFilmPosterProps) {
  const markerPrefix = `film-arrow-${useId().replace(/:/g, "")}`;
  const target = FOCUS_LAYOUTS[state.beat.layout][orientation];
  const source = FOCUS_LAYOUTS[state.fromLayout][orientation];
  const share = state.layoutShare;
  const moving = state.fromLayout !== state.beat.layout && share < 1;
  const placement = moving ? blendPlacement(source, target, share) : target;
  const look: Look = {
    orientation,
    unit: STROKE_UNIT[orientation],
    title: TEXT_SIZES[orientation].title,
    small: TEXT_SIZES[orientation].small,
    chip: TEXT_SIZES[orientation].chip,
    motion: !still && !reducedMotion,
    reducedMotion,
    transition: still || reducedMotion ? undefined : "opacity 300ms",
  };
  const presenceOf = (visible: boolean, inTarget: boolean, inSource: boolean): number => {
    if (visible) {
      return !inSource && moving ? share : 1;
    }
    return inSource && !inTarget && moving ? 1 - share : 0;
  };
  const badgeItems = hopNumbers(state.tab, state.beatIndex).filter((item) => placement.arrows[item.arrow]);
  const scene: Scene = {
    state,
    labels,
    placement,
    look,
    badgeItems,
    geometry: sceneGeometry({
      placement,
      settled: target,
      orientation,
      frameTexts: state.tab === "cloud" ? labels.cloudFrames : labels.frames,
      chips: state.chips.map((id) => ({ id, text: labels.chips[id] })),
      badges: badgeItems,
    }),
    markerPrefix,
    presence: (id) => presenceOf(state.beat.visible.has(id), id in target.blocks, id in source.blocks),
    framePresence: (id) => {
      if (!moving) {
        return id in target.frames ? 1 : 0;
      }
      return id in target.frames && id in source.frames ? 1 : id in target.frames ? share : 1 - share;
    },
    arrowFactor: (id) => (moving && !(id in target.arrows) ? 1 - share : 1),
  };
  const accessibility = accessibleLabel ? { role: "img", "aria-label": accessibleLabel } : { "aria-hidden": true };
  const viewBox = placement.viewBox;
  return (
    <svg {...accessibility} viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`} className="block h-full w-full">
      <defs>
        {MARKERS.map((marker) => (
          <marker key={marker.name} id={`${markerPrefix}-${marker.name}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
            <path d="M0 0L10 5L0 10z" fill={marker.colour} />
          </marker>
        ))}
      </defs>
      <rect x={viewBox.x} y={viewBox.y} width={viewBox.width} height={viewBox.height} fill={COLOURS.stage} />
      <FrameLayer scene={scene} />
      <ArrowLayer scene={scene} />
      <ScaleLayer scene={scene} behind />
      <BlockLayer scene={scene} />
      <PlateLayer scene={scene} />
      <PacketLayer scene={scene} />
      <BadgeLayer scene={scene} />
      <ScaleLayer scene={scene} behind={false} />
      <ChipLayer scene={scene} />
      <SafetyLayer scene={scene} />
    </svg>
  );
}
