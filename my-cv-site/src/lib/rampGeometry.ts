export type RampLockup = "compact" | "wide";
export type RampWeight = "fine" | "regular" | "bold";
export type RampTone = "onLight" | "onNavy";
export type RampStation = 1 | 2 | 3 | 4 | 5;

export type RampGeometry = {
  viewBox: string;
  width: number;
  height: number;
  lane: string;
  ramp: string;
  returnCurve: string;
  returnHead: string;
  beads: [number, number][];
};

export const RAMP_GEOMETRY: Record<RampLockup, RampGeometry> = {
  compact: {
    viewBox: "0 0 240 120",
    width: 240,
    height: 120,
    lane: "M8 96H232",
    ramp: "M8 96H48V80H88V64H128V48H168V32H224",
    returnCurve: "M214 42C202 58 202 78 212 90",
    returnHead: "M201 85L212 90L209 78",
    beads: [
      [28, 96],
      [68, 80],
      [108, 64],
      [148, 48],
      [196, 32],
    ],
  },
  wide: {
    viewBox: "0 16 1000 80",
    width: 1000,
    height: 80,
    lane: "M20 84H980",
    ramp: "M20 84H194V70H398V56H602V42H806V28H980",
    returnCurve: "M868 40C826 50 826 66 862 79",
    returnHead: "M846 80L862 79L850 68",
    beads: [
      [92, 84],
      [296, 70],
      [500, 56],
      [704, 42],
      [908, 28],
    ],
  },
};

export type RampStrokes = {
  lane: number;
  ramp: number;
  returnLine: number;
  bead: number;
  beadRadius: number;
};

export const RAMP_WEIGHTS: Record<RampWeight, RampStrokes> = {
  fine: { lane: 2, ramp: 3, returnLine: 1.5, bead: 1.5, beadRadius: 3 },
  regular: { lane: 3, ramp: 4.5, returnLine: 2.5, bead: 2, beadRadius: 4 },
  bold: { lane: 5, ramp: 7, returnLine: 4, bead: 3, beadRadius: 6 },
};

export type RampColors = {
  lane: string;
  ramp: string;
  returnLine: string;
  beadFill: string;
};

export const RAMP_TONES: Record<RampTone, RampColors> = {
  onLight: { lane: "#9ca3af", ramp: "#047857", returnLine: "#9ca3af", beadFill: "#ffffff" },
  onNavy: {
    lane: "rgba(255,255,255,0.30)",
    ramp: "#6ee7b7",
    returnLine: "rgba(255,255,255,0.38)",
    beadFill: "#12314e",
  },
};

const HALO_FACTOR = 2.2;
const CORE_FACTOR = 1.35;
const HALO_OPACITY = 0.35;

export const activeStationRadii = (strokes: RampStrokes) => ({
  halo: Math.round(strokes.beadRadius * HALO_FACTOR),
  core: Math.round(strokes.beadRadius * CORE_FACTOR),
});

export type RampOptions = {
  lockup?: RampLockup;
  weight?: RampWeight;
  tone?: RampTone;
  activeStation?: RampStation;
  showReturn?: boolean;
};

export type RampBead = {
  x: number;
  y: number;
  active: boolean;
};

export const rampBeads = (lockup: RampLockup, activeStation?: RampStation): RampBead[] =>
  RAMP_GEOMETRY[lockup].beads.map(([x, y], index) => ({ x, y, active: activeStation === index + 1 }));

export function rampSvgMarkup({
  lockup = "compact",
  weight = "regular",
  tone = "onLight",
  activeStation,
  showReturn = false,
}: RampOptions = {}): string {
  const geometry = RAMP_GEOMETRY[lockup];
  const strokes = RAMP_WEIGHTS[weight];
  const colors = RAMP_TONES[tone];
  const radii = activeStationRadii(strokes);
  const beads = rampBeads(lockup, activeStation)
    .map((bead) =>
      bead.active
        ? `<circle cx="${bead.x}" cy="${bead.y}" r="${radii.halo}" fill="none" stroke="${colors.ramp}" stroke-opacity="${HALO_OPACITY}" stroke-width="${strokes.bead}"/><circle cx="${bead.x}" cy="${bead.y}" r="${radii.core}" fill="${colors.ramp}"/>`
        : `<circle cx="${bead.x}" cy="${bead.y}" r="${strokes.beadRadius}" fill="${colors.beadFill}" stroke="${colors.ramp}" stroke-width="${strokes.bead}"/>`
    )
    .join("");
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${geometry.viewBox}" width="${geometry.width}" height="${geometry.height}" fill="none">` +
    `<path d="${geometry.lane}" stroke="${colors.lane}" stroke-width="${strokes.lane}" stroke-linecap="round"/>` +
    `<path d="${geometry.ramp}" stroke="${colors.ramp}" stroke-width="${strokes.ramp}" stroke-linecap="round" stroke-linejoin="round"/>` +
    (showReturn
      ? `<path d="${geometry.returnCurve}" stroke="${colors.returnLine}" stroke-width="${strokes.returnLine}" stroke-linecap="round"/>` +
        `<path d="${geometry.returnHead}" stroke="${colors.returnLine}" stroke-width="${strokes.returnLine}" stroke-linecap="round" stroke-linejoin="round"/>`
      : "") +
    beads +
    `</svg>`
  );
}

export const RAMP_HALO_OPACITY = HALO_OPACITY;
