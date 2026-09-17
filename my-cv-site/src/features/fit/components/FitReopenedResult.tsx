"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { BUSINESS_PROFILE } from "@/lib/seo/constants/meta-constants";
import {
  CV_POLL_INTERVAL_MILLISECONDS,
  fillDatePlaceholder,
  formatFitCheckDate,
  hasPollBudgetLeft,
  tailoredCvFileName,
  trackFitEvent,
  type FitLocale,
  type FitReport as FitReportData,
} from "@/lib/fit/client";
import { FitReport } from "./FitReport";
import { FitQuestion } from "./FitQuestion";
import { FitBooking } from "./FitBooking";

export type FitReopenedResultLabels = {
  loading: string;
  ready: string;
  failed: string;
  rateLimited: string;
  checkedOn: string;
  untitled: string;
  download: string;
  downloading: string;
  downloadNote: string;
  downloaded: string;
  downloadFailed: string;
  downloadTimedOut: string;
  downloadRateLimited: string;
  nextSteps: string;
  nextStepsLink: string;
  mailAction: string;
};

type FitReopenedResultProps = {
  sessionId: string;
  resultKey: string;
  labels: FitReopenedResultLabels;
  turnstileSiteKey?: string;
};

type StoredResult = {
  report: FitReportData;
  locale: FitLocale;
  title: string;
  createdAt: string;
  hasCv: boolean;
};

type CvStatus = {
  ready: boolean;
  failed: boolean;
};

type LoadState = "loading" | "ready" | "failed" | "rateLimited";
type DownloadState = "idle" | "working" | "downloaded" | "failed" | "timedOut" | "rateLimited";

type LoadOutcome =
  | { state: "ready"; stored: StoredResult }
  | { state: "failed" }
  | { state: "rateLimited" };

const readStoredResult = async (parameters: URLSearchParams): Promise<LoadOutcome> => {
  try {
    const response = await fetch(`/api/fit/result?${parameters.toString()}`);
    if (!response.ok) {
      return { state: response.status === 429 ? "rateLimited" : "failed" };
    }
    return { state: "ready", stored: (await response.json()) as StoredResult };
  } catch {
    return { state: "failed" };
  }
};

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

const waitForNextPoll = () =>
  new Promise((resolve) => setTimeout(resolve, CV_POLL_INTERVAL_MILLISECONDS));

