import type { BlogPost } from "./types";
import { meta as folderStructureMeta, Body as FolderStructureBody } from "./components/FolderStructurePost";
import { meta as architectureMeta, Body as ArchitectureBody } from "./components/ArchitecturePost";
import { meta as unitTestingMeta, Body as UnitTestingBody } from "./components/UnitTestingPost";
import { meta as seoMeta, Body as SeoBody } from "./components/SeoPost";
import { meta as routingMeta, Body as RoutingBody } from "./components/RoutingPost";
import { meta as hexagonalCSharpMeta, Body as HexagonalCSharpBody } from "./components/HexagonalCSharpPost";
import { meta as hexagonalKotlinMeta, Body as HexagonalKotlinBody } from "./components/HexagonalKotlinPost";
import { meta as hexagonalJavaMeta, Body as HexagonalJavaBody } from "./components/HexagonalJavaPost";

const POSTS: BlogPost[] = [
  { ...folderStructureMeta, Body: FolderStructureBody },
  { ...architectureMeta, Body: ArchitectureBody },
  { ...unitTestingMeta, Body: UnitTestingBody },
  { ...seoMeta, Body: SeoBody },
  { ...routingMeta, Body: RoutingBody },
  { ...hexagonalCSharpMeta, Body: HexagonalCSharpBody },
  { ...hexagonalKotlinMeta, Body: HexagonalKotlinBody },
  { ...hexagonalJavaMeta, Body: HexagonalJavaBody },
];

export const BLOG_POSTS: BlogPost[] = [...POSTS].sort((first, second) =>
  second.publishedDate.localeCompare(first.publishedDate)
);

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug);
}
