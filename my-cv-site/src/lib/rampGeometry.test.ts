import { describe, it, expect } from "vitest";
import {
  RAMP_GEOMETRY,
  RAMP_TONES,
  RAMP_WEIGHTS,
  activeStationRadii,
  rampBeads,
  rampSvgMarkup,
} from "./rampGeometry";

describe("rampGeometry", () => {
  it("places five beads on each lockup, one per method step", () => {
    expect(RAMP_GEOMETRY.compact.beads).toHaveLength(5);
    expect(RAMP_GEOMETRY.wide.beads).toHaveLength(5);
    expect(rampBeads("compact").every((bead) => !bead.active)).toBe(true);
    expect(rampBeads("wide", 4).map((bead) => bead.active)).toEqual([false, false, false, true, false]);
  });

  it("scales the lit station from the bead radius of the weight", () => {
    expect(activeStationRadii(RAMP_WEIGHTS.bold)).toEqual({ halo: 13, core: 8 });
    expect(activeStationRadii(RAMP_WEIGHTS.fine)).toEqual({ halo: 7, core: 4 });
  });

  it("draws the compact ramp in the light tone at the regular weight by default", () => {
    const markup = rampSvgMarkup();
    expect(markup).toContain('viewBox="0 0 240 120"');
    expect(markup).toContain(`stroke="${RAMP_TONES.onLight.ramp}" stroke-width="${RAMP_WEIGHTS.regular.ramp}"`);
    expect(markup).toContain(`fill="${RAMP_TONES.onLight.beadFill}"`);
    expect(markup).not.toContain("stroke-opacity");
    expect(markup.match(/<circle/g)).toHaveLength(5);
    expect(markup.match(/<path/g)).toHaveLength(2);
  });

  it("draws the wide lockup on navy with a halo around the lit station", () => {
    const markup = rampSvgMarkup({ lockup: "wide", tone: "onNavy", weight: "bold", activeStation: 4, showReturn: true });
    expect(markup).toContain('viewBox="0 16 1000 80"');
    expect(markup.match(/<path/g)).toHaveLength(4);
    expect(markup).toContain(`stroke="${RAMP_TONES.onNavy.ramp}" stroke-width="${RAMP_WEIGHTS.bold.ramp}"`);
    expect(markup).toContain('cx="704" cy="42" r="13"');
    expect(markup).toContain('cx="704" cy="42" r="8"');
    expect(markup.match(/<circle/g)).toHaveLength(6);
  });
});
