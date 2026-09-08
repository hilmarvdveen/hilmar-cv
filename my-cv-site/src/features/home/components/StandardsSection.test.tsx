import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { StandardsSection } from "./StandardsSection";

const standardsColumns = [
  {
    title: "Security",
    body: "The complete Certified Secure curriculum, from Essential Security through Web and Server Security Specialist, plus Secure Development, Full-Stack Security and Kubernetes network security. Applied in practice through a CSP profile, an auth keyserver allow-list and secure referral-code threading.",
  },
  {
    title: "Accessibility and privacy",
    body: "WCAG 2.1 AA on the 2020 to 2024 engagements and 2.2 AA at bol.com, delivered as part of the work rather than retrofitted. Keyboard focus management in real flows. GDPR training on protecting personal data, plus EU AI Act literacy.",
  },
  {
    title: "Verification and handover",
    body: "Co-located tests with Vitest and Testing Library over GraphQL mocks, Playwright, and a Storybook story per scenario. Written handover documentation, so a backend-heavy team can maintain the work after the contract ends.",
  },
];

vi.mock("next-intl", () => {
  const t = ((key: string) => {
    if (key === "title")
      return "Security, accessibility and tests are the floor, not the upsell";
    return key;
  }) as ((key: string) => string) & { raw: (key: string) => unknown };
  t.raw = (key: string) => {
    if (key === "columns") return standardsColumns;
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

describe("StandardsSection", () => {
  it("renders the section heading wired to the section via aria-labelledby", () => {
    const { container } = render(<StandardsSection />);
    const section = container.querySelector("section");
    expect(section).toHaveAttribute("aria-labelledby", "standards-heading");

    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toHaveAttribute("id", "standards-heading");
    expect(heading).toHaveTextContent(
      "Security, accessibility and tests are the floor, not the upsell"
    );
  });

  it("renders one column per entry with its title and body", () => {
    render(<StandardsSection />);
    for (const column of standardsColumns) {
      expect(screen.getByText(column.title)).toBeInTheDocument();
      expect(screen.getByText(column.body)).toBeInTheDocument();
    }
    const columnHeadings = screen.getAllByRole("heading", { level: 3 });
    expect(columnHeadings).toHaveLength(standardsColumns.length);
  });

  it("renders exactly the number of columns provided", () => {
    const { container } = render(<StandardsSection />);
    expect(container.querySelectorAll("svg")).toHaveLength(
      standardsColumns.length
    );
  });

  it("links to the testing article under the columns", () => {
    render(<StandardsSection />);
    const link = screen.getByRole("link", { name: "link" });
    expect(link).toHaveAttribute("href", "/blog/unit-testing-react-the-right-way");
    expect(link).toHaveAttribute("data-placement", "home-standards-article");
  });
});
