import { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { BookingForm } from "@/features/booking";
import { Section } from "@/components/Section";
import { Container } from "@/components/Container";
import { SEOFactory } from "@/lib/seo";
import type { Locale } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const seoData = SEOFactory.booking(locale as Locale);
  return seoData.metadata;
}

export default async function BookPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "booking" });
  const seoData = SEOFactory.booking(locale as Locale);
  const facts = t.raw("hero.facts") as string[];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: seoData.structuredData,
        }}
      />

      <Section
        background="navy"
        padding="default"
        className="py-5 sm:py-12 lg:py-14"
        aria-labelledby="book-heading"
      >
        <Container>
          <p className="hidden text-[13px] font-bold uppercase tracking-widest text-emerald-300 sm:block">
            {t("hero.badge")}
          </p>
          <h1
            id="book-heading"
            className="text-lg font-extrabold tracking-tight text-white text-balance sm:mt-3 sm:text-4xl lg:text-5xl"
          >
            {t("hero.title")}
          </h1>
          <p className="mt-4 hidden max-w-2xl text-lg leading-relaxed text-slate-300 sm:block">
            {t("hero.description")}
          </p>
          <ul className="mt-6 hidden flex-wrap gap-2 sm:flex">
            {facts.map((fact) => (
              <li
                key={fact}
                className="rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-sm font-medium text-slate-100"
              >
                {fact}
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section
        background="light"
        padding="compact"
        className="pt-6 sm:pt-10"
        id="booking-form"
        aria-labelledby="booking-step-heading"
      >
        <Container>
          <BookingForm />
        </Container>
      </Section>
    </>
  );
}
