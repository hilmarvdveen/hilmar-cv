import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { renderToString } from "react-dom/server";
import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { BEATS, FILM_TABS, beatEndState, beatLengthMilliseconds, type BeatRenderState } from "@/lib/smartEnergyFilm/film";
import type { Orientation } from "@/lib/smartEnergyFilm/layout";
import { smartEnergyFilmLabels } from "../smartEnergyFilmLabels";
import { SmartEnergyPosterExplainer } from "./SmartEnergyPosterExplainer";

vi.mock("./SmartEnergyFilmPoster", () => ({
  SmartEnergyFilmPoster: ({
    state,
    orientation,
    reducedMotion,
  }: {
    state: BeatRenderState;
    orientation: Orientation;
    reducedMotion?: boolean;
  }) => <p>{`poster ${state.tab} ${state.beat.id} ${orientation} ${reducedMotion ? "reduced" : "motion"} ${state.progress}`}</p>,
}));

type ObserverCallback = (entries: { isIntersecting: boolean }[]) => void;

let observerCallback: ObserverCallback = () => undefined;
let observedThreshold: number | undefined;

class FakeObserver {
  constructor(callback: ObserverCallback, options?: IntersectionObserverInit) {
    observerCallback = callback;
    observedThreshold = options?.threshold as number | undefined;
  }
  observe = vi.fn();
  disconnect = vi.fn();
}

const frameCallbacks = new Map<number, FrameRequestCallback>();
let nextHandle = 1;
let clock = 1000;

const pendingFrames = () => frameCallbacks.size;

const runPendingFrames = () => {
  const pending = [...frameCallbacks.values()];
  frameCallbacks.clear();
  for (const callback of pending) {
    callback(clock);
  }
};

const advance = (milliseconds: number) => {
  act(() => {
    runPendingFrames();
    for (let spent = 0; spent < milliseconds; spent += 100) {
      clock += 100;
      runPendingFrames();
    }
  });
};

const installMedia = (reduced: boolean, wide: boolean) => {
  vi.stubGlobal(
    "matchMedia",
    vi.fn((media: string) => ({
      media,
      matches: media.includes("prefers-reduced-motion") ? reduced : wide,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
    })),
  );
};

const scrollIntoView = (visible: boolean) => {
  act(() => observerCallback([{ isIntersecting: visible }]));
};

const labels = smartEnergyFilmLabels("en");

const tabNamed = (name: string) => screen.getByRole("tab", { name });

const indicator = (current: number, total: number) => `Beat ${current} of ${total}`;

const next = () => screen.getByRole("button", { name: labels.next });

const previous = () => screen.getByRole("button", { name: labels.previous });

const status = () => screen.getByRole("status");

const shownCaption = (text: string) => {
  const element = screen.getByText(text);
  expect(element.closest('[aria-hidden="true"]')).not.toBeNull();
  return element;
};

const stepNext = (times: number) => {
  for (let count = 0; count < times; count += 1) {
    fireEvent.click(next());
  }
};

