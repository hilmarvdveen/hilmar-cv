import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Body, meta } from "./HexagonalCSharpPost";

describe("HexagonalCSharpPost", () => {
  it("has bilingual metadata within the title and description limits", () => {
    expect(meta.slug).toBe("hexagonal-architecture-csharp-dotnet");
    expect(meta.title.en.length).toBeLessThan(60);
    expect(meta.title.nl.length).toBeLessThan(60);
    expect(meta.description.en.length).toBeLessThan(160);
    expect(meta.description.nl.length).toBeLessThan(160);
    expect(meta.keywords.length).toBeGreaterThan(0);
  });

  it("names the current runtime and language version in both locales", () => {
    expect(meta.updatedDate).toBe("2026-09-06");
    expect(meta.description.en).toContain("C# 14 and .NET 10");
    expect(meta.description.nl).toContain("C# 14 en .NET 10");
    expect(meta.excerpt.en).toContain("C# 14 and .NET 10");
    expect(meta.excerpt.nl).toContain("C# 14 en .NET 10");
  });

  it("renders the English body with sections, code and a diagram", () => {
    render(<Body locale="en" />);
    expect(screen.getAllByRole("heading", { level: 2 }).length).toBeGreaterThan(3);
    expect(screen.getAllByRole("img").length).toBeGreaterThan(0);
    expect(
      screen.getByText(/target \.NET 10 and C# 14, the versions current on 6 September 2026/),
    ).toBeInTheDocument();
    expect(screen.getByText(/net10\.0/)).toBeInTheDocument();
  });

  it("renders the Dutch body with sections", () => {
    render(<Body locale="nl" />);
    expect(screen.getAllByRole("heading", { level: 2 }).length).toBeGreaterThan(3);
    expect(
      screen.getByText(/voor \.NET 10 en C# 14, de versies die op 6 september 2026 actueel zijn/),
    ).toBeInTheDocument();
  });
});
