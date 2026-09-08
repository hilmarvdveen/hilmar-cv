import { describe, it, expect } from "vitest";
import { BLOG_POSTS, getPostBySlug } from "./registry";

const slugs = BLOG_POSTS.map((post) => post.slug);

describe("blog registry", () => {
  it("exposes posts with unique slugs, the unfeatured ones sorted newest-first", () => {
    expect(BLOG_POSTS.length).toBeGreaterThan(0);
    expect(new Set(slugs).size).toBe(slugs.length);

    const unfeatured = BLOG_POSTS.filter((post) => !post.featured);
    for (let index = 1; index < unfeatured.length; index++) {
      expect(
        unfeatured[index - 1].publishedDate.localeCompare(unfeatured[index].publishedDate)
      ).toBeGreaterThanOrEqual(0);
    }
  });

  it("looks posts up by slug", () => {
    const first = slugs[0];
    expect(getPostBySlug(first)?.slug).toBe(first);
    expect(getPostBySlug("does-not-exist")).toBeUndefined();
  });

  it("gives every post bilingual metadata and a Body", () => {
    for (const post of BLOG_POSTS) {
      expect(post.title.en).toBeTruthy();
      expect(post.title.nl).toBeTruthy();
      expect(post.description.en).toBeTruthy();
      expect(post.description.nl).toBeTruthy();
      expect(typeof post.Body).toBe("function");
      expect(post.keywords.length).toBeGreaterThan(0);
    }
  });
  it("features the cut-over post ahead of the newest ones", () => {
    expect(BLOG_POSTS[0].slug).toBe("reversible-cut-over-legacy-to-new");
    expect(BLOG_POSTS[0].featured).toBe(true);
  });

});
