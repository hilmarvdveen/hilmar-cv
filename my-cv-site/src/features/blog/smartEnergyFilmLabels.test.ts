import { BEAT_IDS, FILM_TABS } from "@/lib/smartEnergyFilm/film";
import { BLOCKS, GATE_COUNT, SAFETY_MECHANISMS } from "@/lib/smartEnergyFilm/layout";
import { smartEnergyFilmLabels } from "./smartEnergyFilmLabels";

const LOCALES = ["en", "nl"] as const;

const allTexts = (value: unknown): string[] => {
  if (typeof value === "string") {
    return [value];
  }
  if (Array.isArray(value)) {
    return value.flatMap(allTexts);
  }
  if (typeof value === "object" && value !== null) {
    return Object.values(value).flatMap(allTexts);
  }
  return [];
};

describe("smartEnergyFilmLabels", () => {
  it("gives every tab a full caption for every beat in both languages", () => {
    for (const locale of LOCALES) {
      const labels = smartEnergyFilmLabels(locale);
      for (const tab of FILM_TABS) {
        const captions = labels.captions[tab] as Record<string, { headline: string; detail: string; why: string }>;
        expect(Object.keys(captions).sort()).toEqual([...BEAT_IDS[tab]].sort());
        for (const beat of BEAT_IDS[tab]) {
          expect(captions[beat].headline.length).toBeGreaterThan(0);
          expect(captions[beat].detail.length).toBeGreaterThan(0);
          expect(captions[beat].why.length).toBeGreaterThan(0);
        }
        expect(labels.tabs[tab]).toBeTruthy();
      }
    }
  });

  it("keeps every caption inside the fixed caption area", () => {
    for (const locale of LOCALES) {
      const labels = smartEnergyFilmLabels(locale);
      for (const tab of FILM_TABS) {
        const captions = labels.captions[tab] as Record<string, { headline: string; detail: string; why: string }>;
        for (const beat of BEAT_IDS[tab]) {
          expect(captions[beat].headline.length).toBeLessThanOrEqual(60);
          expect(captions[beat].detail.length).toBeLessThanOrEqual(190);
          expect(captions[beat].why.length).toBeLessThanOrEqual(120);
        }
      }
    }
  });

  it("gives every block, chip, legend line and control its text", () => {
    for (const locale of LOCALES) {
      const labels = smartEnergyFilmLabels(locale);
      for (const block of BLOCKS) {
        expect(labels.blocks[block.id].title.length).toBeGreaterThan(0);
      }
      for (const text of Object.values(labels.chips)) {
        expect(text).toBeTruthy();
      }
      for (const text of Object.values(labels.legend)) {
        expect(text).toBeTruthy();
      }
      expect(labels.gates).toHaveLength(GATE_COUNT);
      expect(labels.gatesLine).toBe(labels.gates.join(", "));
      expect(labels.safety.mechanisms).toHaveLength(SAFETY_MECHANISMS.length);
      expect(labels.beatIndicator).toContain("{current}");
      expect(labels.beatIndicator).toContain("{total}");
      for (const text of [labels.previous, labels.next, labels.play, labels.pause, labels.tablistLabel, labels.textVersion, labels.legendLabel, labels.zero]) {
        expect(text).toBeTruthy();
      }
    }
  });

  it("writes no dash connector and no semicolon in any text", () => {
    for (const locale of LOCALES) {
      for (const text of allTexts(smartEnergyFilmLabels(locale))) {
        expect(text).not.toContain("—");
        expect(text).not.toContain(" - ");
        expect(text).not.toContain(";");
      }
    }
  });

  it("translates the captions and keeps the English technical terms", () => {
    const english = smartEnergyFilmLabels("en");
    const dutch = smartEnergyFilmLabels("nl");
    for (const tab of FILM_TABS) {
      const englishCaptions = english.captions[tab] as Record<string, { headline: string }>;
      const dutchCaptions = dutch.captions[tab] as Record<string, { headline: string }>;
      const differing = BEAT_IDS[tab].filter((beat) => englishCaptions[beat].headline !== dutchCaptions[beat].headline);
      expect(differing.length).toBeGreaterThan(0);
    }
    expect(dutch.beatIndicator).not.toBe(english.beatIndicator);
    expect(dutch.captions.command.focus.headline).toContain("commandpad");
  });

  it("states the corrected facts and stays away from what the code does not have", () => {
    const english = smartEnergyFilmLabels("en");
    const text = JSON.stringify(english);
    expect(text).not.toMatch(/\d+\s?%/);
    expect(text).not.toMatch(/FOR UPDATE|outbox|unhackable|CVE proof|OIDC|S7|S8|S16|destroyed|1 to n|nothing sent|never run against live/i);
    expect(english.captions.overview.commandsOut.headline).toBe("Commands go out");
    expect(english.captions.command.store.detail).toContain("Created");
    expect(english.captions.command.acknowledge.detail).toContain("not the battery");
    expect(english.captions.command.confirm.detail).toContain("max(1 kW, 10 percent of the setpoint)");
    expect(english.captions.customer.notModified.headline).toContain("no body sent");
    expect(english.captions.safety.lock.detail).toContain("Postgres path");
    expect(english.captions.scale.out.headline).toContain("1 today");
    expect(english.blocks.serviceBus.note).toBe("pro only");
    expect(english.chips.queueProOnly).toBe("pro only");
    expect(english.chips.kedaProOnly).toBe("pro only");
    expect(english.chips.token).toBe("api token");
    expect(english.chips.queueLengthLever).toBe("queue length");
    expect(JSON.stringify(english.captions.scale)).toContain("KEDA scaling on queue length is pro only");
    expect(english.chips.entraQueue).toContain("pro");
    expect(english.cloudFrames.azure).toBe("Azure, pro never applied");
    for (const locale of LOCALES) {
      const joined = allTexts(smartEnergyFilmLabels(locale)).join(" ");
      expect(joined).not.toMatch(/JWT|dev applied|dev toegepast|Every known advisory|Elke bekende advisory|itself enforces|zelf af|caches in het geheugen/);
    }
    expect(smartEnergyFilmLabels("nl").chips.queueProOnly).toBe("alleen pro");
  });
});
