import { readFile } from "node:fs/promises";

const baseUrl = process.argv[2] || "http://localhost:3000";
const unknownRoute = "/this-page-does-not-exist";

const readMessages = async (locale) =>
  JSON.parse(await readFile(new URL(`../src/i18n/messages/${locale}.json`, import.meta.url), "utf8"));
const messages = { en: await readMessages("en"), nl: await readMessages("nl") };

const routes = [
  "",
  "/about",
  "/services",
  "/services/frontend",
  "/services/consulting",
  "/services/design-systems",
  "/services/fullstack",
  "/projects",
  "/experience",
  "/faq",
  "/book",
  "/contact",
  "/blog",
  "/search",
  "/search?q=react",
  "/privacy",
  "/terms",
  "/cookies",
  "/disclaimer",
  unknownRoute,
];

const namespaces =
  "home|common|experiencePage|work|projects|contact|services|notFound|about|cvModal|faq|breadcrumb|booking|footer|blog";
const leakedKeyPattern = new RegExp(
  `(?<![\\w/.-])(?:${namespaces})\\.[a-zA-Z]+(?:\\.[a-zA-Z0-9\\[\\]]+)*(?![\\w/-])`,
  "g"
);
const dutchWords =
  /\b(een|het|van|voor|niet|met|wordt|jaar|opdracht|gesprek|bij|naar|zonder|ik|mijn|werk|klanten|uur|dagen|maanden|nieuwe|zijn|dat|dit|ook|als|wat|hoe|wij|onze|jouw|je|en|of|door|over)\b/gi;
const englishWords =
  /\b(the|and|with|for|your|you|our|that|this|from|into|are|not|what|how|when|which|will|can|about|have|has)\b/gi;

const visibleText = (html) =>
  html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ");

const foreignPassages = (text, pattern, threshold) => {
  const words = text.split(" ");
  const passages = [];
  for (let start = 0; start < words.length; start += 10) {
    const passage = words.slice(start, start + 12).join(" ");
    const hits = (passage.match(pattern) || []).length;
    if (hits >= threshold) passages.push(passage);
  }
  return passages;
};

const fetchWithRetry = async (url, attempts = 30) => {
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      return await fetch(url, { redirect: "manual" });
    } catch (error) {
      if (attempt === attempts) throw error;
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
  throw new Error("unreachable");
};

const inspectUnknownRoute = (locale, response, html) => {
  const problems = [];
  if (response.status !== 404) problems.push(`status ${response.status}`);
  const title = messages[locale].notFound.title;
  if (!html.includes(title)) problems.push(`404 page does not carry "${title}"`);
  return problems;
};

const inspectPage = (locale, response, html, text) => {
  const lang = (html.match(/<html[^>]*lang="([^"]*)"/) || [])[1];
  const leakedKeys = [...new Set(text.match(leakedKeyPattern) || [])];
  const foreign =
    locale === "en"
      ? foreignPassages(text, dutchWords, 3)
      : foreignPassages(text, englishWords, 3);
  const problems = [];
  if (response.status !== 200) problems.push(`status ${response.status}`);
  if (lang !== locale) problems.push(`lang=${lang}`);
  for (const key of leakedKeys) problems.push(`leaked key ${key}`);
  for (const passage of foreign) problems.push(`foreign: ${passage}`);
  return problems;
};

const inspect = async (locale, route) => {
  const url = `${baseUrl}/${locale}${route}`;
  const response = await fetchWithRetry(url);
  const html = await response.text();
  const text = visibleText(html);
  const problems =
    route === unknownRoute
      ? inspectUnknownRoute(locale, response, html)
      : inspectPage(locale, response, html, text);
  return { url, problems, words: text.split(" ").length };
};

let failures = 0;
for (const locale of ["en", "nl"]) {
  for (const route of routes) {
    const result = await inspect(locale, route);
    const marker = result.problems.length ? "!!" : "ok";
    if (result.problems.length) failures++;
    console.log(`${marker} ${result.words.toString().padStart(5)} words  ${result.url}`);
    for (const problem of result.problems) console.log(`        ${problem}`);
  }
}
console.log(failures ? `\n${failures} page(s) need a look` : "\nevery page renders in its own language");
process.exit(failures ? 1 : 0);
