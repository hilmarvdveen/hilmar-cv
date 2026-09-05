import { ImageResponse } from "next/og";
import { OG_LOGO_DATA_URI } from "./og-logo";

export const SOCIAL_CARD_SIZE = { width: 1200, height: 630 };

export type SocialCardLocale = "en" | "nl";

const CARD_COPY: Record<SocialCardLocale, { role: string; reach: string }> = {
  en: {
    role: "Senior frontend engineer",
    reach: "React · Angular · TypeScript · Randstad and remote",
  },
  nl: {
    role: "Senior frontend engineer",
    reach: "React · Angular · TypeScript · Randstad en remote",
  },
};

const headingSize = (heading: string) => {
  if (heading.length > 64) return 44;
  if (heading.length > 40) return 52;
  return 64;
};

export function renderSocialCard(locale: SocialCardLocale, title?: string, headers?: Record<string, string>) {
  const copy = CARD_COPY[locale];
  const [titleHeading, titleDetail] = (title ?? "").split(" | ").map((part) => part.trim());
  const heading = titleHeading && titleHeading.length > 0 ? titleHeading : copy.role;
  const subline = titleHeading && titleHeading.length > 0 ? titleDetail || copy.role : copy.reach;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#12314e",
          color: "#ffffff",
          fontFamily: "sans-serif",
          padding: 72,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={OG_LOGO_DATA_URI} width={96} height={66} alt="" />
          <div style={{ fontSize: 34, fontWeight: 700 }}>Hilmar van der Veen</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: headingSize(heading), fontWeight: 700, lineHeight: 1.15, maxWidth: 1000 }}>
            {heading}
          </div>
          <div style={{ fontSize: 30, color: "#6ee7b7" }}>{subline}</div>
        </div>
        <div style={{ fontSize: 26, color: "#cbd5e1" }}>{copy.reach}</div>
      </div>
    ),
    { ...SOCIAL_CARD_SIZE, headers }
  );
}
