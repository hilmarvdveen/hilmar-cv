import { describe, it, expect } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { ExperienceQuickNav, type ExperienceChip } from "./ExperienceQuickNav";

const chips: ExperienceChip[] = [
  { id: "alpha", company: "Alpha Company" },
  { id: "beta", company: "Beta Company" },
  { id: "gamma", company: "Gamma Company" },
];

describe("ExperienceQuickNav", () => {
  it("renders a labelled navigation with one text link per chip and no images", () => {
    render(<ExperienceQuickNav chips={chips} label="Work experience" />);
    expect(
      screen.getByRole("navigation", { name: "Work experience" })
    ).toBeInTheDocument();
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(chips.length);
    expect(links.map((link) => link.textContent)).toEqual(
      chips.map((chip) => chip.company)
    );
    expect(screen.queryAllByRole("img")).toHaveLength(0);
  });

  it("marks the first chip as current before any scroll or click", () => {
    render(<ExperienceQuickNav chips={chips} label="Work experience" />);
    const active = screen.getByRole("link", { current: "location" });
    expect(active).toHaveTextContent("Alpha Company");
  });

  it("marks the clicked chip as current and leaves the others unmarked", () => {
    render(<ExperienceQuickNav chips={chips} label="Work experience" />);
    const links = screen.getAllByRole("link");
    fireEvent.click(links[1]);

    const active = screen.getByRole("link", { current: "location" });
    expect(active).toHaveTextContent("Beta Company");

    const others = links.filter((link) => link !== active);
    others.forEach((link) => expect(link).not.toHaveAttribute("aria-current"));
  });
});