beforeEach(() => {
  frameCallbacks.clear();
  nextHandle = 1;
  clock = 1000;
  installMedia(false, true);
  vi.stubGlobal("IntersectionObserver", FakeObserver);
  vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
    const handle = nextHandle++;
    frameCallbacks.set(handle, callback);
    return handle;
  });
  vi.stubGlobal("cancelAnimationFrame", (handle: number) => {
    frameCallbacks.delete(handle);
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("SmartEnergyPosterExplainer structure", () => {
  it("renders a figure with a labelled tablist, seven tabs and a panel", () => {
    render(<SmartEnergyPosterExplainer locale="en" />);
    expect(screen.getByRole("figure")).toBeInTheDocument();
    expect(screen.getByRole("tablist", { name: labels.tablistLabel })).toBeInTheDocument();
    const tabs = screen.getAllByRole("tab");
    expect(tabs).toHaveLength(7);
    expect(tabs.map((tab) => tab.textContent)).toEqual(FILM_TABS.map((tab) => labels.tabs[tab]));
    expect(tabs[0]).toHaveAttribute("aria-selected", "true");
    expect(tabs[0]).toHaveAttribute("tabindex", "0");
    expect(tabs[1]).toHaveAttribute("aria-selected", "false");
    expect(tabs[1]).toHaveAttribute("tabindex", "-1");
    expect(tabs[1]).not.toHaveAttribute("aria-controls");
    const panel = screen.getByRole("tabpanel");
    expect(tabs[0]).toHaveAttribute("aria-controls", panel.id);
    expect(panel).toHaveAccessibleName(tabs[0].textContent as string);
    expect(within(panel).getByText(/^poster overview orient landscape motion/)).toBeInTheDocument();
    expect(screen.queryByText("1 / 7")).not.toBeInTheDocument();
    expect(status()).toBeEmptyDOMElement();
    expect(observedThreshold).toBe(0.5);
  });

  it("shows the beat indicator and the caption of the first beat", () => {
    render(<SmartEnergyPosterExplainer locale="en" />);
    expect(screen.getByText(indicator(1, BEATS.overview.length))).toBeInTheDocument();
    const caption = labels.captions.overview.orient;
    shownCaption(caption.headline);
    shownCaption(caption.detail);
    shownCaption(caption.why);
  });

  it("lists every beat of the active tab in the text version", () => {
    render(<SmartEnergyPosterExplainer locale="en" />);
    fireEvent.click(tabNamed(labels.tabs.command));
    const list = screen.getByRole("list", { name: labels.textVersion });
    const items = within(list).getAllByRole("listitem");
    expect(items).toHaveLength(BEATS.command.length);
    BEATS.command.forEach((beat, index) => {
      const caption = labels.captions.command[beat.id];
      expect(items[index]).toHaveTextContent(`${caption.headline}. ${caption.detail} ${caption.why}`);
    });
  });

  it("shows only the legend kinds of the current beat with their words", () => {
    render(<SmartEnergyPosterExplainer locale="en" />);
    BEATS.reading.forEach((_beat, index) => {
      if (index === 0) {
        fireEvent.click(tabNamed(labels.tabs.reading));
      } else {
        fireEvent.click(next());
      }
      const kinds = beatEndState("reading", index).legend;
      if (kinds.length === 0) {
        expect(screen.queryByRole("list", { name: labels.legendLabel })).not.toBeInTheDocument();
        return;
      }
      const legend = screen.getByRole("list", { name: labels.legendLabel });
      expect(within(legend).getAllByRole("listitem").map((item) => item.textContent)).toEqual(
        kinds.map((kind) => labels.legend[kind]),
      );
    });
  });

  it("renders Dutch words and keeps the controls labelled", () => {
    render(<SmartEnergyPosterExplainer locale="nl" />);
    const dutch = smartEnergyFilmLabels("nl");
    expect(screen.getByRole("tablist", { name: dutch.tablistLabel })).toBeInTheDocument();
    expect(tabNamed(dutch.tabs.overview)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: dutch.pause })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: dutch.next })).toBeInTheDocument();
    expect(screen.getByRole("list", { name: dutch.textVersion })).toBeInTheDocument();
    expect(screen.getByText(dutch.beatIndicator.replace("{current}", "1").replace("{total}", String(BEATS.overview.length)))).toBeInTheDocument();
  });

  it("renders the phone poster in portrait under the sm breakpoint", () => {
    installMedia(false, false);
    render(<SmartEnergyPosterExplainer locale="en" />);
    expect(screen.getByText(/^poster overview orient portrait/)).toBeInTheDocument();
  });

  it("renders the landscape poster on the server before the width is known", () => {
    installMedia(false, false);
    const html = renderToString(<SmartEnergyPosterExplainer locale="en" />);
    expect(html).toContain("poster overview orient landscape");
  });

  it("shows the gates line only on the gates beat of the cloud tab", () => {
    render(<SmartEnergyPosterExplainer locale="en" />);
    fireEvent.click(tabNamed(labels.tabs.cloud));
    const gatesIndex = BEATS.cloud.findIndex((beat) => beat.id === "gates");
    stepNext(gatesIndex - 1);
    expect(status()).not.toHaveTextContent(labels.gatesLine);
    stepNext(1);
    expect(status()).toHaveTextContent(labels.gatesLine);
    const items = within(screen.getByRole("list", { name: labels.textVersion })).getAllByRole("listitem");
    items.forEach((item, index) => {
      if (index === gatesIndex) {
        expect(item).toHaveTextContent(labels.gatesLine);
      } else {
        expect(item).not.toHaveTextContent(labels.gatesLine);
      }
    });
  });

  it("keeps only the beat indicator in the figure name and the caption out of reading mode", () => {
    render(<SmartEnergyPosterExplainer locale="en" />);
    const caption = screen.getByText(indicator(1, BEATS.overview.length)).closest("figcaption") as HTMLElement;
    expect(within(caption).queryAllByRole("button")).toHaveLength(0);
    expect(within(caption).queryAllByRole("list")).toHaveLength(0);
    expect(within(caption).queryByText(labels.captions.overview.orient.headline)).toBeInTheDocument();
    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
  });
});

