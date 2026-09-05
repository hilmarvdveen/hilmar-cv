import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { RampDevice } from "./RampDevice";

describe("RampDevice", () => {
  it("renders a decorative drawing that is hidden from assistive technology", () => {
    const { container } = render(<RampDevice />);
    const drawing = container.querySelector("svg");
    expect(drawing).toHaveAttribute("aria-hidden", "true");
    expect(drawing).toHaveAttribute("viewBox", "0 0 240 120");
    expect(drawing).toHaveAttribute("width", "240");
    expect(container.querySelectorAll("circle")).toHaveLength(5);
    expect(container.querySelectorAll("path")).toHaveLength(2);
  });

  it("switches to the wide lockup and takes explicit render sizes", () => {
    const { container } = render(
      <RampDevice lockup="wide" showReturn width={1216} height={97} className="hidden lg:block" />
    );
    const drawing = container.querySelector("svg");
    expect(drawing).toHaveAttribute("viewBox", "0 16 1000 80");
    expect(drawing).toHaveAttribute("width", "1216");
    expect(drawing).toHaveAttribute("height", "97");
    expect(drawing).toHaveClass("hidden", "lg:block");
    expect(container.querySelectorAll("path")).toHaveLength(4);
  });

  it("lights one station with a halo and a solid core", () => {
    const { container } = render(<RampDevice weight="bold" activeStation={4} />);
    const circles = container.querySelectorAll("circle");
    expect(circles).toHaveLength(6);
    expect(circles[3]).toHaveAttribute("r", "13");
    expect(circles[4]).toHaveAttribute("r", "8");
  });

  it("uses the navy tone colours on dark surfaces", () => {
    const { container } = render(<RampDevice tone="onNavy" weight="fine" />);
    const paths = container.querySelectorAll("path");
    expect(paths[1]).toHaveAttribute("stroke", "#6ee7b7");
    expect(paths[1]).toHaveAttribute("stroke-width", "3");
    expect(container.querySelector("circle")).toHaveAttribute("fill", "#12314e");
  });
});
