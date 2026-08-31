import { describe, it, expect } from "vitest";
import { pickActiveSectionId, centeredScrollLeft } from "./scrollSpy";

const positions = [
  { id: "first", top: -500 },
  { id: "second", top: 50 },
  { id: "third", top: 400 },
];

describe("pickActiveSectionId", () => {
  it("returns empty for no positions and above the first card", () => {
    expect(pickActiveSectionId([], 132, false)).toBe("");
    expect(
      pickActiveSectionId(
        [
          { id: "first", top: 200 },
          { id: "second", top: 600 },
        ],
        132,
        false
      )
    ).toBe("");
  });

  it("picks the last card whose top crossed the activation line", () => {
    expect(pickActiveSectionId(positions, 132, false)).toBe("second");
  });

  it("hands the win to the lower card the moment it crosses the line", () => {
    expect(
      pickActiveSectionId(
        [
          { id: "first", top: -900 },
          { id: "second", top: 131 },
        ],
        132,
        false
      )
    ).toBe("second");
  });

  it("forces the last card at the bottom of the document", () => {
    expect(pickActiveSectionId(positions, 132, true)).toBe("third");
  });
});

describe("centeredScrollLeft", () => {
  it("centers the chip against the viewport", () => {
    expect(centeredScrollLeft(300, 100, 400, 800)).toBe(150);
  });

  it("clamps at the left end of the strip", () => {
    expect(centeredScrollLeft(10, 100, 400, 800)).toBe(0);
  });

  it("clamps at the right end of the strip", () => {
    expect(centeredScrollLeft(790, 100, 400, 500)).toBe(500);
  });

  it("treats a non-overflowing strip as zero scroll", () => {
    expect(centeredScrollLeft(200, 100, 400, -50)).toBe(0);
  });
});
