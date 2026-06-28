import { Link } from "@/i18n/navigation";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import type { Locale } from "@/lib/seo";
import type { BlogPost, BlogLabels } from "../types";
import { formatDate } from "../format";

type BlogIndexProps = {
  posts: BlogPost[];
  locale: Locale;
  labels: BlogLabels;
};

/** Presentational blog landing page: a localized, card-based post listing. */
export function BlogIndex({ posts, locale, labels }: BlogIndexProps) {
  return (
    <div className="bg-gray-50">
      <header className="border-b border-gray-100 bg-gradient-to-b from-gray-50 to-white">
        <div className="mx-auto max-w-5xl px-6 pb-10 text-center pt-[calc(var(--header-height)_+_2rem)]">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            {labels.eyebrow}
          </p>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            {labels.indexTitle}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">{labels.indexSubtitle}</p>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="grid gap-6 sm:grid-cols-2">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              locale={locale}
              className="group flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
            >
              <span className="self-start rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
                {labels.category[post.category]}
              </span>
              <h2 className="mt-4 text-xl font-bold text-gray-900 group-hover:text-blue-700">
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

              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600">
                {labels.readArticle}
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
