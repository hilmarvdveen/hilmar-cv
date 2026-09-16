import { useTranslations } from "next-intl";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/Container";
import type { Locale } from "@/lib/seo";
import type { BlogPostMeta } from "../types";

export type PostNeighbour = Pick<BlogPostMeta, "slug" | "title">;

type PostNeighboursProps = {
  locale: Locale;
  previous?: PostNeighbour;
  next?: PostNeighbour;
};

const neighbourLinkClass =
  "inline-flex min-h-6 items-center gap-2 rounded-md text-base font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 sm:max-w-[48%]";

export function PostNeighbours({ locale, previous, next }: PostNeighboursProps) {
  const t = useTranslations("blog");

  if (!previous && !next) return null;

  return (
    <Container width="prose" className="pb-12">
      <nav
        aria-label={t("neighbours.label")}
        className="flex flex-col gap-4 border-t border-gray-200 pt-6 sm:flex-row sm:items-center sm:justify-between"
      >
        {previous ? (
          <Link
            href={`/blog/${previous.slug}`}
            locale={locale}
            className={neighbourLinkClass}
            data-placement="post-previous"
          >
            <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>
              {t("neighbours.previous")}: {previous.title[locale]}
            </span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/blog/${next.slug}`}
            locale={locale}
            className={`${neighbourLinkClass} sm:justify-end sm:text-right`}
            data-placement="post-next"
          >
            <span>
              {t("neighbours.next")}: {next.title[locale]}
            </span>
            <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </Container>
  );
}
