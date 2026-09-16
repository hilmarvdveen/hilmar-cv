import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { act, render, screen } from "@testing-library/react";
import { ANALYTICS_CONSENT_KEY, storeConsent } from "@/features/analytics/consentStore";
import { STORAGE_EVENT } from "@/lib/analytics/consentChoice";
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
  localStorage.clear();
  vi.stubEnv("NODE_ENV", "production");
  vi.stubEnv("NEXT_PUBLIC_GTM_ID", "GTM-EXAMPLE");
  vi.stubGlobal("IntersectionObserver", StubIntersectionObserver);
  vi.stubGlobal("ResizeObserver", StubResizeObserver);
});

afterEach(() => {
  vi.unstubAllEnvs();
});

const hero = () => (
  <>
    <main>
      <section>Hero content</section>
    </main>
    <StickyCallToActionBar />
  </>
);

const storeChoiceBeforeTheVisit = (granted: boolean) => {
  localStorage.setItem(ANALYTICS_CONSENT_KEY, granted ? "granted" : "denied");
};

const renderWithHero = () => {
  storeChoiceBeforeTheVisit(true);
  return render(hero());
};

const bookingAction = () => screen.queryByRole("link", { name: "nav.book" });

describe("StickyCallToActionBar", () => {
  it("stays hidden while the hero is still in view", () => {
    renderWithHero();
    expect(bookingAction()).not.toBeInTheDocument();
  });

  it("shows the booking action once the hero scrolls out of view", () => {
    renderWithHero();
    triggerLastObserver(false);
    expect(screen.getByRole("link", { name: "nav.book" })).toHaveAttribute("href", "/book");
  });

  it("renders the booking action at the medium primary button size", () => {
    renderWithHero();
    triggerLastObserver(false);
    expect(screen.getByRole("link", { name: "nav.book" }).className).toContain("py-2.5");
  });

  it("hides again once the hero comes back into view", () => {
    renderWithHero();
    triggerLastObserver(false);
    expect(bookingAction()).toBeInTheDocument();
    triggerLastObserver(true);
    expect(bookingAction()).not.toBeInTheDocument();
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
    expect(bookingAction()).not.toBeInTheDocument();
  });

  it("resets to hidden when the route changes without a full remount", () => {
    const { rerender } = renderWithHero();
    triggerLastObserver(false);
    expect(bookingAction()).toBeInTheDocument();

    state.path = "/about";
    rerender(hero());
    expect(bookingAction()).not.toBeInTheDocument();

    triggerLastObserver(false);
    expect(bookingAction()).toBeInTheDocument();
  });

  it("stays out of the page while the cookie banner still waits for an answer", () => {
    render(hero());
    triggerLastObserver(false);
    expect(bookingAction()).not.toBeInTheDocument();
  });

  it("publishes no bottom bar offset while the cookie banner still waits", () => {
    render(hero());
    triggerLastObserver(false);
    expect(document.documentElement.style.getPropertyValue("--bottom-bar-offset")).toBe("");
  });

  it("appears the moment the visitor accepts, without a reload", () => {
    render(hero());
    triggerLastObserver(false);
    expect(bookingAction()).not.toBeInTheDocument();

    act(() => storeConsent(true));

    expect(bookingAction()).toBeInTheDocument();
    expect(document.documentElement.style.getPropertyValue("--bottom-bar-offset")).toMatch(/px$/);
  });

  it("appears the moment the visitor declines, because the banner is gone either way", () => {
    render(hero());
    triggerLastObserver(false);

    act(() => storeConsent(false));

    expect(bookingAction()).toBeInTheDocument();
  });

  it("appears on a later visit that already carries a stored choice", () => {
    storeChoiceBeforeTheVisit(false);
    render(hero());
    triggerLastObserver(false);
    expect(bookingAction()).toBeInTheDocument();
  });

  it("mounts without a stored choice when the site has no tag manager id", () => {
    vi.stubEnv("NEXT_PUBLIC_GTM_ID", undefined);
    render(hero());
    triggerLastObserver(false);
    expect(bookingAction()).toBeInTheDocument();
  });

  it("mounts without a stored choice outside a production build, where no banner renders", () => {
    vi.stubEnv("NODE_ENV", "development");
    render(hero());
    triggerLastObserver(false);
    expect(bookingAction()).toBeInTheDocument();
  });

  it("follows a choice made in another tab", () => {
    render(hero());
    triggerLastObserver(false);
    expect(bookingAction()).not.toBeInTheDocument();

    storeChoiceBeforeTheVisit(true);
    act(() => {
      window.dispatchEvent(new Event(STORAGE_EVENT));
    });

    expect(bookingAction()).toBeInTheDocument();
  });
});
