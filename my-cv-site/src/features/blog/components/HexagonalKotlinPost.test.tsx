import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Body, meta } from "./HexagonalKotlinPost";

describe("HexagonalKotlinPost", () => {
  it("has bilingual metadata in the architecture category", () => {
    expect(meta.category).toBe("architecture");
    expect(meta.slug).toBe("hexagonal-architecture-kotlin");
    expect(meta.title.en).toBeTruthy();
    expect(meta.title.nl).toBeTruthy();
  });

  it("renders the English body with the domain, adapter and test sources", () => {
    render(<Body locale="en" />);
    expect(screen.getByText("domain/Subscription.kt")).toBeInTheDocument();
    expect(screen.getByText("api/SubscriptionMutation.kt")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Ports are interfaces the domain writes for itself/ })
    ).toBeInTheDocument();
    expect(screen.getAllByRole("img").length).toBeGreaterThan(0);
  });

  it("renders the Dutch body", () => {
    render(<Body locale="nl" />);
    expect(
      screen.getByRole("heading", { name: /Ports zijn interfaces die het domein voor zichzelf schrijft/ })
    ).toBeInTheDocument();
  });
});
