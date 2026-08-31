import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { TrackRecordSection } from "./TrackRecordSection";

const trackRecordCards = [
  {
    meta: "Belastingdienst · 2023 to 2024",
    headline: "A new income tax form, from months to a few days",
    body: "A low-code visual forms editor with drag and drop, conditional logic and validation, so content teams build and demo a form themselves.",
    tags: ["Angular", "Stencil", "WCAG 2.1 AA"],
  },
  {
    meta: "Nationale Postcode Loterij · 2022 to 2023",
    headline: "Campaign time to market, from weeks to days",
    body: "A JSON-driven international design system in an Nx monorepo with Storyblok and Next.js SSR, rolled out across European lottery labels.",
    tags: ["Next.js SSR", "Nx", "Storyblok"],
  },
  {
    meta: "Athlon · 2020 to 2022",
    headline: "A legacy Angular 1.6 app, safely modernised",
    body: "Led the migration to Angular 12 with a component library, dynamic dashboards and CI/CD on Azure DevOps, and coached the frontend team through it.",
    tags: ["Angular 12", "Azure DevOps", "Team coaching"],
  },
];

vi.mock("next-intl", () => ({
  useTranslations: () => {
    const t = ((key: string) => key) as ((key: string) => string) & {
      raw: (key: string) => unknown;
    };
    t.raw = (key: string) => {
      if (key === "cards") return trackRecordCards;
      return [];
    };
    return t;
  },
}));

describe("TrackRecordSection", () => {
  it("renders the section heading wired to the section via aria-labelledby", () => {
    const { container } = render(<TrackRecordSection />);
    const section = container.querySelector("section");
    expect(section).toHaveAttribute(
      "aria-labelledby",
      "track-record-heading"
    );
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toHaveAttribute("id", "track-record-heading");
    expect(heading).toHaveTextContent("title");
  });

  it("renders the subtitle", () => {
    render(<TrackRecordSection />);
    expect(screen.getByText("subtitle")).toBeInTheDocument();
  });

  it("renders one card per entry with its meta, headline and body", () => {
    render(<TrackRecordSection />);
    for (const card of trackRecordCards) {
      expect(screen.getByText(card.meta)).toBeInTheDocument();
      expect(screen.getByText(card.headline)).toBeInTheDocument();
      expect(screen.getByText(card.body)).toBeInTheDocument();
    }
    const headlines = screen.getAllByRole("heading", { level: 3 });
    expect(headlines).toHaveLength(trackRecordCards.length);
  });

  it("renders every tag pill for every card", () => {
    render(<TrackRecordSection />);
    const allTags = trackRecordCards.flatMap((card) => card.tags);
    for (const tag of allTags) {
      expect(screen.getAllByText(tag).length).toBeGreaterThan(0);
    }
  });
});
