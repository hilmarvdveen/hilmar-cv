const base = process.argv[2] || "http://localhost:3123";
const productionOrigin = "https://www.hilmarvanderveen.com";

const sitemapText = await (await fetch(`${base}/sitemap.xml`)).text();
const paths = [...sitemapText.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1].replace(productionOrigin, ""));
const problems = [];
let checked = 0;

for (const path of paths) {
  const response = await fetch(`${base}${path}`);
  const html = await response.text();
  checked += 1;
  const policy = response.headers.get("content-security-policy") || "";
  const headerNonce = (policy.match(/'nonce-([^']+)'/) || [])[1];
  if (!headerNonce) {
    problems.push(`${path}: no nonce in the Content-Security-Policy header`);
    continue;
  }
  const scriptNonces = [...html.matchAll(/<script[^>]*\snonce="([^"]+)"/g)].map((match) => match[1]);
  if (scriptNonces.length === 0) {
    problems.push(`${path}: no script carries a nonce`);
    continue;
  }
  const foreign = scriptNonces.filter((nonce) => nonce !== headerNonce);
  if (foreign.length > 0) {
    problems.push(`${path}: ${foreign.length} of ${scriptNonces.length} scripts carry a nonce that differs from the header, the page was prerendered and its scripts are blocked`);
  }
  const cache = response.headers.get("x-vercel-cache");
  if (cache && cache !== "MISS" && cache !== "BYPASS") {
    problems.push(`${path}: served from the cache (${cache}), so its nonce cannot match a fresh header`);
  }
}

console.log(`checked ${checked} pages`);
if (problems.length === 0) console.log("every page is rendered per request and every script nonce matches the header nonce");
else for (const problem of problems) console.log("!! " + problem);
