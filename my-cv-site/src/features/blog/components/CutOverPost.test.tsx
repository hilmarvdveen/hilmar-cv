import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { Body, meta } from "./CutOverPost";

describe("CutOverPost", () => {
  it("has bilingual metadata within the title and description limits", () => {
    expect(meta.slug).toBe("reversible-cut-over-legacy-to-new");
    expect(meta.category).toBe("architecture");
    expect(meta.track).toBe("fullstack");
    expect(meta.publishedDate).toBe("2026-09-06");
    expect(meta.readingTimeMin).toBe(13);
    expect(meta.title.en.length).toBeLessThan(60);
    expect(meta.title.nl.length).toBeLessThan(60);
    expect(meta.description.en.length).toBeLessThan(160);
    expect(meta.description.nl.length).toBeLessThan(160);
    expect(meta.keywords.length).toBeGreaterThan(5);
  });

  it("renders the English body with every section, both diagrams and the contents list", () => {
    render(<Body locale="en" />);

    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(12);
    expect(screen.getAllByRole("img")).toHaveLength(2);

    const contents = screen.getByRole("navigation", { name: "In this article" });
    expect(within(contents).getAllByRole("listitem")).toHaveLength(12);
    expect(
      within(contents).getByRole("link", { name: "Why the risky part is not the code" })
    ).toBeInTheDocument();
    expect(within(contents).getByRole("link", { name: "What to take away" })).toBeInTheDocument();

    expect(
      screen.getByRole("heading", { level: 2, name: "Ramp by percentage, and keep each visitor in one group" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "Keep the way back to one action" })
    ).toBeInTheDocument();
  });

  it("carries both captions as readable text in English", () => {
    render(<Body locale="en" />);

    expect(
      screen.getByText(
        "The old system keeps serving until the last visitor has moved, so every step has somewhere to go back to."
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Each visitor is assigned once, so nobody sees the old page and the new page in turn."
      )
    ).toBeInTheDocument();
  });

  it("keeps the wording of the record for the cut-over and its scope", () => {
    render(<Body locale="en" />);

    expect(screen.getByText(/no customer-facing outage/)).toBeInTheDocument();
    expect(screen.getByText(/226 Handlebars templates/)).toBeInTheDocument();
    expect(screen.getByText(/route-matching order bug/)).toBeInTheDocument();
    expect(
      screen.getByText(/My work was the routing rules for these addresses/)
    ).toBeInTheDocument();
  });

  it("renders the Dutch body with every section, both diagrams and the contents list", () => {
    render(<Body locale="nl" />);

    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(12);
    expect(screen.getAllByRole("img")).toHaveLength(2);

    const contents = screen.getByRole("navigation", { name: "In dit artikel" });
    expect(within(contents).getAllByRole("listitem")).toHaveLength(12);
    expect(
      within(contents).getByRole("link", { name: "Waarom het risico niet in de code zit" })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", { level: 2, name: "Wanneer het oude systeem eindelijk weg kan" })
    ).toBeInTheDocument();
  });

  it("carries both captions as readable text in Dutch", () => {
    render(<Body locale="nl" />);

    expect(
      screen.getByText(
        "Het oude systeem blijft bedienen tot de laatste bezoeker over is, zodat elke stap een weg terug heeft."
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Elke bezoeker wordt een keer ingedeeld, zodat niemand om beurten de oude en de nieuwe pagina ziet."
      )
    ).toBeInTheDocument();
  });

  it("keeps the Dutch wording of the record for the cut-over", () => {
    render(<Body locale="nl" />);

    expect(screen.getByText(/zonder onderbreking voor klanten/)).toBeInTheDocument();
    expect(screen.getByText(/fout in de routeringsvolgorde/)).toBeInTheDocument();
  });

  it("names no ramp schedule and no measured performance number", () => {
    for (const locale of ["en", "nl"] as const) {
      const { container, unmount } = render(<Body locale={locale} />);
      const prose = container.textContent ?? "";
      expect(prose).not.toMatch(/\d+\s?%/);
      expect(prose).not.toMatch(/zero downtime/i);
      unmount();
    }
  });
});
