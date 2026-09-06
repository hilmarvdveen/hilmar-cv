import { Link } from "@/i18n/navigation";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import type { Locale } from "@/lib/seo";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { Container } from "@/components/Container";
import { Card } from "@/components/Card";
import { SectionTitle } from "@/components/SectionTitle";
import { Button } from "@/components/Button";
import type { BlogPost, BlogLabels, BlogTrack } from "../types";
import { formatDate } from "../format";

type BlogIndexProps = {
  posts: BlogPost[];
  locale: Locale;
  labels: BlogLabels;
};

type PostCardProps = {
  post: BlogPost;
  locale: Locale;
  labels: BlogLabels;
  featured: boolean;
};

const TRACK_ORDER: BlogTrack[] = ["frontend", "fullstack", "backend"];

function PostCard({ post, locale, labels, featured }: PostCardProps) {
  const Heading = featured ? "h2" : "h3";
  return (
    <Link
      href={`/blog/${post.slug}`}
      locale={locale}
      className={`group block ${featured ? "sm:col-span-2" : ""}`}
    >
      <Card className="flex h-full flex-col transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
            {labels.category[post.category]}
          </span>
          <span className="text-xs font-semibold uppercase tracking-widest text-gray-600">
            {labels.track[post.track]}
          </span>
        </div>
        <Heading
          className={`mt-4 font-bold text-textMain group-hover:text-emerald-700 ${
            featured ? "text-subsection-title" : "text-lg"
          }`}
        >
          {post.title[locale]}
        </Heading>
        <p className="mt-2 flex-1 text-gray-600">{post.excerpt[locale]}</p>

        <div className="mt-5 flex items-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
            {formatDate(post.publishedDate, locale)}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
            {post.readingTimeMin} {labels.minRead}
          </span>
        </div>

        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
          {labels.readArticle}
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
        </span>
      </Card>
    </Link>
  );
}

export function BlogIndex({ posts, locale, labels }: BlogIndexProps) {
  const [featuredPost, ...otherPosts] = posts;
  const groups = TRACK_ORDER.map((track) => ({
    track,
    posts: otherPosts.filter((post) => post.track === track),
  })).filter((group) => group.posts.length > 0);

  return (
    <div className="bg-bgLight">
      <PageHero
        badge={labels.eyebrow}
        title={labels.indexTitle}
        description={labels.indexSubtitle}
      />

      <Section background="light" padding="default">
        <Container width="narrow">
          <div className="grid gap-6 sm:grid-cols-2">
            <PostCard post={featuredPost} locale={locale} labels={labels} featured />
          </div>
        </Container>
      </Section>

      {groups.map((group, position) => (
        <Section
          key={group.track}
          background={position % 2 === 0 ? "white" : "light"}
          padding="default"
          aria-labelledby={`blog-group-${group.track}`}
        >
          <Container width="narrow">
            <SectionTitle id={`blog-group-${group.track}`} title={labels.group[group.track]} />
            <div className="grid gap-6 sm:grid-cols-2">
              {group.posts.map((post) => (
                <PostCard key={post.slug} post={post} locale={locale} labels={labels} featured={false} />
              ))}
            </div>
          </Container>
        </Section>
      ))}

      <Section background="navy" padding="default" aria-labelledby="blog-index-cta-heading">
        <Container width="prose">
          <h2 id="blog-index-cta-heading" className="text-section-title text-white">
            {labels.ctaTitle}
          </h2>
          <p className="mt-2 max-w-xl text-slate-300">{labels.ctaText}</p>
          <Button
            href="/book"
            variant="primary"
            size="md"
            className="mt-5"
            data-placement="blog-close"
          >
            {labels.ctaButton}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Container>
      </Section>
    </div>
  );
}
