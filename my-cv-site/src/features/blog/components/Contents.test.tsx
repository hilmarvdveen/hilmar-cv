import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Contents } from "./Contents";
import { H2 } from "./prose";

describe("Contents", () => {
  it("lists every heading as a numbered anchor link that matches the heading id", () => {
    render(
      <>
        <Contents label="In this article" items={["Why the rules outlive the framework", "The shape"]} />
        <H2>Why the rules outlive the framework</H2>
        <H2>The shape</H2>
      </>
    );
    const nav = screen.getByRole("navigation", { name: "In this article" });
    expect(nav).toBeInTheDocument();
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute("href", "#why-the-rules-outlive-the-framework");
    expect(screen.getByRole("heading", { level: 2, name: "The shape" })).toHaveAttribute("id", "the-shape");
    expect(links[1]).toHaveAttribute("href", "#the-shape");
  });
});
