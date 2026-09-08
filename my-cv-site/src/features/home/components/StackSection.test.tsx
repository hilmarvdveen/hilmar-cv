import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { StackSection } from "./StackSection";

const tiers = [
  {
    label: "Depth",
    emphasis: true,
    items: ["React 19 + React Compiler", "TypeScript", "Next.js"],
  },
  {
    label: "Range",
    emphasis: false,
    items: ["Kotlin / JVM", "C# / .NET Core"],
  },
  {
    label: "Platform",
    emphasis: false,
    items: ["GCP + Kubernetes", "Azure", "Docker"],
  },
];

vi.mock("next-intl", () => ({
  useTranslations: () => {
    const t = ((key: string) => key) as ((key: string) => string) & {
      raw: (key: string) => unknown;
    };
    t.raw = (key: string) => {
      if (key === "tiers") return tiers;
      return [];
    };
    return t;
  },
}));

describe("StackSection", () => {
  it("renders the section title and footnote", () => {
    render(<StackSection />);
    expect(screen.getByRole("heading", { name: "title" })).toBeInTheDocument();
    expect(screen.getByText("footnote")).toBeInTheDocument();
  });

  it("renders every tier label and its items", () => {
    render(<StackSection />);
    for (const tier of tiers) {
      expect(screen.getByText(tier.label)).toBeInTheDocument();
      for (const item of tier.items) {
        expect(screen.getByText(item)).toBeInTheDocument();
      }
    }
  });

  it("styles the emphasis tier label and pills differently from the rest", () => {
    render(<StackSection />);
    const emphasisLabel = screen.getByText("Depth");
    expect(emphasisLabel.className).toContain("text-primary");

    const nonEmphasisLabel = screen.getByText("Range");
    expect(nonEmphasisLabel.className).toContain("text-gray-500");

    const emphasisPill = screen.getByText("React 19 + React Compiler");
    expect(emphasisPill.className).toContain("bg-emerald-50");

    const otherPill = screen.getByText("Kotlin / JVM");
    expect(otherPill.className).toContain("bg-gray-100");
  });

  it("wires the section to the heading via aria-labelledby", () => {
    const { container } = render(<StackSection />);
    const section = container.querySelector("section");
    const heading = screen.getByRole("heading", { name: "title" });
    expect(section).toHaveAttribute("aria-labelledby", "stack-heading");
    expect(heading).toHaveAttribute("id", "stack-heading");
  });

  it("renders the pills as fill-only, without a border, so they read as read-only tags", () => {
    render(<StackSection />);
    const emphasisPill = screen.getByText("React 19 + React Compiler");
    expect(emphasisPill.className).not.toContain("border");

    const otherPill = screen.getByText("Kotlin / JVM");
    expect(otherPill.className).not.toContain("border");
  });
});
