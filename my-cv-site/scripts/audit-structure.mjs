const baseUrl = process.argv[2] || "http://localhost:3000";
const routes = [
  "", "/about", "/services", "/services/frontend", "/projects", "/experience", "/faq", "/book",
  "/contact", "/blog", "/blog/react-folder-structure", "/search", "/privacy",
];

const decode = (value) =>
  value.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/\s+/g, " ").trim();

const inspect = async (locale, route) => {
  const url = `${baseUrl}/${locale}${route}`;
  const html = await (await fetch(url)).text();
  const body = html.replace(/<script[\s\S]*?<\/script>/gi, "");
  const headings = [...body.matchAll(/<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi)].map((match) => ({
    level: Number(match[1]),
    text: decode(match[2]).slice(0, 60),
  }));
  const problems = [];
  const h1Count = headings.filter((heading) => heading.level === 1).length;
  if (h1Count !== 1) problems.push(`${h1Count} h1 elements`);
  let previous = 0;
  for (const heading of headings) {
    if (heading.level > previous + 1 && previous !== 0) problems.push(`h${previous} to h${heading.level} skips a level at "${heading.text}"`);
    previous = heading.level;
  }
  const landmarks = {
    main: (body.match(/<main[\s>]/g) || []).length,
    nav: (body.match(/<nav[\s>]/g) || []).length,
    header: (body.match(/<header[\s>]/g) || []).length,
    footer: (body.match(/<footer[\s>]/g) || []).length,
  };
  if (landmarks.main !== 1) problems.push(`${landmarks.main} main landmarks`);
  const ids = [...body.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
  const duplicateIds = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
  if (duplicateIds.length) problems.push(`duplicate ids: ${duplicateIds.join(", ")}`);
  const imagesWithoutAlt = (body.match(/<img(?![^>]*\balt=)[^>]*>/g) || []).length;
  if (imagesWithoutAlt) problems.push(`${imagesWithoutAlt} img without alt`);
  const emptyLinks = [...body.matchAll(/<a\b[^>]*>([\s\S]*?)<\/a>/g)].filter(
    (match) => !decode(match[1]) && !/aria-label=|aria-labelledby=/.test(match[0])
  ).length;
  if (emptyLinks) problems.push(`${emptyLinks} links without an accessible name`);
  const buttonsWithoutName = [...body.matchAll(/<button\b[^>]*>([\s\S]*?)<\/button>/g)].filter(
    (match) => !decode(match[1]) && !/aria-label=|aria-labelledby=/.test(match[0])
  ).length;
  if (buttonsWithoutName) problems.push(`${buttonsWithoutName} buttons without an accessible name`);
  const lang = (html.match(/<html[^>]*lang="([^"]*)"/) || [])[1];
  if (lang !== locale) problems.push(`lang=${lang}`);
  return { url, headings, problems, landmarks };
};

let failures = 0;
for (const locale of ["nl", "en"]) {
  for (const route of routes) {
    const result = await inspect(locale, route);
    const marker = result.problems.length ? "!!" : "ok";
    if (result.problems.length) failures++;
    console.log(`${marker} ${result.url}  (h1 ${result.headings.filter((heading) => heading.level === 1).map((heading) => `"${heading.text}"`).join(" ")}, main ${result.landmarks.main}, nav ${result.landmarks.nav})`);
    for (const problem of result.problems) console.log(`        ${problem}`);
    if (process.argv.includes("--outline")) {
      for (const heading of result.headings) console.log(`        ${"  ".repeat(heading.level - 1)}h${heading.level} ${heading.text}`);
    }
  }
}
console.log(failures ? `\n${failures} page(s) need a look` : "\nevery page has one h1, one main and an orderly outline");
process.exit(failures ? 1 : 0);
