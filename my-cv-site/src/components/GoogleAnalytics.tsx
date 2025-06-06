"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

interface GoogleAnalyticsProps {
  gaId: string;
}

export function GoogleAnalytics({ gaId }: GoogleAnalyticsProps) {
  const [consentGiven, setConsentGiven] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if user has already given consent
    const consent = localStorage.getItem("ga-consent");
    if (consent === "granted") {
      setConsentGiven(true);
    } else if (consent === "denied") {
      setConsentGiven(false);
    }
  }, []);

  const grantConsent = () => {
    localStorage.setItem("ga-consent", "granted");
    setConsentGiven(true);

    // Initialize GA after consent
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("consent", "update", {
        analytics_storage: "granted",
      });
    }
  };

  const denyConsent = () => {
    localStorage.setItem("ga-consent", "denied");
    setConsentGiven(false);
  };

  return (
    <>
      {/* Google Analytics Scripts - Lazy loaded for better performance */}
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

      {/* Consent Banner */}
      {consentGiven === null && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 z-50 shadow-lg">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex-1">
              <p className="text-sm">
                We use cookies to analyze website traffic and optimize your
                website experience. By accepting our use of cookies, your data
                will be aggregated with all other user data.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={denyConsent}
                className="px-4 py-2 border border-gray-600 text-gray-300 rounded hover:bg-gray-800 transition-colors text-sm"
              >
                Decline
              </button>
              <button
                onClick={grantConsent}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    gtag: (
      command: string,
      ...args: (string | Date | Record<string, unknown>)[]
    ) => void;
    dataLayer: Record<string, unknown>[];
  }
}
