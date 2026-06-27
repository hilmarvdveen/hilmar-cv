/**
 * Escape a string for safe interpolation into HTML email bodies.
 * User-supplied values (name, message, etc.) are rendered in mail clients,
 * so they must never carry raw HTML/markup.
 */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
