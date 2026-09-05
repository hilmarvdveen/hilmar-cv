const FONT_STYLESHEET_URL = "https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap";
const LEGACY_USER_AGENT = "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:20.0) Gecko/20100101 Firefox/20.0";
const FETCH_TIMEOUT_MS = 3000;
const FONT_FACE_PATTERN = /font-weight:\s*(400|700);[^}]*?src:\s*url\(([^)]+)\)/g;

export type SocialCardFontWeight = 400 | 700;

export type SocialCardFont = {
  name: "Inter";
  data: ArrayBuffer;
  weight: SocialCardFontWeight;
  style: "normal";
};

export type FontFace = {
  weight: SocialCardFontWeight;
  url: string;
};

type FetchImplementation = typeof fetch;

let cachedFonts: Promise<SocialCardFont[]> | undefined;

export function parseFontFaces(stylesheet: string): FontFace[] {
  return [...stylesheet.matchAll(FONT_FACE_PATTERN)].map((match) => ({
    weight: Number(match[1]) as SocialCardFontWeight,
    url: match[2].replace(/["']/g, ""),
  }));
}

async function fetchFonts(fetchImplementation: FetchImplementation): Promise<SocialCardFont[]> {
  const stylesheetResponse = await fetchImplementation(FONT_STYLESHEET_URL, {
    headers: { "User-Agent": LEGACY_USER_AGENT },
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
  const faces = parseFontFaces(await stylesheetResponse.text());
  if (faces.length === 0) {
    throw new Error("The font stylesheet lists no usable faces");
  }
  return Promise.all(
    faces.map(async (face) => {
      const fontResponse = await fetchImplementation(face.url, { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) });
      return { name: "Inter" as const, data: await fontResponse.arrayBuffer(), weight: face.weight, style: "normal" as const };
    })
  );
}

export function loadSocialCardFonts(fetchImplementation: FetchImplementation = fetch): Promise<SocialCardFont[]> {
  cachedFonts ??= fetchFonts(fetchImplementation).catch(() => {
    cachedFonts = undefined;
    return [];
  });
  return cachedFonts;
}

export function __resetSocialCardFontCache() {
  cachedFonts = undefined;
}
