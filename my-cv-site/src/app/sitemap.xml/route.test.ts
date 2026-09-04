import { describe, expect, it } from "vitest";
import { GET } from "./route";

describe("GET /sitemap.xml", () => {
  it("includes the four legal pages in both locales", async () => {
    const response = await GET();
    const xml = await response.text();
    for (const slug of ["privacy", "terms", "cookies", "disclaimer"]) {
      expect(xml).toContain(`<loc>https://www.hilmarvanderveen.com/nl/${slug}</loc>`);
      expect(xml).toContain(`<loc>https://www.hilmarvanderveen.com/en/${slug}</loc>`);
    }
  });

  it("returns valid XML with the experience page and every blog post", async () => {
    const response = await GET();
    const xml = await response.text();
    expect(xml).toContain("<urlset");
    expect(xml).toContain("<loc>https://www.hilmarvanderveen.com/nl/experience</loc>");
    expect(xml).toContain("<loc>https://www.hilmarvanderveen.com/nl/blog</loc>");
  });
});
