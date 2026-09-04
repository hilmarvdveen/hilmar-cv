import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Card } from "./Card";

describe("Card", () => {
  it("renders children on the shared card surface", () => {
    render(<Card>Card content</Card>);
    const element = screen.getByText("Card content");
    expect(element).toHaveClass("bg-white");
    expect(element).toHaveClass("rounded-xl");
    expect(element).toHaveClass("border-gray-200");
    expect(element).toHaveClass("shadow-sm");
  });

  it("lets callers override the padding through className", () => {
    render(<Card className="p-4">Tight</Card>);
    const element = screen.getByText("Tight");
    expect(element).toHaveClass("p-4");
    expect(element).not.toHaveClass("p-7");
  });

  it("switches to the tinted surface so consecutive grids stop looking alike", () => {
    render(<Card variant="tinted">Tinted content</Card>);
    const element = screen.getByText("Tinted content");
    expect(element).toHaveClass("bg-bgLight");
    expect(element).not.toHaveClass("bg-white");
  });

  it("keeps the white surface as the default variant", () => {
    render(<Card>Default content</Card>);
    const element = screen.getByText("Default content");
    expect(element).toHaveClass("bg-white");
    expect(element).not.toHaveClass("bg-bgLight");
  });
});
