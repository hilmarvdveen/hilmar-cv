import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CodeBlock } from "./CodeBlock";

describe("CodeBlock", () => {
  it("shows a header with filename + language and trims a leading newline", () => {
    render(<CodeBlock code={"\nconst x = 1;\n"} lang="tsx" filename="example.tsx" />);
    expect(screen.getByText("example.tsx")).toBeInTheDocument();
    expect(screen.getByText("tsx")).toBeInTheDocument();
    expect(screen.getByText("const x = 1;")).toBeInTheDocument();
  });

  it("renders a header with only a language pill", () => {
    render(<CodeBlock code="npm test" lang="bash" />);
    expect(screen.getByText("bash")).toBeInTheDocument();
    expect(screen.getByText("npm test")).toBeInTheDocument();
  });

  it("renders no header when neither filename nor language is given", () => {
    render(<CodeBlock code="plain" />);
    expect(screen.getByText("plain")).toBeInTheDocument();
    expect(screen.queryByText("plain", { selector: "figcaption" })).toBeNull();
    expect(screen.getByRole("region", { name: "Code" })).toBeInTheDocument();
  });

  it("makes the scrolling code reachable by keyboard and labelled by its filename", () => {
    render(<CodeBlock code="const x = 1;" lang="ts" filename="example.ts" />);
    const region = screen.getByRole("region", { name: "Code: example.ts" });
    expect(region).toHaveAttribute("tabindex", "0");
    region.focus();
    expect(region).toHaveFocus();
    expect(screen.getByText("const x = 1;")).toHaveAttribute("lang", "en");
  });

  it("labels the region by the language when there is no filename", () => {
    render(<CodeBlock code="npm test" lang="bash" />);
    expect(screen.getByRole("region", { name: "Code: bash" })).toBeInTheDocument();
  });

  it("ties the header to the figure as its caption", () => {
    render(<CodeBlock code="x" filename="a.ts" />);
    expect(screen.getByText("a.ts").closest("figcaption")?.parentElement).toBe(screen.getByRole("figure"));
  });
});
