"use client";

import { useEffect } from "react";
import { SEOPageConfig } from "@/types/seo.types";

interface PageSEOProps {
  structuredData: Record<string, unknown>[];
  trackPageView?: boolean;
  onMount?: () => void;
}

export function PageSEO({
  structuredData,
  trackPageView = true,
  onMount,
}: PageSEOProps) {
  useEffect(() => {
    // Track page view
    if (trackPageView && typeof window !== "undefined" && window.gtag) {
      window.gtag("config", process.env.NEXT_PUBLIC_GA_ID || "", {
        page_title: document.title,
        page_location: window.location.href,
      });
    }

    // Call onMount callback
    if (onMount) {
      onMount();
    }
  }, [trackPageView, onMount]);

  return (
    <>
      {structuredData.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema),
          }}
        />
      ))}
    </>
  );
}

// HOC for wrapping pages with SEO
export function withPageSEO<T extends Record<string, unknown>>(
  Component: React.ComponentType<T>,
  seoConfig: (props: T) => SEOPageConfig
) {
  return function WrappedComponent(props: T) {
    const config = seoConfig(props);

    return (
      <>
        <PageSEO
          structuredData={
            config.structuredData?.map((schema) => ({
              "@context": "https://schema.org",
              "@type": schema.type,
              ...schema.data,
            })) || []
          }
        />
        <Component {...props} />
      </>
    );
  };
}
