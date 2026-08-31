import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { HiringSection } from "./HiringSection";

const facts = [
  {
    label: "Availability",
    value: "From 1 October 2026",
    detail: "Earlier by arrangement",
    highlight: true,
  },
  {
    label: "Location",
    value: "Utrecht, hybrid or remote",
    detail: "1 to 2 days on site is fine",
    highlight: false,
  },
  {
    label: "Languages",
    value: "Dutch native, English fluent",
    detail: "",
    highlight: false,
  },
];

const faq = {
  title: "The questions hiring managers ask first",
  items: [
    {
      question: "What does the first month look like?",
      answer: "At bol.com I shipped a production page within weeks.",
    },
    {
      question: "Can you work with our backend team?",
      answer: "That is exactly what I get hired for.",
    },
  ],
  linkLabel: "Read all questions",
};

vi.mock("next-intl", () => ({
  useTranslations: () => {
    const t = ((key: string) => key) as ((key: string) => string) & {
      raw: (key: string) => unknown;
    };
    t.raw = (key: string) => {
      if (key === "facts") return facts;
      if (key === "faq") return faq;
      return [];
    };
    return t;
  },
}));

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

describe("HiringSection", () => {
  it("renders the section title wired to the heading id", () => {
    const { container } = render(<HiringSection />);
    const section = container.querySelector("section");
    const heading = screen.getByRole("heading", { name: "title", level: 2 });
    expect(section).toHaveAttribute("aria-labelledby", "hiring-heading");
    expect(heading).toHaveAttribute("id", "hiring-heading");
  });

  it("renders every fact label, value and non-empty detail", () => {
    render(<HiringSection />);
    for (const fact of facts) {
      expect(screen.getByText(fact.label)).toBeInTheDocument();
      expect(screen.getByText(fact.value)).toBeInTheDocument();
      if (fact.detail) {
        expect(screen.getByText(fact.detail)).toBeInTheDocument();
      }
    }
    // Languages has an empty detail: nothing extra rendered for it beyond
    // the value/label already asserted above.
  });

  it("shows the highlight status dot only for highlighted facts", () => {
    const { container } = render(<HiringSection />);
    const dots = container.querySelectorAll("span.bg-emerald-500");
    expect(dots).toHaveLength(1);
  });

  it("renders the faq title and every question and answer", () => {
    render(<HiringSection />);
    expect(screen.getByText(faq.title)).toBeInTheDocument();
    for (const item of faq.items) {
      expect(screen.getByText(item.question)).toBeInTheDocument();
      expect(screen.getByText(item.answer)).toBeInTheDocument();
    }
  });

  it("links to /faq with the translated label", () => {
    render(<HiringSection />);
    const link = screen.getByRole("link", { name: faq.linkLabel });
    expect(link).toHaveAttribute("href", "/faq");
  });
});
