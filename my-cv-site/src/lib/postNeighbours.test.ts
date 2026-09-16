import { describe, it, expect } from "vitest";
import { findPostNeighbours } from "./postNeighbours";

const posts = [
  { slug: "oldest", publishedDate: "2026-06-10" },
  { slug: "newest", publishedDate: "2026-09-08" },
  { slug: "middle", publishedDate: "2026-07-01" },
];

describe("findPostNeighbours", () => {
  it("reads the list newest first, so previous is the newer post and next the older one", () => {
    const neighbours = findPostNeighbours(posts, "middle");
    expect(neighbours.previous?.slug).toBe("newest");
    expect(neighbours.next?.slug).toBe("oldest");
  });

  it("leaves previous empty on the newest post", () => {
    const neighbours = findPostNeighbours(posts, "newest");
    expect(neighbours.previous).toBeUndefined();
    expect(neighbours.next?.slug).toBe("middle");
  });

  it("leaves next empty on the oldest post", () => {
    const neighbours = findPostNeighbours(posts, "oldest");
    expect(neighbours.previous?.slug).toBe("middle");
    expect(neighbours.next).toBeUndefined();
  });

  it("returns nothing for a slug that is not in the list", () => {
    expect(findPostNeighbours(posts, "unknown")).toEqual({});
  });

  it("returns nothing for an empty list", () => {
    expect(findPostNeighbours([], "middle")).toEqual({});
  });

  it("orders posts that share a date by slug, so the input order never leaks in", () => {
    const sameDay = [
      { slug: "carol", publishedDate: "2026-09-06" },
      { slug: "alice", publishedDate: "2026-09-06" },
      { slug: "bob", publishedDate: "2026-09-06" },
    ];
    const neighbours = findPostNeighbours(sameDay, "bob");
    expect(neighbours.previous?.slug).toBe("alice");
    expect(neighbours.next?.slug).toBe("carol");
  });

  it("ignores any ordering the caller applied and never mutates the list", () => {
    const featuredFirst = [
      { slug: "middle", publishedDate: "2026-07-01" },
      { slug: "newest", publishedDate: "2026-09-08" },
      { slug: "oldest", publishedDate: "2026-06-10" },
    ];
    const neighbours = findPostNeighbours(featuredFirst, "newest");
    expect(neighbours.previous).toBeUndefined();
    expect(neighbours.next?.slug).toBe("middle");
    expect(featuredFirst.map((post) => post.slug)).toEqual(["middle", "newest", "oldest"]);
  });

  it("keeps the extra fields of the posts it hands back", () => {
    const withTitles = [
      { slug: "one", publishedDate: "2026-09-08", title: "One" },
      { slug: "two", publishedDate: "2026-09-07", title: "Two" },
    ];
    expect(findPostNeighbours(withTitles, "two").previous?.title).toBe("One");
  });
});
