import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { ContactHero, ContactChannels, ContactForm } from "@/features/contact";
import { Section } from "@/components/Section";
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
      <ContactHero />
      <ContactChannels />

      <Section
        id="contact-form"
        aria-labelledby="contact-form-heading"
        background="light"
      >
        <ContactForm />
      </Section>
    </>
  );
}
