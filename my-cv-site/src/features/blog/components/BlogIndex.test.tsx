import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { BlogIndex } from "./BlogIndex";
import type { BlogPost, BlogLabels } from "../types";

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
  ctaTitle: "x",
  ctaText: "y",
  ctaButton: "z",
};

const makePost = (slug: string, titleEn: string): BlogPost => ({
  slug,
  category: "testing",
  publishedDate: "2026-05-01",
  readingTimeMin: 9,
  title: { en: titleEn, nl: `${titleEn} NL` },
  description: { en: "d", nl: "d" },
  excerpt: { en: `excerpt-${slug}`, nl: `nl-${slug}` },
  keywords: ["k"],
  Body: () => null,
});

describe("BlogIndex", () => {
  const posts = [makePost("one", "First Post"), makePost("two", "Second Post")];

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
});
