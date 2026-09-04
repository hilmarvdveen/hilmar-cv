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

const shapes = [
  {
    title: "A short discovery",
    description: "A scoped week to map the legacy surface before committing to a plan.",
    href: "/services/consulting",
    linkLabel: "Read about discovery",
  },
  {
    title: "An embedded engagement",
    description: "Full time on your team for the length of the rebuild.",
    href: "/services/frontend",
    linkLabel: "Read about embedded work",
  },
  {
    title: "A design system build",
    description: "A shared component library your teams keep after I leave.",
    href: "/services/design-systems",
    linkLabel: "Read about design systems",
  },
];

vi.mock("next-intl", () => ({
  useTranslations: () => {
    const t = ((key: string) => key) as ((key: string) => string) & {
      raw: (key: string) => unknown;
    };
    t.raw = (key: string) => {
      if (key === "facts") return facts;
      if (key === "faq") return faq;
      if (key === "shapes.items") return shapes;
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

  it("renders the engagement shapes intro", () => {
    render(<HiringSection />);
    expect(screen.getByText("shapes.title")).toBeInTheDocument();
    expect(screen.getByText("shapes.subtitle")).toBeInTheDocument();
  });

  it("renders every engagement shape as a card with a linked call to action", () => {
    render(<HiringSection />);
    for (const shape of shapes) {
      expect(
        screen.getByRole("heading", { level: 3, name: shape.title })
      ).toBeInTheDocument();
      expect(screen.getByText(shape.description)).toBeInTheDocument();
      const link = screen.getByRole("link", { name: shape.linkLabel });
      expect(link).toHaveAttribute("href", shape.href);
    }
  });

  it("renders the pitch row as a labelled blockquote with examples", () => {
    render(<HiringSection />);
    expect(screen.getByText("pitch.label")).toBeInTheDocument();
    expect(screen.getByText("pitch.sentence").tagName).toBe("BLOCKQUOTE");
    expect(screen.getByText("pitch.examples")).toBeInTheDocument();
  });
});
