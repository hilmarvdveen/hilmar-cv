import type { ReactNode } from "react";

/**
 * Typed article primitives. The site has no `@tailwindcss/typography` plugin, so
 * long-form posts compose these instead of relying on a `.prose` cascade. Each
 * element is a small, fully-testable component with consistent rhythm.
 */

/** Turn heading text into a stable anchor id for in-page links / a future TOC. */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

type HeadingProps = { children: ReactNode; id?: string };

function headingId(id: string | undefined, children: ReactNode): string | undefined {
  if (id) return id;
  return typeof children === "string" ? slugify(children) : undefined;
}

export function H2({ children, id }: HeadingProps) {
  return (
    <h2
      id={headingId(id, children)}
      className="scroll-mt-28 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl mt-14 mb-4"
    >
      {children}
    </h2>
  );
}

export function H3({ children, id }: HeadingProps) {
  return (
    <h3
      id={headingId(id, children)}
      className="scroll-mt-28 text-xl font-bold text-gray-900 mt-10 mb-3"
    >
      {children}
    </h3>
  );
}

export function Lead({ children }: { children: ReactNode }) {
  return <p className="text-xl leading-relaxed text-gray-600 mb-8">{children}</p>;
}

export function P({ children }: { children: ReactNode }) {
  return <p className="text-[1.0625rem] leading-relaxed text-gray-700 mb-5">{children}</p>;
}

export function UL({ children }: { children: ReactNode }) {
  return <ul className="mb-6 list-disc space-y-2 pl-6 text-[1.0625rem] text-gray-700">{children}</ul>;
}

export function OL({ children }: { children: ReactNode }) {
  return <ol className="mb-6 list-decimal space-y-2 pl-6 text-[1.0625rem] text-gray-700">{children}</ol>;
}

export function LI({ children }: { children: ReactNode }) {
  return <li className="leading-relaxed">{children}</li>;
}

export function Strong({ children }: { children: ReactNode }) {
  return <strong className="font-semibold text-gray-900">{children}</strong>;
}

export function InlineCode({ children }: { children: ReactNode }) {
  return (
    <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-[0.85em] text-pink-700">
      {children}
    </code>
  );
}

export function A({ href, children }: { href: string; children: ReactNode }) {
  const external = /^https?:\/\//.test(href);
  return (
    <a
      href={href}
      className="font-medium text-blue-600 underline decoration-blue-300 underline-offset-2 hover:text-blue-800"
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </a>
  );
}

export function Divider() {
  return <hr className="my-12 border-gray-200" />;
}

/** A pull-quote / key takeaway block. */
export function Quote({ children }: { children: ReactNode }) {
  return (
    <blockquote className="my-8 border-l-4 border-blue-500 bg-blue-50/60 py-3 pl-5 pr-4 text-lg italic text-gray-700">
      {children}
    </blockquote>
  );
}
