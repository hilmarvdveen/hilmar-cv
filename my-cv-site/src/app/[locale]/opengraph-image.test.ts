import { describe, it, expect } from "vitest";
import OpengraphImage, { size, contentType, alt } from "./opengraph-image";

describe("opengraph-image route", () => {
  it("declares a 1200x630 PNG share card", () => {
    expect(size).toEqual({ width: 1200, height: 630 });
    expect(contentType).toBe("image/png");
    expect(alt).toContain("Hilmar van der Veen");
  });

  it("renders without throwing by reading the co-located logo (Vercel FS-safe)", async () => {
    // Executes `readFile(new URL("./og-logo.png", import.meta.url))`. If the asset
    // path regressed to `process.cwd()/public/...` (which doesn't exist in
    // Vercel's serverless FS) or the co-located logo were removed, this throws.
    const res = await OpengraphImage();
    expect(res).toBeInstanceOf(Response);
    expect(res.headers.get("content-type")).toContain("image/png");
  });
});
