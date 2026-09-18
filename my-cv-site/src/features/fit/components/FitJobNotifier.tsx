"use client";

import { useState, type KeyboardEvent } from "react";
import { useTranslations } from "next-intl";
import { Loader2, X } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { mergeClasses } from "@/lib/mergeClasses";
import { useFitJob, type FitJobView } from "../hooks/useFitJob";
import { useTrackFitJobOutcome } from "../hooks/useTrackFitJobOutcome";

export const FIT_PAGE_PATH = "/fit";

type NoticeKind = "running" | "ready" | "failed";

const noticeKindOf = (view: FitJobView): NoticeKind | null => {
  if (view.state === "running") return "running";
  if (view.state === "failed") return "failed";
  if (view.state === "done" && !view.seen) return "ready";
  return null;
};

export const FitJobNotifier = () => {
  const t = useTranslations("fit.notifier");
  const pathname = usePathname();
  const isOnTheFitPage = pathname === FIT_PAGE_PATH;
  const job = useFitJob(!isOnTheFitPage);
  const [dismissedKind, setDismissedKind] = useState<NoticeKind | null>(null);

  useTrackFitJobOutcome(job.view, !isOnTheFitPage);

  const kind = noticeKindOf(job.view);
  if (isOnTheFitPage || kind === null || kind === dismissedKind) return null;

  const dismiss = () => {
    setDismissedKind(kind);
    if (kind === "failed") job.forgetFailure();
  };

  const closeOnEscape = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") dismiss();
  };

  const announcement =
    kind === "ready" ? t("announceReady") : kind === "failed" ? t("announceFailed") : "";

  return (
    <div
      role="region"
      aria-label={t("label")}
      onKeyDown={closeOnEscape}
      className={mergeClasses(
        "fixed left-4 right-4 z-30 rounded-xl border border-gray-200 bg-white/95 p-4 text-sm shadow-sm backdrop-blur",
        "bottom-[calc(var(--bottom-bar-offset,0px)+0.75rem)] lg:bottom-6 lg:left-auto lg:right-6 lg:w-80",
        kind === "ready" && "border-l-4 border-l-emerald-600"
      )}
    >
      <p role="status" aria-live="polite" className="sr-only">
        {announcement}
      </p>
      <div className="flex items-start gap-3">
        {kind === "running" && (
          <Loader2
            className="mt-0.5 h-4 w-4 shrink-0 animate-spin text-primary motion-reduce:animate-none"
            aria-hidden="true"
          />
        )}
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-textMain">{t(kind)}</p>
          {kind !== "running" && (
            <Link
              href={FIT_PAGE_PATH}
              data-placement={kind === "ready" ? "fit-notifier-ready" : "fit-notifier-failed"}
              className="mt-1 inline-flex min-h-6 items-center rounded-sm font-semibold text-primary underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
            >
              {kind === "ready" ? t("readyLink") : t("failedLink")}
            </Link>
          )}
        </div>
        <button
          type="button"
          onClick={dismiss}
          aria-label={t("dismiss")}
          className="-mr-1 -mt-1 inline-flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-md text-gray-600 hover:bg-gray-100 active:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};
