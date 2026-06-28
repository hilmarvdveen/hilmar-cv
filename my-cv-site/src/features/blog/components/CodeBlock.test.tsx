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
    const { container } = render(<CodeBlock code="plain" />);
    expect(screen.getByText("plain")).toBeInTheDocument();
    expect(container.querySelectorAll("pre")).toHaveLength(1);
  });
});
