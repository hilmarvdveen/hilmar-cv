import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
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

  it("exposes the hierarchy as nested lists and names each entry as a folder or a file", () => {
    render(
      <FileTree
        tree={[{ name: "src", children: [{ name: "index.ts" }] }, { name: "readme", type: "file" }]}
      />,
    );
    const lists = screen.getAllByRole("list");
    expect(lists).toHaveLength(2);
    const [outer, inner] = lists;
    expect(within(outer).getAllByRole("listitem")).toHaveLength(3);
    expect(within(inner).getAllByRole("listitem")).toHaveLength(1);
    expect(screen.getByText("folder")).toBeInTheDocument();
    expect(screen.getAllByText("file")).toHaveLength(2);
  });

  it("renders without a caption", () => {
    render(<FileTree tree={[{ name: "only.ts" }]} />);
    expect(screen.getByText("only.ts")).toBeInTheDocument();
  });
});
