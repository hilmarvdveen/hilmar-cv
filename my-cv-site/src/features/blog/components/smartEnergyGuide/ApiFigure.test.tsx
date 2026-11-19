import { render, screen, within } from "@testing-library/react";
import type { Locale } from "@/lib/seo";
import { API_VIEW_WIDTH, ApiFigure } from "./ApiFigure";
import { FIGURE_LABELS } from "./labels";
import { smallestRenderedFontSize } from "./testSupport";

const PHONE_TEXT_SIZE = 14;

const CASES: ReadonlyArray<{ locale: Locale; caption: string; items: readonly string[] }> = [
  {
    locale: "en",
    caption:
      "The route handler calls the internal api. The api runs in one auth mode, scopes every query to an organisation and answers a matching ETag with a 304 and no body sent.",
    items: [
      "The api runs in one of two auth modes: a static bearer token for one fixed organisation, or Entra with the organisation per request.",
      "Limits: 86 400 rows for a raw series and a 64 KB request body.",
      "Another organisation asking for the same site gets a 404 and finds nothing.",
    ],
  },
  {
    locale: "nl",
    caption:
      "De route handler roept de interne api aan. De api draait in een auth mode, beperkt elke query tot een organisatie en beantwoordt een passende ETag met een 304 zonder verstuurde body.",
    items: [
      "De api draait in een van twee auth modes: een static bearer token voor een vaste organisatie, of Entra met de organisatie per verzoek.",
      "Limieten: 86 400 rijen voor een ruwe reeks en een request body van 64 KB.",
      "Een andere organisatie die om dezelfde site vraagt krijgt een 404 en vindt niets.",
    ],
  },
];

describe("ApiFigure", () => {
  it.each(CASES)("shows the caption and the text version in $locale", ({ locale, caption, items }) => {
    render(<ApiFigure locale={locale} />);
    expect(screen.getByRole("figure")).toBeInTheDocument();
    expect(screen.getByText(caption)).toBeInTheDocument();
    expect(screen.getByRole("list", { name: FIGURE_LABELS.steps[locale] })).toBeInTheDocument();
    const texts = within(screen.getByRole("list")).getAllByRole("listitem").map((item) => item.textContent);
    expect(texts).toHaveLength(8);
    for (const item of items) {
      expect(texts).toContain(item);
    }
  });

  it("keeps every label at 14 pixels or more on a 358 pixel phone", () => {
    const { container } = render(<ApiFigure locale="en" />);
    expect(smallestRenderedFontSize(container, API_VIEW_WIDTH)).toBeGreaterThanOrEqual(PHONE_TEXT_SIZE);
  });

  it("hides the drawing from assistive technology and scales it to the column", () => {
    const { container } = render(<ApiFigure locale="nl" />);
    const drawing = container.querySelector("svg");
    expect(drawing).toHaveAttribute("aria-hidden", "true");
    expect(drawing).toHaveAttribute("width", "100%");
    expect(drawing?.getAttribute("viewBox")).toMatch(/^0 0 300 \d+/);
  });
});
