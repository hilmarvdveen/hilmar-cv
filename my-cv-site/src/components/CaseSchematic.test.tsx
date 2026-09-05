import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { CaseSchematic } from "./CaseSchematic";

describe("CaseSchematic", () => {
  it("draws the cut-over case as the ramp with the fourth station lit", () => {
    const { container } = render(<CaseSchematic schematic="ramp" />);
    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
    expect(container.querySelectorAll("circle")).toHaveLength(6);
  });

  it("draws the forms editor as blocks entering a frame with one empty slot", () => {
    const { container } = render(<CaseSchematic schematic="formBuilder" />);
    expect(container.querySelector("svg")).toHaveAttribute("width", "96");
    expect(container.querySelector("[stroke-dasharray]")).not.toBeNull();
  });

  it("draws the design system as one source fanning out to three pages", () => {
    const { container } = render(<CaseSchematic schematic="sourceToPages" tone="onNavy" />);
    expect(container.querySelectorAll("rect")).toHaveLength(13);
    expect(container.querySelector("rect")).toHaveAttribute("stroke", "#6ee7b7");
  });

  it("draws the migration as an old frame stepping into a taller new one", () => {
    const { container } = render(
      <CaseSchematic schematic="versionToVersion" width={240} height={120} className="mt-2" />
    );
    const drawing = container.querySelector("svg");
    expect(drawing).toHaveAttribute("width", "240");
    expect(drawing).toHaveClass("mt-2");
    expect(container.querySelectorAll("path")).toHaveLength(4);
  });
});