describe("SmartEnergyPosterExplainer tabs", () => {
  it("selects a tab on click and starts at its first beat", () => {
    render(<SmartEnergyPosterExplainer locale="en" />);
    fireEvent.click(tabNamed(labels.tabs.safety));
    expect(tabNamed(labels.tabs.safety)).toHaveAttribute("aria-selected", "true");
    expect(tabNamed(labels.tabs.overview)).toHaveAttribute("aria-selected", "false");
    expect(screen.getByText(/^poster safety orient/)).toBeInTheDocument();
    expect(screen.getByText(indicator(1, BEATS.safety.length))).toBeInTheDocument();
  });

  it("moves with Right and Left and wraps at both ends", () => {
    render(<SmartEnergyPosterExplainer locale="en" />);
    fireEvent.keyDown(tabNamed(labels.tabs.overview), { key: "ArrowRight" });
    expect(tabNamed(labels.tabs.reading)).toHaveAttribute("aria-selected", "true");
    expect(tabNamed(labels.tabs.reading)).toHaveFocus();
    fireEvent.keyDown(tabNamed(labels.tabs.reading), { key: "ArrowLeft" });
    expect(tabNamed(labels.tabs.overview)).toHaveAttribute("aria-selected", "true");
    fireEvent.keyDown(tabNamed(labels.tabs.overview), { key: "ArrowLeft" });
    expect(tabNamed(labels.tabs.cloud)).toHaveAttribute("aria-selected", "true");
    expect(tabNamed(labels.tabs.cloud)).toHaveFocus();
    fireEvent.keyDown(tabNamed(labels.tabs.cloud), { key: "ArrowRight" });
    expect(tabNamed(labels.tabs.overview)).toHaveAttribute("aria-selected", "true");
  });

  it("jumps with Home and End and ignores other keys", () => {
    render(<SmartEnergyPosterExplainer locale="en" />);
    fireEvent.keyDown(tabNamed(labels.tabs.overview), { key: "End" });
    expect(tabNamed(labels.tabs.cloud)).toHaveAttribute("aria-selected", "true");
    fireEvent.keyDown(tabNamed(labels.tabs.cloud), { key: "Home" });
    expect(tabNamed(labels.tabs.overview)).toHaveAttribute("aria-selected", "true");
    const notPrevented = fireEvent.keyDown(tabNamed(labels.tabs.overview), { key: "a" });
    expect(notPrevented).toBe(true);
    expect(tabNamed(labels.tabs.overview)).toHaveAttribute("aria-selected", "true");
  });
});

describe("SmartEnergyPosterExplainer previous and next", () => {
  it("disables Previous on the first beat and Next on the last beat", () => {
    render(<SmartEnergyPosterExplainer locale="en" />);
    expect(previous()).toBeDisabled();
    expect(next()).toBeEnabled();
    fireEvent.keyDown(tabNamed(labels.tabs.overview), { key: "End" });
    stepNext(BEATS.cloud.length - 1);
    expect(next()).toBeDisabled();
    expect(previous()).toBeEnabled();
    expect(previous()).toHaveFocus();
    expect(screen.getByText(indicator(BEATS.cloud.length, BEATS.cloud.length))).toBeInTheDocument();
  });

  it("moves to the first beat of the next tab from the last beat", () => {
    render(<SmartEnergyPosterExplainer locale="en" />);
    stepNext(BEATS.overview.length - 1);
    expect(tabNamed(labels.tabs.overview)).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText(indicator(BEATS.overview.length, BEATS.overview.length))).toBeInTheDocument();
    fireEvent.click(next());
    expect(tabNamed(labels.tabs.reading)).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText(indicator(1, BEATS.reading.length))).toBeInTheDocument();
    expect(screen.getByText(/^poster reading orient/)).toBeInTheDocument();
  });

  it("moves to the last beat of the previous tab from the first beat", () => {
    render(<SmartEnergyPosterExplainer locale="en" />);
    fireEvent.click(tabNamed(labels.tabs.reading));
    fireEvent.click(previous());
    expect(tabNamed(labels.tabs.overview)).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText(indicator(BEATS.overview.length, BEATS.overview.length))).toBeInTheDocument();
    expect(previous()).toBeEnabled();
  });

  it("moves focus to Next when Previous reaches the very first beat", () => {
    render(<SmartEnergyPosterExplainer locale="en" />);
    fireEvent.click(next());
    fireEvent.click(previous());
    expect(previous()).toBeDisabled();
    expect(next()).toHaveFocus();
  });

  it("shows the settled end state of the beat after a manual step", () => {
    render(<SmartEnergyPosterExplainer locale="en" />);
    fireEvent.click(next());
    expect(screen.getByText(/^poster overview readingsIn landscape motion 1$/)).toBeInTheDocument();
  });
});

