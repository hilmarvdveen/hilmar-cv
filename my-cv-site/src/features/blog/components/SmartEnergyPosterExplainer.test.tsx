import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { CAPTION_COUNT, FILM_TABS } from "@/lib/smartEnergyFilm/film";
import type { FilmFrame } from "@/lib/smartEnergyFilm/film";
import { smartEnergyFilmLabels } from "../smartEnergyFilmLabels";
import { SmartEnergyPosterExplainer } from "./SmartEnergyPosterExplainer";

vi.mock("./SmartEnergyFilmPoster", async (importOriginal) => {
  const original = await importOriginal<typeof import("./SmartEnergyFilmPoster")>();
  return {
    ...original,
    SmartEnergyFilmPoster: ({ frame, chrome }: { frame: FilmFrame; chrome?: string }) => (
      <p>{`stage ${frame.sceneId} ${chrome}`}</p>
    ),
  };
});

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

const runFrame = () => {
  const pending = [...frameCallbacks.values()];
  frameCallbacks.clear();
  act(() => {
    for (const callback of pending) {
      callback(clock);
    }
  });
};

const advance = (milliseconds: number) => {
  runFrame();
  for (let spent = 0; spent < milliseconds; spent += 100) {
    clock += 100;
    runFrame();
  }
};

