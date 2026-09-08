import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { RegionPage } from "./RegionPage";
import { ALL_REGIONS, regionEngagements, regionNearbyEngagements, regionSectorEngagements, otherRegions } from "@/data/regions";
import { BLOG_POSTS } from "@/features/blog";

const travel = ["Half an hour by train", "One or two days on site"];
const shapes = [
  { title: "Shape one", body: "Body one" },
  { title: "Shape two", body: "Body two" },
  { title: "Shape three", body: "Body three" },
];
const questions = [{ question: "How often on site?", answer: "One or two days." }];
const facts = [
  { label: "Availability", value: "From 1 October 2026", detail: "Earlier by arrangement" },
  { label: "Rate", value: "€95 to €125 per hour", detail: "" },
];

vi.mock("next-intl", () => {
  const raw = (key: string) => {
    if (key.endsWith(".travel")) return travel;
    if (key.endsWith(".shapes")) return key.startsWith("rotterdam") ? shapes.slice(0, 1) : shapes;
    if (key.endsWith(".questions")) return questions;
    if (key === "hiring.facts") return facts;
    return [];
  };
  const t = ((key: string, values?: Record<string, string | number>) =>
    values ? `${key}:${Object.values(values).join(",")}` : key) as ((key: string) => string) & { raw: typeof raw };
  t.raw = raw;
  return { useTranslations: () => t, useLocale: () => "en" };
});

vi.mock("@/i18n/navigation", () => ({
  Link: ({ children, href, className, ...rest }: { children: React.ReactNode; href: string; className?: string }) => (
    <a href={href} className={className} {...rest}>
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

const renderRegion = (id: string) => {
  const region = ALL_REGIONS.find((candidate) => candidate.id === id)!;
  const posts = region.postSlugs.flatMap((slug) => BLOG_POSTS.filter((post) => post.slug === slug));
  render(
    <RegionPage
      region={region}
      locale="en"
      engagements={regionEngagements(region)}
      nearby={regionNearbyEngagements(region)}
      sector={regionSectorEngagements(region)}
      posts={posts}
      siblings={otherRegions(region)}
      totalEngagements={12}
    />
  );
  return region;
};

describe("RegionPage", () => {
  it("renders the pitch, the local engagements, the nearby row, the reading list, the facts, the questions and the close for Amsterdam", () => {
    const region = renderRegion("amsterdam");
    expect(screen.getByRole("heading", { level: 2, name: "shared.pitchTitle" })).toBeInTheDocument();
    expect(screen.getByText("hiring.pitch.sentence")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "shared.engagementsTitle:amsterdam.name" })).toBeInTheDocument();
    expect(screen.getByText("amsterdam.engagementsLead:4,12")).toBeInTheDocument();
    const engagementLinks = screen.getAllByRole("link", { name: /^readMore:/ });
    expect(engagementLinks.map((link) => link.getAttribute("href"))).toEqual([
      ...region.engagementIds.map((id) => `/experience/${id}`),
      ...region.nearbyEngagementIds.map((id) => `/experience/${id}`),
    ]);
    expect(screen.getByRole("heading", { level: 3, name: "shared.nearbyTitle" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { level: 3, name: "shared.sectorTitle" })).toBeNull();
    expect(screen.getAllByRole("heading", { level: 3, name: "Shape one" })).toHaveLength(1);
    expect(screen.getAllByRole("link", { name: "shared.readPost" }).map((link) => link.getAttribute("href"))).toEqual(
      region.postSlugs.map((slug) => `/blog/${slug}`)
    );
    expect(screen.getByText("From 1 October 2026")).toBeInTheDocument();
    const question = screen.getByText("How often on site?");
    expect(question).toBeInTheDocument();
    const summary = question.closest("summary");
    const chevron = summary?.querySelector("svg");
    expect(chevron).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByRole("link", { name: "utrecht.name" })).toHaveAttribute("href", "/freelance-frontend-developer/utrecht");
    expect(screen.getByRole("link", { name: "shared.hubLink" })).toHaveAttribute("href", "/freelance-frontend-developer");
    expect(screen.getByRole("link", { name: "close.button" })).toHaveAttribute("data-placement", "region-amsterdam-close");
    expect(screen.getByRole("link", { name: "close.alternative" })).toHaveAttribute("href", "/contact");
  });

  it("stretches every reading-list link over its whole card without changing its accessible name", () => {
    const region = renderRegion("amsterdam");
    const links = screen.getAllByRole("link", { name: "shared.readPost" });
    expect(links).toHaveLength(region.postSlugs.length);
    for (const link of links) {
      expect(link).toHaveClass("after:absolute", "after:inset-0");
    }
    expect(links[0]).toHaveAccessibleName("shared.readPost");
  });

  it("collapses a single engagement shape to one sentence and shows the sector row for Den Haag", () => {
    renderRegion("rotterdam");
    expect(screen.getByText("Body one")).toBeInTheDocument();
    expect(screen.queryByRole("heading", { level: 3, name: "Shape one" })).toBeNull();
  });

  it("shows the sector row with the city named when the city has no engagement of its own", () => {
    renderRegion("den-haag");
    expect(screen.getByRole("heading", { level: 3, name: "shared.sectorTitle" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "shared.nearbyTitle" })).toBeInTheDocument();
    expect(screen.getByText(/^belastingdienst\.location · /)).toBeInTheDocument();
    expect(screen.getByText("den-haag.engagementsLead:0,12")).toBeInTheDocument();
  });
});