describe("SmartEnergyPosterExplainer playback", () => {
  it("does not run until at least half of the figure is in view", () => {
    render(<SmartEnergyPosterExplainer locale="en" />);
    expect(pendingFrames()).toBe(0);
    scrollIntoView(true);
    expect(pendingFrames()).toBe(1);
    scrollIntoView(false);
    expect(pendingFrames()).toBe(0);
  });

  it("advances beat by beat and fills the tab progress", () => {
    render(<SmartEnergyPosterExplainer locale="en" />);
    const fillOf = (name: string) => tabNamed(name).lastElementChild as HTMLElement;
    expect(fillOf(labels.tabs.overview)).toHaveStyle({ transform: "scaleX(0)" });
    expect(tabNamed(labels.tabs.reading).children).toHaveLength(0);
    scrollIntoView(true);
    advance(beatLengthMilliseconds(BEATS.overview[0]) + 200);
    expect(screen.getByText(indicator(2, BEATS.overview.length))).toBeInTheDocument();
    expect(fillOf(labels.tabs.overview)).not.toHaveStyle({ transform: "scaleX(0)" });
  });

  it("crosses into the next tab while playing", () => {
    render(<SmartEnergyPosterExplainer locale="en" />);
    scrollIntoView(true);
    const overviewLength = BEATS.overview.reduce((sum, beat) => sum + beatLengthMilliseconds(beat), 0);
    advance(overviewLength + 400);
    expect(tabNamed(labels.tabs.reading)).toHaveAttribute("aria-selected", "true");
  });

  it("plays one pass, stops on the last beat and restarts from the first on Play", () => {
    render(<SmartEnergyPosterExplainer locale="en" />);
    scrollIntoView(true);
    const pass = FILM_TABS.reduce((sum, tab) => sum + BEATS[tab].reduce((inner, beat) => inner + beatLengthMilliseconds(beat), 0), 0);
    advance(pass + 2000);
    expect(tabNamed(labels.tabs.cloud)).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText(indicator(BEATS.cloud.length, BEATS.cloud.length))).toBeInTheDocument();
    expect(pendingFrames()).toBe(0);
    expect(screen.getByRole("button", { name: labels.play })).toBeInTheDocument();
    expect(next()).toBeDisabled();
    fireEvent.click(screen.getByRole("button", { name: labels.play }));
    expect(tabNamed(labels.tabs.overview)).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText(indicator(1, BEATS.overview.length))).toBeInTheDocument();
    expect(screen.getByRole("button", { name: labels.pause })).toBeInTheDocument();
    expect(pendingFrames()).toBe(1);
  });

  it("toggles between Pause and Play and keeps the beat when resuming", () => {
    render(<SmartEnergyPosterExplainer locale="en" />);
    scrollIntoView(true);
    fireEvent.click(screen.getByRole("button", { name: labels.pause }));
    expect(screen.getByRole("button", { name: labels.play })).toBeInTheDocument();
    expect(pendingFrames()).toBe(0);
    fireEvent.click(screen.getByRole("button", { name: labels.play }));
    expect(screen.getByRole("button", { name: labels.pause })).toBeInTheDocument();
    expect(pendingFrames()).toBe(1);
    expect(screen.getByText(indicator(1, BEATS.overview.length))).toBeInTheDocument();
  });

  it("stops autoplay on a manual step until Play is pressed", () => {
    render(<SmartEnergyPosterExplainer locale="en" />);
    scrollIntoView(true);
    fireEvent.click(next());
    expect(pendingFrames()).toBe(0);
    expect(screen.getByRole("button", { name: labels.play })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: labels.play }));
    expect(pendingFrames()).toBe(1);
    advance(300);
    expect(screen.getByText(indicator(3, BEATS.overview.length))).toBeInTheDocument();
  });

  it("stops autoplay on a tab click", () => {
    render(<SmartEnergyPosterExplainer locale="en" />);
    scrollIntoView(true);
    fireEvent.click(tabNamed(labels.tabs.command));
    expect(pendingFrames()).toBe(0);
    expect(screen.getByRole("button", { name: labels.play })).toBeInTheDocument();
  });

  it("keeps running while the pointer or focus rests inside", () => {
    render(<SmartEnergyPosterExplainer locale="en" />);
    scrollIntoView(true);
    fireEvent.pointerEnter(screen.getByRole("figure"));
    fireEvent.focus(tabNamed(labels.tabs.overview));
    expect(pendingFrames()).toBe(1);
  });
});

