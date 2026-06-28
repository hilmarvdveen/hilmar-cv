import type { BlogPost } from "./types";
import { meta as folderStructureMeta, Body as FolderStructureBody } from "./components/FolderStructurePost";
import { meta as architectureMeta, Body as ArchitectureBody } from "./components/ArchitecturePost";
import { meta as unitTestingMeta, Body as UnitTestingBody } from "./components/UnitTestingPost";
import { meta as seoMeta, Body as SeoBody } from "./components/SeoPost";
import { meta as routingMeta, Body as RoutingBody } from "./components/RoutingPost";

/**
 * Central registry of all blog posts. Each post file co-locates its `meta` with
 * its `Body`; here we assemble them into the renderable `BlogPost` shape and
 * sort newest-first. Add a post by importing it and appending to `POSTS`.
 */
const POSTS: BlogPost[] = [
  { ...folderStructureMeta, Body: FolderStructureBody },
  { ...architectureMeta, Body: ArchitectureBody },
  { ...unitTestingMeta, Body: UnitTestingBody },
  { ...seoMeta, Body: SeoBody },
  { ...routingMeta, Body: RoutingBody },
];

export const BLOG_POSTS: BlogPost[] = [...POSTS].sort((a, b) =>
  b.publishedDate.localeCompare(a.publishedDate)
);

/** Look up a single post by its URL slug. */
export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug);
}

/** All slugs, for `generateStaticParams` and the sitemap. */
export function getAllSlugs(): string[] {
  return BLOG_POSTS.map((post) => post.slug);
}
