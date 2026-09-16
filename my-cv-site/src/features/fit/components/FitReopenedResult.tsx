"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { trackFitEvent, type FitReport as FitReportData } from "@/lib/fit";
import { FitReport } from "./FitReport";

export type FitReopenedResultLabels = {
  title: string;
  intro: string;
  loading: string;
  failed: string;
  download: string;
  downloading: string;
  downloadNote: string;
};

type FitReopenedResultProps = {
  sessionId: string;
  resultKey: string;
  labels: FitReopenedResultLabels;
};

type StoredResult = {
  report: FitReportData;
};

const documentFileName = (locale: string): string =>
  `cv-hilmar-van-der-veen-${locale === "en" ? "en" : "nl"}.pdf`;

const saveDocument = (blob: Blob, fileName: string) => {
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(objectUrl);
};

export const FitReopenedResult = ({ sessionId, resultKey, labels }: FitReopenedResultProps) => {
  const locale = useLocale();
  const [report, setReport] = useState<FitReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasFailed, setHasFailed] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadFailed, setDownloadFailed] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const parameters = new URLSearchParams({ session: sessionId, key: resultKey });

    const load = async () => {
      try {
        const response = await fetch(`/api/fit/result?${parameters.toString()}`);
        if (!response.ok) throw new Error(`The result answered ${response.status}`);
        const data = (await response.json()) as StoredResult;
        if (isMounted) setReport(data.report);
      } catch {
        if (isMounted) setHasFailed(true);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    void load();
    return () => {
      isMounted = false;
    };
  }, [sessionId, resultKey]);

  const handleDownload = async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    setDownloadFailed(false);

    try {
      const parameters = new URLSearchParams({ session: sessionId, key: resultKey, locale });
      const response = await fetch(`/api/fit/cv?${parameters.toString()}`);
      if (!response.ok) throw new Error(`The CV answered ${response.status}`);
      saveDocument(await response.blob(), documentFileName(locale));
      trackFitEvent("fit_cv_downloaded", { locale });
    } catch {
      setDownloadFailed(true);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div>
      <h2 className="text-subsection-title text-textMain">{labels.title}</h2>
      <p className="mt-2 text-base leading-relaxed text-gray-700">{labels.intro}</p>

      <p role="status" aria-live="polite" className="sr-only">
        {isLoading ? labels.loading : ""}
      </p>

      {isLoading && (
        <p className="mt-6 flex items-center gap-3 text-base text-gray-700">
          <Loader2
            className="h-5 w-5 animate-spin motion-reduce:animate-none"
            aria-hidden="true"
          />
          {labels.loading}
        </p>
      )}

      {hasFailed && (
        <Card variant="tinted" className="mt-6">
          <p className="text-base leading-relaxed text-gray-700">{labels.failed}</p>
        </Card>
      )}

      {report && (
        <>
          <Card variant="tinted" className="mt-6">
            <Button
              type="button"
              variant="primary"
              size="lg"
              onClick={handleDownload}
              aria-disabled={isDownloading}
              className="w-full sm:w-auto"
            >
              {isDownloading ? (
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
            {downloadFailed && (
              <p role="alert" className="mt-3 text-sm font-semibold text-red-800">
                {labels.failed}
              </p>
            )}
          </Card>
          <FitReport report={report} sessionId={sessionId} />
        </>
      )}
    </div>
  );
};
