import { render, screen, within } from "@testing-library/react";
import type { Locale } from "@/lib/seo";
import { FlowFigure } from "./FlowFigure";
import { MINIMUM_RENDERED_SIZE, smallestRenderedFontSize } from "./testSupport";

const CASES: ReadonlyArray<{ locale: Locale; caption: string; reading: string }> = [
  { locale: "en", caption: "Readings come in through one transaction. A plan becomes one command per period, and the next reading confirms it.", reading: "The next reading confirms the command." },
  { locale: "nl", caption: "Metingen komen binnen via een transactie. Een plan wordt een commando per periode, en de volgende meting bevestigt het.", reading: "De volgende meting bevestigt het commando." },
];

describe("FlowFigure", () => {
  it.each(CASES)("shows the caption and the text version in $locale", ({ locale, caption, reading }) => {
    render(<FlowFigure locale={locale} />);
    expect(screen.getByRole("figure")).toBeInTheDocument();
    expect(screen.getByText(caption)).toBeInTheDocument();
    const items = within(screen.getByRole("list")).getAllByRole("listitem");
    expect(items.map((item) => item.textContent)).toContain(reading);
  });

  it("keeps every label at 11 pixels or more on a 358 pixel phone", () => {
    const { container } = render(<FlowFigure locale="en" />);
    expect(smallestRenderedFontSize(container)).toBeGreaterThanOrEqual(MINIMUM_RENDERED_SIZE);
  });

  it("hides the drawing from assistive technology and scales it to the column", () => {
    const { container } = render(<FlowFigure locale="nl" />);
    const drawing = container.querySelector("svg");
    expect(drawing).toHaveAttribute("aria-hidden", "true");
    expect(drawing).toHaveAttribute("width", "100%");
    expect(drawing?.getAttribute("viewBox")).toMatch(/^0 0 360 \d+/);
  });
});
