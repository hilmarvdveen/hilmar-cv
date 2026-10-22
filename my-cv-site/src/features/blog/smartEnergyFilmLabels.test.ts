import { CAPTION_COUNT, FILM_SCENES } from "@/lib/smartEnergyFilm/film";
import { BLOCKS, GATE_COUNT, SAFETY_MECHANISMS, SHIELDS } from "@/lib/smartEnergyFilm/layout";
import { smartEnergyFilmLabels } from "./smartEnergyFilmLabels";

describe("smartEnergyFilmLabels", () => {
  it("gives every step its captions and every block and shield its text in both languages", () => {
    for (const locale of ["en", "nl"] as const) {
      const labels = smartEnergyFilmLabels(locale);
      for (const scene of FILM_SCENES) {
        expect(labels.captions[scene.id]).toHaveLength(CAPTION_COUNT[scene.id]);
      }
      for (const block of BLOCKS) {
        expect(labels.blocks[block.id].title.length).toBeGreaterThan(0);
      }
      for (const shield of SHIELDS) {
        expect(labels.shields[shield.id]).toBeTruthy();
      }
      expect(labels.gates).toHaveLength(GATE_COUNT);
      expect(labels.safety.mechanisms).toHaveLength(SAFETY_MECHANISMS.length);
      expect(labels.endCard.link).toContain(`/${locale}/blog/smart-energy-steering-architecture`);
    }
  });

  it("keeps positive framing and out of what the code does not have", () => {
    for (const locale of ["en", "nl"] as const) {
      const labels = smartEnergyFilmLabels(locale);
      const text = JSON.stringify(labels);
      expect(text).not.toMatch(/\d+\s?%/);
      expect(text).not.toMatch(/FOR UPDATE|outbox|unhackable|CVE proof|OIDC|S7|S8|S16|destroyed|measured\./i);
      expect(text.match(/client/g)?.length ?? 0).toBeLessThanOrEqual(1);
    }
    expect(smartEnergyFilmLabels("en").blocks.serviceBus.note).toBe("pro only");
  });
});
