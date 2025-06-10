import Link from "next/link";
import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { SEOFactory } from "@/lib/seo";
import type { Locale } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const seoData = SEOFactory.about(locale as Locale);
  return seoData.metadata;
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const seoData = SEOFactory.about(locale as Locale);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: seoData.structuredData,
        }}
      />
      <div className="bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">About Me</h1>
          <div className="bg-white rounded-lg p-8">
            <p className="text-lg text-gray-600 mb-6">
              With over 15 years of experience in full-stack development, I
              specialize in building scalable web applications and technical
              solutions for companies across Europe.
            </p>
            <p className="text-gray-600">
              This page is coming soon. In the meantime, feel free to{" "}
              <Link
                href="/contact"
                className="text-emerald-600 hover:underline"
              >
                get in touch
              </Link>{" "}
              or{" "}
              <Link href="/book" className="text-emerald-600 hover:underline">
                book a consultation
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
