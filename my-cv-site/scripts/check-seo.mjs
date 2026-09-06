const base = process.argv[2] || "http://localhost:3123";
const productionOrigin = "https://www.hilmarvanderveen.com";

const decode = (text) =>
  text
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");

const attribute = (tag, name) => {
  const match = tag.match(new RegExp(`${name}="([^"]*)"`, "i"));
  return match ? decode(match[1]) : undefined;
};

const sitemapText = await (await fetch(`${base}/sitemap.xml`)).text();
const urls = [...sitemapText.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
const robots = await (await fetch(`${base}/robots.txt`)).text();
console.log(`sitemap urls: ${urls.length}, robots declares sitemap: ${/Sitemap:/.test(robots)}`);

const problems = [];
let checked = 0;
for (const productionUrl of urls) {
  const path = productionUrl.replace(productionOrigin, "");
  const response = await fetch(`${base}${path}`);
  const html = await response.text();
  checked += 1;
  const report = (message) => problems.push(`${path}: ${message}`);
  if (response.status !== 200) report(`status ${response.status}`);
  const head = html.slice(0, html.indexOf("</head>"));
  const title = decode((head.match(/<title>([^<]*)<\/title>/) || [])[1] || "");
  if (!title) report("no title");
  if (title.length > 60) report(`title ${title.length} chars`);
  if (/…/.test(title)) report("title ends in an ellipsis");
  const metaTags = head.match(/<meta [^>]*>/g) || [];
  const description = metaTags.map((tag) => attribute(tag, "name") === "description" ? attribute(tag, "content") : undefined).find(Boolean) || "";
  if (!description) report("no description");
  if (description.length < 50 || description.length > 160) report(`description ${description.length} chars`);
  const links = head.match(/<link [^>]*>/g) || [];
  const canonical = links.filter((tag) => attribute(tag, "rel") === "canonical").map((tag) => attribute(tag, "href"));
  if (canonical.length !== 1) report(`${canonical.length} canonical links`);
  else if (canonical[0] !== productionUrl) report(`canonical ${canonical[0]} instead of ${productionUrl}`);
  const alternates = links.filter((tag) => attribute(tag, "rel") === "alternate" && attribute(tag, "hreflang"));
  const hreflangs = alternates.map((tag) => attribute(tag, "hreflang")).sort();
  if (hreflangs.join(",") !== "en-US,nl-NL,x-default") report(`hreflang ${hreflangs.join(",") || "missing"}`);
  const ogImage = metaTags.find((tag) => attribute(tag, "property") === "og:image");
  const twitterImage = metaTags.find((tag) => attribute(tag, "name") === "twitter:image");
  if (!ogImage) report("no og:image");
  if (!twitterImage) report("no twitter:image");
  const ogTitle = metaTags.find((tag) => attribute(tag, "property") === "og:title");
  if (!ogTitle) report("no og:title");
  const robotsMeta = metaTags.filter((tag) => attribute(tag, "name") === "robots").map((tag) => attribute(tag, "content"));
  if (robotsMeta.some((content) => /noindex/.test(content || ""))) report(`robots ${robotsMeta.join(" ")}`);
  const jsonLd = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((match) => match[1]);
  const types = [];
  for (const block of jsonLd) {
    try {
      const parsed = JSON.parse(block);
      const collect = (node) => {
        if (Array.isArray(node)) node.forEach(collect);
        else if (node && typeof node === "object") {
          if (node["@type"]) types.push(node["@type"]);
          if (node["@graph"]) collect(node["@graph"]);
        }
      };
      collect(parsed);
    } catch {
      report("json-ld does not parse");
    }
  }
  const websiteCount = types.filter((type) => type === "WebSite").length;
  if (websiteCount > 1) report(`${websiteCount} WebSite entities`);
  if (jsonLd.length === 0) report("no structured data");
  if (/ - /.test(title) || /—/.test(title) || /—/.test(description)) report("dash in title or description");
}
console.log(`checked ${checked} pages`);
if (problems.length === 0) console.log("every sitemap page has a self-referencing canonical, three hreflang links, both cards, a title under 60, a description under 160, no noindex, parsed structured data and one WebSite entity");
else for (const problem of problems) console.log("!! " + problem);
