import { Link } from "@/i18n/navigation";
import { Calendar, Clock, ArrowLeft, ArrowRight, User, Home, ChevronRight } from "lucide-react";
import type { Locale } from "@/lib/seo";
import { Section } from "@/components/Section";
import { Container } from "@/components/Container";
import { Button } from "@/components/Button";
import type { BlogPost, BlogLabels } from "../types";
import { formatDate } from "../format";

type BlogArticleProps = {
  post: BlogPost;
  locale: Locale;
  labels: BlogLabels;
};

export function BlogArticle({ post, locale, labels }: BlogArticleProps) {
  const { Body } = post;

  return (
    <article className="bg-white">
      <Section background="light" padding="compact" className="border-b border-gray-100">
        <Container width="prose">
          <nav className="mb-6" aria-label={labels.breadcrumbLabel}>
            <ol className="flex flex-wrap items-center text-sm text-gray-500">
              <li className="flex items-center">
                <Link
                  href="/"
                  locale={locale}
                  className="flex min-h-6 min-w-6 items-center justify-center gap-1 hover:text-gray-700"
                  aria-label={labels.homeLabel}
                >
                  <Home className="h-4 w-4" />
                </Link>
              </li>
              <li className="flex items-center">
                <ChevronRight className="mx-1.5 h-4 w-4 text-gray-400" aria-hidden="true" />
                <Link
                  href="/blog"
                  locale={locale}
                  className="inline-flex min-h-6 items-center font-medium text-gray-600 hover:text-emerald-700"
                >
                  {labels.eyebrow}
                </Link>
              </li>
              <li className="flex min-w-0 items-center">
                <ChevronRight className="mx-1.5 h-4 w-4 text-gray-400" aria-hidden="true" />
                <span
                  className="max-w-[55vw] truncate text-textMain sm:max-w-xs"
                  aria-current="page"
                  title={post.title[locale]}
                >
                  {post.title[locale]}
                </span>
              </li>
            </ol>
          </nav>

          <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
            {labels.category[post.category]}
          </span>

          <h1 className="mt-4 text-display text-textMain">
            {post.title[locale]}
          </h1>
          <p className="mt-4 text-lg text-gray-600">{post.description[locale]}</p>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500">
            <span className="flex items-center gap-1.5">
              <User className="h-4 w-4" aria-hidden="true" />
              {labels.writtenBy}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" aria-hidden="true" />
              {labels.publishedOn} {formatDate(post.publishedDate, locale)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" aria-hidden="true" />
              {post.readingTimeMin} {labels.minRead}
            </span>
          </div>
        </Container>
      </Section>

      <Container width="prose" className="py-10">
        <Body locale={locale} />
      </Container>

      <Section background="navy" padding="default" aria-labelledby="blog-cta-heading">
        <Container width="prose">
          <h2 id="blog-cta-heading" className="text-section-title text-white">
            {labels.ctaTitle}
          </h2>
          <p className="mt-2 max-w-xl text-slate-300">{labels.ctaText}</p>
          <Button href="/book" variant="primary" size="md" className="mt-5" data-placement="blog-article-close">
            {labels.ctaButton}
            <ArrowRight className="h-4 w-4" />
          </Button>

          <div>
            <Link
              href="/blog"
              locale={locale}
              className="mt-8 inline-flex min-h-6 items-center gap-2 text-sm font-medium text-slate-300 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              {labels.backToList}
            </Link>
          </div>
        </Container>
      </Section>
    </article>
  );
}
