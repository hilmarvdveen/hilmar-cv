import { describe, it, expect, vi, beforeEach } from "vitest";
import { act, render, screen } from "@testing-library/react";
import { StickyCallToActionBar } from "./StickyCallToActionBar";

const state = vi.hoisted(() => ({ path: "/" }));

vi.mock("next-intl", async () => (await import("@/test/intl")).intlMock());
vi.mock("@/i18n/navigation", () => ({
  Link: ({ children, href, ...rest }: { children: React.ReactNode; href: string }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
  usePathname: () => state.path,
}));

type IntersectionEntry = { isIntersecting: boolean };
type IntersectionCallback = (entries: IntersectionEntry[]) => void;

const observed = vi.hoisted(() => ({
  observers: [] as { callback: IntersectionCallback; target: Element }[],
}));

class StubIntersectionObserver {
  constructor(private callback: IntersectionCallback) {}
  observe(target: Element) {
    observed.observers.push({ callback: this.callback, target });
  }
  disconnect() {}
  unobserve() {}
}

class StubResizeObserver {
  observe() {}
  disconnect() {}
}

const triggerLastObserver = (isIntersecting: boolean) => {
  const last = observed.observers[observed.observers.length - 1];
  act(() => last?.callback([{ isIntersecting }]));
};

beforeEach(() => {
  state.path = "/";
  observed.observers = [];
  vi.stubGlobal("IntersectionObserver", StubIntersectionObserver);
  vi.stubGlobal("ResizeObserver", StubResizeObserver);
});

const hero = () => (
  <>
    <main>
      <section>Hero content</section>
    </main>
    <StickyCallToActionBar />
  </>
);

const renderWithHero = () => render(hero());

describe("StickyCallToActionBar", () => {
  it("stays hidden while the hero is still in view", () => {
    renderWithHero();
    expect(screen.queryByRole("link", { name: "nav.book" })).not.toBeInTheDocument();
  });

  it("shows the booking action once the hero scrolls out of view", () => {
    renderWithHero();
    triggerLastObserver(false);
    expect(screen.getByRole("link", { name: "nav.book" })).toHaveAttribute(
      "href",
      "/book"
    );
  });

  it("hides again once the hero comes back into view", () => {
    renderWithHero();
    triggerLastObserver(false);
    expect(screen.getByRole("link", { name: "nav.book" })).toBeInTheDocument();
    triggerLastObserver(true);
    expect(screen.queryByRole("link", { name: "nav.book" })).not.toBeInTheDocument();
  });

  it("sets up no observer when the page has no hero to watch", () => {
    render(
      <>
        <main />
        <StickyCallToActionBar />
      </>
    );
    expect(observed.observers).toHaveLength(0);
  });

  it("never appears on the booking page, which already has its own bar", () => {
    state.path = "/book";
    renderWithHero();
    expect(observed.observers).toHaveLength(0);
    expect(screen.queryByRole("link", { name: "nav.book" })).not.toBeInTheDocument();
  });

  it("resets to hidden when the route changes without a full remount", () => {
    const { rerender } = renderWithHero();
    triggerLastObserver(false);
    expect(screen.getByRole("link", { name: "nav.book" })).toBeInTheDocument();

    state.path = "/about";
    rerender(hero());
    expect(screen.queryByRole("link", { name: "nav.book" })).not.toBeInTheDocument();

    triggerLastObserver(false);
    expect(screen.getByRole("link", { name: "nav.book" })).toBeInTheDocument();
  });
});
