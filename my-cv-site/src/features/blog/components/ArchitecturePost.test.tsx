import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Body, meta } from "./ArchitecturePost";

describe("ArchitecturePost", () => {
  it("has bilingual metadata in the architecture category", () => {
    expect(meta.category).toBe("architecture");
    expect(meta.title.en).toBeTruthy();
    expect(meta.title.nl).toBeTruthy();
  });

  it("renders the English body with config, stories and diagrams", () => {
    render(<Body locale="en" />);
    expect(screen.getAllByText("vite.config.ts").length).toBeGreaterThan(0);
    expect(screen.getByText("src/components/Button.stories.tsx")).toBeInTheDocument();
    expect(screen.getAllByRole("img").length).toBeGreaterThan(0);
  });

  it("renders the Dutch body", () => {
    render(<Body locale="nl" />);
    expect(screen.getByRole("heading", { name: /Vite: bouwen/ })).toBeInTheDocument();
  });
});
