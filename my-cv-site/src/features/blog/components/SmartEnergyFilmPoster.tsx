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
  SHIELDS,
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

type PosterProps = { frame: FilmFrame; labels: SmartEnergyFilmLabels };

const NAVY = "#12314e";
const NAVY_TINT = "#e8eef5";
const EMERALD_TEXT = "#047857";
const EMERALD_TINT = "#ecfdf5";
const EMERALD_LINE = "#059669";
const GRAY = "#374151";
const GRAY_LINE = "#6b7280";
const GRAY_BORDER = "#9ca3af";
const GRAY_TINT = "#f3f4f6";
const WHITE = "#ffffff";
const DIMMED = 0.28;

const FILLS = { white: WHITE, navy: NAVY_TINT, emerald: EMERALD_TINT, gray: GRAY_TINT };

const BORDERS = { white: GRAY_BORDER, navy: NAVY, emerald: EMERALD_LINE, gray: GRAY_BORDER };

export const LINE_STYLES: Record<LineKind, { colour: string; dash?: string }> = {
  telemetry: { colour: EMERALD_LINE },
  commands: { colour: NAVY, dash: "12 8" },
  reads: { colour: GRAY_LINE },
  control: { colour: GRAY_LINE, dash: "2 9" },
};

const activeArrows = (frame: FilmFrame): ReadonlySet<ArrowId> | null =>
  frame.journey ? new Set(JOURNEYS[frame.journey.id].map((hop) => hop.arrow)) : null;

const activeBlocks = (frame: FilmFrame): ReadonlySet<BlockId> | null => {
  const arrows = activeArrows(frame);
  if (arrows === null) {
    return null;
  }
  return new Set(ARROWS.filter((arrow) => arrows.has(arrow.id)).flatMap((arrow) => arrow.ends));
};

function FrameBox({ frame, labels, box }: PosterProps & { box: PosterFrame }) {
  const label = frame.sceneId === "cloud" || frame.sceneId === "end" ? labels.cloudFrames[box.id] : labels.frames[box.id];
  const colour = box.tone === "navy" ? NAVY : EMERALD_LINE;
  const width = label.length * 15.5 + 24;
  const left = box.labelAnchor === "start" ? box.labelAt.x - 12 : box.labelAt.x - width + 12;
  return (
    <g>
      <rect x={box.x} y={box.y} width={box.width} height={box.height} rx={18} fill="none" stroke={colour} strokeWidth={2.5} />
      <rect x={left} y={box.labelAt.y - 20} width={width} height={40} rx={20} fill={WHITE} />
      <text x={box.labelAt.x} y={box.labelAt.y} textAnchor={box.labelAnchor} dominantBaseline="central" fontSize={28} fontWeight={700} fill={colour}>
        {label}
      </text>
    </g>
  );
}

function ArrowLine({ arrow, dimmed }: { arrow: PosterArrow; dimmed: boolean }) {
  const style = LINE_STYLES[arrow.kind];
  return (
    <path
      d={polylinePath(arrow.points)}
      fill="none"
      stroke={style.colour}
      strokeWidth={5}
      strokeLinecap="round"
      strokeDasharray={style.dash}
      markerEnd={`url(#film-arrow-${arrow.kind})`}
      opacity={dimmed ? DIMMED : 1}
    />
  );
}

