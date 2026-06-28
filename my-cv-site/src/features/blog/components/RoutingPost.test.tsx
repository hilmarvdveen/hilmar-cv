import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Body, meta } from "./RoutingPost";

describe("RoutingPost", () => {
  it("has bilingual metadata in the routing category", () => {
    expect(meta.category).toBe("routing");
    expect(meta.title.en).toBeTruthy();
    expect(meta.title.nl).toBeTruthy();
  });

  it("renders the English body with route modules, file tree and diagrams", () => {
    render(<Body locale="en" />);
    expect(screen.getByText("app/routes.ts")).toBeInTheDocument();
    expect(screen.getByText("app/routes/dashboard.products.tsx")).toBeInTheDocument();
    expect(screen.getAllByRole("img").length).toBeGreaterThan(0);
  });

  it("renders the Dutch body", () => {
    render(<Body locale="nl" />);
    expect(screen.getByRole("heading", { name: /Remix/ })).toBeInTheDocument();
  });
});
