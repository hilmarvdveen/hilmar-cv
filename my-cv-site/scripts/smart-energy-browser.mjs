import { createRequire } from "node:module";
import { dirname, relative, resolve as resolvePath, sep } from "node:path";
import { fileURLToPath } from "node:url";

const playwrightRoot = process.env.PLAYWRIGHT_ROOT ?? "C:/Src/smart-energy-poc/dashboard";
const siteDirectory = resolvePath(dirname(fileURLToPath(import.meta.url)), "..");
const requireFromDashboard = createRequire(`${playwrightRoot}/package.json`);

export const refusePublicFolder = (target) => {
  const absolute = resolvePath(target);
  const normalised = absolute.split(sep).join("/");
  const lowered = normalised.toLowerCase();
  if (lowered.includes("/public/") || lowered.endsWith("/public")) {
    throw new Error(`Refusing to write under a public folder: ${normalised}`);
  }
  const fromSite = relative(siteDirectory, absolute);
  if (!fromSite.startsWith("..") && !fromSite.startsWith(sep) && !/^[a-zA-Z]:/.test(fromSite)) {
    throw new Error(`Refusing to write inside the site folder: ${normalised}`);
  }
  return normalised;
};

export async function launchBrowser() {
  const { chromium } = requireFromDashboard("@playwright/test");
  return chromium.launch();
}

export async function openPage(browser, { width, height, deviceScaleFactor = 1 }) {
  const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor, reducedMotion: "reduce" });
  return context.newPage();
}

const ATTEMPTS = 3;

async function captureOnce(page, url, target) {
  const response = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
  if (!response || !response.ok()) {
    throw new Error(`Capture page answered ${response ? response.status() : "nothing"} for ${url}`);
  }
  await page.evaluate(() => document.fonts.ready);
  return page.screenshot({ path: refusePublicFolder(target), animations: "disabled" });
}

export async function captureUrl(page, url, target) {
  for (let attempt = 1; ; attempt += 1) {
    try {
      return await captureOnce(page, url, target);
    } catch (error) {
      if (attempt >= ATTEMPTS) throw error;
      console.error(`attempt ${attempt} for ${url} failed, retrying`);
    }
  }
}
