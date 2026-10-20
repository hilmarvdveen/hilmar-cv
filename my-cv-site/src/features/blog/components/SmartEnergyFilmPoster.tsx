import type { Point } from "@/lib/flowLayout";
import { pointAlongPolyline, polylinePath } from "@/lib/smartEnergyExplainer/drawing";
import type { FilmFrame } from "@/lib/smartEnergyFilm/film";
import {
  ARROWS,
  CHIPS,
  DATABASE,
  FRAMES,
  NODES,
  POSTER_SIZE,
  ROUTES,
  STEP_BADGES,
  type PosterArrow,
  type PosterFrame,
  type PosterNode,
} from "@/lib/smartEnergyFilm/layout";
import type { SmartEnergyFilmLabels } from "../smartEnergyFilmLabels";

type PosterProps = { frame: FilmFrame; labels: SmartEnergyFilmLabels };

const NAVY = "#12314e";
const NAVY_TINT = "#e8eef5";
const EMERALD_TEXT = "#047857";
const EMERALD_TINT = "#ecfdf5";
const EMERALD_LINE = "#059669";
const GRAY = "#374151";
const GRAY_SUPPORT = "#4b5563";
const GRAY_LINE = "#9ca3af";
const GRAY_TINT = "#f3f4f6";
const WHITE = "#ffffff";
const DIMMED = 0.35;

const FILLS = { white: WHITE, navy: NAVY_TINT, emerald: EMERALD_TINT, gray: GRAY_TINT };

const STROKES = { white: GRAY_LINE, navy: NAVY, emerald: EMERALD_LINE, gray: GRAY_LINE };

const LINE_COLOURS = { gray: GRAY_LINE, emerald: EMERALD_LINE, navy: NAVY };

const nodeOpacity = (frame: FilmFrame, node: PosterNode): number => {
  if (frame.highlight === null) {
    return 1;
  }
  return frame.highlight.nodes.includes(node.id) ? 1 : DIMMED;
};

function NodeBox({ frame, labels, node }: PosterProps & { node: PosterNode }) {
  const text = labels.nodes[node.id];
  const lit = frame.highlight?.nodes.includes(node.id) ?? false;
  return (
    <g opacity={nodeOpacity(frame, node) * frame.reveal[node.group]}>
      <rect
        x={node.x}
        y={node.y}
        width={node.width}
        height={node.height}
        rx={8}
        fill={FILLS[node.tone]}
        stroke={lit ? EMERALD_LINE : STROKES[node.tone]}
        strokeWidth={lit ? 3 : 1.5}
        strokeDasharray={node.dashed ? "6 4" : undefined}
      />
      <text x={node.x + node.width / 2} y={node.y + node.height / 2 - 8} textAnchor="middle" dominantBaseline="central" fontSize={14} fontWeight={700} fill={NAVY}>
        {text.title}
      </text>
      <text x={node.x + node.width / 2} y={node.y + node.height / 2 + 10} textAnchor="middle" dominantBaseline="central" fontSize={12} fill={GRAY_SUPPORT}>
        {text.subtitle}
      </text>
    </g>
  );
}

function FrameBox({ frame, labels, box }: PosterProps & { box: PosterFrame }) {
  const label = labels.frames[box.id];
  const lit = frame.highlight?.frames.includes(box.id) ?? false;
  const colour = box.tone === "gray" ? GRAY_LINE : LINE_COLOURS[box.tone];
  return (
    <g opacity={frame.reveal[box.group]}>
      <rect
        x={box.x}
        y={box.y}
        width={box.width}
        height={box.height}
        rx={14}
        fill="none"
        stroke={lit ? EMERALD_LINE : colour}
        strokeWidth={lit ? 3.5 : 1.5}
        strokeDasharray={box.tone === "gray" ? "8 5" : undefined}
      />
      <rect x={box.x + 14} y={box.y - 10} width={label.length * 7.4 + 16} height={20} rx={10} fill={WHITE} />
      <text x={box.x + 22} y={box.y} dominantBaseline="central" fontSize={12} fontWeight={700} fill={box.tone === "gray" ? GRAY : colour}>
        {label}
      </text>
    </g>
  );
}

