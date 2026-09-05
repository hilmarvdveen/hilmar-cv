import { describe, it, expect, vi, beforeEach } from "vitest";
import { loadSocialCardFonts, parseFontFaces, __resetSocialCardFontCache } from "./socialCardFont";

const STYLESHEET = `
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  src: url(https://fonts.gstatic.com/s/inter/v20/regular.ttf) format('truetype');
}
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 700;
  src: url("https://fonts.gstatic.com/s/inter/v20/bold.ttf") format('truetype');
}
`;

const textResponse = (body: string) => ({ text: async () => body }) as unknown as Response;
const binaryResponse = (byteLength: number) => ({ arrayBuffer: async () => new ArrayBuffer(byteLength) }) as unknown as Response;

const fetchStub = (stylesheet: string) =>
  vi.fn(async (url: string | URL | Request) => {
    const address = String(url);
    if (address.startsWith("https://fonts.googleapis.com/")) return textResponse(stylesheet);
    return binaryResponse(address.includes("bold") ? 700 : 400);
  }) as unknown as typeof fetch;

describe("parseFontFaces", () => {
  it("reads the weight and the url of every face in the stylesheet", () => {
    expect(parseFontFaces(STYLESHEET)).toEqual([
      { weight: 400, url: "https://fonts.gstatic.com/s/inter/v20/regular.ttf" },
      { weight: 700, url: "https://fonts.gstatic.com/s/inter/v20/bold.ttf" },
    ]);
  });

  it("returns nothing for a stylesheet without faces", () => {
    expect(parseFontFaces("body { color: red; }")).toEqual([]);
  });
});

describe("loadSocialCardFonts", () => {
  beforeEach(() => {
    __resetSocialCardFontCache();
  });

  it("downloads both weights once and serves them from the cache afterwards", async () => {
    const fetchImplementation = fetchStub(STYLESHEET);
    const fonts = await loadSocialCardFonts(fetchImplementation);
    expect(fonts.map((font) => [font.name, font.weight, font.style, font.data.byteLength])).toEqual([
      ["Inter", 400, "normal", 400],
      ["Inter", 700, "normal", 700],
    ]);
    await loadSocialCardFonts(fetchImplementation);
    expect(fetchImplementation).toHaveBeenCalledTimes(3);
  });

  it("returns no fonts when the stylesheet cannot be fetched and retries on the next call", async () => {
    const failing = vi.fn(async () => {
      throw new Error("offline");
    }) as unknown as typeof fetch;
    expect(await loadSocialCardFonts(failing)).toEqual([]);
    const working = fetchStub(STYLESHEET);
    expect(await loadSocialCardFonts(working)).toHaveLength(2);
  });

  it("returns no fonts when the stylesheet lists no faces", async () => {
    expect(await loadSocialCardFonts(fetchStub("body { color: red; }"))).toEqual([]);
  });
});
