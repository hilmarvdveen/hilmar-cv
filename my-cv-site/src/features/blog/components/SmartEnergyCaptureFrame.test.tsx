import { render, screen } from "@testing-library/react";
import { CAMERA_MOVE_MILLISECONDS, FILM_SCENES, filmFrameAtMilliseconds } from "@/lib/smartEnergyFilm/film";
import { smartEnergyFilmLabels } from "../smartEnergyFilmLabels";
import { SmartEnergyCaptureFrame } from "./SmartEnergyCaptureFrame";

const startOf = (index: number) => FILM_SCENES[index].startMilliseconds;

describe("SmartEnergyCaptureFrame", () => {
  it("shows the scene caption when no beat runs, with the site address", () => {
    const labels = smartEnergyFilmLabels("en");
    render(<SmartEnergyCaptureFrame frame={filmFrameAtMilliseconds(0)} labels={labels} />);
    expect(screen.getByText("The whole application")).toBeInTheDocument();
    expect(screen.getByText(labels.scenes.overview.caption)).toBeInTheDocument();
    expect(screen.getByText("www.hilmarvanderveen.com")).toBeInTheDocument();
    expect(screen.getByText(labels.closing)).toHaveStyle({ opacity: "0" });
  });

  it("shows the caption of the running beat in Dutch", () => {
    const labels = smartEnergyFilmLabels("nl");
    render(<SmartEnergyCaptureFrame frame={filmFrameAtMilliseconds(startOf(1) + CAMERA_MOVE_MILLISECONDS + 100)} labels={labels} />);
    expect(screen.getByText("Frontend met backend")).toBeInTheDocument();
    expect(screen.getByText(labels.scenes.frontend.beats[0])).toBeInTheDocument();
  });
});
