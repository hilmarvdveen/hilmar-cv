import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { ExperienceQuickNav, type ExperienceChip } from "./ExperienceQuickNav";

vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt="" src={String(props.src ?? "")} />
  ),
}));

const chips: ExperienceChip[] = [
  { id: "alpha", company: "Alpha Company", logo: "alpha.svg" },
  { id: "beta", company: "Beta Company", logo: "beta.svg" },
  { id: "gamma", company: "Gamma Company", logo: "gamma.svg" },
];

describe("ExperienceQuickNav", () => {
  it("renders a labelled navigation with one link per chip", () => {
    render(<ExperienceQuickNav chips={chips} label="Work experience" />);
    expect(
      screen.getByRole("navigation", { name: "Work experience" })
    ).toBeInTheDocument();
    expect(screen.getAllByRole("link")).toHaveLength(chips.length);
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
