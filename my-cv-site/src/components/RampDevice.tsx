import {
  RAMP_GEOMETRY,
  RAMP_HALO_OPACITY,
  RAMP_TONES,
  RAMP_WEIGHTS,
  activeStationRadii,
  rampBeads,
  type RampLockup,
  type RampStation,
  type RampTone,
  type RampWeight,
} from "@/lib/rampGeometry";

type RampDeviceProps = {
  lockup?: RampLockup;
  weight?: RampWeight;
  tone?: RampTone;
  activeStation?: RampStation;
  showReturn?: boolean;
  width?: number;
  height?: number;
  className?: string;
};

export const RampDevice = ({
  lockup = "compact",
  weight = "regular",
  tone = "onLight",
  activeStation,
  showReturn = false,
  width,
  height,
  className,
}: RampDeviceProps) => {
  const geometry = RAMP_GEOMETRY[lockup];
  const strokes = RAMP_WEIGHTS[weight];
  const colors = RAMP_TONES[tone];
  const radii = activeStationRadii(strokes);

  return (
    <svg
      viewBox={geometry.viewBox}
      width={width ?? geometry.width}
      height={height ?? geometry.height}
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path d={geometry.lane} stroke={colors.lane} strokeWidth={strokes.lane} strokeLinecap="round" />
      <path
        d={geometry.ramp}
        stroke={colors.ramp}
        strokeWidth={strokes.ramp}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {showReturn && (
        <>
          <path
            d={geometry.returnCurve}
            stroke={colors.returnLine}
            strokeWidth={strokes.returnLine}
            strokeLinecap="round"
          />
          <path
            d={geometry.returnHead}
            stroke={colors.returnLine}
            strokeWidth={strokes.returnLine}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      )}
      {rampBeads(lockup, activeStation).map((bead) =>
        bead.active ? (
          <g key={`${bead.x}-${bead.y}`}>
            <circle
              cx={bead.x}
              cy={bead.y}
              r={radii.halo}
              fill="none"
              stroke={colors.ramp}
              strokeOpacity={RAMP_HALO_OPACITY}
              strokeWidth={strokes.bead}
            />
            <circle cx={bead.x} cy={bead.y} r={radii.core} fill={colors.ramp} />
          </g>
        ) : (
          <circle
            key={`${bead.x}-${bead.y}`}
            cx={bead.x}
            cy={bead.y}
            r={strokes.beadRadius}
            fill={colors.beadFill}
            stroke={colors.ramp}
            strokeWidth={strokes.bead}
          />
        )
      )}
    </svg>
  );
};
