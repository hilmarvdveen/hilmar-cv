import { Link } from "@/i18n/navigation";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import type { Locale } from "@/lib/seo";
import { Section } from "@/components/Section";
import { Container } from "@/components/Container";
import { Card } from "@/components/Card";
import type { BlogPost, BlogLabels } from "../types";
import { formatDate } from "../format";

type BlogIndexProps = {
  posts: BlogPost[];
  locale: Locale;
  labels: BlogLabels;
};

export function BlogIndex({ posts, locale, labels }: BlogIndexProps) {
  return (
    <div className="bg-bgLight">
      <Section background="light" padding="compact" className="border-b border-gray-100">
        <Container width="narrow" className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            {labels.eyebrow}
          </p>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-textMain sm:text-5xl">
            {labels.indexTitle}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">{labels.indexSubtitle}</p>
        </Container>
      </Section>

      <Section padding="default">
        <Container width="narrow">
          <div className="grid gap-6 sm:grid-cols-2">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                locale={locale}
                className="group block"
              >
                <Card className="flex h-full flex-col transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md">
                  <span className="self-start rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
                    {labels.category[post.category]}
                  </span>
                  <h2 className="mt-4 text-xl font-bold text-textMain group-hover:text-emerald-700">
                    {post.title[locale]}
                  </h2>
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
            ))}
          </div>
        </Container>
      </Section>
    </div>
  );
}
