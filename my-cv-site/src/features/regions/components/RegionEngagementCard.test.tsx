import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { RegionEngagementCard } from "./RegionEngagementCard";
import { workHistory } from "@/data/workHistory";

vi.mock("next-intl", () => {
  const t = ((key: string, values?: Record<string, string>) =>
    values ? `${key}:${Object.values(values).join(",")}` : key) as ((key: string) => string) & {
    raw: (key: string) => unknown;
  };
  t.raw = () => [];
  return { useTranslations: () => t, useLocale: () => "en" };
});

vi.mock("@/i18n/navigation", () => ({
  Link: ({ children, href, className }: { children: React.ReactNode; href: string; className?: string }) => (
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

const opinity = workHistory.find((entry) => entry.id === "opinity")!;

describe("RegionEngagementCard", () => {
  it("shows the company, the period and role, the summary and the link to the engagement page", () => {
    render(<RegionEngagementCard entry={opinity} />);
    expect(screen.getByRole("heading", { level: 3, name: "opinity.company" })).toBeInTheDocument();
    expect(screen.getByText(/period:.*opinity\.role/)).toBeInTheDocument();
    expect(screen.getByText("opinity.summary")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "readMore:opinity.company" })).toHaveAttribute(
      "href",
      "/experience/opinity"
    );
    expect(screen.getByRole("img", { name: "images.companyLogoAlt:Opinity" })).toBeInTheDocument();
  });

  it("names the city first when the engagement is elsewhere", () => {
    render(<RegionEngagementCard entry={opinity} showCity />);
    expect(screen.getByText(/^opinity\.location · period/)).toBeInTheDocument();
  });

  it("stretches the engagement link over the whole card without changing its accessible name", () => {
    render(<RegionEngagementCard entry={opinity} />);
    const link = screen.getByRole("link", { name: "readMore:opinity.company" });
    expect(link).toHaveClass("after:absolute", "after:inset-0");
    expect(link).toHaveAccessibleName("readMore:opinity.company");
  });
});