function ArrowLine({ frame, labels, arrow }: PosterProps & { arrow: PosterArrow }) {
  const label = labels.arrows[arrow.id];
  return (
    <g opacity={frame.reveal.arrows * (frame.highlight === null ? 1 : DIMMED + 0.25)}>
      <path
        d={polylinePath(arrow.points)}
        fill="none"
        stroke={LINE_COLOURS[arrow.tone]}
        strokeWidth={1.8}
        strokeDasharray={arrow.dashed ? "5 4" : undefined}
        markerEnd={`url(#film-arrow-${arrow.tone})`}
      />
      {label && arrow.labelAt && (
        <>
          <rect x={arrow.labelAt.x - label.length * 3.4 - 6} y={arrow.labelAt.y - 9} width={label.length * 6.8 + 12} height={18} rx={9} fill={WHITE} stroke={GRAY_LINE} strokeWidth={0.8} />
          <text x={arrow.labelAt.x} y={arrow.labelAt.y} textAnchor="middle" dominantBaseline="central" fontSize={11} fill={GRAY}>
            {label}
          </text>
        </>
      )}
    </g>
  );
}

function Chip({ at, text, tone, lit }: { at: Point; text: string; tone: "emerald" | "navy"; lit: boolean }) {
  const width = text.length * 7 + 16;
  return (
    <g>
      <rect
        x={at.x}
        y={at.y}
        width={width}
        height={22}
        rx={11}
        fill={tone === "emerald" ? EMERALD_TINT : NAVY_TINT}
        stroke={lit ? EMERALD_LINE : tone === "emerald" ? EMERALD_LINE : NAVY}
        strokeWidth={lit ? 3 : 1}
      />
      <text x={at.x + width / 2} y={at.y + 11} textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600} fill={tone === "emerald" ? EMERALD_TEXT : NAVY}>
        {text}
      </text>
    </g>
  );
}

function Database({ frame, labels }: PosterProps) {
  const highlight = frame.highlight;
  const lit = highlight !== null && (highlight.database || highlight.chips.length > 0);
  const codeLine = frame.sceneId === "backend" && frame.beatIndex !== null ? labels.backendCode[frame.beatIndex] : null;
  return (
    <g opacity={frame.reveal.database * (highlight === null || lit ? 1 : DIMMED)}>
      <rect
        x={DATABASE.x}
        y={DATABASE.y}
        width={DATABASE.width}
        height={DATABASE.height}
        rx={10}
        fill={NAVY_TINT}
        stroke={highlight?.database ? EMERALD_LINE : NAVY}
        strokeWidth={highlight?.database ? 3 : 1.5}
      />
      <text x={DATABASE.x + 16} y={DATABASE.y + 24} fontSize={14} fontWeight={700} fill={NAVY}>
        {labels.databaseTitle}
      </text>
      {CHIPS.map((chip) => (
        <Chip key={chip.id} at={chip.at} text={labels.chips[chip.id]} tone={chip.tone} lit={highlight?.chips.includes(chip.id) ?? false} />
      ))}
      <text x={DATABASE.x + 16} y={DATABASE.y + 124} fontSize={codeLine ? 13 : 12} fontWeight={codeLine ? 700 : 400} fill={codeLine ? EMERALD_TEXT : GRAY_SUPPORT}>
        {codeLine ?? labels.databaseSummary}
      </text>
    </g>
  );
}

function Shield({ at, text, lit }: { at: Point; text: string; lit: boolean }) {
  return (
    <g opacity={lit ? 1 : DIMMED}>
      <path d={`M${at.x} ${at.y - 8} l7 3 v5 c0 4 -3 7 -7 9 c-4 -2 -7 -5 -7 -9 v-5 z`} fill={EMERALD_LINE} />
      <text x={at.x + 13} y={at.y + 1} dominantBaseline="central" fontSize={12} fill={GRAY}>
        {text}
      </text>
    </g>
  );
}

function SecurityBand({ frame, labels }: PosterProps) {
  const running = frame.sceneId === "running";
  return (
    <g opacity={frame.reveal.security}>
      {labels.controls.map((control, index) => (
        <Shield key={control} at={{ x: 40 + (index % 3) * 344, y: 898 + Math.floor(index / 3) * 24 }} text={control} lit={!running || index < frame.shieldsLit} />
      ))}
      <text x={34} y={1012} fontSize={12} fontWeight={700} fill={NAVY}>
        {labels.gatesLabel}
      </text>
      <g opacity={running ? Math.max(DIMMED, frame.gateOpacity) : 1}>
        {labels.gates.map((gate, index) => (
          <Chip key={gate} at={{ x: 220 + index * 122, y: 1000 }} text={gate} tone="navy" lit={running && frame.gateOpacity === 1} />
        ))}
      </g>
      <text x={34} y={1048} fontSize={12} fill={GRAY_SUPPORT}>
        {labels.acceptedNote}
      </text>
    </g>
  );
}

