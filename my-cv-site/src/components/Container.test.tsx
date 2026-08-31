import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Container } from "./Container";

describe("Container", () => {
  it("renders children with the default width and gutters", () => {
    render(<Container>Inside</Container>);
    const element = screen.getByText("Inside");
    expect(element).toHaveClass("max-w-7xl");
    expect(element).toHaveClass("mx-auto");
    expect(element).toHaveClass("px-4", "sm:px-6");
  });

  it("applies the narrow width variant", () => {
    render(<Container width="narrow">Inside</Container>);
    expect(screen.getByText("Inside")).toHaveClass("max-w-4xl");
  });

  it("applies the prose width variant", () => {
    render(<Container width="prose">Inside</Container>);
    expect(screen.getByText("Inside")).toHaveClass("max-w-3xl");
  });

  it("merges extra classes", () => {
    render(<Container className="text-center">Inside</Container>);
    expect(screen.getByText("Inside")).toHaveClass("text-center");
  });
});
