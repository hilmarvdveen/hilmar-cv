export type DatedPost = {
  slug: string;
  publishedDate: string;
};

export type NeighbouringPosts<PostType extends DatedPost> = {
  previous?: PostType;
  next?: PostType;
};

const newestFirst = (first: DatedPost, second: DatedPost) =>
  second.publishedDate.localeCompare(first.publishedDate) ||
  first.slug.localeCompare(second.slug);

export function findPostNeighbours<PostType extends DatedPost>(
  posts: readonly PostType[],
  slug: string
): NeighbouringPosts<PostType> {
  const ordered = [...posts].sort(newestFirst);
  const index = ordered.findIndex((post) => post.slug === slug);
  if (index < 0) return {};
  return { previous: ordered[index - 1], next: ordered[index + 1] };
}
