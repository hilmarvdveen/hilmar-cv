import { render, screen, within } from "@testing-library/react";
import type { Locale } from "@/lib/seo";
import { smartEnergyFilmLabels } from "../../smartEnergyFilmLabels";
import { STILL_LABELS } from "./labels";
import { StaticBeat } from "./StaticBeat";

const CASES: ReadonlyArray<{ locale: Locale; blocks: string; hop: string; hopWord: string }> = [
  { locale: "en", blocks: "Blocks", hop: "Battery to IoT Hub", hopWord: "Hop" },
  { locale: "nl", blocks: "Blokken", hop: "Batterij naar IoT Hub", hopWord: "Stap" },
];

describe("StaticBeat", () => {
  it.each(CASES)("names the tab first and gives the caption in $locale", ({ locale }) => {
    const labels = smartEnergyFilmLabels(locale);
    const caption = labels.captions.reading.transaction;
    render(<StaticBeat locale={locale} tab="reading" beat="transaction" />);
    expect(screen.getByRole("figure")).toBeInTheDocument();
    const text = screen.getByRole("figure").querySelector("figcaption")?.textContent ?? "";
    expect(text.startsWith(labels.tabs.reading)).toBe(true);
    expect(text).toContain(`${caption.headline}. ${caption.detail} ${caption.why}`);
  });

  it.each(CASES)("lists the blocks and the hops of the beat in $locale", ({ locale, blocks, hop, hopWord }) => {
    render(<StaticBeat locale={locale} tab="reading" beat="deviceToHub" />);
    expect(screen.getByRole("list", { name: STILL_LABELS.list[locale] })).toBeInTheDocument();
    const items = within(screen.getByRole("list")).getAllByRole("listitem").map((item) => item.textContent ?? "");
    expect(items[0].startsWith(`${blocks}: `)).toBe(true);
    expect(items).toContain(`${hopWord} 1: ${hop}`);
  });

  it("turns a reverse hop around and keeps the hops in order", () => {
    render(<StaticBeat locale="en" tab="command" beat="acknowledge" />);
    const items = within(screen.getByRole("list")).getAllByRole("listitem").map((item) => item.textContent);
    expect(items).toContain("Hop 1: IoT Hub to Gateway");
  });

  it("draws one landscape and one portrait poster, both hidden from assistive technology", () => {
    const { container } = render(<StaticBeat locale="en" tab="overview" beat="orient" />);
    const drawings = Array.from(container.querySelectorAll("svg"));
    expect(drawings).toHaveLength(2);
    for (const drawing of drawings) {
      expect(drawing).toHaveAttribute("aria-hidden", "true");
    }
  });
});
