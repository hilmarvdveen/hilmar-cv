"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { Button } from "@/components/Button";

export const ANALYTICS_CONSENT_KEY = "ga-consent";
export const ANALYTICS_CONSENT_EVENT = "analytics-consent";

export type ConsentLabels = {
  text: string;
  decline: string;
  accept: string;
};

type GoogleAnalyticsProps = {
  gaId: string;
  labels: ConsentLabels;
};

export const readStoredConsent = (): boolean | null => {
  try {
    const stored = localStorage.getItem(ANALYTICS_CONSENT_KEY);
    if (stored === "granted") return true;
    if (stored === "denied") return false;
    return null;
  } catch {
    return null;
  }
};

export function GoogleAnalytics({ gaId, labels }: GoogleAnalyticsProps) {
  const [consentGiven, setConsentGiven] = useState<boolean | null>(null);

  useEffect(() => {
    const stored = readStoredConsent();
    if (stored !== null) setConsentGiven(stored);
  }, []);

  const decide = (granted: boolean) => {
    localStorage.setItem(ANALYTICS_CONSENT_KEY, granted ? "granted" : "denied");
    setConsentGiven(granted);
    window.dispatchEvent(new CustomEvent(ANALYTICS_CONSENT_EVENT, { detail: granted }));
    if (granted && typeof window.gtag === "function") {
      window.gtag("consent", "update", { analytics_storage: "granted" });
    }
  };

  return (
    <>
      {consentGiven && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="lazyOnload"
          />
          <Script id="google-analytics" strategy="lazyOnload">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}', {
                anonymize_ip: true,
                cookie_flags: 'secure;samesite=strict',
              });
            `}
          </Script>
        </>
      )}

      {consentGiven === null && (
        <section
          aria-label={labels.accept}
          className="fixed inset-x-0 bottom-0 z-50 border-t border-gray-200 bg-white/95 px-4 py-3 shadow-lg backdrop-blur sm:px-6"
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-700">{labels.text}</p>
            <div className="flex gap-2">
              <Button type="button" variant="neutral" size="sm" onClick={() => decide(false)}>
                {labels.decline}
              </Button>
              <Button type="button" variant="primary" size="sm" onClick={() => decide(true)}>
                {labels.accept}
              </Button>
            </div>
          </div>
        </section>
      )}
    </>
  );
}

declare global {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}
