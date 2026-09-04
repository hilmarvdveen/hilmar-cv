import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { FlagshipSection } from "./FlagshipSection";

const flagshipMessages = {
  eyebrow: "Current engagement",
  title: "bol.com has extended the engagement three times",
  intro:
    "bol.com is one of the largest e-commerce retailers in the Netherlands and Belgium. It keeps contractors on delivered value, not tenure. My engagement started in July 2025, first in the Loyalty team and then in Digital, and has been extended three times.",
  cards: [
    {
      title: "Loyalty, built end to end",
      body: "The Select points-overview page from spec to production. A rewards table with order points and action points, NL and FR translations, edge cases like cancelled orders and external merchants, tests and a Storybook story per scenario.",
    },
    {
      title: "A new app, empty folder to production",
      body: "Built the Digital app for software and games inside the Nx monorepo with SSR, routing, CI/CD, GCP and Kubernetes. Then ran the phased cut-over off the legacy stack, employees first, ramped by percentage, reversible in one step.",
    },
    {
      title: "Nine experiments, honest numbers",
      body: "Nine A/B experiments with design and business across the acquisition page, product page and basket. Winning variants delivered GMV uplifts of up to 24%, roughly 5% to 24% across the winners. Not every experiment won, so the aggregate effect was positive but modest.",
    },
    {
      title: "Data you can trust",
      body: "Stood up Sentry end to end. Fixed an all-or-nothing GraphQL bail-out so partial responses still render while errors reach Sentry. Fixed placeholder analytics IDs that were quietly corrupting funnels.",
    },
  ],
  stackLabel: "Stack on this engagement",
  stack: ["React 19", "React Router SSR", "TypeScript", "Nx + pnpm"],
  linkLabel: "See the full work history",
};

vi.mock("next-intl", () => {
  const t = ((key: string) => {
    const value = (flagshipMessages as Record<string, unknown>)[key];
    return typeof value === "string" ? value : key;
  }) as ((key: string) => string) & { raw: (key: string) => unknown };
  t.raw = (key: string) => (flagshipMessages as Record<string, unknown>)[key];
  return {
    useTranslations: () => t,
  };
});

vi.mock("@/i18n/navigation", () => ({
  Link: ({
    href,
    children,
    className,
  }: {
    href: string;
    children: React.ReactNode;
    className?: string;
  }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

describe("FlagshipSection", () => {
  it("renders the eyebrow, title and intro", () => {
    render(<FlagshipSection />);
    expect(screen.getByText(flagshipMessages.eyebrow)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: flagshipMessages.title })
    ).toBeInTheDocument();
    expect(screen.getByText(flagshipMessages.intro)).toBeInTheDocument();
  });

  it("renders every card title and body", () => {
    render(<FlagshipSection />);
    for (const card of flagshipMessages.cards) {
      expect(screen.getByText(card.title)).toBeInTheDocument();
      expect(screen.getByText(card.body)).toBeInTheDocument();
    }
  });

  it("renders exactly the expected number of cards", () => {
    render(<FlagshipSection />);
    const headings = screen.getAllByRole("heading", { level: 3 });
    expect(headings).toHaveLength(flagshipMessages.cards.length);
  });

  it("renders the engagement stack as a labelled list of pills", () => {
    render(<FlagshipSection />);
    const list = screen.getByRole("list", {
      name: flagshipMessages.stackLabel,
    });
    const pills = within(list).getAllByRole("listitem");
    expect(pills.map((pill) => pill.textContent)).toEqual(
      flagshipMessages.stack
    );
  });

  it("renders the link with the correct href and label", () => {
    render(<FlagshipSection />);
    const link = screen.getByRole("link", {
      name: flagshipMessages.linkLabel,
    });
    expect(link).toHaveAttribute("href", "/experience");
  });

  it("wires the section aria-labelledby to the heading id", () => {
    const { container } = render(<FlagshipSection />);
    const section = container.querySelector("section");
    const heading = screen.getByRole("heading", {
      name: flagshipMessages.title,
    });
    expect(section).toHaveAttribute("aria-labelledby", "flagship-heading");
    expect(heading).toHaveAttribute("id", "flagship-heading");
  });

  it("renders the flagship heading at display size", () => {
    render(<FlagshipSection />);
    const heading = screen.getByRole("heading", {
      name: flagshipMessages.title,
    });
    expect(heading).toHaveClass("text-3xl", "sm:text-4xl", "md:text-5xl");
  });

  it("gives the flagship cards the tinted surface", () => {
    render(<FlagshipSection />);
    const firstCardTitle = screen.getByText(flagshipMessages.cards[0].title);
    expect(firstCardTitle.closest("div")).toHaveClass("bg-bgLight");
  });
});
