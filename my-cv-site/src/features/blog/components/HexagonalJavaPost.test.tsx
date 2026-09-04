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

  it("renders the English body with sections, code and a diagram", () => {
    render(<Body locale="en" />);
    expect(screen.getAllByRole("heading", { level: 2 }).length).toBeGreaterThan(3);
    expect(screen.getAllByRole("img").length).toBeGreaterThan(0);
  });

  it("renders the Dutch body with sections", () => {
    render(<Body locale="nl" />);
    expect(screen.getAllByRole("heading", { level: 2 }).length).toBeGreaterThan(3);
  });
});
