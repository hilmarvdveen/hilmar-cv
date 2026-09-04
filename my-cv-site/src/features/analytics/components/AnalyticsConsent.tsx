"use client";

import { Button } from "@/components/Button";
import { storeConsent, useAnalyticsConsent } from "../consentStore";

export {
  ANALYTICS_CONSENT_EVENT,
  ANALYTICS_CONSENT_KEY,
  readStoredConsent,
} from "../consentStore";

export type ConsentLabels = {
  text: string;
  decline: string;
  accept: string;
};

type AnalyticsConsentProps = {
  labels: ConsentLabels;
};

export function AnalyticsConsent({ labels }: AnalyticsConsentProps) {
  const consent = useAnalyticsConsent();

  if (consent !== null) return null;

  return (
    <section
      aria-label={labels.accept}
      className="fixed inset-x-0 bottom-[var(--bottom-bar-offset,0px)] z-50 border-t border-gray-200 bg-white/95 px-4 py-3 shadow-lg backdrop-blur sm:px-6"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-gray-700">{labels.text}</p>
        <div className="flex gap-2">
          <Button type="button" variant="neutral" size="sm" onClick={() => storeConsent(false)}>
            {labels.decline}
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => storeConsent(true)}>
            {labels.accept}
          </Button>
        </div>
      </div>
    </section>
  );
}
