import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ValidationSection } from "./ValidationSection";

const panels = [
  {
    title: "Three extensions",
    body: "bol.com does not keep contractors on by default. It looks hard at value delivered, and not everyone is extended. In that environment my engagement was extended three times.",
    attribution: "bol.com engagement, 2023 to 2026",
  },
  {
    title: "An internal recommendation",
    body: "Runner-up in a very close process for another senior role at bol.com. The engineering manager's feedback was positive and he recommended me to his peers, which is how the current engagement started.",
    attribution: "Engineering manager, bol.com",
  },
  {
    title: "No gaps since 2016",
    body: "Engagements of one to two years at the Belastingdienst, Athlon, Omniplan and others, back to back. Retention is the signal that the work landed.",
    attribution: "Work history since 2016",
  },
];

vi.mock("next-intl", () => {
  const t = ((key: string) => key) as ((key: string) => string) & {
    raw: (key: string) => unknown;
  };
  t.raw = (key: string) => {
    if (key === "panels") return panels;
    return [];
  };
  return { useTranslations: () => t };
});

vi.mock("@/i18n/navigation", () => ({
  Link: ({ children, href, ...rest }: { children: React.ReactNode; href: string }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

describe("ValidationSection", () => {
  it("renders the section title and all panels", () => {
    render(<ValidationSection />);

    expect(screen.getByRole("heading", { name: "title" })).toBeInTheDocument();

    panels.forEach((panel) => {
      expect(screen.getByText(panel.title)).toBeInTheDocument();
      expect(screen.getByText(panel.body)).toBeInTheDocument();
      expect(screen.getByText(panel.attribution)).toBeInTheDocument();
    });
  });

  it("wires the section aria-labelledby to the heading id", () => {
    const { container } = render(<ValidationSection />);
    const section = container.querySelector("section");
    const heading = screen.getByRole("heading", { name: "title" });

    expect(section).toHaveAttribute("aria-labelledby", "validation-heading");
    expect(heading).toHaveAttribute("id", "validation-heading");
  });

  it("renders exactly three panel cards", () => {
    const { container } = render(<ValidationSection />);
    const headings = container.querySelectorAll("h3");
    expect(headings).toHaveLength(3);
  });

  it("links the twelve-engagements panel to the full work history", () => {
    render(<ValidationSection />);
    const link = screen.getByRole("link", { name: "historyLink" });
    expect(link).toHaveAttribute("href", "/experience");
    expect(link).toHaveAttribute("data-placement", "validation-history");
  });

  it("places the history link inside the twelve-engagements panel, after its other panels", () => {
    render(<ValidationSection />);
    const link = screen.getByRole("link", { name: "historyLink" });
    const lastPanelHeading = screen.getByText(panels[panels.length - 1].title);
    expect(
      lastPanelHeading.compareDocumentPosition(link) & Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
  });
});
