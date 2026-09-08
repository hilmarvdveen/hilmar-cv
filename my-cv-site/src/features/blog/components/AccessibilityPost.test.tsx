import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { Body, meta } from "./AccessibilityPost";

describe("AccessibilityPost", () => {
  it("has bilingual metadata within the title and description limits", () => {
    expect(meta.slug).toBe("wcag-aa-in-the-component");
    expect(meta.category).toBe("accessibility");
    expect(meta.track).toBe("frontend");
    expect(meta.publishedDate).toBe("2026-09-06");
    expect(meta.readingTimeMin).toBe(16);
    expect(meta.title.en.length).toBeLessThan(60);
    expect(meta.title.nl.length).toBeLessThan(60);
    expect(meta.description.en.length).toBeLessThan(160);
    expect(meta.description.nl.length).toBeLessThan(160);
    expect(meta.excerpt.en.length).toBeGreaterThan(0);
    expect(meta.excerpt.nl.length).toBeGreaterThan(0);
    expect(meta.keywords.length).toBeGreaterThan(5);
  });

  it("renders the English body with every section, both diagrams and the contents list", () => {
    render(<Body locale="en" />);

    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(12);
    expect(screen.getAllByRole("img")).toHaveLength(2);
    expect(screen.getAllByRole("note")).toHaveLength(2);

    const contents = screen.getByRole("navigation", { name: "In this article" });
    expect(within(contents).getAllByRole("listitem")).toHaveLength(12);
    expect(
      within(contents).getByRole("link", { name: "Why the audit at the end is the expensive way" })
    ).toBeInTheDocument();
    expect(within(contents).getByRole("link", { name: "What to take away" })).toBeInTheDocument();

    expect(
      screen.getByRole("heading", { level: 2, name: "What AA actually asks of a component" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "Focus: visible, ordered, and never lost" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "Names: what a screen reader reads out" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "Target size and the things people click with" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "Putting the check in the pipeline" })
    ).toBeInTheDocument();
  });

  it("carries both captions as readable text in English", () => {
    render(<Body locale="en" />);

    expect(
      screen.getByText(
        "A screen reader announces a name, a role and a state, and each of the three comes from a different part of the markup."
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Focus has to be able to reach every control and to leave again, in an order that matches what the reader sees."
      )
    ).toBeInTheDocument();
  });

  it("keeps the record's split between WCAG 2.2 AA and WCAG 2.1 AA in English", () => {
    render(<Body locale="en" />);

    expect(
      screen.getByText(/At bol.com the components I hand over follow WCAG 2.2 AA/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /At the Belastingdienst, the Nationale Postcode Loterij and Athlon the level was WCAG 2.1 AA/
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Checked on 6 September 2026 against WCAG 2.2/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Bold design system shipped as Stencil web components/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/verified with automated tests in a pipeline/)
    ).toBeInTheDocument();
  });

  it("names the criteria that are new at level A and AA in WCAG 2.2", () => {
    render(<Body locale="en" />);

    const prose = screen.getByRole("heading", { level: 2, name: "What changed between 2.1 and 2.2" })
      .parentElement?.textContent;
    for (const criterion of ["2.4.11", "2.5.7", "2.5.8", "3.2.6", "3.3.7", "3.3.8"]) {
      expect(prose).toContain(criterion);
    }
    expect(prose).toContain("4.1.1 Parsing was removed");
  });

  it("renders the Dutch body with every section, both diagrams and the contents list", () => {
    render(<Body locale="nl" />);

    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(12);
    expect(screen.getAllByRole("img")).toHaveLength(2);
    expect(screen.getAllByRole("note")).toHaveLength(2);

    const contents = screen.getByRole("navigation", { name: "In dit artikel" });
    expect(within(contents).getAllByRole("listitem")).toHaveLength(12);
    expect(
      within(contents).getByRole("link", { name: "Waarom een audit achteraf de dure route is" })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", { level: 2, name: "Namen: wat een schermlezer voorleest" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "Klikoppervlak en waar mensen mee klikken" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "Overdragen zodat het zo blijft" })
    ).toBeInTheDocument();
  });

  it("carries both captions as readable text in Dutch", () => {
    render(<Body locale="nl" />);

    expect(
      screen.getByText(
        "Een schermlezer kondigt een naam, een rol en een toestand aan, en die drie komen elk uit een ander deel van de markup."
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Focus moet elk element kunnen bereiken en er weer weg kunnen, in een volgorde die past bij wat de lezer ziet."
      )
    ).toBeInTheDocument();
  });

  it("keeps the Dutch wording of the record and the dated version check", () => {
    render(<Body locale="nl" />);

    expect(
      screen.getByText(/volgen de componenten die ik overdraag WCAG 2.2 AA/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Gecontroleerd op 6 september 2026 tegen WCAG 2.2/)
    ).toBeInTheDocument();
    expect(screen.getAllByText(/schermlezer/).length).toBeGreaterThan(1);
    expect(screen.getAllByText(/focusvolgorde/).length).toBeGreaterThan(0);
  });

  it("claims no score, no percentage and no external audit in either language", () => {
    for (const locale of ["en", "nl"] as const) {
      const { container, unmount } = render(<Body locale={locale} />);
      const prose = container.textContent ?? "";
      expect(prose).not.toMatch(/\d+\s?%/);
      expect(prose).not.toMatch(/—|–/);
      expect(prose).not.toMatch(/external audit|externe audit/i);
      expect(prose).not.toMatch(/instead of|rather than|in plaats van/i);
      unmount();
    }
  });
});
