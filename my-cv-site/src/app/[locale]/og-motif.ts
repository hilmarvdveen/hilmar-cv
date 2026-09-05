import { rampSvgMarkup } from "@/lib/rampGeometry";

export const OG_MOTIF_SIZE = { width: 900, height: 450 };

export const OG_MOTIF_OPACITY = 0.18;

export const OG_MOTIF_DATA_URI = `data:image/svg+xml;utf8,${encodeURIComponent(
  rampSvgMarkup({ lockup: "compact", weight: "fine", tone: "onNavy" })
)}`;
