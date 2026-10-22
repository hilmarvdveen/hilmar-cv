import { render, screen } from "@testing-library/react";
import { CAMERA_MOVE_MILLISECONDS, FILM_SCENES, filmFrameAtMilliseconds } from "@/lib/smartEnergyFilm/film";
import { smartEnergyFilmLabels } from "../smartEnergyFilmLabels";
import { SmartEnergyCaptureFrame } from "./SmartEnergyCaptureFrame";

const startOf = (id: string) => FILM_SCENES.find((scene) => scene.id === id)?.startMilliseconds ?? 0;

describe("SmartEnergyCaptureFrame", () => {
  it("opens on the title card with the business line, the name and the role", () => {
    const labels = smartEnergyFilmLabels("en");
    render(<SmartEnergyCaptureFrame frame={filmFrameAtMilliseconds(0)} labels={labels} />);
    expect(screen.getByText("A battery that charges when power is cheap.")).toBeInTheDocument();
    expect(screen.getByText("Hilmar van der Veen")).toBeInTheDocument();
    expect(screen.getByText("Senior Frontend Engineer")).toBeInTheDocument();
    expect(screen.getByText("telemetry")).toBeInTheDocument();
    expect(screen.queryByText("Own work, never ran at a client.")).not.toBeInTheDocument();
  });

  it("shows the headline and the technical line of a journey in Dutch", () => {
    const labels = smartEnergyFilmLabels("nl");
    render(<SmartEnergyCaptureFrame frame={filmFrameAtMilliseconds(startOf("reading") + CAMERA_MOVE_MILLISECONDS + 100)} labels={labels} />);
    expect(screen.getByText("Een meting verlaat de batterij")).toBeInTheDocument();
    expect(screen.getByText("MQTT naar IoT Hub, een apparaatidentiteit per asset")).toBeInTheDocument();
    expect(screen.queryByText("Een batterij die laadt als stroom goedkoop is.")).not.toBeInTheDocument();
  });

  it("ends on the card with the post link and own work said once", () => {
    const labels = smartEnergyFilmLabels("en");
    render(<SmartEnergyCaptureFrame frame={filmFrameAtMilliseconds(startOf("end") + 3000)} labels={labels} />);
    expect(screen.getByText("www.hilmarvanderveen.com/en/blog/smart-energy-steering-architecture")).toBeInTheDocument();
    expect(screen.getAllByText("Own work, never ran at a client.")).toHaveLength(1);
  });
});
