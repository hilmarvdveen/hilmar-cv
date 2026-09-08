import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { DeliveryMethodSection } from "./DeliveryMethodSection";

const steps = [
  {
    title: "Read the legacy first",
    body: "Reverse-engineer the old system, undocumented Java included, so the rebuild is faithful rather than approximate.",
  },
  {
    title: "Shape the contract",
    body: "GraphQL is a real contract. I go back to backend to reshape a field when the UI needs it, instead of working around it.",
  },
  {
    title: "Ship behind a gate",
    body: "Employees and internal traffic first, so real people use the new page before customers ever see it.",
  },
  {
    title: "Ramp by percentage",
    body: "1, 10, 50, then 100 percent of traffic, hashed per visitor, with one-step rollback available the whole way.",
  },
  {
    title: "Problems surface",
    body: "Sentry from day one, partial responses that still render, and analytics verified so the funnel data is trustworthy.",
  },
];

vi.mock("next-intl", () => {
  const t = ((key: string) => {
    if (key === "title") return "How delivery stays boring";
    if (key === "subtitle")
      return "Most senior frontend engineers hand off at the API boundary. This is the part that does not get handed off.";
    return key;
  }) as ((key: string) => string) & { raw: (key: string) => unknown };
  t.raw = (key: string) => {
    if (key === "steps") return steps;
    return [];
  };
  return {
    useTranslations: () => t,
  };
});

vi.mock("@/i18n/navigation", () => ({
  Link: ({ children, href, ...rest }: { children: React.ReactNode; href: string }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

describe("DeliveryMethodSection", () => {
  it("renders the section heading and subtitle", () => {
    render(<DeliveryMethodSection />);

    expect(
      screen.getByRole("heading", { name: "How delivery stays boring" })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Most senior frontend engineers hand off at the API boundary. This is the part that does not get handed off."
      )
    ).toBeInTheDocument();
  });

  it("wires the heading id to the section's aria-labelledby", () => {
    const { container } = render(<DeliveryMethodSection />);
    const section = container.querySelector("section");
    const heading = screen.getByRole("heading", {
      name: "How delivery stays boring",
    });

    expect(heading).toHaveAttribute("id", "method-heading");
    expect(section).toHaveAttribute("aria-labelledby", "method-heading");
  });

  it("renders every step with its zero-padded number, title and body", () => {
    render(<DeliveryMethodSection />);

    steps.forEach((step, index) => {
      expect(
        screen.getByText(String(index + 1).padStart(2, "0"))
      ).toBeInTheDocument();
      expect(screen.getByText(step.title)).toBeInTheDocument();
      expect(screen.getByText(step.body)).toBeInTheDocument();
    });
  });

  it("renders exactly the number of steps provided", () => {
    render(<DeliveryMethodSection />);

    expect(screen.getAllByText(/^\d{2}$/)).toHaveLength(steps.length);
  });
  it("links the cut-over article under the steps", () => {
    render(<DeliveryMethodSection />);
    const link = screen.getByRole("link", { name: "link" });
    expect(link).toHaveAttribute("href", "/blog/reversible-cut-over-legacy-to-new");
    expect(link).toHaveAttribute("data-placement", "home-method-article");
  });

  it("gives the article link a resting underline instead of hover-only", () => {
    render(<DeliveryMethodSection />);
    const link = screen.getByRole("link", { name: "link" });
    expect(link.className).toContain("underline");
    expect(link.className).not.toContain("hover:underline");
  });
});
