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

  it("names Spring Boot 4 in both descriptions", () => {
    expect(meta.description.en).toContain("Spring Boot 4");
    expect(meta.description.nl).toContain("Spring Boot 4");
    expect(meta.updatedDate).toBe("2026-09-06");
  });

  it("dates the English version claim next to the versions it names", () => {
    render(<Body locale="en" />);
    expect(
      screen.getByText(/Kotlin 2\.4 and Spring Boot 4\.1, the versions current on 6 September 2026/)
    ).toBeInTheDocument();
  });

  it("dates the Dutch version claim next to the versions it names", () => {
    render(<Body locale="nl" />);
    expect(
      screen.getByText(/Kotlin 2\.4 en Spring Boot 4\.1, de versies die op 6 september 2026 actueel zijn/)
    ).toBeInTheDocument();
  });
});
