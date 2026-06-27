type FlagProps = {
  /** Locale code: "nl" renders the Dutch flag, anything else the US flag. */
  code: string;
  className?: string;
};

/**
 * Inline SVG flags. Flag *emoji* (🇺🇸/🇳🇱) don't render on Windows and some
 * browsers (they fall back to the "US"/"NL" letter pair), so we draw the flags
 * as SVG to guarantee they're visible everywhere. Decorative — the adjacent
 * locale label conveys the meaning, so these are aria-hidden.
 */
export function Flag({ code, className = "w-5 h-3.5 rounded-sm" }: FlagProps) {
  if (code === "nl") {
    return (
      <svg className={className} viewBox="0 0 9 6" aria-hidden="true" role="img">
        <rect width="9" height="6" fill="#fff" />
        <rect width="9" height="2" fill="#AE1C28" />
        <rect y="4" width="9" height="2" fill="#21468B" />
      </svg>
    );
  }

  // United States (used for the English locale).
  return (
    <svg className={className} viewBox="0 0 19 10" aria-hidden="true" role="img">
      <rect width="19" height="10" fill="#fff" />
      {[0, 2, 4, 6, 8, 10, 12].map((i) => (
        <rect key={i} y={(i * 10) / 13} width="19" height={10 / 13} fill="#B22234" />
      ))}
      <rect width="7.6" height={(7 * 10) / 13} fill="#3C3B6E" />
      {[0.9, 2.5, 4.1].map((cy) =>
        [1, 2.5, 4, 5.5, 7].map((cx) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="0.28" fill="#fff" />
        ))
      )}
    </svg>
  );
}
