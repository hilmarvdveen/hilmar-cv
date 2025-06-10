import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { SEOFactory } from "@/lib/seo";
import type { Locale } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const seoData = SEOFactory.privacy(locale as Locale);
  return seoData.metadata;
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const seoData = SEOFactory.privacy(locale as Locale);

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
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            Privacy Policy
          </h1>
          <div className="bg-white rounded-lg p-8 space-y-6">
            <p className="text-gray-600">
              <strong>Last updated:</strong> {new Date().toLocaleDateString()}
            </p>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Information Collection
              </h2>
              <p className="text-gray-600">
                We collect information you provide directly to us, such as when
                you contact us or book a consultation.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Contact
              </h2>
              <p className="text-gray-600">
                If you have questions about this Privacy Policy, please contact
                us at hilmar@hilmarvanderveen.com
              </p>
            </section>

            <p className="text-sm text-gray-500">
              This is a simplified privacy policy. A complete version will be
              available soon.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
