import { Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { ReactNode } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { BookingFormProvider } from "@/contexts/BookingFormContext";
import "@/app/globals.css";
import { Metadata, Viewport } from "next";
import { siteConfig } from "@/lib/seo.config";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const baseUrl = siteConfig.url;
  const currentUrl = `${baseUrl}/${locale}`;

  return {
    metadataBase: new URL(baseUrl),
    title: {
      template: `%s | ${siteConfig.name} - ${siteConfig.title}`,
      default: `${siteConfig.name} - ${siteConfig.title} | React, Next.js, Angular Expert`,
    },
    description: siteConfig.description,
    keywords: [
      "Frontend Developer",
      "React Developer",
      "Next.js Developer",
      "Angular Developer",
      "TypeScript Expert",
      "Netherlands",
      "Web Development",
      "UI/UX Development",
      "Accessible Web Design",
      "Senior Developer",
      "Freelance Developer",
      "Amsterdam",
      "Utrecht",
      "Rotterdam",
    ],
    authors: [{ name: siteConfig.author.name }],
    creator: siteConfig.author.name,
    publisher: siteConfig.author.name,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      type: "website",
      locale: locale === "nl" ? "nl_NL" : "en_US",
      alternateLocale: locale === "nl" ? "en_US" : "nl_NL",
      url: currentUrl,
      siteName: siteConfig.name,
      title: `${siteConfig.name} - ${siteConfig.title}`,
      description: siteConfig.description,
      images: [
        {
          url: `${baseUrl}/images/social-card.svg`,
          width: 1200,
          height: 630,
          alt: `${siteConfig.name} - Senior Frontend Developer`,
          type: "image/svg+xml",
        },
        {
          url: `${baseUrl}/images/logo_v1.png`,
          width: 400,
          height: 400,
          alt: `${siteConfig.name} Logo`,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${siteConfig.name} - ${siteConfig.title}`,
      description: siteConfig.description,
      images: [`${baseUrl}/images/social-card.svg`],
      creator: siteConfig.author.twitter,
      site: siteConfig.author.twitter,
    },
    alternates: {
      canonical: currentUrl,
      languages: {
        en: `${baseUrl}/en`,
        nl: `${baseUrl}/nl`,
        "x-default": `${baseUrl}/nl`,
      },
    },
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
    },
    other: {
      "msapplication-TileColor": "#059669",
      "theme-color": "#059669",
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!["en", "nl"].includes(locale)) {
    notFound();
  }

  const messages = await getMessages({ locale });

  return (
    <html
      lang={locale}
      className={`${inter.variable} font-sans h-full`}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* Favicons */}
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link
          rel="icon"
          href="/favicon-32x32.png"
          type="image/png"
          sizes="32x32"
        />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />

        {/* Schema.org markup for Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: siteConfig.author.name,
              jobTitle: siteConfig.title,
              description: siteConfig.description,
              url: siteConfig.url,
              sameAs: [
                siteConfig.author.linkedin,
                siteConfig.author.github,
                `https://twitter.com/${siteConfig.social.twitter.replace("@", "")}`,
              ],
              address: {
                "@type": "PostalAddress",
                addressLocality: siteConfig.location.city,
                addressRegion: siteConfig.location.region,
                addressCountry: "Netherlands",
              },
              knowsAbout: [
                "React.js",
                "Next.js",
                "Angular",
                "TypeScript",
                "JavaScript",
                "Frontend Development",
                "Web Development",
                "UI/UX Design",
              ],
            }),
          }}
        />
      </head>
      <body className="h-full flex flex-col" suppressHydrationWarning>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <BookingFormProvider>
            <Header />
            <main
              className="flex-1"
              role="main"
              style={{ paddingTop: "var(--header-height)" }}
            >
              {children}
            </main>
            <Footer />
          </BookingFormProvider>
          {process.env.NEXT_PUBLIC_GA_ID && (
            <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
          )}
        </NextIntlClientProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
