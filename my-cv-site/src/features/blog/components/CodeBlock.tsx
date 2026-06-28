type CodeBlockProps = {
  /** Raw source. A single leading/trailing newline is trimmed for convenience. */
  code: string;
  /** Language label shown in the header pill, e.g. `tsx`, `bash`, `json`. */
  lang?: string;
  /** Optional file name shown on the left of the header. */
  filename?: string;
};

/**
 * Dependency-free code block. We deliberately avoid a runtime syntax highlighter:
 * it keeps the strict CSP intact (no injected inline styles/scripts) and the
 * component fully unit-testable. Styling leans on a dark surface + monospace.
 */
export function CodeBlock({ code, lang, filename }: CodeBlockProps) {
  const body = code.replace(/^\n/, "").replace(/\n\s*$/, "");
  const showHeader = Boolean(filename || lang);

  return (
    <figure className="my-6 overflow-hidden rounded-xl border border-gray-800 bg-gray-900 shadow-sm">
      {showHeader && (
        <div className="flex items-center justify-between border-b border-gray-800 px-4 py-2">
          <span className="font-mono text-xs text-gray-400">{filename ?? ""}</span>
          {lang && (
            <span className="rounded bg-gray-800 px-2 py-0.5 font-mono text-[0.7rem] uppercase tracking-wide text-gray-400">
              {lang}
            </span>
          )}
        </div>
      )}
      <pre className="overflow-x-auto px-4 py-4 text-sm leading-relaxed text-gray-100">
        <code className="font-mono">{body}</code>
      </pre>
    </figure>
  );
}
