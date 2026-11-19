import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { ProseTable } from "./ProseTable";

const columns = ["Method", "Safe", "Idempotent"];
const rows = [
  { term: "GET", cells: ["yes", "yes"] },
  { term: "POST", cells: ["no", <strong key="no">no</strong>] },
];

describe("ProseTable", () => {
  it("renders a captioned table with column and row headers", () => {
    render(<ProseTable caption="Methods" columns={columns} rows={rows} />);
    const table = screen.getByRole("table", { name: "Methods" });
    expect(within(table).getAllByRole("columnheader").map((header) => header.textContent)).toEqual(columns);
    expect(within(table).getByRole("rowheader", { name: "POST" })).toBeInTheDocument();
    expect(within(table).getAllByRole("cell")).toHaveLength(4);
    expect(within(table).getByText("no", { selector: "strong" })).toBeInTheDocument();
  });

  it("sets a minimum width only when one is given", () => {
    const { rerender } = render(<ProseTable caption="Methods" columns={columns} rows={rows} />);
    expect(screen.getByRole("table")).not.toHaveStyle({ minWidth: "480px" });
    expect(screen.getByRole("table").getAttribute("style")).toBeNull();
    rerender(<ProseTable caption="Methods" columns={columns} rows={rows} minimumWidth={480} />);
    expect(screen.getByRole("table")).toHaveStyle({ minWidth: "480px" });
  });
});
