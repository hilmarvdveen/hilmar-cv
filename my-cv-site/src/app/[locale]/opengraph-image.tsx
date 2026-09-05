import { ImageResponse } from "next/og";
import { OG_LOGO_DATA_URI } from "./og-logo";

export const alt = "Hilmar van der Veen, senior frontend engineer, Randstad and remote";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type OpengraphImageProps = {
  params?: Promise<{ locale: string }>;
};

const CARD_COPY = {
  en: {
    role: "Senior frontend engineer",
    reach: "React · Angular · TypeScript · Randstad and remote",
  },
  nl: {
    role: "Senior frontend engineer",
    reach: "React · Angular · TypeScript · Randstad en remote",
  },
};

export default async function OpengraphImage({ params }: OpengraphImageProps = {}) {
  const resolvedParams = params ? await params : undefined;
  const locale = resolvedParams?.locale === "en" ? "en" : "nl";
  const copy = CARD_COPY[locale];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#12314e",
          color: "#ffffff",
          fontFamily: "sans-serif",
          padding: 80,
          textAlign: "center",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={OG_LOGO_DATA_URI} width={200} height={137} alt="" />
        <div style={{ fontSize: 68, fontWeight: 700, marginTop: 36 }}>Hilmar van der Veen</div>
        <div style={{ fontSize: 40, color: "#6ee7b7", marginTop: 8 }}>{copy.role}</div>
        <div style={{ fontSize: 28, color: "#cbd5e1", marginTop: 28 }}>{copy.reach}</div>
      </div>
    ),
    { ...size }
  );
}
