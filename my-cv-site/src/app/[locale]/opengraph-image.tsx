import { ImageResponse } from "next/og";
import { OG_LOGO_DATA_URI } from "./og-logo";

// Branded social share card (Open Graph / WhatsApp / LinkedIn / X).
export const alt = "Hilmar van der Veen — Senior Frontend Developer, Amsterdam";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  // The logo is embedded as a base64 data URI (see ./og-logo) so this route
  // needs no filesystem or fetch access — both are unreliable on Vercel's
  // serverless runtime and can't be exercised in unit tests.
  const logoSrc = OG_LOGO_DATA_URI;

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
          background: "linear-gradient(135deg, #0b1f17 0%, #064e3b 55%, #059669 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
          padding: 80,
          textAlign: "center",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} width={200} height={137} alt="" />
        <div style={{ fontSize: 68, fontWeight: 700, marginTop: 36 }}>
          Hilmar van der Veen
        </div>
        <div style={{ fontSize: 40, color: "#a7f3d0", marginTop: 8 }}>
          Senior Frontend Developer
        </div>
        <div style={{ fontSize: 28, color: "#d1fae5", marginTop: 28 }}>
          React · Angular · Next.js · TypeScript — Amsterdam
        </div>
      </div>
    ),
    { ...size }
  );
}
