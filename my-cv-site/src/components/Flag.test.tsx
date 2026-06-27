import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Flag } from "./Flag";

describe("Flag", () => {
  it("renders the Dutch flag for the nl locale", () => {
    const { container } = render(<Flag code="nl" />);
    const svg = container.querySelector("svg");
    expect(svg).toBeTruthy();
    // NL has the blue band colour.
    expect(container.innerHTML).toContain("#21468B");
  });

  it("renders the US flag for any other locale (e.g. en) with a custom class", () => {
    const { container } = render(<Flag code="en" className="w-6" />);
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("class")).toContain("w-6");
    // US flag stripes + canton + stars.
    expect(container.querySelectorAll("circle").length).toBeGreaterThan(0);
    expect(container.innerHTML).toContain("#B22234");
  });
});
