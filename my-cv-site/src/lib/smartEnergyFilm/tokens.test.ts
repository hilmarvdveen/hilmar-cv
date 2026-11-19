import { blendOver, contrastRatio, relativeLuminance } from "./colourContrast";
import { LEGEND_KINDS } from "./layout";
import { ACTIVE_LINE_COLOUR, BLOCK_STYLE, CHIP_STYLE, COLOURS, FADED_OPACITY, FRAME_STYLES, LINE_STYLES, PLATE_STYLE, STROKE_UNIT, dashPattern } from "./tokens";

describe("colour contrast", () => {
  it("measures black on white at 21 to 1 and a colour on itself at 1 to 1", () => {
    expect(contrastRatio("#000000", "#ffffff")).toBeCloseTo(21, 5);
    expect(contrastRatio(COLOURS.navy, COLOURS.navy)).toBeCloseTo(1, 5);
    expect(relativeLuminance("#ffffff")).toBeCloseTo(1, 5);
    expect(relativeLuminance("#000000")).toBe(0);
  });

  it("blends a colour over a background by opacity", () => {
    expect(blendOver("#000000", "#ffffff", 0.5)).toBe("#808080");
    expect(blendOver("#102030", "#ffffff", 1)).toBe("#102030");
  });
});

describe("faded opacity", () => {
  const backgrounds = (opacity: number) => [COLOURS.stage, BLOCK_STYLE.computeFill, BLOCK_STYLE.storeFill].map((fill) => blendOver(fill, COLOURS.stage, opacity));

  const lowestContrast = (colour: string, opacity: number) =>
    Math.min(...backgrounds(opacity).map((background) => contrastRatio(blendOver(colour, COLOURS.stage, opacity), background)));

  it("keeps faded gray text at 4.5 to 1 or better against the stage and the block fills", () => {
    expect(lowestContrast(COLOURS.gray, FADED_OPACITY)).toBeGreaterThanOrEqual(4.5);
  });

  it("keeps faded emerald text at 3 to 1 or better against the stage and the block fills", () => {
    expect(lowestContrast(COLOURS.emeraldText, FADED_OPACITY)).toBeGreaterThanOrEqual(3);
  });

  it("keeps faded arrows at 3 to 1 or better against the stage and the block fills", () => {
    expect(lowestContrast(COLOURS.grayLine, FADED_OPACITY)).toBeGreaterThanOrEqual(3);
  });

  it("is close to the faintest passing step, a clearly fainter value fails", () => {
    expect(lowestContrast(COLOURS.gray, FADED_OPACITY - 0.1)).toBeLessThan(4.5);
    expect(lowestContrast(COLOURS.grayLine, FADED_OPACITY - 0.1)).toBeLessThan(3);
  });
});

describe("tokens", () => {
  it("gives Azure a stroke of 1.5 and Container Apps a stroke of 1 with a light fill each", () => {
    expect(FRAME_STYLES.azure.strokeWidthRatio).toBe(1.5);
    expect(FRAME_STYLES.containerApps.strokeWidthRatio).toBe(1);
    expect(FRAME_STYLES.azure.fill).not.toBe(FRAME_STYLES.containerApps.fill);
  });

  it("gives every dashed line kind its own pattern and reads its own", () => {
    const patterns = LEGEND_KINDS.map((kind) => dashPattern(kind, 5));
    expect(patterns[0]).toBeUndefined();
    expect(new Set(patterns.slice(1)).size).toBe(3);
    expect(dashPattern("reads", 5)).toBe("14 7 2 7");
    expect(dashPattern("commands", 5)).toBe("14 14");
    expect(LINE_STYLES.reads.dashRatio).not.toEqual(LINE_STYLES.commands.dashRatio);
  });

  it("carries colours and ratios only", () => {
    expect(ACTIVE_LINE_COLOUR).toBe(COLOURS.emeraldLine);
    expect(STROKE_UNIT.portrait).toBeLessThan(STROKE_UNIT.landscape);
    expect(CHIP_STYLE.paddingRatio).toBeGreaterThan(0);
    expect(PLATE_STYLE.radiusRatio).toBeGreaterThan(0);
  });
});
