import { render, screen } from "@testing-library/react";
import {
  BEATS,
  FILM_TABS,
  beatEndState,
  beatIndexOf,
  beatLengthMilliseconds,
  beatRenderState,
  type BeatIdOf,
  type BeatRenderState,
  type TabId,
} from "@/lib/smartEnergyFilm/film";
import { type Orientation } from "@/lib/smartEnergyFilm/layout";
import { FADED_OPACITY } from "@/lib/smartEnergyFilm/tokens";
import { smartEnergyFilmLabels } from "../smartEnergyFilmLabels";
import { SmartEnergyFilmPoster } from "./SmartEnergyFilmPoster";

const labels = smartEnergyFilmLabels("en");

const MINIMUM_PORTRAIT_SIZE = 12;

const chipGroups = (label: string): Element[] =>
  Array.from(document.querySelectorAll("g")).filter(
    (group) =>
      Array.from(group.children)
        .filter((child) => child.tagName === "text")
        .map((child) => child.textContent)
        .join(" ") === label,
  );

const stateOf = <Tab extends TabId>(tab: Tab, beat: BeatIdOf<Tab>, progress = 1): BeatRenderState => beatRenderState(tab, beatIndexOf(tab, beat), progress);

const draw = (state: BeatRenderState, orientation: Orientation = "landscape", options: { still?: boolean; reducedMotion?: boolean; accessibleLabel?: string } = {}) =>
  render(<SmartEnergyFilmPoster state={state} labels={labels} orientation={orientation} {...options} />);

const circlesOf = (container: HTMLElement) => container.querySelectorAll("circle").length;

const effectiveFontSize = (element: Element): number => {
  let scale = 1;
  let node: Element | null = element.parentElement;
  while (node) {
    const match = /scale\(([\d.]+)\)/.exec(node.getAttribute("transform") ?? "");
    scale *= match ? Number(match[1]) : 1;
    node = node.parentElement;
  }
  return Number(element.getAttribute("font-size")) * scale;
};

