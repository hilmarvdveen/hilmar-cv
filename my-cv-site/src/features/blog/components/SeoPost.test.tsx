import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Body, meta } from "./SeoPost";

describe("SeoPost", () => {
  it("has bilingual metadata in the seo category", () => {
    expect(meta.category).toBe("seo");
    expect(meta.title.en).toBeTruthy();
    expect(meta.title.nl).toBeTruthy();
  });

  it("renders the English body with metadata, JSON-LD and diagrams", () => {
    render(<Body locale="en" />);
    expect(screen.getByText("JSON-LD: BlogPosting")).toBeInTheDocument();
    expect(screen.getAllByText("robots.txt").length).toBeGreaterThan(0);
    expect(screen.getAllByRole("img").length).toBeGreaterThan(0);
  });

  it("renders the Dutch body", () => {
    render(<Body locale="nl" />);
    expect(screen.getByRole("heading", { name: /Core Web Vitals/ })).toBeInTheDocument();
  });
});
