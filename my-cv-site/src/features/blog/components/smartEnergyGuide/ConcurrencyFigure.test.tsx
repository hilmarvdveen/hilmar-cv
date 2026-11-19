import { render, screen, within } from "@testing-library/react";
import type { Locale } from "@/lib/seo";
import { ConcurrencyFigure } from "./ConcurrencyFigure";
import { MINIMUM_RENDERED_SIZE, smallestRenderedFontSize } from "./testSupport";

const CASES: ReadonlyArray<{ locale: Locale; caption: string; reading: string }> = [
  { locale: "en", caption: "Writes go in one transaction per batch. Reads hit the current state and the rollup, and an unchanged answer costs a 304.", reading: "Four lanes share one 15 minute window." },
  { locale: "nl", caption: "Schrijfacties gaan in een transactie per batch. Leesacties raken de actuele stand en de rollup, en een ongewijzigd antwoord kost een 304.", reading: "Vier lanes delen een venster van 15 minuten." },
];

describe("ConcurrencyFigure", () => {
  it.each(CASES)("shows the caption and the text version in $locale", ({ locale, caption, reading }) => {
    render(<ConcurrencyFigure locale={locale} />);
    expect(screen.getByRole("figure")).toBeInTheDocument();
    expect(screen.getByText(caption)).toBeInTheDocument();
    const items = within(screen.getByRole("list")).getAllByRole("listitem");
    expect(items.map((item) => item.textContent)).toContain(reading);
  });

  it("keeps every label at 11 pixels or more on a 358 pixel phone", () => {
    const { container } = render(<ConcurrencyFigure locale="en" />);
    expect(smallestRenderedFontSize(container)).toBeGreaterThanOrEqual(MINIMUM_RENDERED_SIZE);
  });

  it("hides the drawing from assistive technology and scales it to the column", () => {
    const { container } = render(<ConcurrencyFigure locale="nl" />);
    const drawing = container.querySelector("svg");
    expect(drawing).toHaveAttribute("aria-hidden", "true");
    expect(drawing).toHaveAttribute("width", "100%");
    expect(drawing?.getAttribute("viewBox")).toMatch(/^0 0 360 \d+/);
  });
});
