import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import messages from "@/i18n/messages/en.json";
import { FitWaitingPanel } from "./FitWaitingPanel";

vi.mock("next-intl", async () => {
  const english = (await import("@/i18n/messages/en.json")).default;
  const { intlMock } = await import("@/test/intl");
  const phases = english.fit.check.progress.phases;
  return intlMock({
    raw: { "phases.reading": phases.reading, "phases.searching": phases.searching },
  });
});

const PHASES = messages.fit.check.progress.phases;
const EXCERPT = "Senior Frontend Engineer, Randstad.";

const renderPanel = (overrides: Partial<Parameters<typeof FitWaitingPanel>[0]> = {}) => {
  cleanup();
  render(
    <FitWaitingPanel
      phase="reading"
      toolCalls={0}
      elapsedSeconds={0}
      vacancyExcerpt={EXCERPT}
      {...overrides}
    />
  );
};

const askForLessMotion = () => {
  const matchMedia = vi.fn((media: string) => ({
    media,
    matches: true,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
  }));
  vi.stubGlobal("matchMedia", matchMedia);
  window.matchMedia = matchMedia as unknown as typeof window.matchMedia;
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("FitWaitingPanel", () => {
  it("names what is happening and shows the pasted text back", () => {
    renderPanel();
    expect(screen.getByRole("heading", { level: 2, name: "title" })).toBeInTheDocument();
    expect(screen.getByText("intro")).toBeInTheDocument();
    expect(screen.getByText(EXCERPT)).toBeInTheDocument();
  });

  it("leaves the excerpt out when there is nothing to show", () => {
    renderPanel({ vacancyExcerpt: "" });
    expect(screen.queryByText(EXCERPT)).toBeNull();
  });

  it("moves to the next line every five seconds and starts over at the end", () => {
    renderPanel({ elapsedSeconds: 0 });
    expect(screen.getByText(PHASES.reading["1"])).toBeInTheDocument();

    renderPanel({ elapsedSeconds: 7 });
    expect(screen.getByText(PHASES.reading["2"])).toBeInTheDocument();

    renderPanel({ elapsedSeconds: 12 });
    expect(screen.getByText(PHASES.reading["3"])).toBeInTheDocument();

    renderPanel({ elapsedSeconds: 20 });
    expect(screen.getByText(PHASES.reading["1"])).toBeInTheDocument();
  });

  it("draws its lines from the phase the agent is in", () => {
    renderPanel({ phase: "searching", elapsedSeconds: 6 });
    expect(screen.getByText(PHASES.searching["2"])).toBeInTheDocument();
    expect(screen.queryByText(PHASES.reading["2"])).toBeNull();
  });

  it("holds the first line still for a visitor who asked for less motion", () => {
    askForLessMotion();
    renderPanel({ elapsedSeconds: 12 });
    expect(screen.getByText(PHASES.reading["1"])).toBeInTheDocument();
  });

  it("counts in seconds under a minute and in minutes above it", () => {
    renderPanel({ elapsedSeconds: 42 });
    expect(screen.getByText("elapsedSeconds")).toBeInTheDocument();

    renderPanel({ elapsedSeconds: 95 });
    expect(screen.getByText("elapsedMinutes")).toBeInTheDocument();
    expect(screen.queryByText("elapsedSeconds")).toBeNull();
  });

  it("names the lookups only once the agent has made some", () => {
    const elapsedLine = () => screen.getByText(/elapsed/, { selector: "p" });
    renderPanel({ elapsedSeconds: 8 });
    expect(elapsedLine()).not.toHaveTextContent("lookups");

    renderPanel({ elapsedSeconds: 8, toolCalls: 3 });
    expect(elapsedLine()).toHaveTextContent("lookups");
  });

  it("says nothing extra inside the first minute", () => {
    renderPanel({ elapsedSeconds: 30 });
    expect(screen.queryByText("stillRunning")).toBeNull();
    expect(screen.queryByText("takingLong")).toBeNull();
  });

  it("explains the start up after a minute and the long wait after two", () => {
    renderPanel({ elapsedSeconds: 60 });
    expect(screen.getByText("stillRunning")).toBeInTheDocument();

    renderPanel({ elapsedSeconds: 120 });
    expect(screen.getByText("takingLong")).toBeInTheDocument();
    expect(screen.queryByText("stillRunning")).toBeNull();
  });

  it("announces the start politely and then that the check is still running", () => {
    renderPanel({ elapsedSeconds: 10 });
    const region = screen.getByRole("status");
    expect(region).toHaveAttribute("aria-live", "polite");
    expect(region).toHaveTextContent("announceStart");

    renderPanel({ elapsedSeconds: 61 });
    expect(screen.getByRole("status")).toHaveTextContent("announceStillRunning");
  });

  it("offers a way to read on while the check runs", () => {
    renderPanel();
    const browse = screen.getByRole("link", { name: "keepBrowsing" });
    expect(browse).toHaveAttribute("href", "/experience");
    expect(browse).toHaveAttribute("data-placement", "fit-waiting-browse");
  });

  it("offers the call only once the wait passes two minutes", () => {
    renderPanel({ elapsedSeconds: 119 });
    expect(screen.queryByRole("link", { name: "bookButton" })).toBeNull();

    renderPanel({ elapsedSeconds: 121 });
    const booking = screen.getByRole("link", { name: "bookButton" });
    expect(booking).toHaveAttribute("href", "/book");
    expect(booking).toHaveAttribute("data-placement", "fit-waiting-book");
  });
});
