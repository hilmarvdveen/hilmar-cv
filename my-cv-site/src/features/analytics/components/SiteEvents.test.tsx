import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { act, fireEvent, render } from "@testing-library/react";
import { SiteEvents } from "./SiteEvents";

const state = vi.hoisted(() => ({ path: "/en" }));

vi.mock("@/i18n/navigation", () => ({
  usePathname: () => state.path,
}));

const pushSiteEvent = vi.hoisted(() => vi.fn());
vi.mock("@/lib/analytics/events", () => ({ pushSiteEvent }));

type IntersectionCallback = (entries: { isIntersecting: boolean; target: Element }[]) => void;

const observed = vi.hoisted(() => ({
  instances: [] as { callback: IntersectionCallback; elements: Element[] }[],
}));

class StubIntersectionObserver {
  private entry: { callback: IntersectionCallback; elements: Element[] };
  constructor(callback: IntersectionCallback) {
    this.entry = { callback, elements: [] };
    observed.instances.push(this.entry);
  }
  observe(element: Element) {
    this.entry.elements.push(element);
  }
  unobserve(element: Element) {
    this.entry.elements = this.entry.elements.filter((candidate) => candidate !== element);
  }
  disconnect() {}
}

const appendedElements: HTMLElement[] = [];

function appendAnchor(href: string, placement?: string): HTMLAnchorElement {
  const anchor = document.createElement("a");
  anchor.setAttribute("href", href);
  if (placement) anchor.setAttribute("data-placement", placement);
  anchor.textContent = "Link";
  document.body.appendChild(anchor);
  appendedElements.push(anchor);
  return anchor;
}

function appendTrackedSection(section: string): HTMLDivElement {
  const element = document.createElement("div");
  element.setAttribute("data-track-section", section);
  document.body.appendChild(element);
  appendedElements.push(element);
  return element;
}

beforeEach(() => {
  state.path = "/en";
  pushSiteEvent.mockClear();
  observed.instances = [];
  vi.stubGlobal("IntersectionObserver", StubIntersectionObserver);
});

afterEach(() => {
  appendedElements.forEach((element) => element.remove());
  appendedElements.length = 0;
});

describe("SiteEvents", () => {
  it("pushes cta_click with the placement and path when a booking link is clicked", () => {
    const anchor = appendAnchor("/en/book", "hero");
    render(<SiteEvents />);
    fireEvent.click(anchor);
    expect(pushSiteEvent).toHaveBeenCalledWith("cta_click", {
      placement: "hero",
      path: "/en",
    });
  });

  it("falls back to unlabelled when a booking link carries no placement", () => {
    const anchor = appendAnchor("/book");
    render(<SiteEvents />);
    fireEvent.click(anchor);
    expect(pushSiteEvent).toHaveBeenCalledWith("cta_click", {
      placement: "unlabelled",
      path: "/en",
    });
  });

  it("pushes contact_click with the placement and path when a contact link is clicked", () => {
    const anchor = appendAnchor("/en/contact", "close");
    render(<SiteEvents />);
    fireEvent.click(anchor);
    expect(pushSiteEvent).toHaveBeenCalledWith("contact_click", {
      placement: "close",
      path: "/en",
    });
  });

  it("pushes link_click with the placement, destination and path for any other labelled link", () => {
    const anchor = appendAnchor("https://wa.me/31681049847", "footer-whatsapp");
    render(<SiteEvents />);
    fireEvent.click(anchor);
    expect(pushSiteEvent).toHaveBeenCalledWith("link_click", {
      placement: "footer-whatsapp",
      destination: "https://wa.me/31681049847",
      path: "/en",
    });
  });

  it("pushes only contact_click for a labelled contact link, never link_click as well", () => {
    const anchor = appendAnchor("/en/contact", "about-close-contact");
    render(<SiteEvents />);
    fireEvent.click(anchor);
    expect(pushSiteEvent).toHaveBeenCalledTimes(1);
    expect(pushSiteEvent).toHaveBeenCalledWith("contact_click", {
      placement: "about-close-contact",
      path: "/en",
    });
  });

  it("ignores a click on an unlabelled link that is neither a booking nor a contact link", () => {
    const anchor = appendAnchor("/about");
    render(<SiteEvents />);
    fireEvent.click(anchor);
    expect(pushSiteEvent).not.toHaveBeenCalled();
  });

  it("ignores a click that never reaches an anchor", () => {
    const button = document.createElement("button");
    button.textContent = "Not a link";
    document.body.appendChild(button);
    appendedElements.push(button);
    render(<SiteEvents />);
    fireEvent.click(button);
    expect(pushSiteEvent).not.toHaveBeenCalled();
  });

  it("ignores a click whose target is not an element", () => {
    const textNode = document.createTextNode("Plain text");
    document.body.appendChild(textNode);
    render(<SiteEvents />);
    textNode.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(pushSiteEvent).not.toHaveBeenCalled();
    textNode.remove();
  });

  it("ignores a click on an anchor with no href", () => {
    const anchor = document.createElement("a");
    anchor.textContent = "No destination";
    document.body.appendChild(anchor);
    appendedElements.push(anchor);
    render(<SiteEvents />);
    fireEvent.click(anchor);
    expect(pushSiteEvent).not.toHaveBeenCalled();
  });

  it("reads the placement and path at the moment of the click after a route change", () => {
    const anchor = appendAnchor("/en/book", "sticky-bar");
    const { rerender } = render(<SiteEvents />);
    state.path = "/en/experience";
    rerender(<SiteEvents />);
    fireEvent.click(anchor);
    expect(pushSiteEvent).toHaveBeenCalledWith("cta_click", {
      placement: "sticky-bar",
      path: "/en/experience",
    });
  });

  it("pushes section_view once when a tracked section enters view", () => {
    const target = appendTrackedSection("results-strip");
    render(<SiteEvents />);
    const [observer] = observed.instances;

    act(() => observer.callback([{ isIntersecting: true, target }]));
    expect(pushSiteEvent).toHaveBeenCalledWith("section_view", { section: "results-strip" });

    pushSiteEvent.mockClear();
    act(() => observer.callback([{ isIntersecting: true, target }]));
    expect(pushSiteEvent).not.toHaveBeenCalled();
  });

  it("ignores an intersection entry that has not become visible", () => {
    const target = appendTrackedSection("results-strip");
    render(<SiteEvents />);
    const [observer] = observed.instances;

    act(() => observer.callback([{ isIntersecting: false, target }]));
    expect(pushSiteEvent).not.toHaveBeenCalled();
  });

  it("sets up no observer when the page has no tracked section", () => {
    render(<SiteEvents />);
    expect(observed.instances).toHaveLength(0);
  });
});
