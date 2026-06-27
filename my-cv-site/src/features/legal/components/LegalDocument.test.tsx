import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { LegalDocument } from "./LegalDocument";
import type { LegalDoc } from "../legalContent";

const doc: LegalDoc = {
  title: "Test Policy",
  lastUpdated: "27 June 2026",
  intro: "Intro paragraph.",
  sections: [
    { heading: "With paragraphs", paragraphs: ["Para one.", "Para two."] },
    { heading: "With bullets", bullets: ["Bullet one.", "Bullet two."] },
    { heading: "Heading only" },
  ],
};

describe("LegalDocument", () => {
  it("renders the title, last-updated, intro and all section variants", () => {
    render(<LegalDocument doc={doc} lastUpdatedLabel="Last updated" />);
    expect(screen.getByRole("heading", { level: 1, name: "Test Policy" })).toBeInTheDocument();
    expect(screen.getByText(/Last updated: 27 June 2026/)).toBeInTheDocument();
    expect(screen.getByText("Intro paragraph.")).toBeInTheDocument();
    expect(screen.getByText("Para one.")).toBeInTheDocument();
    expect(screen.getByText("Bullet two.")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Heading only" })).toBeInTheDocument();
  });

  it("renders without an intro", () => {
    const { container } = render(
      <LegalDocument doc={{ ...doc, intro: undefined }} lastUpdatedLabel="Bijgewerkt" />
    );
    expect(container.textContent).not.toContain("Intro paragraph.");
    expect(screen.getByText(/Bijgewerkt:/)).toBeInTheDocument();
  });
});
