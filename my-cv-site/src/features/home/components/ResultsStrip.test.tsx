import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ResultsStrip } from "./ResultsStrip";

const items = [
  {
    value: "up to 24% GMV",
    label: "Revenue on winning experiments",
    detail:
      "on winning A/B variants at bol.com, roughly 5% to 24% across the winners",
  },
  {
    value: "months to days",
    label: "A new tax form ready in days",
    detail: "to build a new income tax form at the Belastingdienst",
  },
  {
    value: "weeks to days",
    label: "A campaign page live in days",
    detail:
      "for a new page with the shared design systems built for two organisations",
  },
  {
    value: "zero downtime",
    label: "No downtime during the switch",
    detail: "phased, reversible cut-over of live account pages at bol.com",
  },
];

vi.mock("next-intl", () => {
  const t = ((key: string) => key) as ((key: string) => string) & {
    raw: (key: string) => unknown;
  };
  t.raw = (key: string) => {
    if (key === "items") return items;
    return [];
  };
  return { useTranslations: () => t };
});

describe("ResultsStrip", () => {
  it("renders the visible title", () => {
    render(<ResultsStrip />);
    const heading = screen.getByRole("heading", { level: 2, name: "title" });
    expect(heading).toBeInTheDocument();
    expect(heading).not.toHaveClass("sr-only");
  });

  it("renders every result item with its value, label and detail", () => {
    render(<ResultsStrip />);
    for (const item of items) {
      expect(screen.getByText(item.value)).toBeInTheDocument();
      expect(screen.getByText(item.label)).toBeInTheDocument();
      expect(screen.getByText(item.detail)).toBeInTheDocument();
    }
  });

  it("renders exactly the expected number of stat cells", () => {
    const { container } = render(<ResultsStrip />);
    const cells = container.querySelectorAll(".border-l-\\[3px\\]");
    expect(cells).toHaveLength(items.length);
  });

  it("gives every stat cell fixed rows so short details never leave a gap", () => {
    const { container } = render(<ResultsStrip />);
    const cells = container.querySelectorAll(".border-l-\\[3px\\]");
    for (const cell of cells) {
      expect(cell).toHaveClass("lg:grid-rows-[5rem_2.5rem_1fr]");
      expect(cell).not.toHaveClass("lg:grid-rows-subgrid");
      expect(cell).not.toHaveClass("lg:row-span-3");
    }
  });

  it("gives the value the emerald figure treatment", () => {
    render(<ResultsStrip />);
    for (const item of items) {
      expect(screen.getByText(item.value)).toHaveClass("text-primary");
    }
  });

  it("renders the caveat text", () => {
    render(<ResultsStrip />);
    expect(screen.getByText("caveat")).toBeInTheDocument();
  });

  it("wires the section's aria-labelledby to the heading id", () => {
    const { container } = render(<ResultsStrip />);
    const section = container.querySelector("section");
    const heading = screen.getByRole("heading", { level: 2, name: "title" });
    expect(section).toHaveAttribute("aria-labelledby", heading.id);
  });
});
