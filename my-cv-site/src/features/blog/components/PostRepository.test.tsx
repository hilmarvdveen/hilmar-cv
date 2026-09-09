import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { PostRepository } from "./PostRepository";

describe("PostRepository", () => {
  it("links the repository root when no folder is given", () => {
    render(<PostRepository locale="en" />);
    const link = screen.getByRole("link", { name: "hilmarvdveen/zappy-mart" });
    expect(link).toHaveAttribute("href", "https://github.com/hilmarvdveen/zappy-mart");
    expect(link).toHaveAttribute("data-placement", "post-repository");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
    expect(
      screen.getByText(/The code behind this article runs in a public repository/)
    ).toHaveTextContent("all seven projects.");
  });

  it("links a single folder on the repository default branch", () => {
    render(<PostRepository locale="en" folders={["backends/dotnet"]} />);
    const link = screen.getByRole("link", { name: "zappy-mart/backends/dotnet" });
    expect(link).toHaveAttribute(
      "href",
      "https://github.com/hilmarvdveen/zappy-mart/tree/main/backends/dotnet"
    );
    expect(link).toHaveAttribute("data-placement", "post-repository");
  });

  it("joins two folders with and", () => {
    render(<PostRepository locale="en" folders={["contract", "tools/conformance"]} />);
    expect(
      screen.getByRole("link", { name: "zappy-mart/contract" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "zappy-mart/tools/conformance" })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/The code behind this article runs in a public repository/)
    ).toHaveTextContent(
      "zappy-mart/contract and zappy-mart/tools/conformance."
    );
  });

  it("joins three folders with commas and a closing and, in Dutch", () => {
    render(
      <PostRepository
        locale="nl"
        folders={["frontends/react-router", "frontends/nextjs", "frontends/angular"]}
      />
    );
    expect(
      screen.getByText(/De code achter dit artikel draait in een openbare repository/)
    ).toHaveTextContent(
      "zappy-mart/frontends/react-router, zappy-mart/frontends/nextjs en zappy-mart/frontends/angular."
    );
    expect(screen.getAllByRole("link")).toHaveLength(3);
  });

  it("names all seven projects in Dutch for the repository root", () => {
    render(<PostRepository locale="nl" />);
    expect(
      screen.getByText(/De code achter dit artikel draait in een openbare repository/)
    ).toHaveTextContent("alle zeven projecten.");
  });
});
