import { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { Inter } from "next/font/google";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { GoogleTagManager } from "@/components/GoogleTagManager";
import { getMessages } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";
import "@/app/globals.css";
import { Metadata, Viewport } from "next";
import { SEOEngine } from "@/lib/seo";
import { BUSINESS_PROFILE } from "@/lib/seo/constants/meta-constants";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Locale } from "@/lib/seo/types/seo-types";
import { BookingFormProvider } from "@/contexts/BookingFormContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

const FAVICON_VERSION = "v2024-01-15";

// Initialize SEO Engine
const seoEngine = new SEOEngine();

export type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  // Validate locale
  if (!["en", "nl"].includes(locale)) {
    notFound();
  }

  // Generate SEO metadata using our comprehensive SEO system
  const { metadata } = seoEngine.createHomepageSEO(locale as Locale);

  // Add additional layout-specific metadata
  return {
    ...metadata,
    // Enhance with favicon and PWA metadata
    icons: {
      icon: [
        { url: `/favicon.ico?${FAVICON_VERSION}`, sizes: "any" },
        { url: `/favicon.svg?${FAVICON_VERSION}`, type: "image/svg+xml" },
        {
          url: `/android-chrome-192x192.png?${FAVICON_VERSION}`,
          sizes: "192x192",
        },
        {
          url: `/android-chrome-512x512.png?${FAVICON_VERSION}`,
          sizes: "512x512",
        },
      ],
      apple: [
        { url: `/apple-touch-icon.png?${FAVICON_VERSION}`, sizes: "180x180" },
      ],
    },
    manifest: "/manifest.json",
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
    },
    other: {
      "theme-color": "#059669",
      "msapplication-TileColor": "#059669",
      "apple-mobile-web-app-title": "Hilmar vdV",
      "application-name": BUSINESS_PROFILE.NAME,
      "apple-mobile-web-app-capable": "yes",
      "apple-mobile-web-app-status-bar-style": "default",
      "mobile-web-app-capable": "yes",
      "msapplication-TileImage": `/android-chrome-192x192.png?${FAVICON_VERSION}`,
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#059669",
};

export default async function LocaleLayout({ children, params }: Props) {
  const [{ locale }, messages] = await Promise.all([
    params,
    params.then(({ locale }) => {
      if (![`en`, `nl`].includes(locale)) notFound();
      return getMessages({ locale });
    }),
  ]);

  setRequestLocale(locale);

  return (
    <html
      lang={locale}
      className={`${inter.variable} font-sans h-full`}
      suppressHydrationWarning
    >
      <head>
        {/* Enhanced DNS prefetch and preconnect for performance */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//www.googletagmanager.com" />
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* Professional geo metadata */}
        <meta name="geo.region" content="NL-NH" />
        <meta name="geo.placename" content="Amsterdam" />
        <meta name="geo.position" content="52.3676;4.9041" />
        <meta name="ICBM" content="52.3676, 4.9041" />

        {/* Preload critical resources */}
        <link
          rel="preload"
          href="/fonts/inter-var.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />

        {/* Google Tag Manager - Load as high as possible */}
        {process.env.NODE_ENV === "production" &&
          process.env.NEXT_PUBLIC_GTM_ID && (
            <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID} />
          )}
      </head>

      <body
        className="min-h-screen bg-white text-gray-900 font-sans antialiased"
        suppressHydrationWarning
      >
        {/* GTM NoScript fallback - immediately after body tag */}
        {process.env.NODE_ENV === "production" &&
          process.env.NEXT_PUBLIC_GTM_ID && (
            <noscript>
              <iframe
                src={`https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GTM_ID}`}
                height="0"
                width="0"
                style={{ display: "none", visibility: "hidden" }}
              />
            </noscript>
          )}

        <NextIntlClientProvider locale={locale} messages={messages}>
          <BookingFormProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </BookingFormProvider>
        </NextIntlClientProvider>

        {/* Analytics - GA4 with GTM integration */}
        {process.env.NODE_ENV === "production" &&
          process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
            <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
          )}

        {/* Performance monitoring */}
        <SpeedInsights />
      </body>
    </html>
  );
}
