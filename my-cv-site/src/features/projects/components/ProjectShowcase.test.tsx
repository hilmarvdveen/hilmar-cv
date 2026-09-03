import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProjectShowcase } from "./ProjectShowcase";

const cases = [
  {
    outcome: "Months to days",
    client: "Belastingdienst",
    title: "Forms editor rebuild",
    body: "Rebuilt the forms editor on a modern stack.",
    roleLabel: "See the Belastingdienst case",
    href: "/experience#experience-belastingdienst",
  },
  {
    outcome: "Zero downtime",
    client: "bol.com",
    title: "Traffic cut-over",
    body: "Moved live traffic to the rebuilt page without an outage.",
    roleLabel: "See the bol.com case",
    href: "/experience#experience-bol",
  },
];

vi.mock("next-intl", () => {
  const t = ((key: string) => key) as ((key: string) => string) & {
    raw: (key: string) => unknown;
  };
  t.raw = (key: string) => (key === "cases" ? cases : []);
  return { useTranslations: () => t };
});

vi.mock("@/i18n/navigation", () => ({
  Link: ({
    children,
    href,
    className,
  }: {
    children: React.ReactNode;
    href: string;
    className?: string;
  }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

describe("ProjectShowcase", () => {
  it("renders the section heading", () => {
    render(<ProjectShowcase />);
    expect(
      screen.getByRole("heading", { level: 2, name: "showcase.title" })
    ).toBeInTheDocument();
  });

  it("renders every case outcome, title and body", () => {
    render(<ProjectShowcase />);
    for (const projectCase of cases) {
      expect(screen.getByText(projectCase.outcome)).toBeInTheDocument();
      expect(
        screen.getByRole("heading", { level: 3, name: projectCase.title })
      ).toBeInTheDocument();
      expect(screen.getByText(projectCase.body)).toBeInTheDocument();
    }
  });

  it("links each case to its role label and href", () => {
    render(<ProjectShowcase />);
    for (const projectCase of cases) {
      const link = screen.getByRole("link", { name: projectCase.roleLabel });
      expect(link).toHaveAttribute("href", projectCase.href);
    }
  });

  it("renders the closing call to action", () => {
    render(<ProjectShowcase />);
    expect(
      screen.getByRole("heading", { level: 2, name: "cta.title" })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "cta.button" })).toHaveAttribute(
      "href",
      "/book"
    );
  });
});
