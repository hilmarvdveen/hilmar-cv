import type { BlogPost } from "./types";
import { meta as folderStructureMeta, Body as FolderStructureBody } from "./components/FolderStructurePost";
import { meta as architectureMeta, Body as ArchitectureBody } from "./components/ArchitecturePost";
import { meta as unitTestingMeta, Body as UnitTestingBody } from "./components/UnitTestingPost";
import { meta as seoMeta, Body as SeoBody } from "./components/SeoPost";
import { meta as routingMeta, Body as RoutingBody } from "./components/RoutingPost";
import { meta as hexagonalCSharpMeta, Body as HexagonalCSharpBody } from "./components/HexagonalCSharpPost";
import { meta as hexagonalKotlinMeta, Body as HexagonalKotlinBody } from "./components/HexagonalKotlinPost";
import { meta as hexagonalJavaMeta, Body as HexagonalJavaBody } from "./components/HexagonalJavaPost";
import { meta as cutOverMeta, Body as CutOverBody } from "./components/CutOverPost";
import { meta as graphQLContractMeta, Body as GraphQLContractBody } from "./components/GraphQLContractPost";
import { meta as rxjsSignalsMeta, Body as RxjsSignalsBody } from "./components/RxjsSignalsPost";

const POSTS: BlogPost[] = [
  { ...folderStructureMeta, track: "frontend", Body: FolderStructureBody },
  { ...architectureMeta, track: "frontend", Body: ArchitectureBody },
  { ...unitTestingMeta, track: "frontend", Body: UnitTestingBody },
  { ...seoMeta, track: "frontend", Body: SeoBody },
  { ...routingMeta, track: "frontend", Body: RoutingBody },
  { ...hexagonalCSharpMeta, track: "backend", Body: HexagonalCSharpBody },
  { ...hexagonalKotlinMeta, track: "backend", Body: HexagonalKotlinBody },
  { ...hexagonalJavaMeta, track: "backend", Body: HexagonalJavaBody },
  { ...cutOverMeta, track: "fullstack", Body: CutOverBody },
  { ...graphQLContractMeta, track: "fullstack", Body: GraphQLContractBody },
  { ...rxjsSignalsMeta, track: "frontend", Body: RxjsSignalsBody },
];

export const BLOG_POSTS: BlogPost[] = [...POSTS].sort((first, second) =>
  second.publishedDate.localeCompare(first.publishedDate)
);

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug);
}
