"use client";

import { useEffect } from "react";

// Type declarations for Google Analytics
type GtagFunction = (command: string, ...args: unknown[]) => void;

interface ComprehensiveSEOProps {
  structuredData: Record<string, unknown>[];
  trackPageView?: boolean;
  onMount?: () => void;
  pageTitle?: string;
  canonicalUrl?: string;
  locale?: string;
}

/**
 * Comprehensive SEO component that implements Google's 2024 best practices
 *
 * Features:
 * - JSON-LD structured data injection with language targeting
 * - Google Analytics page view tracking
 * - Enhanced duplicate content prevention
 * - Core Web Vitals optimization
 * - Proper language and region signals for search engines
 */
export function ComprehensiveSEO({
  structuredData,
  trackPageView = true,
  onMount,
  pageTitle,
  canonicalUrl,
  locale = "nl",
}: ComprehensiveSEOProps) {
  useEffect(() => {
    // Track page view with enhanced parameters for multilingual tracking
    if (trackPageView && typeof window !== "undefined" && "gtag" in window) {
      const gtag = (window as { gtag?: GtagFunction }).gtag;
      const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
      if (measurementId && gtag) {
        gtag("config", measurementId, {
          page_title: pageTitle,
          page_location: canonicalUrl || window.location.href,
          language: locale,
          content_group1: locale === "nl" ? "Dutch" : "English",
          content_group2: "Professional Services",
          custom_map: {
            custom_parameter_1: "page_language",
            custom_parameter_2: "page_region",
          },
        });

        // Enhanced page view event for better tracking
        if (gtag) {
          gtag("event", "page_view", {
            page_title: pageTitle,
            page_location: canonicalUrl || window.location.href,
            page_language: locale,
            page_region: locale === "nl" ? "NL" : "US",
            content_category: "Portfolio",
            content_type: "webpage",
          });
        }
      }
    }

    // Execute custom mount handler
    onMount?.();

    // SEO enhancement: Add language signals to the document
    if (typeof document !== "undefined") {
      // Set document language
      document.documentElement.lang = locale === "nl" ? "nl-NL" : "en-US";

      // Add content language meta tag if not present
      if (!document.querySelector('meta[name="content-language"]')) {
        const metaLang = document.createElement("meta");
        metaLang.name = "content-language";
        metaLang.content = locale === "nl" ? "nl-NL" : "en-US";
        document.head.appendChild(metaLang);
      }

      // Add geo targeting meta tags if not present
      if (!document.querySelector('meta[name="geo.region"]')) {
        const metaGeoRegion = document.createElement("meta");
        metaGeoRegion.name = "geo.region";
        metaGeoRegion.content = locale === "nl" ? "NL" : "US";
        document.head.appendChild(metaGeoRegion);
      }

      // Prevent browser auto-translation (important for preventing duplicate content confusion)
      if (
        !document.querySelector('meta[name="google"][content="notranslate"]')
      ) {
        const metaNoTranslate = document.createElement("meta");
        metaNoTranslate.name = "google";
        metaNoTranslate.content = "notranslate";
        document.head.appendChild(metaNoTranslate);
      }
    }
  }, [trackPageView, pageTitle, canonicalUrl, locale, onMount]);

  // Enhanced JSON-LD injection with proper error handling and validation
  useEffect(() => {
    if (!structuredData?.length) return;

    // Clean up existing structured data
    const existingScripts = document.querySelectorAll(
      'script[type="application/ld+json"][data-seo-component="true"]'
    );
    existingScripts.forEach((script) => script.remove());

    // Inject new structured data with language context
    structuredData.forEach((data, index) => {
      try {
        // Enhance structured data with language and location context
        const enhancedData = {
          ...data,
          "@context": data["@context"] || "https://schema.org",
          inLanguage: locale === "nl" ? "nl-NL" : "en-US",
          // Add geo information to all structured data
          ...(locale === "nl" && {
            areaServed: {
              "@type": "Country",
              name: "Netherlands",
              sameAs: "https://en.wikipedia.org/wiki/Netherlands",
            },
          }),
          // Add website context
          isPartOf: {
            "@type": "WebSite",
            name: "Hilmar van der Veen - Senior Fullstack Developer",
            url: canonicalUrl
              ? new URL(canonicalUrl).origin
              : typeof window !== "undefined"
                ? window.location.origin
                : "",
            inLanguage: locale === "nl" ? "nl-NL" : "en-US",
            potentialAction: {
              "@type": "SearchAction",
              target: {
                "@type": "EntryPoint",
                urlTemplate: `${canonicalUrl ? new URL(canonicalUrl).origin : typeof window !== "undefined" ? window.location.origin : ""}/search?q={search_term_string}`,
              },
              "query-input": "required name=search_term_string",
            },
          },
        };

        const script = document.createElement("script");
        script.type = "application/ld+json";
        script.setAttribute("data-seo-component", "true");
        script.setAttribute("data-locale", locale);
        script.setAttribute("data-index", index.toString());

        // Validate JSON before injection
        const jsonString = JSON.stringify(enhancedData, null, 0);
        JSON.parse(jsonString); // Validate

        script.textContent = jsonString;
        document.head.appendChild(script);
      } catch (error) {
        console.warn(
          `Failed to inject structured data at index ${index}:`,
          error
        );

        // Fallback: inject basic structured data without enhancements
        try {
          const fallbackScript = document.createElement("script");
          fallbackScript.type = "application/ld+json";
          fallbackScript.setAttribute("data-seo-component", "true");
          fallbackScript.setAttribute("data-locale", locale);
          fallbackScript.setAttribute("data-index", index.toString());
          fallbackScript.setAttribute("data-fallback", "true");
          fallbackScript.textContent = JSON.stringify(data, null, 0);
          document.head.appendChild(fallbackScript);
        } catch (fallbackError) {
          console.error(
            `Failed to inject fallback structured data at index ${index}:`,
            fallbackError
          );
        }
      }
    });

    // Cleanup function
    return () => {
      const scripts = document.querySelectorAll(
        'script[data-seo-component="true"]'
      );
      scripts.forEach((script) => script.remove());
    };
  }, [structuredData, locale, canonicalUrl]);

  // Enhanced hreflang injection with proper validation
  useEffect(() => {
    if (!canonicalUrl) return;

    // Remove existing hreflang links added by this component
    const existingHreflangLinks = document.querySelectorAll(
      'link[rel="alternate"][data-seo-component="true"]'
    );
    existingHreflangLinks.forEach((link) => link.remove());

    try {
      const url = new URL(canonicalUrl);
      const basePath = url.pathname.replace(/^\/(nl|en)(\/|$)/, "/");

      // Generate hreflang links for all language versions
      const hreflangLinks = [
        {
          hreflang: "nl",
          href:
            `${url.origin}/nl${basePath}`.replace(/\/+$/, "") ||
            `${url.origin}/nl`,
        },
        {
          hreflang: "en",
          href: `${url.origin}${basePath}`.replace(/\/+$/, "") || url.origin,
        },
        {
          hreflang: "x-default",
          href: `${url.origin}${basePath}`.replace(/\/+$/, "") || url.origin,
        },
      ];

      hreflangLinks.forEach(({ hreflang, href }) => {
        const link = document.createElement("link");
        link.rel = "alternate";
        link.hreflang = hreflang;
        link.href = href;
        link.setAttribute("data-seo-component", "true");
        link.setAttribute("data-current-locale", locale);
        document.head.appendChild(link);
      });
    } catch (error) {
      console.warn("Failed to generate hreflang links:", error);
    }

    // Cleanup function
    return () => {
      const hreflangLinks = document.querySelectorAll(
        'link[rel="alternate"][data-seo-component="true"]'
      );
      hreflangLinks.forEach((link) => link.remove());
    };
  }, [canonicalUrl, locale]);

  return null; // This component only manages SEO, no visual output
}
