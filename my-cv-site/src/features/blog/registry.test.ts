import { describe, it, expect } from "vitest";
import { BLOG_POSTS, getPostBySlug, getAllSlugs } from "./registry";

describe("blog registry", () => {
  it("exposes posts with unique slugs, sorted newest-first", () => {
    expect(BLOG_POSTS.length).toBeGreaterThan(0);

    const slugs = getAllSlugs();
    expect(new Set(slugs).size).toBe(slugs.length);

    for (let i = 1; i < BLOG_POSTS.length; i++) {
      expect(
        BLOG_POSTS[i - 1].publishedDate.localeCompare(BLOG_POSTS[i].publishedDate)
      ).toBeGreaterThanOrEqual(0);
    }
  });

  it("looks posts up by slug", () => {
    const first = getAllSlugs()[0];
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
});
