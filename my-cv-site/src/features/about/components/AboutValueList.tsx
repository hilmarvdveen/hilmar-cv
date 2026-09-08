import { useTranslations } from "next-intl";
import { ArrowRight, Check } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { CaseSchematic } from "@/components/CaseSchematic";
import { mergeClasses } from "@/lib/mergeClasses";

type ValueBlock = {
  title: string;
  body: string;
  evidence: string;
  article?: { href: string; label: string };
};

const ARTICLE_LINK_CLASS =
  "mt-3 inline-flex min-h-6 items-center gap-1.5 text-sm font-semibold text-primary underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2";

const blockNumber = (index: number) => String(index + 1).padStart(2, "0");

export const AboutValueList = () => {
  const t = useTranslations("about");
  const blocks = t.raw("value.blocks") as ValueBlock[];

  return (
    <ol>
      {blocks.map((block, index) => (
        <li
          key={block.title}
          className={mergeClasses(
            "grid grid-cols-[2rem_1fr] gap-x-4 sm:grid-cols-[2.5rem_1fr]",
            index > 0 && "border-t border-gray-200 pt-8 mt-8"
          )}
        >
          <p
            className="text-sm font-bold text-primary tabular-nums"
            aria-hidden="true"
          >
            {blockNumber(index)}
          </p>
          <div>
            <h3 className="text-subsection-title text-textMain">{block.title}</h3>
            <p className="mt-3 text-lg leading-relaxed text-gray-700">{block.body}</p>
            <p className="mt-5 border-t border-gray-200 pt-3 flex items-start gap-2 text-sm font-semibold text-primary">
              <Check className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              {block.evidence}
            </p>
            {block.article && (
              <Link
                href={block.article.href}
                data-placement="about-mentoring-article"
                className={ARTICLE_LINK_CLASS}
              >
                {block.article.label}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            )}
            {index === 0 && (
              <figure className="mt-6 hidden sm:flex flex-col items-end">
                <CaseSchematic schematic="ramp" width={96} height={48} />
                <figcaption className="mt-1 text-xs text-gray-600">
                  {t("value.device")}
                </figcaption>
              </figure>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
};
