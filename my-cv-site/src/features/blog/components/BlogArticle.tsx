import { Link } from "@/i18n/navigation";
import { Calendar, Clock, ArrowLeft, ArrowRight, User, Home, ChevronRight } from "lucide-react";
import type { Locale } from "@/lib/seo";
import type { BlogPost, BlogLabels } from "../types";
import { formatDate } from "../format";

type BlogArticleProps = {
  post: BlogPost;
  locale: Locale;
  labels: BlogLabels;
};

/**
 * Presentational article shell. Chrome strings arrive pre-translated as
 * `labels` so this component stays free of server/client i18n coupling and is
 * trivially testable; the localized body is rendered by `post.Body`.
 */
export function BlogArticle({ post, locale, labels }: BlogArticleProps) {
  const { Body } = post;

  return (
    <article className="bg-white">
      <header className="border-b border-gray-100 bg-gradient-to-b from-gray-50 to-white">
        <div className="mx-auto max-w-3xl px-6 pb-8 pt-[calc(var(--header-height)_+_2rem)]">
          <nav className="mb-6" aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center text-sm text-gray-500">
              <li className="flex items-center">
                <Link
                  href="/"
                  locale={locale}
                  className="flex items-center gap-1 hover:text-gray-700"
                  aria-label="Home"
                >
                  <Home className="h-4 w-4" />
                </Link>
              </li>
              <li className="flex items-center">
                <ChevronRight className="mx-1.5 h-4 w-4 text-gray-400" aria-hidden="true" />
                <Link
                  href="/blog"
                  locale={locale}
                  className="font-medium text-gray-600 hover:text-blue-600"
                >
                  {labels.eyebrow}
                </Link>
              </li>
              <li className="flex min-w-0 items-center">
                <ChevronRight className="mx-1.5 h-4 w-4 text-gray-400" aria-hidden="true" />
                <span
                  className="max-w-[55vw] truncate text-gray-900 sm:max-w-xs"
                  aria-current="page"
                  title={post.title[locale]}
                >
                  {post.title[locale]}
                </span>
              </li>
            </ol>
          </nav>

          <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
            {labels.category[post.category]}
          </span>

          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
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
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-6 py-10">
        <Body locale={locale} />
      </div>

      <div className="border-t border-gray-100 bg-gray-50">
        <div className="mx-auto max-w-3xl px-6 py-12">
          <div className="rounded-2xl bg-gradient-to-br from-blue-900 to-blue-700 p-8 text-white shadow-lg">
            <h2 className="text-2xl font-bold">{labels.ctaTitle}</h2>
            <p className="mt-2 max-w-xl text-blue-100">{labels.ctaText}</p>
            <Link
              href="/contact"
              locale={locale}
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 font-semibold text-blue-700 transition hover:bg-blue-50"
            >
              {labels.ctaButton}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <Link
            href="/blog"
            locale={locale}
            className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            {labels.backToList}
          </Link>
        </div>
      </div>
    </article>
  );
}
