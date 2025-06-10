import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { SEOFactory } from "@/lib/seo";
import type { Locale, FAQItem } from "@/lib/seo";
import { FAQClientContent } from "@/components/FAQ/FAQClientContent";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  // Create FAQ items for SEO structured data
  const faqItems: FAQItem[] = [
    {
      question: "What frontend technologies do you specialize in?",
      answer:
        "I specialize in React, Angular, Next.js, TypeScript, and modern JavaScript frameworks with 8+ years of professional experience.",
    },
    {
      question: "What are your hourly rates for frontend development?",
      answer:
        "My rates range from €95-125 per hour depending on the project complexity and scope. I also offer project-based pricing for larger engagements.",
    },
    {
      question: "Do you work remotely or on-site in Amsterdam?",
      answer:
        "I offer both remote and on-site development services in Amsterdam and throughout the Netherlands. Remote collaboration is my primary working method.",
    },
    {
      question: "What is your typical project delivery timeline?",
      answer:
        "Project timelines vary based on scope, but I typically deliver small to medium projects within 2-8 weeks. I provide detailed estimates during consultation.",
    },
    {
      question: "Do you provide ongoing maintenance and support?",
      answer:
        "Yes, I offer comprehensive maintenance packages and ongoing support for all frontend applications I develop, including bug fixes, updates, and performance optimization.",
    },
  ];

  const seoData = SEOFactory.faq(locale as Locale, faqItems);
  return seoData.metadata;
}

export default async function FAQPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Create FAQ items for SEO structured data
  const faqItems: FAQItem[] = [
    {
      question: "What frontend technologies do you specialize in?",
      answer:
        "I specialize in React, Angular, Next.js, TypeScript, and modern JavaScript frameworks with 8+ years of professional experience.",
    },
    {
      question: "What are your hourly rates for frontend development?",
      answer:
        "My rates range from €95-125 per hour depending on the project complexity and scope. I also offer project-based pricing for larger engagements.",
    },
    {
      question: "Do you work remotely or on-site in Amsterdam?",
      answer:
        "I offer both remote and on-site development services in Amsterdam and throughout the Netherlands. Remote collaboration is my primary working method.",
    },
    {
      question: "What is your typical project delivery timeline?",
      answer:
        "Project timelines vary based on scope, but I typically deliver small to medium projects within 2-8 weeks. I provide detailed estimates during consultation.",
    },
    {
      question: "Do you provide ongoing maintenance and support?",
      answer:
        "Yes, I offer comprehensive maintenance packages and ongoing support for all frontend applications I develop, including bug fixes, updates, and performance optimization.",
    },
  ];

  const seoData = SEOFactory.faq(locale as Locale, faqItems);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: seoData.structuredData,
        }}
      />
      <FAQClientContent locale={locale} />
    </>
  );
}
