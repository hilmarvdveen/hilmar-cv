import { describe, it, expect, vi } from "vitest";
import { NextRequest } from "next/server";
import { GET } from "./route";

vi.mock("@/lib/seo/socialCardFont", () => ({ loadSocialCardFonts: async () => [] }));

describe("GET /api/og", () => {
  it("renders a cacheable PNG card for a page title", async () => {
    const response = await GET(new NextRequest("http://localhost/api/og?locale=en&title=Work+history"));
    expect(response.headers.get("content-type")).toContain("image/png");
    expect(response.headers.get("cache-control")).toContain("max-age=86400");
  });

  it("falls back to Dutch and to the positioning line without a title", async () => {
    const response = await GET(new NextRequest("http://localhost/api/og?locale=de"));
    expect(response.headers.get("content-type")).toContain("image/png");
  });
});
