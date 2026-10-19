import { lastFrameMillisecondsOfScene, sceneStartMilliseconds } from "./timeline";

export type CarouselPageId =
  | "title"
  | "drawing"
  | "telemetry"
  | "command"
  | "stores"
  | "consistency"
  | "assetKind"
  | "caching"
  | "diagrams"
  | "assistantPort"
  | "scale"
  | "security"
  | "closing";

export type CarouselPage = { id: CarouselPageId; frameMilliseconds: number };

export const CAROUSEL_PAGES: readonly CarouselPage[] = [
  { id: "title", frameMilliseconds: lastFrameMillisecondsOfScene("title") },
  { id: "drawing", frameMilliseconds: lastFrameMillisecondsOfScene("layers") },
  { id: "telemetry", frameMilliseconds: sceneStartMilliseconds("telemetry") + 2750 },
  { id: "command", frameMilliseconds: sceneStartMilliseconds("command") + 7500 },
  { id: "stores", frameMilliseconds: sceneStartMilliseconds("stores") + 1500 },
  { id: "consistency", frameMilliseconds: lastFrameMillisecondsOfScene("consistency") },
  { id: "assetKind", frameMilliseconds: lastFrameMillisecondsOfScene("assetKind") },
  { id: "caching", frameMilliseconds: lastFrameMillisecondsOfScene("telemetry") },
  { id: "diagrams", frameMilliseconds: sceneStartMilliseconds("ports") + 3000 },
  { id: "assistantPort", frameMilliseconds: lastFrameMillisecondsOfScene("ports") },
  { id: "scale", frameMilliseconds: lastFrameMillisecondsOfScene("scale") },
  { id: "security", frameMilliseconds: lastFrameMillisecondsOfScene("security") },
  { id: "closing", frameMilliseconds: lastFrameMillisecondsOfScene("closing") },
];
