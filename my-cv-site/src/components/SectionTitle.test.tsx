import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SectionTitle } from "./SectionTitle";

describe("SectionTitle", () => {
  it("renders the provided title", () => {
    render(<SectionTitle title="My Section" />);
    expect(screen.getByText("My Section")).toBeInTheDocument();
  });

  it("renders an optional subtitle", () => {
    render(<SectionTitle title="My Section" subtitle="More context" />);
    expect(screen.getByText("More context")).toBeInTheDocument();
  });

  it("omits the subtitle element when none is given", () => {
    render(<SectionTitle title="Only a title" />);
    expect(screen.getByText("Only a title").parentElement?.querySelector("p")).toBeNull();
  });

  it("centers when asked and stays left by default", () => {
    const { rerender } = render(<SectionTitle title="Aligned" />);
    expect(screen.getByText("Aligned").parentElement).not.toHaveClass("text-center");
    rerender(<SectionTitle title="Aligned" align="center" />);
    expect(screen.getByText("Aligned").parentElement).toHaveClass("text-center");
  });

  it("switches to light text on dark backgrounds", () => {
    render(<SectionTitle title="On navy" subtitle="Sub" onDark />);
    expect(screen.getByText("On navy")).toHaveClass("text-white");
    expect(screen.getByText("Sub")).toHaveClass("text-slate-300");
  });

  it("forwards the heading id for aria-labelledby wiring", () => {
    render(<SectionTitle title="Labelled" id="section-heading" />);
    expect(screen.getByText("Labelled")).toHaveAttribute("id", "section-heading");
  });
});
