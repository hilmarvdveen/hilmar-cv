import { render, screen, within } from "@testing-library/react";
import type { Locale } from "@/lib/seo";
import { PipelineFigure } from "./PipelineFigure";
import { MINIMUM_RENDERED_SIZE, smallestRenderedFontSize } from "./testSupport";

const CASES: ReadonlyArray<{ locale: Locale; caption: string; reading: string }> = [
  { locale: "en", caption: "Every job runs on GitHub-hosted runners with actions pinned by SHA. Deploys log in with OIDC and roll out images by digest.", reading: "A drift check runs every Monday." },
  { locale: "nl", caption: "Elke job draait op runners van GitHub met actions vastgezet op SHA. Deploys melden aan met OIDC en rollen images uit op digest.", reading: "Een drift check draait elke maandag." },
];

describe("PipelineFigure", () => {
  it.each(CASES)("shows the caption and the text version in $locale", ({ locale, caption, reading }) => {
    render(<PipelineFigure locale={locale} />);
    expect(screen.getByRole("figure")).toBeInTheDocument();
    expect(screen.getByText(caption)).toBeInTheDocument();
    const items = within(screen.getByRole("list")).getAllByRole("listitem");
    expect(items.map((item) => item.textContent)).toContain(reading);
  });

  it("keeps every label at 11 pixels or more on a 358 pixel phone", () => {
    const { container } = render(<PipelineFigure locale="en" />);
    expect(smallestRenderedFontSize(container)).toBeGreaterThanOrEqual(MINIMUM_RENDERED_SIZE);
  });

  it("hides the drawing from assistive technology and scales it to the column", () => {
    const { container } = render(<PipelineFigure locale="nl" />);
    const drawing = container.querySelector("svg");
    expect(drawing).toHaveAttribute("aria-hidden", "true");
    expect(drawing).toHaveAttribute("width", "100%");
    expect(drawing?.getAttribute("viewBox")).toMatch(/^0 0 360 \d+/);
  });
});
