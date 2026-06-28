import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Body, meta } from "./UnitTestingPost";

describe("UnitTestingPost", () => {
  it("has bilingual metadata in the testing category", () => {
    expect(meta.category).toBe("testing");
    expect(meta.title.en).toBeTruthy();
    expect(meta.title.nl).toBeTruthy();
  });

  it("renders the English body with examples and diagrams", () => {
    render(<Body locale="en" />);
    expect(screen.getByText("money.test.ts")).toBeInTheDocument();
    expect(screen.getByText("test/handlers.ts")).toBeInTheDocument();
    expect(screen.getAllByRole("img").length).toBeGreaterThan(0);
  });

  it("renders the Dutch body", () => {
    render(<Body locale="nl" />);
    expect(screen.getByRole("heading", { name: /testing trophy/i })).toBeInTheDocument();
  });
});
