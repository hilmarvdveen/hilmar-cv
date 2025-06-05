import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { ContactHero } from "@/components/ContactHero";
import { Breadcrumb } from "@/components/Breadcrumb";
import ContactForm from "@/components/ContactForm";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });

  return {
    title: t("meta.title"),
    description: t("meta.description"),
    openGraph: {
      title: t("meta.title"),
      description: t("meta.description"),
      type: "website",
      locale: locale,
    },
    twitter: {
      card: "summary_large_image",
      title: t("meta.title"),
      description: t("meta.description"),
    },
    alternates: {
      canonical: `/${locale}/contact`,
      languages: {
        nl: "/nl/contact",
        en: "/en/contact",
      },
    },
  };
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
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
  );
}
