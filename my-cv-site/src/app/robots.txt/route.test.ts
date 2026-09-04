import { describe, expect, it } from "vitest";
import { GET } from "./route";

describe("GET /robots.txt", () => {
  it("declares exactly one sitemap location, the real route", async () => {
    const response = GET();
    const text = await response.text();
    const sitemapLines = text.split("\n").filter((line) => line.startsWith("Sitemap:"));
    expect(sitemapLines).toHaveLength(1);
    expect(sitemapLines[0]).toContain("/sitemap.xml");
  });

  it("allows crawling and blocks the API", async () => {
    const response = GET();
    const text = await response.text();
    expect(text).toContain("User-agent: *");
    expect(text).toContain("Disallow: /api/");
  });
});
