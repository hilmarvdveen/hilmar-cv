"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { BUSINESS_PROFILE } from "@/lib/seo/constants/meta-constants";
import { trackFitEvent, type FitReport as FitReportData } from "@/lib/fit";
import { FitReport } from "./FitReport";
import { FitQuestion } from "./FitQuestion";
import { FitBooking } from "./FitBooking";

export type FitReopenedResultLabels = {
  loading: string;
  ready: string;
  failed: string;
  download: string;
  downloading: string;
  downloadNote: string;
  downloaded: string;
  downloadFailed: string;
  mailAction: string;
};

type FitReopenedResultProps = {
  sessionId: string;
  resultKey: string;
  labels: FitReopenedResultLabels;
};

type StoredResult = {
  report: FitReportData;
};

type LoadState = "loading" | "ready" | "failed";
type DownloadState = "idle" | "downloading" | "downloaded" | "failed";

const documentFileName = (locale: string): string =>
  `cv-hilmar-van-der-veen-${locale === "en" ? "en" : "nl"}.pdf`;

const saveDocument = (blob: Blob, fileName: string) => {
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(objectUrl), 0);
};

const statusLabelFor = (
  loadState: LoadState,
  downloadState: DownloadState,
  labels: FitReopenedResultLabels
): string => {
  if (downloadState === "downloaded") return labels.downloaded;
  if (downloadState === "failed") return labels.downloadFailed;
  if (loadState === "loading") return labels.loading;
  if (loadState === "failed") return labels.failed;
  return labels.ready;
};

export const FitReopenedResult = ({ sessionId, resultKey, labels }: FitReopenedResultProps) => {
  const locale = useLocale();
  const [report, setReport] = useState<FitReportData | null>(null);
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [downloadState, setDownloadState] = useState<DownloadState>("idle");

  useEffect(() => {
    let isMounted = true;
    const parameters = new URLSearchParams({ session: sessionId, key: resultKey });

    const load = async () => {
      try {
        const response = await fetch(`/api/fit/result?${parameters.toString()}`);
        if (!response.ok) throw new Error(`The result answered ${response.status}`);
        const data = (await response.json()) as StoredResult;
        if (isMounted) {
          setReport(data.report);
          setLoadState("ready");
        }
      } catch {
        if (isMounted) setLoadState("failed");
      }
    };

    void load();
    return () => {
      isMounted = false;
    };
  }, [sessionId, resultKey]);

  const handleDownload = async () => {
    if (downloadState === "downloading") return;
    setDownloadState("downloading");

    try {
      const parameters = new URLSearchParams({ session: sessionId, key: resultKey, locale });
      const response = await fetch(`/api/fit/cv?${parameters.toString()}`);
      if (!response.ok) throw new Error(`The CV answered ${response.status}`);
      saveDocument(await response.blob(), documentFileName(locale));
      trackFitEvent("fit_cv_downloaded", { locale });
      setDownloadState("downloaded");
    } catch {
      setDownloadState("failed");
    }
  };

  return (
    <div>
      <p role="status" aria-live="polite" className="sr-only">
        {statusLabelFor(loadState, downloadState, labels)}
      </p>

      {loadState === "loading" && (
        <p className="flex items-center gap-3 text-base text-gray-700">
          <Loader2
            className="h-5 w-5 animate-spin motion-reduce:animate-none"
            aria-hidden="true"
          />
          {labels.loading}
        </p>
      )}

      {loadState === "failed" && (
        <Card>
          <p className="text-base leading-relaxed text-gray-700">{labels.failed}</p>
        </Card>
      )}

      {report && (
        <>
          <Card className="p-4 sm:p-7">
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={handleDownload}
              aria-disabled={downloadState === "downloading"}
              className="w-full sm:w-auto"
            >
              {downloadState === "downloading" ? (
                <>
                  <Loader2
                    className="h-5 w-5 animate-spin motion-reduce:animate-none"
                    aria-hidden="true"
                  />
                  {labels.downloading}
                </>
              ) : (
                <>
                  <Download className="h-5 w-5" aria-hidden="true" />
                  {labels.download}
                </>
              )}
            </Button>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">{labels.downloadNote}</p>
            {downloadState === "failed" && (
              <p role="alert" className="mt-3 text-sm leading-relaxed text-red-800">
                {labels.downloadFailed}{" "}
                <a
                  href={`mailto:${BUSINESS_PROFILE.CONTACT.EMAIL}`}
                  data-placement="fit-download-mail"
                  className="inline-flex min-h-6 items-center rounded-sm font-semibold text-primary underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
                >
                  {labels.mailAction}
                </a>
              </p>
            )}
          </Card>
          <FitReport report={report} sessionId={sessionId} />
          <FitQuestion sessionId={sessionId} />
          <FitBooking cardVariant="default" />
        </>
      )}
    </div>
  );
};
