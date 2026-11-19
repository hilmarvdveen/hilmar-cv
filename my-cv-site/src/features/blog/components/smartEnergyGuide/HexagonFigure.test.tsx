import { render, screen, within } from "@testing-library/react";
import type { Locale } from "@/lib/seo";
import { HexagonFigure } from "./HexagonFigure";
import { MINIMUM_RENDERED_SIZE, smallestRenderedFontSize } from "./testSupport";

const CASES: ReadonlyArray<{ locale: Locale; caption: string; reading: string }> = [
  { locale: "en", caption: "Dependencies point inward. Every port has an in-memory adapter and an Azure or Postgres adapter, and each host registers only what it needs.", reading: "The domain sits at the centre." },
  { locale: "nl", caption: "Afhankelijkheden wijzen naar binnen. Elke poort heeft een in-memory adapter en een Azure- of Postgres-adapter, en elke host registreert alleen wat hij nodig heeft.", reading: "De domain staat in het midden." },
];

describe("HexagonFigure", () => {
  it.each(CASES)("shows the caption and the text version in $locale", ({ locale, caption, reading }) => {
    render(<HexagonFigure locale={locale} />);
    expect(screen.getByRole("figure")).toBeInTheDocument();
    expect(screen.getByText(caption)).toBeInTheDocument();
    const items = within(screen.getByRole("list")).getAllByRole("listitem");
    expect(items.map((item) => item.textContent)).toContain(reading);
  });

  it("keeps every label at 11 pixels or more on a 358 pixel phone", () => {
    const { container } = render(<HexagonFigure locale="en" />);
    expect(smallestRenderedFontSize(container)).toBeGreaterThanOrEqual(MINIMUM_RENDERED_SIZE);
  });

  it("hides the drawing from assistive technology and scales it to the column", () => {
    const { container } = render(<HexagonFigure locale="nl" />);
    const drawing = container.querySelector("svg");
    expect(drawing).toHaveAttribute("aria-hidden", "true");
    expect(drawing).toHaveAttribute("width", "100%");
    expect(drawing?.getAttribute("viewBox")).toMatch(/^0 0 360 \d+/);
  });
});