const installMotion = (reduced: boolean) => {
  vi.stubGlobal(
    "matchMedia",
    vi.fn((media: string) => ({
      media,
      matches: reduced,
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

beforeEach(() => {
  frameCallbacks.clear();
  nextHandle = 1;
  clock = 1000;
  installMotion(false);
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
    expect(screen.getByRole("tablist", { name: "Steps of the platform" })).toBeInTheDocument();
    const tabs = screen.getAllByRole("tab");
    expect(tabs).toHaveLength(7);
    expect(tabs.map((tab) => tab.textContent)).toEqual(FILM_TABS.map((tab) => labels.tabs[tab as keyof typeof labels.tabs]));
    expect(tabs[0]).toHaveAttribute("aria-selected", "true");
    expect(tabs[0]).toHaveAttribute("tabindex", "0");
    expect(tabs[1]).toHaveAttribute("aria-selected", "false");
    expect(tabs[1]).toHaveAttribute("tabindex", "-1");
    const panel = screen.getByRole("tabpanel");
    expect(tabs[0]).toHaveAttribute("aria-controls", panel.id);
    expect(panel).toHaveAccessibleName(tabs[0].textContent as string);
    expect(within(panel).getByText("stage overview stage")).toBeInTheDocument();
    expect(screen.getByText("1 / 7")).toBeInTheDocument();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(observedThreshold).toBe(0.5);
  });

  it("shows the caption and a text version list for the active tab", () => {
    render(<SmartEnergyPosterExplainer locale="en" />);
    fireEvent.click(tabNamed(labels.tabs.command));
    const captions = labels.captions.command;
    const list = screen.getByRole("list", { name: "Text version of this step" });
    expect(within(list).getAllByRole("listitem")).toHaveLength(CAPTION_COUNT.command);
    captions.forEach((caption, index) => {
      expect(within(list).getAllByRole("listitem")[index]).toHaveTextContent(`${caption.headline}. ${caption.detail}`);
    });
    expect(screen.getByText(captions[0].headline)).toBeInTheDocument();
    expect(screen.getByText(captions[0].detail)).toBeInTheDocument();
    expect(screen.getByText("3 / 7")).toBeInTheDocument();
  });

  it("lists the three line kinds in the legend", () => {
    render(<SmartEnergyPosterExplainer locale="en" />);
    const legend = screen.getByRole("list", { name: "Line types" });
    expect(within(legend).getAllByRole("listitem").map((item) => item.textContent)).toEqual(["data", "commands", "plan"]);
  });

  it("renders Dutch words and keeps commands in English", () => {
    render(<SmartEnergyPosterExplainer locale="nl" />);
    const dutch = smartEnergyFilmLabels("nl");
    expect(screen.getByRole("tablist", { name: "Stappen van het platform" })).toBeInTheDocument();
    expect(tabNamed(dutch.tabs.overview)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Pauzeer" })).toBeInTheDocument();
    const legend = screen.getByRole("list", { name: "Soorten lijnen" });
    expect(within(legend).getByText("commands")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Pauzeer" }));
    expect(screen.getByRole("button", { name: "Afspelen" })).toBeInTheDocument();
    expect(screen.getByRole("list", { name: "Tekstversie van deze stap" })).toBeInTheDocument();
  });
});

describe("SmartEnergyPosterExplainer tabs", () => {
  it("selects a tab on click and jumps to its scene", () => {
    render(<SmartEnergyPosterExplainer locale="en" />);
    fireEvent.click(tabNamed(labels.tabs.safety));
    expect(tabNamed(labels.tabs.safety)).toHaveAttribute("aria-selected", "true");
    expect(tabNamed(labels.tabs.overview)).toHaveAttribute("aria-selected", "false");
    expect(screen.getByText("stage safety stage")).toBeInTheDocument();
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
    expect(screen.queryByText(labels.gatesLine)).not.toBeInTheDocument();
    fireEvent.keyDown(tabNamed(labels.tabs.overview), { key: "End" });
    expect(tabNamed(labels.tabs.cloud)).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText(labels.gatesLine)).toBeInTheDocument();
    fireEvent.keyDown(tabNamed(labels.tabs.cloud), { key: "Home" });
    expect(tabNamed(labels.tabs.overview)).toHaveAttribute("aria-selected", "true");
    const notPrevented = fireEvent.keyDown(tabNamed(labels.tabs.overview), { key: "a" });
    expect(notPrevented).toBe(true);
    expect(tabNamed(labels.tabs.overview)).toHaveAttribute("aria-selected", "true");
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

  it("advances through the scenes and shows the progress fill", () => {
    render(<SmartEnergyPosterExplainer locale="en" />);
    const fillOf = (name: string) => tabNamed(name).lastElementChild as HTMLElement;
    expect(fillOf(labels.tabs.overview)).toHaveStyle({ transform: "scaleX(0)" });
    expect(tabNamed(labels.tabs.reading).children).toHaveLength(0);
    scrollIntoView(true);
    advance(6100);
    expect(tabNamed(labels.tabs.reading)).toHaveAttribute("aria-selected", "true");
    expect(fillOf(labels.tabs.reading)).not.toHaveStyle({ transform: "scaleX(0)" });
    expect(screen.getByText("2 / 7")).toBeInTheDocument();
  });

  it("loops from the last tab back to the first", () => {
    render(<SmartEnergyPosterExplainer locale="en" />);
    fireEvent.click(tabNamed(labels.tabs.cloud));
    scrollIntoView(true);
    expect(tabNamed(labels.tabs.cloud)).toHaveAttribute("aria-selected", "true");
    advance(7200);
    expect(tabNamed(labels.tabs.overview)).toHaveAttribute("aria-selected", "true");
  });

  it("toggles between Pause and Play", () => {
    render(<SmartEnergyPosterExplainer locale="en" />);
    scrollIntoView(true);
    fireEvent.click(screen.getByRole("button", { name: "Pause" }));
    expect(screen.getByRole("button", { name: "Play" })).toBeInTheDocument();
    expect(pendingFrames()).toBe(0);
    fireEvent.click(screen.getByRole("button", { name: "Play" }));
    expect(screen.getByRole("button", { name: "Pause" })).toBeInTheDocument();
    expect(pendingFrames()).toBe(1);
  });

  it("pauses on hover and resumes on leave", () => {
    render(<SmartEnergyPosterExplainer locale="en" />);
    scrollIntoView(true);
    const figure = screen.getByRole("figure");
    fireEvent.pointerEnter(figure);
    expect(pendingFrames()).toBe(0);
    fireEvent.pointerLeave(figure);
    expect(pendingFrames()).toBe(1);
  });

  it("pauses while focus is inside and resumes when it leaves", () => {
    render(<SmartEnergyPosterExplainer locale="en" />);
    scrollIntoView(true);
    const first = tabNamed(labels.tabs.overview);
    fireEvent.focus(first);
    expect(pendingFrames()).toBe(0);
    fireEvent.blur(first, { relatedTarget: tabNamed(labels.tabs.reading) });
    expect(pendingFrames()).toBe(0);
    fireEvent.blur(first, { relatedTarget: null });
    expect(pendingFrames()).toBe(1);
  });

  it("stays paused after leaving when the visitor pressed Pause", () => {
    render(<SmartEnergyPosterExplainer locale="en" />);
    scrollIntoView(true);
    const figure = screen.getByRole("figure");
    fireEvent.click(screen.getByRole("button", { name: "Pause" }));
    fireEvent.pointerEnter(figure);
    fireEvent.pointerLeave(figure);
    expect(pendingFrames()).toBe(0);
  });

  it("resumes on Play even while the pointer and focus are still inside", () => {
    render(<SmartEnergyPosterExplainer locale="en" />);
    scrollIntoView(true);
    const figure = screen.getByRole("figure");
    fireEvent.click(screen.getByRole("button", { name: "Pause" }));
    fireEvent.pointerEnter(figure);
    fireEvent.focus(screen.getByRole("button", { name: "Play" }));
    fireEvent.click(screen.getByRole("button", { name: "Play" }));
    expect(pendingFrames()).toBe(1);
  });
});

describe("SmartEnergyPosterExplainer reduced motion", () => {
  beforeEach(() => {
    installMotion(true);
  });

  it("never autoplays and offers no play control or progress fill", () => {
    render(<SmartEnergyPosterExplainer locale="en" />);
    scrollIntoView(true);
    expect(pendingFrames()).toBe(0);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(tabNamed(labels.tabs.overview).children).toHaveLength(0);
  });

  it("shows the settled last frame of the selected scene", () => {
    render(<SmartEnergyPosterExplainer locale="en" />);
    fireEvent.click(tabNamed(labels.tabs.command));
    const captions = labels.captions.command;
    expect(screen.getByText(captions[captions.length - 1].headline)).toBeInTheDocument();
    expect(screen.getByText("stage command stage")).toBeInTheDocument();
  });
});