function BlockBox({ block, labels, dimmed, lit }: { block: Block; labels: SmartEnergyFilmLabels; dimmed: boolean; lit: boolean }) {
  const text = labels.blocks[block.id];
  const lines = text.note ? [...text.title, text.note] : text.title;
  const top = block.y + block.height / 2 - ((lines.length - 1) * 34) / 2;
  return (
    <g opacity={dimmed ? DIMMED : 1}>
      <rect
        x={block.x}
        y={block.y}
        width={block.width}
        height={block.height}
        rx={14}
        fill={FILLS[block.tone]}
        stroke={lit ? EMERALD_LINE : BORDERS[block.tone]}
        strokeWidth={lit ? 5 : 2.5}
        strokeDasharray={block.dashed ? "10 7" : undefined}
      />
      {lines.map((line, index) => {
        const isNote = Boolean(text.note) && index === lines.length - 1;
        return (
          <text
            key={line}
            x={block.x + block.width / 2}
            y={top + index * 34}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={isNote ? 28 : 30}
            fontWeight={isNote ? 600 : 800}
            fill={isNote ? EMERALD_TEXT : NAVY}
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
            <circle cx={at.x} cy={at.y} r={21} fill={active ? EMERALD_LINE : NAVY} stroke={WHITE} strokeWidth={3} />
            <text x={at.x} y={at.y} textAnchor="middle" dominantBaseline="central" fontSize={24} fontWeight={800} fill={WHITE}>
              {index + 1}
            </text>
          </g>
        );
      })}
    </>
  );
}

function Packet({ frame }: { frame: FilmFrame }) {
  if (frame.journey === null) {
    return null;
  }
  const arrow = ARROWS.find((candidate) => candidate.id === frame.journey?.packet.arrow) as PosterArrow;
  const at = pointAlongPolyline(arrow.points, frame.journey.packet.fraction);
  return <circle cx={at.x} cy={at.y} r={13} fill={LINE_STYLES[arrow.kind].colour} stroke={WHITE} strokeWidth={4} />;
}

function Shields({ frame, labels }: PosterProps) {
  return (
    <>
      {SHIELDS.slice(0, frame.shieldsShown).map((shield) => {
        const tag = labels.shields[shield.id];
        const width = tag.length * 15 + 24;
        const left = shield.tagAnchor === "start" ? shield.tagAt.x - 10 : shield.tagAnchor === "end" ? shield.tagAt.x - width + 10 : shield.tagAt.x - width / 2;
        return (
          <g key={shield.id}>
            <path
              d={`M${shield.at.x} ${shield.at.y - 18} l15 6 v10 c0 9 -6 15 -15 20 c-9 -5 -15 -11 -15 -20 v-10 z`}
              fill={EMERALD_LINE}
              stroke={WHITE}
              strokeWidth={3}
            />
            <rect x={left} y={shield.tagAt.y - 20} width={width} height={40} rx={20} fill={WHITE} stroke={EMERALD_LINE} strokeWidth={2} />
            <text x={shield.tagAt.x} y={shield.tagAt.y} textAnchor={shield.tagAnchor} dominantBaseline="central" fontSize={28} fontWeight={600} fill={EMERALD_TEXT}>
              {tag}
            </text>
          </g>
        );
      })}
    </>
  );
}

function Gates({ frame, labels }: PosterProps) {
  const rows = [labels.gates.slice(0, 4), labels.gates.slice(4)];
  const quiet = frame.journey !== null || frame.sceneId === "safety";
  return (
    <g opacity={quiet ? DIMMED : 1}>
      {rows.map((row, rowIndex) => {
        const widths = row.map((gate) => gate.length * 15.5 + 36);
        return row.map((gate, index) => {
          const x = 36 + widths.slice(0, index).reduce((total, width) => total + width + 16, 0);
          const y = 912 + rowIndex * 66;
          return (
            <g key={gate}>
              <rect x={x} y={y} width={widths[index]} height={48} rx={24} fill={NAVY_TINT} stroke={NAVY} strokeWidth={2} />
              <text x={x + widths[index] / 2} y={y + 24} textAnchor="middle" dominantBaseline="central" fontSize={28} fontWeight={600} fill={NAVY}>
                {gate}
              </text>
            </g>
          );
        });
      })}
    </g>
  );
}

type CellProps = { labels: SmartEnergyFilmLabels; cell: Rectangle; progress: number };

