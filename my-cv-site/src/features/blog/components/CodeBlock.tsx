type CodeBlockProps = {
  code: string;
  lang?: string;
  filename?: string;
};

export function CodeBlock({ code, lang, filename }: CodeBlockProps) {
  const body = code.replace(/^\n/, "").replace(/\n\s*$/, "");
  const showHeader = Boolean(filename || lang);
  const regionLabel = filename ?? lang;

  return (
    <figure className="my-6 overflow-hidden rounded-xl border border-gray-800 bg-gray-900 shadow-sm">
      {showHeader && (
        <figcaption className="flex items-center justify-between border-b border-gray-800 px-4 py-2">
          <span className="font-mono text-xs text-gray-400">{filename ?? ""}</span>
          {lang && (
            <span className="rounded bg-gray-800 px-2 py-0.5 font-mono text-xs uppercase tracking-wide text-gray-400">
              {lang}
            </span>
          )}
        </figcaption>
      )}
      <pre
        tabIndex={0}
        role="region"
        aria-label={regionLabel ? `Code: ${regionLabel}` : "Code"}
        className="overflow-x-auto px-4 py-4 text-sm leading-relaxed text-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-emerald-300"
      >
        <code lang="en" className="font-mono">
          {body}
        </code>
      </pre>
    </figure>
  );
}
