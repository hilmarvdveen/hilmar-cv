import { render, screen, within } from "@testing-library/react";
import type { Locale } from "@/lib/seo";
import { FrontendPathFigure } from "./FrontendPathFigure";
import { MINIMUM_RENDERED_SIZE, smallestRenderedFontSize } from "./testSupport";

const CASES: ReadonlyArray<{ locale: Locale; caption: string; reading: string }> = [
  { locale: "en", caption: "The browser only talks to its own origin. The route handler calls the internal api, and when nothing changed the answer is a 304.", reading: "PostgreSQL: current state per asset." },
  { locale: "nl", caption: "De browser praat alleen met de eigen origin. De route handler roept de interne api aan, en als er niets veranderde is het antwoord een 304.", reading: "PostgreSQL: actuele stand per asset." },
];

describe("FrontendPathFigure", () => {
  it.each(CASES)("shows the caption and the text version in $locale", ({ locale, caption, reading }) => {
    render(<FrontendPathFigure locale={locale} />);
    expect(screen.getByRole("figure")).toBeInTheDocument();
    expect(screen.getByText(caption)).toBeInTheDocument();
    const items = within(screen.getByRole("list")).getAllByRole("listitem");
    expect(items.map((item) => item.textContent)).toContain(reading);
  });

  it("keeps every label at 11 pixels or more on a 358 pixel phone", () => {
    const { container } = render(<FrontendPathFigure locale="en" />);
    expect(smallestRenderedFontSize(container)).toBeGreaterThanOrEqual(MINIMUM_RENDERED_SIZE);
  });

  it("hides the drawing from assistive technology and scales it to the column", () => {
    const { container } = render(<FrontendPathFigure locale="nl" />);
    const drawing = container.querySelector("svg");
    expect(drawing).toHaveAttribute("aria-hidden", "true");
    expect(drawing).toHaveAttribute("width", "100%");
    expect(drawing?.getAttribute("viewBox")).toMatch(/^0 0 360 \d+/);
  });
});