describe("SmartEnergyFilmPoster", () => {
  it("hides the drawing from assistive technology unless it is given a label", () => {
    const { container, unmount } = draw(stateOf("overview", "orient"));
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
    expect(container.querySelector("svg")).toHaveAttribute("viewBox", "0 0 1080 860");
    unmount();
    draw(stateOf("overview", "orient"), "portrait", { accessibleLabel: "The platform" });
    expect(screen.getByRole("img", { name: "The platform" })).toHaveAttribute("viewBox", "0 0 320 480");
  });

  it("draws the eleven blocks and the frame plates in the overview orient beat", () => {
    draw(stateOf("overview", "orient"));
    for (const text of ["Battery", "Day-ahead", "IoT Hub", "Service Bus", "pro only", "Gateway", "API", "Planner", "Steering", "Dashboard", "PostgreSQL", "Browser"]) {
      expect(screen.getByText(text)).toBeInTheDocument();
    }
    expect(screen.getByText("Azure")).toBeInTheDocument();
    expect(screen.getByText("Container Apps")).toBeInTheDocument();
    expect(screen.queryByText("Dependabot")).not.toBeInTheDocument();
  });

  it("fades what a beat does not involve by block opacity and keeps the involved blocks at full strength", () => {
    draw(stateOf("reading", "orient"));
    expect(screen.getByText("Dashboard").closest("g")).toHaveAttribute("opacity", String(FADED_OPACITY));
    expect(screen.getByText("Gateway").closest("g")).toHaveAttribute("opacity", "1");
  });

  it("fades the rest out and lays the involved blocks out larger in the focus beat", () => {
    draw(stateOf("reading", "focus"));
    expect(screen.queryByText("Dashboard")).not.toBeInTheDocument();
    expect(screen.getByText("Gateway").closest("g")).toHaveAttribute("opacity", "1");
    expect(screen.getByText("PostgreSQL")).toBeInTheDocument();
  });

  it("blends the rest out while a beat is entering and brings new blocks in", () => {
    const fading = draw(stateOf("reading", "focus", 0.05));
    expect(Number(screen.getByText("Dashboard").closest("g")?.getAttribute("opacity"))).toBeGreaterThan(0);
    fading.unmount();
    draw(stateOf("overview", "orient", 0));
    const arriving = draw(beatRenderState("reading", 0, 0));
    expect(arriving.container.querySelector("svg")).toBeInTheDocument();
  });

  it("numbers the hops of a story and keeps the earlier beat numbers", () => {
    draw(stateOf("command", "send"));
    for (const number of ["1", "2", "3", "4", "5"]) {
      expect(screen.getByText(number)).toBeInTheDocument();
    }
    expect(screen.queryByText("6")).not.toBeInTheDocument();
  });

  it("shows no number before the first hop and in the orient and focus beats", () => {
    draw(stateOf("command", "orient"));
    expect(screen.queryByText("1")).not.toBeInTheDocument();
  });

  it("shows the idempotency key, queue and KEDA chips on their steps", () => {
    const store = draw(stateOf("command", "store"));
    expect(screen.getByText("idempotency key")).toBeInTheDocument();
    store.unmount();
    draw(stateOf("command", "send"));
    expect(chipGroups("pro only")).toHaveLength(2);
  });

  it("puts the controls on the arrows they protect in the cloud beat and the cloud frame names on the plates", () => {
    draw(stateOf("cloud", "controls"));
    for (const chip of [labels.chips.deviceKey, labels.chips.hubIdentity, labels.chips.parameterised, labels.chips.contentPolicy, labels.chips.token, labels.chips.internalIngress, labels.chips.entraQueue]) {
      expect(chipGroups(chip)).toHaveLength(1);
    }
    expect(screen.getByText(labels.cloudFrames.azure)).toBeInTheDocument();
    expect(screen.getByText(labels.cloudFrames.containerApps)).toBeInTheDocument();
  });

  it("skips a chip whose anchor is not drawn in the layout", () => {
    const state = { ...stateOf("reading", "transaction"), chips: ["queueProOnly" as const, "blobCheckpoints" as const] };
    draw(state);
    expect(screen.queryByText("pro only")).not.toBeInTheDocument();
    expect(screen.getByText("checkpoints")).toBeInTheDocument();
  });

  it("outlines the involved blocks in an orient beat that fades others and not otherwise", () => {
    const orient = draw(stateOf("reading", "orient"));
    const outlined = orient.container.querySelectorAll("rect[stroke='#059669']").length;
    orient.unmount();
    const step = draw(stateOf("reading", "validation"));
    expect(outlined).toBeGreaterThan(step.container.querySelectorAll("rect[stroke='#059669']").length);
  });

  it("draws the packet in motion and no packet when still or reduced", () => {
    const running = beatRenderState("reading", beatIndexOf("reading", "checkpoint"), 0.2);
    expect(running.packet).not.toBeNull();
    const moving = draw(running);
    const movingCircles = circlesOf(moving.container);
    moving.unmount();
    const still = draw(running, "landscape", { still: true });
    const stillCircles = circlesOf(still.container);
    still.unmount();
    const reduced = draw(running, "landscape", { reducedMotion: true });
    expect(movingCircles).toBeGreaterThan(stillCircles);
    expect(circlesOf(reduced.container)).toBe(stillCircles);
  });

  it("draws the active hop as a thick line with its number when motion is reduced", () => {
    const state = beatEndState("reading", beatIndexOf("reading", "checkpoint"));
    const reduced = draw(state, "landscape", { reducedMotion: true });
    const thick = Array.from(reduced.container.querySelectorAll("path[stroke='#059669']")).map((path) => Number(path.getAttribute("stroke-width")));
    reduced.unmount();
    const normal = draw(state);
    const regular = Array.from(normal.container.querySelectorAll("path[stroke='#059669']")).map((path) => Number(path.getAttribute("stroke-width")));
    expect(Math.max(...thick)).toBeGreaterThan(Math.max(...regular));
    expect(screen.getAllByText("2").length).toBeGreaterThan(0);
  });

  it("draws a reverse hop with an arrowhead at both ends", () => {
    const store = draw(stateOf("command", "store"));
    expect(store.container.querySelector("path[marker-start]")).toBeInTheDocument();
  });

  it("flows dashes along a dashed active arrow and a white pulse along a solid one", () => {
    const solid = beatRenderState("reading", beatIndexOf("reading", "deviceToHub"), 0.3);
    const dashed = beatRenderState("command", beatIndexOf("command", "send"), 0.3);
    const first = draw(solid);
    expect(first.container.querySelector("path[stroke='#ffffff']")).toBeInTheDocument();
    first.unmount();
    const second = draw(dashed);
    expect(second.container.querySelector("path[stroke-dashoffset]")).toBeInTheDocument();
  });

  it("shows the four safety mechanisms in landscape and the active one with its result at the end", () => {
    draw(stateOf("safety", "audit"));
    expect(screen.getByText("PostgreSQL keeps the data right")).toBeInTheDocument();
    for (const text of ["1. duplicate", "2. race", "3. migration", "4. audit", "DO NOTHING", "Sent to Expired: 0 rows", "schema current", "one transaction"]) {
      expect(screen.getByText(text)).toBeInTheDocument();
    }
  });

  it("starts the safety mechanisms waiting", () => {
    draw(stateOf("safety", "lock", 0.01));
    expect(screen.queryByText("DO NOTHING")).toBeInTheDocument();
    expect(screen.getByText("waits")).toBeInTheDocument();
  });

  it("shows one mechanism at a time in portrait and lists the four in the focus beat", () => {
    const focus = draw(stateOf("safety", "focus"), "portrait");
    for (const text of ["1. duplicate", "2. race", "3. migration", "4. audit"]) {
      expect(screen.getByText(text)).toBeInTheDocument();
    }
    focus.unmount();
    draw(stateOf("safety", "race"), "portrait");
    expect(screen.getByText("2. race")).toBeInTheDocument();
    expect(screen.queryByText("1. duplicate")).not.toBeInTheDocument();
    expect(screen.getByText("Sent to Acknowledged: 1 row")).toBeInTheDocument();
  });

  it("stacks gateway replicas and fills the queue in the out beat", () => {
    const early = draw(stateOf("scale", "out", 0.05));
    const earlyRects = early.container.querySelectorAll("rect").length;
    early.unmount();
    const late = draw(stateOf("scale", "out", 0.5));
    expect(late.container.querySelectorAll("rect").length).toBeGreaterThanOrEqual(earlyRects + 2);
    late.unmount();
    draw(stateOf("scale", "out"));
    expect(screen.getByText("1 today")).toBeInTheDocument();
    expect(chipGroups(labels.chips.queueLengthLever)).toHaveLength(1);
  });

  it("tags the bigger tiers in the up beat", () => {
    draw(stateOf("scale", "up"));
    for (const text of ["higher tier", "Premium", "larger tier"]) {
      expect(screen.getByText(text)).toBeInTheDocument();
    }
  });

  it("drops the apps to zero in the down beat and fades them", () => {
    const early = draw(stateOf("scale", "down", 0.2));
    expect(screen.getByText("API").closest("g")).toHaveAttribute("opacity", "1");
    early.unmount();
    draw(stateOf("scale", "down"));
    expect(screen.getAllByText("0")).toHaveLength(3);
    expect(screen.getByText("API").closest("g")).toHaveAttribute("opacity", String(FADED_OPACITY));
  });

  it("outlines what changes first in the next beat and shows all levers in the last", () => {
    const next = draw(stateOf("scale", "next"));
    expect(next.container.querySelectorAll("rect[fill='none']").length).toBe(3);
    next.unmount();
    draw(stateOf("scale", "levers"));
    expect(screen.getAllByText(/tier|Premium|queue length|1 today/)).toHaveLength(5);
  });

  it("emphasises the Container Apps plate in the cloud steps only", () => {
    const orient = draw(stateOf("cloud", "orient"));
    expect(orient.container.querySelector("text[fill='#065f46']")).not.toBeInTheDocument();
    orient.unmount();
    const apps = draw(stateOf("cloud", "apps"));
    expect(apps.container.querySelector("text[fill='#065f46']")).toBeInTheDocument();
  });

  it.each(FILM_TABS)("draws every beat of the %s tab in both orientations, entering, running and ending", (tab) => {
    BEATS[tab].forEach((beat, index) => {
      for (const orientation of ["landscape", "portrait"] as const) {
        for (const progress of [0, 0.1, 0.35, 0.7, 1]) {
          const { container, unmount } = draw(beatRenderState(tab, index, progress), orientation);
          expect(container.querySelector("svg"), `${tab} ${beat.id}`).toBeInTheDocument();
          unmount();
        }
      }
      expect(beatLengthMilliseconds(beat)).toBeGreaterThan(0);
    });
  });

  it("keeps every portrait text at 12 units or more, which renders at 11 pixels or more on a 358 pixel phone column", () => {
    for (const tab of FILM_TABS) {
      BEATS[tab].forEach((beat, index) => {
        const { container, unmount } = draw(beatEndState(tab, index), "portrait");
        container.querySelectorAll("text").forEach((element) => {
          expect(effectiveFontSize(element), `${tab} ${beat.id} ${element.textContent}`).toBeGreaterThanOrEqual(MINIMUM_PORTRAIT_SIZE);
        });
        unmount();
      });
    }
  });

  it("makes a portrait label render at 11 CSS pixels or more on a 358 pixel wide phone", () => {
    const { container } = draw(beatEndState("command", 1), "portrait");
    const sizes = Array.from(container.querySelectorAll("text")).map(effectiveFontSize);
    const viewBoxWidth = 320;
    const phoneWidth = 358;
    for (const size of sizes) {
      expect((size * phoneWidth) / viewBoxWidth).toBeGreaterThanOrEqual(11);
    }
  });
});
