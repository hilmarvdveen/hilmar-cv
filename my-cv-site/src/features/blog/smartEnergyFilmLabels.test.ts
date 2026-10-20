import { FILM_SCENES } from "@/lib/smartEnergyFilm/film";
import { NODES, SECURITY_CONTROL_COUNT, SECURITY_GATE_COUNT } from "@/lib/smartEnergyFilm/layout";
import { smartEnergyFilmLabels } from "./smartEnergyFilmLabels";

describe("smartEnergyFilmLabels", () => {
  it("gives every scene its beats and every node its text in both languages", () => {
    for (const locale of ["en", "nl"] as const) {
      const labels = smartEnergyFilmLabels(locale);
      for (const scene of FILM_SCENES) {
        expect(labels.scenes[scene.id].beats).toHaveLength(scene.beatCount);
      }
      for (const node of NODES) {
        expect(labels.nodes[node.id].title).toBeTruthy();
      }
      expect(labels.controls).toHaveLength(SECURITY_CONTROL_COUNT);
      expect(labels.gates).toHaveLength(SECURITY_GATE_COUNT);
      expect(labels.backendCode).toHaveLength(6);
      expect(labels.steps).toHaveLength(FILM_SCENES.length);
    }
  });

  it("states the limits of the proof of concept and keeps out what the code does not have", () => {
    for (const locale of ["en", "nl"] as const) {
      const text = JSON.stringify(smartEnergyFilmLabels(locale));
      expect(text).not.toMatch(/\d+\s?%/);
      expect(text).not.toMatch(/FOR UPDATE|outbox|unhackable|CVE proof|OIDC/i);
    }
    expect(smartEnergyFilmLabels("en").serviceBusNotes.join(" ")).toBe("pro only, never applied");
    expect(smartEnergyFilmLabels("nl").closing).toContain("nooit bij een klant");
  });
});
