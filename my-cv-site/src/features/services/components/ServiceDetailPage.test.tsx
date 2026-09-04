import { describe, it, expect, vi } from "vitest";
import type { ReactNode } from "react";
import { render, screen, within } from "@testing-library/react";
import { ServiceDetailPage } from "./ServiceDetailPage";
import type { ServiceDetailPageProps, ServiceTitledItem } from "./ServiceDetailPage";

vi.mock("next-intl", async () => (await import("@/test/intl")).intlMock());
vi.mock("next/navigation", () => ({ usePathname: () => "/en/services/frontend" }));
vi.mock("next/link", () => ({
  default: ({ children, href }: { children: ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

const DummyIcon = ({ className }: { className?: string }) => (
  <svg className={className} />
);

const baseProps: ServiceDetailPageProps = {
  structuredData: '{"@context":"https://schema.org"}',
  hero: {
    badge: "Frontend Development",
    Icon: DummyIcon,
    title: "Modern Frontend",
    titleAccent: "That Converts",
    description: "Interfaces built for speed and clarity.",
    features: ["Cross-platform compatibility", "Optimized performance"],
    bookLabel: "Book the intro call",
    actionLabel: "Discuss the project",
  },
  engagement: {
    title: "How the engagement is scoped",
    description: "What every frontend engagement includes.",
    deliverables: [
      { title: "Discovery", description: "Legacy spec read first." },
      { title: "Build", description: "React rebuild behind a gate." },
      { title: "Cut-over", description: "Reversible traffic ramp." },
      { title: "Handover", description: "Tests and documentation." },
    ],
    terms: ["Fixed scope", "Weekly demo", "No lock-in"],
    termsLabel: "Engagement terms",
  },
  benefits: {
    title: "What you get",
    description: "Frontend work built for performance and access.",
    items: [
      {
        title: "Mobile-first design",
        description: "Responsive on every device.",
        Icon: DummyIcon,
      },
      {
        title: "Accessibility focus",
        description: "WCAG 2.2 AA by default.",
        Icon: DummyIcon,
      },
    ],
  },
  technologies: {
    title: "Technologies and tools",
    description: "Modern, battle-tested technologies.",
    groups: [
      {
        name: "Core stack",
        items: [
          { name: "React", description: "Component-based UI library.", level: "Expert" },
          { name: "Next.js", description: "Full-stack React framework.", level: "Advanced" },
          { name: "Vue.js", description: "Progressive framework.", level: "Gevorderd" },
          { name: "Redux", description: "State management.", level: "Familiar" },
        ],
      },
      {
        items: [
          {
            name: "Tailwind CSS",
            description: "Utility-first styling.",
            level: "Beginner",
          },
        ],
      },
    ],
  },
  process: {
    title: "How delivery runs",
    description: "A proven methodology from discovery to handover.",
    steps: [
      {
        title: "Discovery and planning",
        description: "Understanding goals and constraints.",
        details: ["User research", "Architecture planning"],
        Icon: DummyIcon,
      },
      {
        title: "Build and review",
        description: "Shipping behind a gate.",
        details: ["Component build", "Accessibility review"],
        Icon: DummyIcon,
      },
    ],
  },
  callToAction: {
    title: "Ready to get started?",
    description: "Thirty minutes, no obligation.",
    bookLabel: "Book a 30-minute call",
    viewAllLabel: "View all services",
  },
};

const deliverablesItems: ServiceTitledItem[] = [
  {
    title: "Design token library",
    description: "Colours, type and spacing decisions.",
    Icon: DummyIcon,
  },
  {
    title: "Component library",
    description: "Reusable UI components with variants.",
    Icon: DummyIcon,
  },
];

describe("ServiceDetailPage", () => {
  it("renders the hero title and accent as the page heading", () => {
    render(<ServiceDetailPage {...baseProps} />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("Modern Frontend");
    expect(heading).toHaveTextContent("That Converts");
  });

  it("renders every hero feature", () => {
    render(<ServiceDetailPage {...baseProps} />);
    for (const feature of baseProps.hero.features) {
      expect(screen.getByText(feature)).toBeInTheDocument();
    }
  });

  it("links the hero actions to book and contact", () => {
    render(<ServiceDetailPage {...baseProps} />);
    expect(
      screen.getByRole("link", { name: baseProps.hero.bookLabel })
    ).toHaveAttribute("href", "/book");
    expect(
      screen.getByRole("link", { name: baseProps.hero.actionLabel })
    ).toHaveAttribute("href", "/contact");
  });

  it("numbers the engagement deliverables and renders every term", () => {
    render(<ServiceDetailPage {...baseProps} />);
    const engagementRegion = screen.getByRole("region", {
      name: baseProps.engagement.title,
    });
    expect(within(engagementRegion).getByText("01")).toBeInTheDocument();
    expect(within(engagementRegion).getByText("04")).toBeInTheDocument();
    for (const deliverable of baseProps.engagement.deliverables) {
      expect(screen.getByText(deliverable.title)).toBeInTheDocument();
      expect(screen.getByText(deliverable.description)).toBeInTheDocument();
    }
    const termsList = screen.getByRole("list", {
      name: baseProps.engagement.termsLabel,
    });
    for (const term of baseProps.engagement.terms) {
      expect(within(termsList).getByText(term)).toBeInTheDocument();
    }
  });

  it("renders every benefit item", () => {
    render(<ServiceDetailPage {...baseProps} />);
    for (const item of baseProps.benefits.items) {
      expect(screen.getByText(item.title)).toBeInTheDocument();
      expect(screen.getByText(item.description)).toBeInTheDocument();
    }
  });

  it("omits the deliverables section when none is given", () => {
    render(<ServiceDetailPage {...baseProps} />);
    expect(
      screen.queryByRole("heading", { name: "Complete package" })
    ).toBeNull();
  });

  it("renders the deliverables section with icon cards when given", () => {
    render(
      <ServiceDetailPage
        {...baseProps}
        deliverables={{
          title: "Complete package",
          description: "Everything a design system engagement ships.",
          items: deliverablesItems,
        }}
      />
    );
    expect(
      screen.getByRole("heading", { name: "Complete package" })
    ).toBeInTheDocument();
    for (const item of deliverablesItems) {
      expect(screen.getByText(item.title)).toBeInTheDocument();
      expect(screen.getByText(item.description)).toBeInTheDocument();
    }
  });

  it("renders a named technology group heading with h4 items", () => {
    render(<ServiceDetailPage {...baseProps} />);
    expect(
      screen.getByRole("heading", { level: 3, name: "Core stack" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 4, name: "React" })
    ).toBeInTheDocument();
  });

  it("renders an unnamed technology group with h3 items instead of h4", () => {
    render(<ServiceDetailPage {...baseProps} />);
    expect(
      screen.getByRole("heading", { level: 3, name: "Tailwind CSS" })
    ).toBeInTheDocument();
  });

  it("colours the expert level pill emerald", () => {
    render(<ServiceDetailPage {...baseProps} />);
    expect(screen.getByText("Expert").className).toContain("bg-emerald-50");
  });

  it("colours the advanced and gevorderd level pills navy", () => {
    render(<ServiceDetailPage {...baseProps} />);
    expect(screen.getByText("Advanced").className).toContain("bg-brand-navy/10");
    expect(screen.getByText("Gevorderd").className).toContain("bg-brand-navy/10");
  });

  it("colours every other level pill gray", () => {
    render(<ServiceDetailPage {...baseProps} />);
    expect(screen.getByText("Familiar").className).toContain("bg-gray-100");
  });

  it("renders every process step numbered, with its title and details", () => {
    render(<ServiceDetailPage {...baseProps} />);
    const processRegion = screen.getByRole("region", {
      name: baseProps.process.title,
    });
    expect(within(processRegion).getByText("01")).toBeInTheDocument();
    expect(within(processRegion).getByText("02")).toBeInTheDocument();
    for (const step of baseProps.process.steps) {
      expect(
        within(processRegion).getByRole("heading", { level: 3, name: step.title })
      ).toBeInTheDocument();
      for (const detail of step.details) {
        expect(within(processRegion).getByText(detail)).toBeInTheDocument();
      }
    }
  });

  it("links the final call to action to book and services", () => {
    render(<ServiceDetailPage {...baseProps} />);
    expect(
      screen.getByRole("link", { name: baseProps.callToAction.bookLabel })
    ).toHaveAttribute("href", "/book");
    expect(
      screen.getByRole("link", { name: baseProps.callToAction.viewAllLabel })
    ).toHaveAttribute("href", "/services");
  });

  it("renders the structured data script", () => {
    const { container } = render(<ServiceDetailPage {...baseProps} />);
    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script?.innerHTML).toBe(baseProps.structuredData);
  });
});
