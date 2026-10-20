import { spawnSync } from "node:child_process";
import { mkdirSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { registerTypescriptModuleHooks } from "./typescript-module-hooks.mjs";
import { captureUrl, launchBrowser, openPage, refusePublicFolder } from "./smart-energy-browser.mjs";

registerTypescriptModuleHooks();

const [baseUrl, framesArgument, outputArgument] = process.argv.slice(2);
if (!baseUrl || !framesArgument || !outputArgument) {
  console.error("usage: node scripts/capture-smart-energy-video.mjs <baseUrl with locale> <framesFolder> <outputFolder>");
  process.exit(2);
}

const { filmFrameCount, FILM_FRAMES_PER_SECOND } = await import("@/lib/smartEnergyFilm/film");

const framesFolder = refusePublicFolder(framesArgument);
const outputFolder = refusePublicFolder(outputArgument);
mkdirSync(framesFolder, { recursive: true });
mkdirSync(outputFolder, { recursive: true });

const locale = new URL(baseUrl).pathname.split("/").filter(Boolean).at(-1);
if (locale !== "en" && locale !== "nl") {
  console.error("the base url has to end in /en or /nl");
  process.exit(2);
}
const width = 1080;
const height = 1350;
const frameName = (index) => `frame-${String(index).padStart(5, "0")}.png`;
const frameUrl = (index) => `${baseUrl}/smart-energy-capture?frame=${index}`;

const browser = await launchBrowser();
const page = await openPage(browser, { width, height });
const startedAt = Date.now();
let firstFrame = null;
for (let index = 0; index < filmFrameCount; index += 1) {
  const image = await captureUrl(page, frameUrl(index), join(framesFolder, frameName(index)));
  if (index === 0) firstFrame = image;
  if (index % 150 === 0) console.log(`frame ${index} of ${filmFrameCount}, ${Math.round((Date.now() - startedAt) / 1000)} s`);
}
const firstAgain = await captureUrl(page, frameUrl(0), join(framesFolder, "check-frame-00000.png"));
await browser.close();

if (!firstFrame || !firstAgain.equals(firstFrame)) {
  console.error("frame 0 rendered differently the second time, the capture is not deterministic");
  process.exit(1);
}

const written = readdirSync(framesFolder).filter((name) => /^frame-\d{5}\.png$/.test(name)).length;
if (written !== filmFrameCount) {
  console.error(`expected ${filmFrameCount} frames, found ${written}`);
  process.exit(1);
}

const video = join(outputFolder, `smart-energy-${locale}-${width}x${height}.mp4`);
const encode = spawnSync(
  "ffmpeg",
  [
    "-y",
    "-framerate",
    String(FILM_FRAMES_PER_SECOND),
    "-i",
    join(framesFolder, "frame-%05d.png"),
    "-c:v",
    "libx264",
    "-preset",
    "slow",
    "-crf",
    "18",
    "-pix_fmt",
    "yuv420p",
    "-r",
    String(FILM_FRAMES_PER_SECOND),
    "-movflags",
    "+faststart",
    video,
  ],
  { stdio: "inherit" }
);
if (encode.status !== 0) process.exit(encode.status ?? 1);

const thumbnail = spawnSync("ffmpeg", ["-y", "-ss", "61", "-i", video, "-frames:v", "1", "-update", "1", join(outputFolder, `smart-energy-${locale}-thumbnail.jpg`)], {
  stdio: "inherit",
});
if (thumbnail.status !== 0) process.exit(thumbnail.status ?? 1);

console.log(`${video} written from ${written} frames in ${Math.round((Date.now() - startedAt) / 1000)} s`);
