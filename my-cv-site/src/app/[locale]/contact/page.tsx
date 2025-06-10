import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { ContactHero } from "@/components/ContactHero";
import { Breadcrumb } from "@/components/Breadcrumb";
import ContactForm from "@/components/ContactForm";
import { SEOFactory } from "@/lib/seo";
import type { Locale } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const seoData = SEOFactory.contact(locale as Locale);
  return seoData.metadata;
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const seoData = SEOFactory.contact(locale as Locale);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: seoData.structuredData,
        }}
      />
      <main role="main">
        <ContactHero />

        <nav aria-label="Breadcrumb">
          <Breadcrumb />
        </nav>

        <section className="py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-6">
            <ContactForm />
          </div>
        </section>
      </main>
    </>
  );
}
