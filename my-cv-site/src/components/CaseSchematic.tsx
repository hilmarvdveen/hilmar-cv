import { RampDevice } from "./RampDevice";
import type { RampTone } from "@/lib/rampGeometry";

export type CaseSchematicKind = "ramp" | "formBuilder" | "sourceToPages" | "versionToVersion";

type SchematicColors = {
  lane: string;
  frame: string;
  ink: string;
  fill: string;
  muted: string;
};

const SCHEMATIC_TONES: Record<RampTone, SchematicColors> = {
  onLight: {
    lane: "#9ca3af",
    frame: "#9ca3af",
    ink: "#047857",
    fill: "rgba(4,120,87,0.14)",
    muted: "#d1d5db",
  },
  onNavy: {
    lane: "rgba(255,255,255,0.30)",
    frame: "rgba(255,255,255,0.38)",
    ink: "#6ee7b7",
    fill: "rgba(110,231,183,0.16)",
    muted: "rgba(255,255,255,0.22)",
  },
};

const CUT_OVER_STATION = 4;

type CaseSchematicProps = {
  schematic: CaseSchematicKind;
  tone?: RampTone;
  width?: number;
  height?: number;
  className?: string;
};

type DrawingProps = {
  colors: SchematicColors;
};

const FormBuilder = ({ colors }: DrawingProps) => (
  <>
    <path d="M8 106H232" stroke={colors.lane} strokeWidth={4} strokeLinecap="round" />
    <rect x={14} y={24} width={30} height={14} rx={4} stroke={colors.frame} strokeWidth={4} />
    <rect x={14} y={46} width={30} height={14} rx={4} stroke={colors.frame} strokeWidth={4} />
    <rect x={14} y={68} width={30} height={14} rx={4} stroke={colors.frame} strokeWidth={4} />
    <path d="M54 75H82" stroke={colors.ink} strokeWidth={7} strokeLinecap="round" />
    <path d="M75 68L82 75L75 82" stroke={colors.ink} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
    <rect x={98} y={14} width={126} height={84} rx={8} stroke={colors.frame} strokeWidth={5} />
    <rect x={110} y={24} width={102} height={14} rx={4} fill={colors.fill} stroke={colors.ink} strokeWidth={4} />
    <rect x={110} y={46} width={102} height={14} rx={4} fill={colors.fill} stroke={colors.ink} strokeWidth={4} />
    <rect x={110} y={68} width={102} height={14} rx={4} stroke={colors.frame} strokeWidth={4} strokeDasharray="9 7" />
  </>
);

const SourceToPages = ({ colors }: DrawingProps) => (
  <>
    <path d="M8 108H232" stroke={colors.lane} strokeWidth={4} strokeLinecap="round" />
    <rect x={14} y={32} width={48} height={48} rx={8} stroke={colors.ink} strokeWidth={5} />
    <rect x={24} y={43} width={24} height={6} rx={3} fill={colors.ink} />
    <rect x={24} y={54} width={30} height={6} rx={3} fill={colors.ink} />
    <rect x={24} y={65} width={18} height={6} rx={3} fill={colors.ink} />
    <path d="M64 56C96 56 100 24 134 24" stroke={colors.ink} strokeWidth={4} strokeLinecap="round" />
    <path d="M64 56H134" stroke={colors.ink} strokeWidth={4} strokeLinecap="round" />
    <path d="M64 56C96 56 100 88 134 88" stroke={colors.ink} strokeWidth={4} strokeLinecap="round" />
    {[10, 42, 74].map((top) => (
      <g key={top}>
        <rect x={136} y={top} width={90} height={28} rx={6} stroke={colors.frame} strokeWidth={4} />
        <rect x={146} y={top + 5} width={52} height={6} rx={3} fill={colors.ink} />
        <rect x={146} y={top + 17} width={36} height={5} rx={2.5} fill={colors.muted} />
      </g>
    ))}
  </>
);

const VersionToVersion = ({ colors }: DrawingProps) => (
  <>
    <path d="M8 108H232" stroke={colors.lane} strokeWidth={4} strokeLinecap="round" />
    <rect x={12} y={30} width={68} height={56} rx={8} stroke={colors.frame} strokeWidth={4} />
    <rect x={22} y={44} width={48} height={6} rx={3} fill={colors.muted} />
    <rect x={22} y={58} width={32} height={6} rx={3} fill={colors.muted} />
    <path d="M94 46L104 58L94 70" stroke={colors.frame} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M112 46L122 58L112 70" stroke={colors.frame} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M130 46L140 58L130 70" stroke={colors.ink} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
    <rect x={156} y={20} width={72} height={76} rx={8} stroke={colors.ink} strokeWidth={5} />
    <rect x={166} y={32} width={52} height={8} rx={4} fill={colors.ink} />
    {[
      [50, 44],
      [64, 52],
      [78, 30],
    ].map(([top, rowWidth]) => (
      <rect
        key={top}
        x={166}
        y={top}
        width={rowWidth}
        height={6}
        rx={3}
        fill={colors.fill}
        stroke={colors.ink}
        strokeWidth={1.5}
      />
    ))}
  </>
);

const DRAWINGS: Record<Exclude<CaseSchematicKind, "ramp">, (props: DrawingProps) => React.ReactElement> = {
  formBuilder: FormBuilder,
  sourceToPages: SourceToPages,
  versionToVersion: VersionToVersion,
};

export const CaseSchematic = ({
  schematic,
  tone = "onLight",
  width = 96,
  height = 48,
  className,
}: CaseSchematicProps) => {
  if (schematic === "ramp") {
    return (
      <RampDevice
        weight="bold"
        tone={tone}
        activeStation={CUT_OVER_STATION}
        width={width}
        height={height}
        className={className}
      />
    );
  }
  const Drawing = DRAWINGS[schematic];
  return (
    <svg
      viewBox="0 0 240 120"
      width={width}
      height={height}
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <Drawing colors={SCHEMATIC_TONES[tone]} />
    </svg>
  );
};
