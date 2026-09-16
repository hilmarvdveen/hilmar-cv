import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { BlogArticle } from "./BlogArticle";
import type { BlogPost, BlogLabels } from "../types";
import type { Locale } from "@/lib/seo";

vi.mock("next-intl", async () => (await import("@/test/intl")).intlMock());

vi.mock("@/i18n/navigation", () => ({
  Link: ({ children, href, ...rest }: { children: React.ReactNode; href: string }) => (
    <a href={href} {...rest}>
      {children}
    </a>
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
  breadcrumbLabel: "Breadcrumb",
  homeLabel: "Home",
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

    expect(screen.getByRole("navigation", { name: "Breadcrumb" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/");

    const toOverview = screen
      .getAllByRole("link")
      .filter((anchor) => anchor.getAttribute("href") === "/blog");
    expect(toOverview.length).toBeGreaterThan(0);
    expect(
      screen.getByText("Title EN", { selector: '[aria-current="page"]' })
    ).toBeInTheDocument();

    expect(screen.getByText("body-en")).toBeInTheDocument();
    expect(screen.getByText("Architecture")).toBeInTheDocument();
    expect(screen.getByText("Work together?")).toBeInTheDocument();
    expect(screen.getByText("Back to all articles")).toBeInTheDocument();
    expect(screen.getByText(/June/)).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Get in touch" })
    ).toHaveAttribute("href", "/book");
  });

  it("renders the Dutch title when the locale is nl", () => {
    render(<BlogArticle post={post} locale="nl" labels={labels} />);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Titel NL");
    expect(screen.getByText("body-nl")).toBeInTheDocument();
  });

  it("puts the neighbouring articles between the body and the closing band", () => {
    render(
      <BlogArticle
        post={post}
        locale="en"
        labels={labels}
        previous={{ slug: "newer-post", title: { en: "Newer post", nl: "Nieuwer artikel" } }}
        next={{ slug: "older-post", title: { en: "Older post", nl: "Ouder artikel" } }}
      />
    );

    const navigation = screen.getByRole("navigation", { name: "neighbours.label" });
    expect(
      within(navigation).getByRole("link", { name: "neighbours.previous: Newer post" })
    ).toHaveAttribute("href", "/blog/newer-post");
    expect(
      within(navigation).getByRole("link", { name: "neighbours.next: Older post" })
    ).toHaveAttribute("href", "/blog/older-post");

    const body = screen.getByText("body-en");
    const closingBand = screen.getByText("Work together?");
    expect(body.compareDocumentPosition(navigation)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(closingBand.compareDocumentPosition(navigation)).toBe(Node.DOCUMENT_POSITION_PRECEDING);
  });

  it("leaves the neighbour navigation out when the article has none", () => {
    render(<BlogArticle post={post} locale="en" labels={labels} />);
    expect(screen.queryByRole("navigation", { name: "neighbours.label" })).toBeNull();
  });

  it("shows the updated label and date when the post was updated after publishing", () => {
    const updatedPost: BlogPost = { ...post, updatedDate: "2026-07-15" };
    render(<BlogArticle post={updatedPost} locale="en" labels={labels} />);
    expect(screen.getByText(/Published/)).toBeInTheDocument();
    expect(screen.getByText(/June/)).toBeInTheDocument();
    expect(screen.getByText(/Updated/)).toBeInTheDocument();
    expect(screen.getByText(/July/)).toBeInTheDocument();
  });

  it("shows the published date alone when the post has no separate update", () => {
    const noUpdateRender = render(<BlogArticle post={post} locale="en" labels={labels} />);
    expect(screen.getByText(/Published/)).toBeInTheDocument();
    expect(screen.queryByText(/Updated/)).toBeNull();
    noUpdateRender.unmount();

    const sameDatePost: BlogPost = { ...post, updatedDate: post.publishedDate };
    render(<BlogArticle post={sameDatePost} locale="en" labels={labels} />);
    expect(screen.getByText(/Published/)).toBeInTheDocument();
    expect(screen.queryByText(/Updated/)).toBeNull();
  });
});
