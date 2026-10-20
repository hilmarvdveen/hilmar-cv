import { render, screen } from "@testing-library/react";
import { CAMERA_MOVE_MILLISECONDS, FILM_SCENES, filmFrameAtMilliseconds, type FilmSceneId } from "@/lib/smartEnergyFilm/film";
import { smartEnergyFilmLabels } from "../smartEnergyFilmLabels";
import { SmartEnergyFilmPoster } from "./SmartEnergyFilmPoster";

const labels = smartEnergyFilmLabels("en");

const frameIn = (id: FilmSceneId, offset: number) =>
  filmFrameAtMilliseconds((FILM_SCENES.find((scene) => scene.id === id)?.startMilliseconds ?? 0) + offset);

const drawAt = (id: FilmSceneId, offset: number) => render(<SmartEnergyFilmPoster frame={frameIn(id, offset)} labels={labels} />);

describe("SmartEnergyFilmPoster", () => {
  it("names the image and draws every frame, node, arrow label and chip in the overview", () => {
    drawAt("overview", 8000);
    expect(screen.getByRole("img", { name: "Smart energy steering, explained" })).toHaveAttribute("viewBox", "0 0 1080 1080");
    expect(screen.getByText("AZURE SUBSCRIPTION, OWN")).toBeInTheDocument();
    expect(screen.getByText("CONTAINER APPS ENVIRONMENT")).toBeInTheDocument();
    expect(screen.getByText("Service Bus")).toBeInTheDocument();
    expect(screen.getByText("never applied")).toBeInTheDocument();
    expect(screen.getByText("sessions per asset")).toBeInTheDocument();
    expect(screen.getByText("telemetry_readings hypertable")).toBeInTheDocument();
    expect(screen.getByText(labels.databaseSummary)).toBeInTheDocument();
    expect(screen.getByText("ENTSO-E")).toBeInTheDocument();
    expect(screen.getByText("Dependabot")).toBeInTheDocument();
  });

  it("zooms the camera into the frontend and lights the browser and the dashboard", () => {
    drawAt("frontend", CAMERA_MOVE_MILLISECONDS + 500);
    expect(screen.getByRole("img")).toHaveAttribute("viewBox", "470 250 600 600");
    expect(screen.getByText("Browser").closest("g")).toHaveAttribute("opacity", "1");
    expect(screen.getByText("Key Vault").closest("g")).toHaveAttribute("opacity", "0.35");
  });

  it("shows the code line of each backend pattern in the database", () => {
    drawAt("backend", CAMERA_MOVE_MILLISECONDS + 3500);
    expect(screen.getByText("ON CONFLICT (asset_id, measured_at) DO NOTHING")).toBeInTheDocument();
    expect(screen.queryByText(labels.databaseSummary)).not.toBeInTheDocument();
  });

  it("dims the database when a cloud beat lights something else", () => {
    drawAt("cloud", CAMERA_MOVE_MILLISECONDS + 100);
    expect(screen.getByText(labels.databaseTitle).closest("g")).toHaveAttribute("opacity", "0.35");
  });

  it("lights the shields in order and the gates at the end of the running scene", () => {
    const { unmount } = drawAt("running", CAMERA_MOVE_MILLISECONDS);
    expect(screen.getByText(labels.controls[0]).closest("g")).toHaveAttribute("opacity", "1");
    expect(screen.getByText(labels.controls[11]).closest("g")).toHaveAttribute("opacity", "0.35");
    unmount();
    drawAt("running", 12900);
    expect(screen.getByText(labels.controls[11]).closest("g")).toHaveAttribute("opacity", "1");
    expect(screen.getByText("Grype").closest("g")?.parentElement).toHaveAttribute("opacity", "1");
  });
});
