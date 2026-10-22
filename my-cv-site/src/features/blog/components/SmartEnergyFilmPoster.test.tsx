import { render, screen } from "@testing-library/react";
import { CAMERA_MOVE_MILLISECONDS, FILM_SCENES, filmFrameAtMilliseconds, type FilmSceneId } from "@/lib/smartEnergyFilm/film";
import { smartEnergyFilmLabels } from "../smartEnergyFilmLabels";
import { SmartEnergyFilmPoster } from "./SmartEnergyFilmPoster";

const labels = smartEnergyFilmLabels("en");

const sceneOf = (id: FilmSceneId) => FILM_SCENES.find((scene) => scene.id === id) ?? FILM_SCENES[0];

const drawAt = (id: FilmSceneId, share: number) => {
  const scene = sceneOf(id);
  const elapsed = scene.startMilliseconds + CAMERA_MOVE_MILLISECONDS + share * (scene.lengthMilliseconds - CAMERA_MOVE_MILLISECONDS);
  return render(<SmartEnergyFilmPoster frame={filmFrameAtMilliseconds(elapsed)} labels={labels} />);
};

describe("SmartEnergyFilmPoster", () => {
  it("draws the eleven blocks, the frames and the gates in the overview", () => {
    render(<SmartEnergyFilmPoster frame={filmFrameAtMilliseconds(0)} labels={labels} />);
    expect(screen.getByRole("img")).toHaveAttribute("viewBox", "0 0 1080 960");
    for (const text of ["Battery", "Day-ahead", "IoT Hub", "Service Bus", "pro only", "Gateway", "API", "Planner", "Steering", "Dashboard", "PostgreSQL", "Browser"]) {
      expect(screen.getByText(text)).toBeInTheDocument();
    }
    expect(screen.getByText("Azure")).toBeInTheDocument();
    expect(screen.queryByText("Dependabot")).not.toBeInTheDocument();
    expect(screen.queryByText("SAS key")).not.toBeInTheDocument();
  });

  it("numbers the hops of a journey and dims what it does not touch", () => {
    drawAt("reading", 0.95);
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("Dashboard").closest("g")).toHaveAttribute("opacity", "0.28");
    expect(screen.getByText("Gateway").closest("g")).toHaveAttribute("opacity", "1");
  });

  it("numbers the return hops of the customer journey beside the arrow", () => {
    drawAt("customer", 0.99);
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("shows the four safety mechanisms with their results at the end of the zoom", () => {
    drawAt("safety", 0.99);
    expect(screen.getByText("PostgreSQL keeps the data right")).toBeInTheDocument();
    expect(screen.getByText("DO NOTHING")).toBeInTheDocument();
    expect(screen.getByText("Sent to Expired: 0 rows")).toBeInTheDocument();
    expect(screen.getByText("schema current")).toBeInTheDocument();
    expect(screen.getByText("one transaction")).toBeInTheDocument();
  });

  it("starts the safety mechanisms waiting", () => {
    drawAt("safety", 0.05);
    expect(screen.queryByText("DO NOTHING")).not.toBeInTheDocument();
    expect(screen.getByText("waits")).toBeInTheDocument();
  });

  it("puts the shields and the cloud labels on the poster in the cloud step", () => {
    drawAt("cloud", 0.99);
    for (const tag of Object.values(labels.shields)) {
      expect(screen.getByText(tag)).toBeInTheDocument();
    }
    expect(screen.getByText("Azure, dev and pro")).toBeInTheDocument();
    expect(screen.getByText("Container Apps, 0 to 1 replica")).toBeInTheDocument();
    expect(screen.getByText("Dependabot")).toBeInTheDocument();
  });
});
