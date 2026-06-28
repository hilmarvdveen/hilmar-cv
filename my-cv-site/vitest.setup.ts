import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";
import { createElement } from "react";

// Render the locale-aware next-intl <Link> (used by <Button href>) as a plain
// <a> in tests, so components don't need the routing provider mounted.
vi.mock("@/i18n/navigation", () => ({
  Link: ({
    href,
    children,
    ...rest
  }: {
    href: unknown;
    children?: unknown;
  }) => createElement("a", { href: String(href), ...rest }, children as never),
  usePathname: () => "/",
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }),
  redirect: vi.fn(),
  getPathname: ({ href }: { href: unknown }) => String(href),
}));

afterEach(() => {
  cleanup();
});
