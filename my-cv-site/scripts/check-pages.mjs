import fs from "node:fs";
import path from "node:path";

const appRoot = path.resolve("src/app");
const pageMap = path.resolve("docs/PAGES.md");
const routeFile = /^(page|route)\.tsx?$/;

const walk = (directory) =>
  fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) return walk(full);
    return routeFile.test(entry.name) ? [full] : [];
  });

const toRoute = (file) => {
  const segments = path
    .relative(appRoot, path.dirname(file))
    .split(path.sep)
    .filter((segment) => segment !== "" && segment !== "[locale]" && !/^\(.+\)$/.test(segment));
  return "/" + segments.join("/");
};

const codeRoutes = new Set(walk(appRoot).map(toRoute));
const documentedRoutes = new Set(
  [...fs.readFileSync(pageMap, "utf8").matchAll(/^\| `(\/[^`]*)` \|/gm)].map((match) => match[1])
);

const missing = [...codeRoutes].filter((route) => !documentedRoutes.has(route)).sort();
const stale = [...documentedRoutes].filter((route) => !codeRoutes.has(route)).sort();

if (missing.length === 0 && stale.length === 0) {
  console.log(`every one of the ${codeRoutes.size} routes has a row in docs/PAGES.md`);
} else {
  for (const route of missing) console.log(`!! ${route}: no row in docs/PAGES.md`);
  for (const route of stale) console.log(`!! ${route}: row in docs/PAGES.md, but no route in src/app`);
  process.exitCode = 1;
}