export const FitReopenedResult = ({
  sessionId,
  resultKey,
  labels,
  turnstileSiteKey,
}: FitReopenedResultProps) => {
  const pageLocale = useLocale();
  const [stored, setStored] = useState<StoredResult | null>(null);
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [downloadState, setDownloadState] = useState<DownloadState>("idle");
  const [statusMessage, setStatusMessage] = useState(labels.loading);
  const signedParameters = useRef({ session: sessionId, key: resultKey });

  useEffect(() => {
    let isMounted = true;
    const parameters = new URLSearchParams(signedParameters.current);

    const apply = (outcome: LoadOutcome) => {
      if (!isMounted) return;
      if (outcome.state === "ready") {
        setStored(outcome.stored);
        setLoadState("ready");
        setStatusMessage(labels.ready);
        window.history.replaceState(null, "", window.location.pathname);
        return;
      }
      setLoadState(outcome.state);
      setStatusMessage(outcome.state === "rateLimited" ? labels.rateLimited : labels.failed);
    };

    void readStoredResult(parameters).then(apply);
    return () => {
      isMounted = false;
    };
  }, [labels]);

  const documentLocale = stored?.locale ?? (pageLocale === "en" ? "en" : "nl");
  const documentTitle = stored?.title ?? "";

  const cvParameters = () =>
    new URLSearchParams({ ...signedParameters.current, locale: documentLocale });

  const finish = (state: DownloadState, message: string) => {
    setDownloadState(state);
    setStatusMessage(message);
  };

  const startBuild = async (): Promise<CvStatus | null> => {
    const response = await fetch("/api/fit/cv", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...signedParameters.current, locale: documentLocale }),
    });
    if (response.status === 429) {
      finish("rateLimited", labels.downloadRateLimited);
      return null;
    }
    if (!response.ok) {
      trackFitEvent("fit_cv_failed", { status: response.status });
      finish("failed", labels.downloadFailed);
      return null;
    }
    return (await response.json()) as CvStatus;
  };

  const waitForDocument = async (status: CvStatus): Promise<boolean> => {
    let current = status;
    let elapsed = 0;
    while (!current.ready) {
      if (current.failed) {
        trackFitEvent("fit_cv_failed", { status: 0 });
        finish("failed", labels.downloadFailed);
        return false;
      }
      if (!hasPollBudgetLeft(elapsed)) {
        finish("timedOut", labels.downloadTimedOut);
        return false;
      }
      await waitForNextPoll();
      elapsed += CV_POLL_INTERVAL_MILLISECONDS;
      const response = await fetch(`/api/fit/cv/status?${cvParameters().toString()}`);
      if (response.status === 429) {
        finish("rateLimited", labels.downloadRateLimited);
        return false;
      }
      if (!response.ok) {
        trackFitEvent("fit_cv_failed", { status: response.status });
        finish("failed", labels.downloadFailed);
        return false;
      }
      current = (await response.json()) as CvStatus;
    }
    return true;
  };

  const streamDocument = async (): Promise<boolean> => {
    const response = await fetch(`/api/fit/cv?${cvParameters().toString()}`);
    if (response.status === 429) {
      finish("rateLimited", labels.downloadRateLimited);
      return false;
    }
    if (!response.ok) {
      trackFitEvent("fit_cv_failed", { status: response.status });
      finish("failed", labels.downloadFailed);
      return false;
    }
    saveDocument(await response.blob(), tailoredCvFileName(documentTitle, documentLocale));
    return true;
  };

  const handleDownload = async () => {
    if (downloadState === "working") return;
    setDownloadState("working");
    setStatusMessage(labels.downloading);

    try {
      const status = await startBuild();
      if (!status) return;
      if (!(await waitForDocument(status))) return;
      if (!(await streamDocument())) return;
      trackFitEvent("fit_cv_downloaded", { locale: documentLocale });
      finish("downloaded", labels.downloaded);
    } catch {
      trackFitEvent("fit_cv_failed", { status: 0 });
      finish("failed", labels.downloadFailed);
    }
  };

  const checkedOnLine = stored?.createdAt
    ? fillDatePlaceholder(labels.checkedOn, formatFitCheckDate(stored.createdAt, documentLocale))
    : "";

  const downloadFailureMessage =
    downloadState === "failed"
      ? labels.downloadFailed
      : downloadState === "timedOut"
        ? labels.downloadTimedOut
        : downloadState === "rateLimited"
          ? labels.downloadRateLimited
          : "";

  return (
    <div>
      <p role="status" aria-live="polite" className="sr-only">
        {statusMessage}
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

      {(loadState === "failed" || loadState === "rateLimited") && (
        <Card>
          <p className="text-base leading-relaxed text-gray-700">
            {loadState === "failed" ? labels.failed : labels.rateLimited}
          </p>
        </Card>
      )}

      {stored && (
        <>
          <Card className="p-4 sm:p-7">
            <h2 className="text-subsection-title text-textMain">
              {stored.title || labels.untitled}
            </h2>
            {checkedOnLine && <p className="mt-1 text-sm text-gray-600">{checkedOnLine}</p>}
            <div className="mt-5">
              <Button
                type="button"
                variant="primary"
                size="md"
                onClick={handleDownload}
                aria-disabled={downloadState === "working"}
                className="w-full sm:w-auto"
              >
                {downloadState === "working" ? (
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
            </div>
            {!stored.hasCv && (
              <p className="mt-3 text-sm leading-relaxed text-gray-600">{labels.downloadNote}</p>
            )}
            {downloadFailureMessage && (
              <p className="mt-3 text-sm leading-relaxed text-red-800">
                {downloadFailureMessage}{" "}
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
          <FitReport
            report={stored.report}
            sessionId={sessionId}
            nextStepsNote={labels.nextSteps}
            nextStepsLinkLabel={labels.nextStepsLink}
          />
          <FitQuestion sessionId={sessionId} turnstileSiteKey={turnstileSiteKey} />
          <FitBooking cardVariant="default" />
        </>
      )}
    </div>
  );
};
