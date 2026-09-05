import { describe, it, expect } from "vitest";
import OpengraphImage, { size, contentType, alt } from "./opengraph-image";

describe("opengraph-image route", () => {
  it("declares a 1200x630 PNG share card", () => {
    expect(size).toEqual({ width: 1200, height: 630 });
    expect(contentType).toBe("image/png");
    expect(alt).toContain("Hilmar van der Veen");
    expect(alt).not.toMatch(/—| - /);
  });

  it("renders a PNG response without params", async () => {
    const response = await OpengraphImage();
    expect(response).toBeInstanceOf(Response);
    expect(response.headers.get("content-type")).toContain("image/png");
  });

  it("renders a PNG response for each locale", async () => {
    for (const locale of ["nl", "en"]) {
      const response = await OpengraphImage({ params: Promise.resolve({ locale }) });
      expect(response.headers.get("content-type")).toContain("image/png");
    }
  });
});
