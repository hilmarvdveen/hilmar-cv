import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { DependencyFigure } from "./DependencyFigure";

describe("DependencyFigure", () => {
  it("explains the dependency direction in English with a caption and a text version", () => {
    render(<DependencyFigure locale="en" />);

    expect(screen.getByRole("figure")).toBeInTheDocument();
    expect(screen.getByText("Both features depend on the design system. The design system never imports a feature and never fetches data.")).toBeInTheDocument();
    expect(screen.getByRole("list", { name: "Steps in the figure" })).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
  });

  it("explains the dependency direction in Dutch", () => {
    render(<DependencyFigure locale="nl" />);

    expect(screen.getByText("Beide features hangen af van het design system. Het design system importeert nooit een feature en haalt nooit data op.")).toBeInTheDocument();
    expect(screen.getByRole("list", { name: "Stappen in de figuur" })).toBeInTheDocument();
  });
});
