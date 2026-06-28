import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Body, meta } from "./FolderStructurePost";

describe("FolderStructurePost", () => {
  it("has bilingual metadata", () => {
    expect(meta.slug).toBe("react-folder-structure");
    expect(meta.title.en).toBeTruthy();
    expect(meta.title.nl).toBeTruthy();
  });

  it("renders the English body with headings, diagrams and code", () => {
    render(<Body locale="en" />);
    expect(screen.getByRole("heading", { name: /Feature-first/ })).toBeInTheDocument();
    expect(screen.getByText("tsconfig.json")).toBeInTheDocument();
    // a diagram is present (ReactFlow canvas with an aria-label)
    expect(
      screen.getAllByRole("img").some((el) => el.getAttribute("aria-label")?.length)
    ).toBe(true);
  });

  it("renders the Dutch body", () => {
    render(<Body locale="nl" />);
    expect(screen.getByRole("heading", { name: /Feature-first/ })).toBeInTheDocument();
  });
});
