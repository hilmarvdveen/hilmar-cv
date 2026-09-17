import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve as resolvePath } from "node:path";
import { fileURLToPath } from "node:url";
import { registerTypescriptModuleHooks } from "./typescript-module-hooks.mjs";

registerTypescriptModuleHooks();

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const siteDirectory = resolvePath(scriptDirectory, "..");
const defaultTarget = resolvePath(siteDirectory, "seed", "record.json");
const target = process.argv[2] ? resolvePath(process.argv[2]) : defaultTarget;

const { workHistory } = await import("@/data/workHistory");
const { BLOG_POSTS } = await import("@/features/blog/registry");
const { buildSeedRecord } = await import("@/lib/fit/seed");
const englishMessages = (await import("@/i18n/messages/en.json", { with: { type: "json" } })).default;
const dutchMessages = (await import("@/i18n/messages/nl.json", { with: { type: "json" } })).default;

const generatedAt = process.env.SEED_GENERATED_AT ?? new Date().toISOString().slice(0, 10);

const record = buildSeedRecord({
  generatedAt,
  engagements: workHistory,
  posts: BLOG_POSTS.map((post) => ({
    slug: post.slug,
    category: post.category,
    track: post.track,
    publishedDate: post.publishedDate,
    updatedDate: post.updatedDate,
    title: post.title,
    description: post.description,
    keywords: post.keywords,
  })),
  messages: { en: englishMessages, nl: dutchMessages },
});

mkdirSync(dirname(target), { recursive: true });
writeFileSync(target, `${JSON.stringify(record, null, 2)}\n`, "utf8");

console.log(`wrote ${target}`);
const storyCount = (locale) =>
  record.engagements.reduce((total, engagement) => total + engagement.stories[locale].length, 0);

console.log(
  `engagements ${record.engagements.length}, technologies ${
    new Set(record.engagements.flatMap((engagement) => engagement.technologies)).size
  }, posts ${record.posts.length}, faq ${record.faq.length}, stories ${storyCount(
    "en"
  )} english and ${storyCount("nl")} dutch`
);
