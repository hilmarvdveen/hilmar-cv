import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SectionTitle } from "./SectionTitle";

describe("SectionTitle", () => {
  it("renders the provided title", () => {
    render(<SectionTitle title="My Section" />);
    expect(screen.getByText("My Section")).toBeInTheDocument();
  });
});
