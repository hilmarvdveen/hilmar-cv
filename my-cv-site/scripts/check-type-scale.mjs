import fs from "node:fs";
import path from "node:path";

const root = path.resolve("src");
const allowed = new Set(["text-code-inline", "max-w-[68ch]"]);
const pattern = /\b(?:sm:|md:|lg:|xl:)?(?:text|leading|tracking)-\[[^\]]+\]/g;

const walk = (directory) =>
  fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) return walk(full);
    return /\.(tsx?|css)$/.test(entry.name) && !/\.test\.tsx?$/.test(entry.name) ? [full] : [];
  });

const findings = [];
for (const file of walk(root)) {
  const lines = fs.readFileSync(file, "utf8").split(/\r?\n/);
  lines.forEach((line, index) => {
    for (const match of line.matchAll(pattern)) {
      if (allowed.has(match[0])) continue;
      findings.push(`${path.relative(process.cwd(), file)}:${index + 1}: ${match[0]}`);
    }
  });
}

if (findings.length === 0) {
  console.log("every text size, leading and tracking is a scale step or a named token");
} else {
  console.log(`${findings.length} arbitrary type values outside the scale:`);
  for (const finding of findings) console.log("!! " + finding);
  process.exit(1);
}
