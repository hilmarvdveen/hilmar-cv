import type { ReactNode } from "react";

type ProseTableRow = { term: string; cells: readonly ReactNode[] };

export function ProseTable({
  caption,
  columns,
  rows,
  minimumWidth,
}: {
  caption: string;
  columns: readonly string[];
  rows: readonly ProseTableRow[];
  minimumWidth?: number;
}) {
  return (
    <div
      role="region"
      aria-label={caption}
      tabIndex={0}
      className="my-8 overflow-x-auto rounded-xl border border-gray-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
    >
      <table
        className="w-full border-collapse text-left text-sm"
        style={minimumWidth === undefined ? undefined : { minWidth: minimumWidth }}
      >
        <caption className="border-b border-gray-200 bg-gray-50 px-4 py-3 text-left text-sm text-gray-600">
          {caption}
        </caption>
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            {columns.map((column) => (
              <th key={column} scope="col" className="px-4 py-3 font-semibold text-textMain">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.term} className="border-b border-gray-200 last:border-b-0">
              <th scope="row" className="px-4 py-3 align-top font-semibold text-gray-800">
                {row.term}
              </th>
              {row.cells.map((cell, position) => (
                <td key={`${row.term}-${columns[position + 1]}`} className="px-4 py-3 align-top text-gray-700">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
