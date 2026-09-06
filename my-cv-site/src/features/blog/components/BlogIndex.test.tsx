import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { BlogIndex } from "./BlogIndex";
import type { BlogPost, BlogLabels, BlogTrack } from "../types";

vi.mock("@/i18n/navigation", () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

const labels: BlogLabels = {
  eyebrow: "Blog",
  indexTitle: "All articles",
  indexSubtitle: "Things I have written",
  minRead: "min read",
  publishedOn: "Published",
  updatedOn: "Updated",
  writtenBy: "Hilmar van der Veen",
  readArticle: "Read article",
  backToList: "Back",
  category: {
    architecture: "Architecture",
    testing: "Testing",
    seo: "SEO",
    routing: "Routing",
    fundamentals: "Fundamentals",
  },
  track: {
    frontend: "Frontend",
    fullstack: "Fullstack",
    backend: "Backend",
  },
  group: {
    frontend: "Frontend group",
    fullstack: "Fullstack group",
    backend: "Backend group",
  },
  ctaTitle: "x",
  ctaText: "y",
  ctaButton: "z",
  breadcrumbLabel: "Breadcrumb",
  homeLabel: "Home",
};

const makePost = (slug: string, titleEn: string, track: BlogTrack = "frontend"): BlogPost => ({
  slug,
  category: "testing",
  track,
  publishedDate: "2026-05-01",
  readingTimeMin: 9,
  title: { en: titleEn, nl: `${titleEn} NL` },
  description: { en: "d", nl: "d" },
  excerpt: { en: `excerpt-${slug}`, nl: `nl-${slug}` },
  keywords: ["k"],
  Body: () => null,
});

const posts = [makePost("one", "First Post"), makePost("two", "Second Post")];

describe("BlogIndex", () => {
  it("lists every post with localized title, excerpt and a link to its slug", () => {
    render(<BlogIndex posts={posts} locale="en" labels={labels} />);
    expect(screen.getByText("All articles")).toBeInTheDocument();
    expect(screen.getByText("First Post")).toBeInTheDocument();
    expect(screen.getByText("excerpt-one")).toBeInTheDocument();
    expect(screen.getByText("Second Post").closest("a")?.getAttribute("href")).toBe("/blog/two");
    expect(screen.getAllByText("Read article")).toHaveLength(2);
  });

  it("renders Dutch excerpts when locale is nl", () => {
    render(<BlogIndex posts={posts} locale="nl" labels={labels} />);
    expect(screen.getByText("nl-one")).toBeInTheDocument();
  });

  it("features the newest post as a level two heading ahead of the grouped level three cards", () => {
    render(<BlogIndex posts={posts} locale="en" labels={labels} />);
    expect(screen.getByRole("heading", { level: 2, name: "First Post" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "Second Post" })).toBeInTheDocument();
  });

  it("groups the remaining posts by track in the order frontend, fullstack, backend and skips empty tracks", () => {
    const grouped = [
      makePost("newest", "Newest Post", "backend"),
      makePost("api", "Api Post", "backend"),
      makePost("contract", "Contract Post", "fullstack"),
      makePost("hooks", "Hooks Post", "frontend"),
    ];
    render(<BlogIndex posts={grouped} locale="en" labels={labels} />);
    const groupHeadings = screen
      .getAllByRole("heading", { level: 2 })
      .map((heading) => heading.textContent)
      .filter((text) => text?.endsWith("group"));
    expect(groupHeadings).toEqual(["Frontend group", "Fullstack group", "Backend group"]);
    expect(screen.getAllByRole("heading", { level: 3, name: /Post/ })).toHaveLength(3);
    expect(screen.getAllByText("Backend")).toHaveLength(2);
  });

  it("leaves out a group heading when no remaining post carries that track", () => {
    render(<BlogIndex posts={posts} locale="en" labels={labels} />);
    expect(screen.queryByRole("heading", { name: "Backend group" })).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Frontend group" })).toBeInTheDocument();
  });

  it("closes with the site's one booking call to action", () => {
    render(<BlogIndex posts={posts} locale="en" labels={labels} />);
    expect(screen.getByRole("heading", { level: 2, name: "x" })).toBeInTheDocument();
    expect(screen.getByText("y")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "z" })).toHaveAttribute("href", "/book");
  });
});
