import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { RegionHub } from "./RegionHub";
import { REGIONS, engagementsOutsideRegions } from "@/data/regions";

vi.mock("next-intl", () => {
  const t = ((key: string, values?: Record<string, string | number>) =>
    values ? `${key}:${Object.values(values).join(",")}` : key) as ((key: string) => string) & {
    raw: (key: string) => unknown;
  };
  t.raw = () => [];
  return { useTranslations: () => t, useLocale: () => "nl" };
});

vi.mock("@/i18n/navigation", () => ({
  Link: ({ children, href, className, ...rest }: { children: React.ReactNode; href: string; className?: string }) => (
    <a href={href} className={className} {...rest}>
      {children}
    </a>
  ),
}));

describe("RegionHub", () => {
  it("renders the home base, one card per city, the rest of the map and the close", () => {
    const outside = engagementsOutsideRegions();
    render(<RegionHub regions={REGIONS} engagementCounts={{ amsterdam: 4, utrecht: 2, rotterdam: 1, "den-haag": 0 }} outside={outside} />);
    expect(screen.getByRole("heading", { level: 2, name: "hub.baseTitle" })).toBeInTheDocument();
    expect(screen.getByText("hub.baseBody")).toBeInTheDocument();
    const cityLinks = screen.getAllByRole("link", { name: /^hub\.cityLink:/ });
    expect(cityLinks.map((link) => link.getAttribute("href"))).toEqual(REGIONS.map((region) => `/freelance-frontend-developer/${region.id}`));
    expect(screen.getByText("amsterdam.hubLine:4")).toBeInTheDocument();
    const outsideLinks = screen.getAllByRole("link", { name: "readMore" });
    expect(outsideLinks).toHaveLength(outside.length);
    expect(outsideLinks[0]).toHaveAttribute("href", `/experience/${outside[0].id}`);
    expect(screen.getByText("hub.remoteBody")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "close.button" })).toHaveAttribute("data-placement", "region-hub-close");
  });
});
