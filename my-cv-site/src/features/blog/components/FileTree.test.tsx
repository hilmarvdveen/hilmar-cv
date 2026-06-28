import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { FileTree, type FileNode } from "./FileTree";

describe("FileTree", () => {
  it("renders nested dirs, files, comments and a caption", () => {
    const tree: FileNode[] = [
      {
        name: "src",
        children: [
          { name: "index.ts" },
          {
            name: "sub",
            type: "dir",
            comment: "a subfolder",
            children: [{ name: "deep.ts", type: "file" }],
          },
        ],
      },
      { name: "loose-file", type: "file" },
    ];

    render(<FileTree tree={tree} caption="project layout" />);

    expect(screen.getByText("src")).toBeInTheDocument();
    expect(screen.getByText("index.ts")).toBeInTheDocument();
    expect(screen.getByText("deep.ts")).toBeInTheDocument();
    expect(screen.getByText("# a subfolder")).toBeInTheDocument();
    expect(screen.getByText("loose-file")).toBeInTheDocument();
    expect(screen.getByText("project layout")).toBeInTheDocument();
  });

  it("renders without a caption", () => {
    render(<FileTree tree={[{ name: "only.ts" }]} />);
    expect(screen.getByText("only.ts")).toBeInTheDocument();
  });
});