function DuplicateCell({ labels, cell, progress }: CellProps) {
  const first = cell.x + 22 + 108 * Math.min(1, progress / 0.4);
  const secondArrive = progress < 0.4 ? null : cell.x + 22 + 108 * Math.min(1, (progress - 0.4) / 0.3);
  const second = progress >= 0.7 ? cell.x + 130 - 80 * Math.min(1, (progress - 0.7) / 0.3) : secondArrive;
  return (
    <g>
      <rect x={cell.x + 140} y={cell.y + 44} width={120} height={84} rx={10} fill={NAVY_TINT} stroke={NAVY} strokeWidth={2} />
      {labels.safety.duplicateKey.map((line, index) => (
        <text key={line} x={cell.x + 200} y={cell.y + 70 + index * 30} textAnchor="middle" dominantBaseline="central" fontSize={16} fontWeight={700} fill={NAVY}>
          {line}
        </text>
      ))}
      <circle cx={first} cy={cell.y + 70} r={10} fill={EMERALD_LINE} />
      {second !== null && <circle cx={second} cy={cell.y + 102} r={10} fill={NAVY} />}
      {progress >= 0.7 && (
        <text x={cell.x + 200} y={cell.y + 160} textAnchor="middle" dominantBaseline="central" fontSize={17} fontWeight={800} fill={EMERALD_TEXT}>
          {labels.safety.duplicateResult}
        </text>
      )}
    </g>
  );
}

function RaceCell({ labels, cell, progress }: CellProps) {
  return (
    <g>
      <text x={cell.x + 14} y={cell.y + 76} dominantBaseline="central" fontSize={16} fontWeight={700} fill={EMERALD_TEXT} opacity={progress >= 0.25 ? 1 : DIMMED}>
        {labels.safety.raceWinner}
      </text>
      <text x={cell.x + 14} y={cell.y + 124} dominantBaseline="central" fontSize={16} fontWeight={700} fill={GRAY} opacity={progress >= 0.6 ? 1 : DIMMED}>
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
      <rect x={cell.x + 60} y={cell.y + 44} width={150} height={44} rx={22} fill={EMERALD_TINT} stroke={EMERALD_LINE} strokeWidth={2} />
      <text x={cell.x + 135} y={cell.y + 66} textAnchor="middle" dominantBaseline="central" fontSize={16} fontWeight={700} fill={EMERALD_TEXT}>
        {labels.safety.lockName}
      </text>
      <rect x={cell.x + 14} y={cell.y + 110} width={110} height={44} rx={10} fill={done ? WHITE : EMERALD_TINT} stroke={EMERALD_LINE} strokeWidth={done ? 1.5 : 3} />
      <text x={cell.x + 69} y={cell.y + 132} textAnchor="middle" dominantBaseline="central" fontSize={16} fontWeight={700} fill={NAVY}>
        {labels.safety.lockFirst}
      </text>
      <rect x={cell.x + 146} y={cell.y + 110} width={110} height={44} rx={10} fill={done ? EMERALD_TINT : WHITE} stroke={done ? EMERALD_LINE : GRAY_BORDER} strokeWidth={done ? 3 : 2} strokeDasharray={done ? undefined : "6 4"} />
      <text x={cell.x + 201} y={cell.y + 132} textAnchor="middle" dominantBaseline="central" fontSize={16} fontWeight={700} fill={NAVY}>
        {labels.safety.lockSecond}
      </text>
      <text x={cell.x + 201} y={cell.y + 176} textAnchor="middle" dominantBaseline="central" fontSize={16} fontWeight={600} fill={done ? EMERALD_TEXT : GRAY}>
        {done ? labels.safety.lockDone : labels.safety.lockWaits}
      </text>
    </g>
  );
}