describe("SmartEnergyPosterExplainer live region", () => {
  it("stays empty during autoplay", () => {
    render(<SmartEnergyPosterExplainer locale="en" />);
    scrollIntoView(true);
    advance(beatLengthMilliseconds(BEATS.overview[0]) + 200);
    expect(status()).toBeEmptyDOMElement();
  });

  it("announces the current caption when stepping by hand and clears on Play", () => {
    render(<SmartEnergyPosterExplainer locale="en" />);
    fireEvent.click(next());
    const caption = labels.captions.overview.readingsIn;
    expect(status()).toHaveTextContent(`${caption.headline}. ${caption.detail} ${caption.why}`);
    fireEvent.click(screen.getByRole("button", { name: labels.play }));
    expect(status()).toBeEmptyDOMElement();
  });

  it("announces only the tab name and the first headline when a tab is chosen", () => {
    render(<SmartEnergyPosterExplainer locale="en" />);
    fireEvent.keyDown(tabNamed(labels.tabs.overview), { key: "ArrowRight" });
    expect(status()).toHaveTextContent(`${labels.tabs.reading}. ${labels.captions.reading.orient.headline}`);
    expect(status()).not.toHaveTextContent(labels.captions.reading.orient.detail);
  });

  it("prefixes the tab name when a step crosses a tab border", () => {
    render(<SmartEnergyPosterExplainer locale="en" />);
    stepNext(BEATS.overview.length);
    const caption = labels.captions.reading.orient;
    expect(status()).toHaveTextContent(`${labels.tabs.reading}. ${caption.headline}. ${caption.detail} ${caption.why}`);
    fireEvent.click(previous());
    expect(status()).toHaveTextContent(labels.tabs.overview);
  });

  it("stays empty when the visitor pauses", () => {
    render(<SmartEnergyPosterExplainer locale="en" />);
    scrollIntoView(true);
    fireEvent.click(screen.getByRole("button", { name: labels.pause }));
    expect(status()).toBeEmptyDOMElement();
  });
});

describe("SmartEnergyPosterExplainer reduced motion", () => {
  beforeEach(() => {
    installMedia(true, true);
  });

  it("never autoplays and offers no Play, Pause or progress fill", () => {
    render(<SmartEnergyPosterExplainer locale="en" />);
    scrollIntoView(true);
    expect(pendingFrames()).toBe(0);
    expect(screen.queryByRole("button", { name: labels.play })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: labels.pause })).not.toBeInTheDocument();
    expect(tabNamed(labels.tabs.overview).children).toHaveLength(0);
  });

  it("renders the end state with reducedMotion and steps instantly", () => {
    render(<SmartEnergyPosterExplainer locale="en" />);
    expect(screen.getByText(/^poster overview orient landscape reduced 1$/)).toBeInTheDocument();
    fireEvent.click(next());
    expect(screen.getByText(/^poster overview readingsIn landscape reduced 1$/)).toBeInTheDocument();
    fireEvent.click(tabNamed(labels.tabs.command));
    expect(screen.getByText(/^poster command orient landscape reduced 1$/)).toBeInTheDocument();
  });
});
