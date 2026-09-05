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
    href: "/experience/belastingdienst",
  },
  {
    outcome: "Zero downtime",
    client: "bol.com",
    title: "Traffic cut-over",
    body: "Moved live traffic to the rebuilt page without an outage.",
    roleLabel: "See the bol.com case",
    href: "/experience/bol",
  },
  {
    outcome: "No data yet",
    client: "Example Co",
    title: "A case without a work history entry",
    body: "This case intentionally links outside the experience anchors.",
    roleLabel: "See the example case",
    href: "/contact",
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

vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img alt="" {...props} />;
  },
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

  it("shows the client and role line and links each case to its engagement page", () => {
    render(<ProjectShowcase />);
    const links = screen.getAllByRole("link", { name: "readMore" });
    expect(links).toHaveLength(cases.length);
    cases.forEach((projectCase, index) => {
      expect(links[index]).toHaveAttribute("href", projectCase.href);
      expect(screen.getByText(`${projectCase.client} · ${projectCase.roleLabel}`)).toBeInTheDocument();
    });
  });

  it("renders the client logo only when the case matches a work history entry", () => {
    render(<ProjectShowcase />);
    expect(screen.getByRole("img", { name: "Belastingdienst" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "bol.com" })).toBeInTheDocument();
    expect(screen.queryByRole("img", { name: "Example Co" })).toBeNull();
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
