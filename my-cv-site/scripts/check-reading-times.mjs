import fs from "node:fs";
import path from "node:path";

const postsDirectory = path.resolve("src/features/blog/components");
const proseWordsPerMinute = 220;
const codeWordsPerMinute = 200;
const toleranceMinutes = 1;

const countWords = (text) => text.split(/\s+/).filter(Boolean).length;

const estimateMinutes = (source) => {
  const proseLines = source.match(/^\s+en: "(.*)",?\r?$/gm) ?? [];
  const codeBlocks = source.match(/`[\s\S]*?`/g) ?? [];
  const proseWords = countWords(proseLines.join(" "));
  const codeWords = countWords(codeBlocks.join("\n"));
  return {
    proseWords,
    codeWords,
    minutes: Math.round(proseWords / proseWordsPerMinute + codeWords / codeWordsPerMinute),
  };
};

const findings = [];
for (const file of fs.readdirSync(postsDirectory).filter((name) => name.endsWith("Post.tsx"))) {
  const source = fs.readFileSync(path.join(postsDirectory, file), "utf8");
  const declared = Number((source.match(/readingTimeMin:\s*(\d+)/) ?? [])[1]);
  const slug = (source.match(/slug:\s*"([^"]+)"/) ?? [])[1] ?? file;
  const { minutes, proseWords, codeWords } = estimateMinutes(source);
  const drift = Math.abs(declared - minutes);
  const line = `${String(declared).padStart(3)} declared, ${String(minutes).padStart(3)} measured (${proseWords} prose, ${codeWords} code words)  ${slug}`;
  if (drift > toleranceMinutes) findings.push(line);
  else console.log(`ok  ${line}`);
}

if (findings.length > 0) {
  console.error(`\nreading time drifts by more than ${toleranceMinutes} minute on ${findings.length} post(s):`);
  for (const finding of findings) console.error(`!!  ${finding}`);
  process.exit(1);
}
console.log("every post declares a reading time within a minute of its measured length");
