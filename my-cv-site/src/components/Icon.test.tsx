import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Icon } from "./Icon";

describe("Icon", () => {
  it("renders the mapped icon with a default className", () => {
    const { container } = render(<Icon name="code" />);
    const svg = container.querySelector("svg");
    expect(svg).toBeTruthy();
    expect(svg?.getAttribute("class")).toContain("w-6 h-6");
  });

  it("applies a custom className", () => {
    const { container } = render(<Icon name="calendar" className="size-10" />);
    expect(container.querySelector("svg")?.getAttribute("class")).toContain("size-10");
  });
});
