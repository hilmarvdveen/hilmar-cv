import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";

export function ProseDetails({ summary, children }: { summary: string; children: ReactNode }) {
  return (
    <details className="group my-8 border-y border-gray-200 py-1">
      <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 rounded-sm py-2 text-base text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 [&::-webkit-details-marker]:hidden">
        <span>{summary}</span>
        <ChevronDown
          className="h-4 w-4 flex-shrink-0 text-gray-600 motion-safe:transition-transform group-open:rotate-180"
          aria-hidden="true"
        />
      </summary>
      <div className="pb-4 pt-2">{children}</div>
    </details>
  );
}