function AuditCell({ labels, cell, progress }: CellProps) {
  return (
    <g>
      <rect x={cell.x + 14} y={cell.y + 40} width={242} height={112} rx={12} fill="none" stroke={EMERALD_LINE} strokeWidth={3} strokeDasharray="8 6" opacity={progress >= 0.1 ? 1 : DIMMED} />
      <text x={cell.x + 135} y={cell.y + 72} textAnchor="middle" dominantBaseline="central" fontSize={16} fontWeight={700} fill={NAVY} opacity={progress >= 0.2 ? 1 : DIMMED}>
        {labels.safety.auditChange}
      </text>
      <text x={cell.x + 135} y={cell.y + 118} textAnchor="middle" dominantBaseline="central" fontSize={16} fontWeight={700} fill={NAVY} opacity={progress >= 0.5 ? 1 : DIMMED}>
        {labels.safety.auditRow}
      </text>
      <text x={cell.x + 135} y={cell.y + 176} textAnchor="middle" dominantBaseline="central" fontSize={16} fontWeight={700} fill={EMERALD_TEXT} opacity={progress >= 0.8 ? 1 : DIMMED}>
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
      <rect x={0} y={0} width={POSTER_SIZE} height={POSTER_SIZE} fill="#f9fafb" opacity={0.8} />
      <rect x={SAFETY_PANEL.x} y={SAFETY_PANEL.y} width={SAFETY_PANEL.width} height={SAFETY_PANEL.height} rx={18} fill={WHITE} stroke={NAVY} strokeWidth={2.5} />
      <text x={SAFETY_PANEL.x + 20} y={SAFETY_PANEL.y + 28} dominantBaseline="central" fontSize={20} fontWeight={800} fill={NAVY}>
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
            <rect x={cell.x} y={cell.y} width={cell.width} height={cell.height} rx={12} fill={active ? EMERALD_TINT : GRAY_TINT} stroke={active ? EMERALD_LINE : GRAY_BORDER} strokeWidth={active ? 3 : 1.5} />
            <text x={cell.x + 14} y={cell.y + 20} dominantBaseline="central" fontSize={16} fontWeight={800} fill={GRAY}>
              {`${index + 1}. ${labels.safety.mechanisms[index]}`}
            </text>
            <Cell labels={labels} cell={cell} progress={progress} />
          </g>
        );
      })}
    </g>
  );
}

export function SmartEnergyFilmPoster({ frame, labels }: PosterProps) {
  const { camera } = frame;
  const arrows = activeArrows(frame);
  const blocks = activeBlocks(frame);
  const journey = frame.journey;
  return (
    <svg role="img" aria-label={labels.titleCard.join(" ")} viewBox={`${camera.x} ${camera.y} ${camera.size} ${camera.size}`} className="block h-full w-full">
      <defs>
        {Object.entries(LINE_STYLES).map(([kind, style]) => (
          <marker key={kind} id={`film-arrow-${kind}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
            <path d="M0 0L10 5L0 10z" fill={style.colour} />
          </marker>
        ))}
      </defs>
      <rect x={0} y={0} width={POSTER_SIZE} height={POSTER_SIZE} fill="#f9fafb" />
      {FRAMES.map((box) => (
        <FrameBox key={box.id} frame={frame} labels={labels} box={box} />
      ))}
      {ARROWS.map((arrow) => (
        <ArrowLine key={arrow.id} arrow={arrow} dimmed={arrows !== null && !arrows.has(arrow.id)} />
      ))}
      <Packet frame={frame} />
      {BLOCKS.map((block) => (
        <BlockBox
          key={block.id}
          block={block}
          labels={labels}
          dimmed={blocks !== null && !blocks.has(block.id)}
          lit={journey !== null && ARROWS.find((arrow) => arrow.id === JOURNEYS[journey.id][journey.activeHop].arrow)?.ends.includes(block.id) === true}
        />
      ))}
      <HopNumbers frame={frame} />
      <Shields frame={frame} labels={labels} />
      <Gates frame={frame} labels={labels} />
      <SafetyPanel frame={frame} labels={labels} />
    </svg>
  );
}
