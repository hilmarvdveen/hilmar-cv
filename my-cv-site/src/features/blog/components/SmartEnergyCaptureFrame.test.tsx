import { render, screen } from "@testing-library/react";
import { BEATS, FILM_TABS, beatIndexOf, beatLengthMilliseconds, filmRenderStateAtMilliseconds, type BeatIdOf, type TabId } from "@/lib/smartEnergyFilm/film";
import { smartEnergyFilmLabels } from "../smartEnergyFilmLabels";
import { SmartEnergyCaptureFrame } from "./SmartEnergyCaptureFrame";

const startOf = <Tab extends TabId>(tab: Tab, beat: BeatIdOf<Tab>): number => {
  const before = FILM_TABS.slice(0, FILM_TABS.indexOf(tab)).flatMap((earlier) => BEATS[earlier]);
  const within = BEATS[tab].slice(0, beatIndexOf(tab, beat));
  return [...before, ...within].reduce((total, item) => total + beatLengthMilliseconds(item), 0);
};

describe("SmartEnergyCaptureFrame", () => {
  it("opens on the overview orient beat with the headline, the beat indicator and no cards or counter", () => {
    const labels = smartEnergyFilmLabels("en");
    render(<SmartEnergyCaptureFrame state={filmRenderStateAtMilliseconds(0)} labels={labels} />);
    expect(screen.getByText("The whole platform at a glance")).toBeInTheDocument();
    expect(screen.getByText("Beat 1 of 4")).toBeInTheDocument();
    expect(screen.queryByText("Hilmar van der Veen")).not.toBeInTheDocument();
    expect(screen.queryByText("1 / 7")).not.toBeInTheDocument();
    for (const tab of FILM_TABS) {
      expect(screen.getByText(labels.tabs[tab])).toBeInTheDocument();
    }
  });

  it("shows the headline, detail and why of a step in Dutch with the legend of its line kinds", () => {
    const labels = smartEnergyFilmLabels("nl");
    const state = filmRenderStateAtMilliseconds(startOf("reading", "deviceToHub") + 200);
    render(<SmartEnergyCaptureFrame state={state} labels={labels} />);
    const caption = labels.captions.reading.deviceToHub;
    expect(screen.getByText(caption.headline)).toBeInTheDocument();
    expect(screen.getByText(caption.detail)).toBeInTheDocument();
    expect(screen.getByText(caption.why)).toBeInTheDocument();
    expect(screen.getByText("telemetrie")).toBeInTheDocument();
    expect(screen.queryByText("commands")).not.toBeInTheDocument();
  });

  it("lists the gate tools in one line on the last cloud beat only", () => {
    const labels = smartEnergyFilmLabels("en");
    const gates = render(<SmartEnergyCaptureFrame state={filmRenderStateAtMilliseconds(startOf("cloud", "gates") + 200)} labels={labels} />);
    expect(screen.getByText(labels.gatesLine)).toBeInTheDocument();
    gates.unmount();
    render(<SmartEnergyCaptureFrame state={filmRenderStateAtMilliseconds(startOf("cloud", "apps") + 200)} labels={labels} />);
    expect(screen.queryByText(labels.gatesLine)).not.toBeInTheDocument();
  });

  it("marks the tabs before the current one as done", () => {
    const labels = smartEnergyFilmLabels("en");
    render(<SmartEnergyCaptureFrame state={filmRenderStateAtMilliseconds(startOf("scale", "out") + 200)} labels={labels} />);
    expect(screen.getByText(labels.tabs.reading)).toHaveClass("text-brand-navy");
    expect(screen.getByText(labels.tabs.scale)).toHaveClass("bg-brand-navy");
    expect(screen.getByText(labels.tabs.cloud)).toHaveClass("text-gray-500");
  });
});
