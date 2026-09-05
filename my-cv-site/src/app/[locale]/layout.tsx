import { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { Inter } from "next/font/google";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StickyCallToActionBar } from "@/components/StickyCallToActionBar";
import { AnalyticsConsent, GoogleTagManager, SiteEvents } from "@/features/analytics";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { CLIENT_MESSAGE_KEYS, pickMessages } from "@/i18n/pickMessages";
import "@/app/globals.css";
import { Metadata, Viewport } from "next";
import { SEOEngine } from "@/lib/seo";
import { BUSINESS_PROFILE } from "@/lib/seo/constants/meta-constants";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import type { Locale } from "@/lib/seo/types/seo-types";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

const FAVICON_VERSION = "v2024-01-15";

const seoEngine = new SEOEngine();

export type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  if (!["en", "nl"].includes(locale)) {
    notFound();
  }

  const { metadata } = seoEngine.createHomepageSEO(locale as Locale);

  return {
    ...metadata,
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
  const { locale } = await params;
  if (![`en`, `nl`].includes(locale)) notFound();
  setRequestLocale(locale);

  const [messages, common] = await Promise.all([
    getMessages({ locale }),
    getTranslations({ locale, namespace: "common" }),
  ]);
  const clientMessages = pickMessages(messages, CLIENT_MESSAGE_KEYS) as typeof messages;
  const consentLabels = {
    text: common("consent.text"),
    decline: common("consent.decline"),
    accept: common("consent.accept"),
  };
  const gtmId = process.env.NODE_ENV === "production" ? process.env.NEXT_PUBLIC_GTM_ID : undefined;

  return (
    <html
      lang={locale}
      className={`${inter.variable} font-sans h-full`}
      suppressHydrationWarning
    >
      <head>
        <link rel="dns-prefetch" href="//www.googletagmanager.com" />
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        <link rel="dns-prefetch" href="//vercel.live" />
        <link rel="dns-prefetch" href="//vitals.vercel-analytics.com" />
        {gtmId && <GoogleTagManager gtmId={gtmId} />}
      </head>

      <body
        className="min-h-screen bg-white text-gray-900 font-sans antialiased"
        suppressHydrationWarning
      >
        <NextIntlClientProvider locale={locale} messages={clientMessages}>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 pt-[var(--header-height)] pb-[var(--consent-height,0px)]">{children}</main>
            <Footer />
          </div>
          <StickyCallToActionBar />
          <SiteEvents />
        </NextIntlClientProvider>

        {gtmId && <AnalyticsConsent labels={consentLabels} />}

        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
