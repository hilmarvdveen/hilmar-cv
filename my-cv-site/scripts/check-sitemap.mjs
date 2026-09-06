const base = process.argv[2] || "http://localhost:3123";
const productionOrigin = "https://www.hilmarvanderveen.com";
const locales = ["nl", "en"];
const excludedPaths = new Set(["/search"]);

const sitemapText = await (await fetch(`${base}/sitemap.xml`)).text();
const sitemapUrls = [...sitemapText.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
const sitemapSet = new Set(sitemapUrls);
const problems = [];

for (const url of sitemapUrls) {
  if (!url.startsWith(`${productionOrigin}/`)) problems.push(`not on the production origin: ${url}`);
  if (url !== url.trim() || /\s/.test(url)) problems.push(`whitespace in ${url}`);
  if (url.endsWith("/")) problems.push(`trailing slash: ${url}`);
  if (url !== url.toLowerCase()) problems.push(`upper case characters: ${url}`);
  if (/[^A-Za-z0-9\-._~:/]/.test(url)) problems.push(`unusual characters: ${url}`);
  const path = url.replace(productionOrigin, "");
  if (!locales.some((locale) => path === `/${locale}` || path.startsWith(`/${locale}/`))) problems.push(`no locale prefix: ${url}`);
}
const duplicates = sitemapUrls.filter((url, index) => sitemapUrls.indexOf(url) !== index);
for (const url of duplicates) problems.push(`listed twice: ${url}`);

const seen = new Set();
const queue = locales.map((locale) => `/${locale}`);
const internalLinks = new Set();
while (queue.length > 0) {
  const path = queue.shift();
  if (seen.has(path)) continue;
  seen.add(path);
  const response = await fetch(`${base}${path}`);
  if (response.status !== 200) {
    problems.push(`${path} answers ${response.status}`);
    continue;
  }
  const html = await response.text();
  for (const match of html.matchAll(/href="([^"]+)"/g)) {
    const raw = match[1].replace(/&amp;/g, "&");
    if (!raw.startsWith("/") || raw.startsWith("//")) continue;
    const clean = raw.split("#")[0].split("?")[0];
    if (!clean || clean.startsWith("/_next") || clean.startsWith("/api") || /\.[a-z0-9]+$/i.test(clean)) continue;
    if (!locales.some((locale) => clean === `/${locale}` || clean.startsWith(`/${locale}/`))) continue;
    internalLinks.add(clean);
    if (!seen.has(clean)) queue.push(clean);
  }
}

const missingFromSitemap = [...internalLinks]
  .filter((path) => !excludedPaths.has(path.replace(/^\/(nl|en)/, "")))
  .filter((path) => !sitemapSet.has(`${productionOrigin}${path}`))
  .sort();
for (const path of missingFromSitemap) problems.push(`linked on the site but not in the sitemap: ${path}`);

const notLinked = sitemapUrls
  .map((url) => url.replace(productionOrigin, ""))
  .filter((path) => !internalLinks.has(path))
  .sort();
for (const path of notLinked) problems.push(`in the sitemap but no page links to it: ${path}`);

console.log(`sitemap: ${sitemapUrls.length} urls, crawled ${seen.size} internal pages, ${internalLinks.size} distinct internal links`);
const perLocale = locales.map((locale) => `${locale} ${sitemapUrls.filter((url) => url.startsWith(`${productionOrigin}/${locale}`)).length}`).join(", ");
console.log(`per locale: ${perLocale}`);
const blogUrls = sitemapUrls.filter((url) => url.includes("/blog/"));
console.log(`blog posts in the sitemap: ${blogUrls.length} (${blogUrls.filter((url) => url.includes("/nl/")).length} nl, ${blogUrls.filter((url) => url.includes("/en/")).length} en)`);
const experienceUrls = sitemapUrls.filter((url) => url.includes("/experience/"));
console.log(`engagement pages in the sitemap: ${experienceUrls.length}`);
if (problems.length === 0) console.log("every internal link the site renders is in the sitemap, every sitemap url is linked, and every url is lower case, prefixed, on the production origin and without a trailing slash");
else for (const problem of problems) console.log("!! " + problem);
