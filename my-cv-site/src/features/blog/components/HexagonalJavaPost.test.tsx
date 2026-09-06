import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Body, meta } from "./HexagonalJavaPost";

describe("HexagonalJavaPost", () => {
  it("has bilingual metadata within the title and description limits", () => {
    expect(meta.slug).toBe("hexagonal-architecture-java");
    expect(meta.title.en.length).toBeLessThan(60);
    expect(meta.title.nl.length).toBeLessThan(60);
    expect(meta.description.en.length).toBeLessThan(160);
    expect(meta.description.nl.length).toBeLessThan(160);
    expect(meta.keywords.length).toBeGreaterThan(0);
  });

  it("names the current Java release in both locales and carries the date of the check", () => {
    expect(meta.description.en).toContain("Java 25");
    expect(meta.description.nl).toContain("Java 25");
    expect(meta.excerpt.en).toContain("Java 25");
    expect(meta.excerpt.nl).toContain("Java 25");
    expect(meta.updatedDate).toBe("2026-09-06");
  });

  it("renders the English body with sections, code and a diagram", () => {
    render(<Body locale="en" />);
    expect(screen.getAllByRole("heading", { level: 2 }).length).toBeGreaterThan(3);
    expect(screen.getAllByRole("img").length).toBeGreaterThan(0);
    expect(
      screen.getByText(/Java 25, the long-term support release current on 6 September 2026/)
    ).toBeInTheDocument();
    expect(screen.getByText(/The stack was Java 8, Maven and MySQL/)).toBeInTheDocument();
  });

  it("renders the Dutch body with sections", () => {
    render(<Body locale="nl" />);
    expect(screen.getAllByRole("heading", { level: 2 }).length).toBeGreaterThan(3);
    expect(
      screen.getByText(/Java 25, de long-term-supportversie die op 6 september 2026 actueel is/)
    ).toBeInTheDocument();
    expect(screen.getByText(/De stack was Java 8, Maven en MySQL/)).toBeInTheDocument();
  });
});
