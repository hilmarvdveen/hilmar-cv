import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { BlogArticle } from "./BlogArticle";
import type { BlogPost, BlogLabels } from "../types";
import type { Locale } from "@/lib/seo";

vi.mock("@/i18n/navigation", () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

const labels: BlogLabels = {
  eyebrow: "Blog",
  indexTitle: "Index",
  indexSubtitle: "Subtitle",
  minRead: "min read",
  publishedOn: "Published",
  updatedOn: "Updated",
  writtenBy: "Hilmar van der Veen",
  readArticle: "Read article",
  backToList: "Back to all articles",
  category: {
    architecture: "Architecture",
    testing: "Testing",
    seo: "SEO",
    routing: "Routing",
    fundamentals: "Fundamentals",
  },
  ctaTitle: "Work together?",
  ctaText: "Let’s talk.",
  ctaButton: "Get in touch",
};

const post: BlogPost = {
  slug: "demo-post",
  category: "architecture",
  publishedDate: "2026-06-10",
  readingTimeMin: 7,
  title: { en: "Title EN", nl: "Titel NL" },
  description: { en: "Description EN", nl: "Beschrijving NL" },
  excerpt: { en: "Excerpt", nl: "Samenvatting" },
  keywords: ["a", "b"],
  Body: ({ locale }: { locale: Locale }) => <p>body-{locale}</p>,
};

describe("BlogArticle", () => {
  it("renders the localized header, body and chrome for English", () => {
    render(<BlogArticle post={post} locale="en" labels={labels} />);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Title EN");

    // Breadcrumb links back to the blog overview and marks the current article.
    const toOverview = screen
      .getAllByRole("link")
      .filter((a) => a.getAttribute("href") === "/blog");
    expect(toOverview.length).toBeGreaterThan(0);
    expect(
      screen.getByText("Title EN", { selector: '[aria-current="page"]' })
    ).toBeInTheDocument();

    expect(screen.getByText("body-en")).toBeInTheDocument();
    expect(screen.getByText("Architecture")).toBeInTheDocument();
    expect(screen.getByText("Work together?")).toBeInTheDocument();
    expect(screen.getByText("Back to all articles")).toBeInTheDocument();
    expect(screen.getByText(/June/)).toBeInTheDocument();
  });

  it("renders the Dutch title when the locale is nl", () => {
    render(<BlogArticle post={post} locale="nl" labels={labels} />);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Titel NL");
    expect(screen.getByText("body-nl")).toBeInTheDocument();
  });
});