function Notes({ frame, labels }: PosterProps) {
  return (
    <>
      <g opacity={frame.reveal.edges}>
        {labels.sourceNotes.map((note, index) => (
          <text key={note} x={104} y={392 + index * 18} textAnchor="middle" fontSize={11} fill={GRAY_SUPPORT}>
            {note}
          </text>
        ))}
        {labels.priceNotes.map((note, index) => (
          <text key={note} x={104} y={714 + index * 15} textAnchor="middle" fontSize={11} fill={GRAY_SUPPORT}>
            {note}
          </text>
        ))}
        {labels.consumerNotes.map((note, index) => (
          <text key={note} x={982} y={508 + index * 16} textAnchor="middle" fontSize={11} fill={GRAY_SUPPORT}>
            {note}
          </text>
        ))}
      </g>
      <g opacity={frame.reveal.cloud}>
        {labels.serviceBusNotes.map((note, index) => (
          <text key={note} x={795} y={360 + index * 14} textAnchor="middle" fontSize={11} fontWeight={700} fill={EMERALD_TEXT}>
            {note}
          </text>
        ))}
      </g>
      <g opacity={frame.reveal.containers}>
        <Chip at={{ x: 250, y: 392 }} text={labels.replicaChip} tone="navy" lit={false} />
        <text x={250} y={540} fontSize={12} fontWeight={700} fill={NAVY}>
          {labels.jobsLabel}
        </text>
      </g>
    </>
  );
}

function Header({ frame, labels }: PosterProps) {
  return (
    <g opacity={frame.reveal.header}>
      <text x={24} y={40} fontSize={30} fontWeight={800} fill={NAVY}>
        {labels.title}
      </text>
      <text x={24} y={68} fontSize={14} fill={GRAY_SUPPORT}>
        {labels.subtitle}
      </text>
      <rect x={700} y={14} width={364} height={84} rx={10} fill={WHITE} stroke={GRAY_LINE} />
      {labels.steps.map((step, index) => {
        const lit = index === frame.sceneIndex;
        const at = { x: 718 + Math.floor(index / 3) * 180, y: 34 + (index % 3) * 22 };
        return (
          <g key={step}>
            <circle cx={at.x} cy={at.y} r={8} fill={lit ? EMERALD_LINE : NAVY} />
            <text x={at.x} y={at.y} textAnchor="middle" dominantBaseline="central" fontSize={9} fontWeight={800} fill={WHITE}>
              {String(index + 1).padStart(2, "0")}
            </text>
            <text x={at.x + 14} y={at.y} dominantBaseline="central" fontSize={12} fontWeight={lit ? 700 : 400} fill={GRAY}>
              {step}
            </text>
          </g>
        );
      })}
    </g>
  );
}

export function SmartEnergyFilmPoster({ frame, labels }: PosterProps) {
  const { camera } = frame;
  return (
    <svg role="img" aria-label={labels.title} viewBox={`${camera.x} ${camera.y} ${camera.size} ${camera.size}`} className="block h-full w-full">
      <defs>
        {Object.entries(LINE_COLOURS).map(([tone, colour]) => (
          <marker key={tone} id={`film-arrow-${tone}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0 0L10 5L0 10z" fill={colour} />
          </marker>
        ))}
      </defs>
      <rect x={0} y={0} width={POSTER_SIZE} height={POSTER_SIZE} fill="#f9fafb" />
      <Header frame={frame} labels={labels} />
      {FRAMES.map((box) => (
        <FrameBox key={box.id} frame={frame} labels={labels} box={box} />
      ))}
      {ARROWS.map((arrow) => (
        <ArrowLine key={arrow.id} frame={frame} labels={labels} arrow={arrow} />
      ))}
      {NODES.map((node) => (
        <NodeBox key={node.id} frame={frame} labels={labels} node={node} />
      ))}
      <Notes frame={frame} labels={labels} />
      <Database frame={frame} labels={labels} />
      <SecurityBand frame={frame} labels={labels} />
      {STEP_BADGES.map((badge) => (
        <g key={badge.step} opacity={frame.reveal.cloud}>
          <circle cx={badge.at.x} cy={badge.at.y} r={15} fill={badge.step - 1 === frame.sceneIndex ? EMERALD_LINE : NAVY} />
          <text x={badge.at.x} y={badge.at.y} textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight={800} fill={WHITE}>
            {String(badge.step).padStart(2, "0")}
          </text>
        </g>
      ))}
      {frame.packets.map((packet, index) => {
        const at = pointAlongPolyline(ROUTES[packet.route], packet.fraction);
        return <circle key={`${packet.route}-${index}`} cx={at.x} cy={at.y} r={9} fill={packet.tone === "emerald" ? EMERALD_LINE : NAVY} stroke={WHITE} strokeWidth={2.5} />;
      })}
    </svg>
  );
}
