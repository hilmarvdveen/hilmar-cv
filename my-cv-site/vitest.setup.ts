import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";
import { createElement } from "react";

// ReactFlow (used by the blog diagrams) observes container size at mount. jsdom
// ships no ResizeObserver, so provide a no-op stub for component tests.
if (!("ResizeObserver" in globalThis)) {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

// jsdom lacks matchMedia; ReactFlow and a few responsive components read it.
if (!window.matchMedia) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

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
