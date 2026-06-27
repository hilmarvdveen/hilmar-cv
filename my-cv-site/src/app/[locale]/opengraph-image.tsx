import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Branded social share card (Open Graph / WhatsApp / LinkedIn / X).
export const alt = "Hilmar van der Veen — Senior Frontend Developer, Amsterdam";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const logo = await readFile(join(process.cwd(), "public/images/logo_v1.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

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
