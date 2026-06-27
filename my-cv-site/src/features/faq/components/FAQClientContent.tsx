"use client";

import { useTranslations } from "next-intl";
import { Breadcrumb } from "@/components/Breadcrumb";
import Link from "next/link";
import {
  HelpCircle,
  Clock,
  Euro,
  Code,
  Users,
  Globe,
  Shield,
  Calendar,
  Phone,
  Mail,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useState } from "react";

interface FAQClientContentProps {
  locale: string;
}

export function FAQClientContent({}: FAQClientContentProps) {
  const t = useTranslations("faq");
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const faqCategories = [
    {
      id: "general",
      title: t("categories.general.title"),
      icon: HelpCircle,
      questions: t.raw("categories.general.questions") as Array<{
        question: string;
        answer: string;
      }>,
    },
    {
      id: "services",
      title: t("categories.services.title"),
      icon: Code,
      questions: t.raw("categories.services.questions") as Array<{
        question: string;
        answer: string;
      }>,
    },
    {
      id: "pricing",
      title: t("categories.pricing.title"),
      icon: Euro,
      questions: t.raw("categories.pricing.questions") as Array<{
        question: string;
        answer: string;
      }>,
    },
    {
      id: "process",
      title: t("categories.process.title"),
      icon: Clock,
      questions: t.raw("categories.process.questions") as Array<{
        question: string;
        answer: string;
      }>,
    },
    {
      id: "collaboration",
      title: t("categories.collaboration.title"),
      icon: Users,
      questions: t.raw("categories.collaboration.questions") as Array<{
        question: string;
        answer: string;
      }>,
    },
  ];

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-4xl">
            <div className="flex items-center space-x-3 mb-6">
              <HelpCircle className="w-8 h-8 text-blue-300" />
              <span className="text-blue-300 font-medium">{t("badge")}</span>
            </div>

            <h1 className="text-4xl lg:text-6xl font-extrabold leading-tight mb-6 tracking-tight">
              {t("hero.title")}
              <br />
              <span className="text-blue-300">{t("hero.subtitle")}</span>
            </h1>

            <p className="text-xl text-blue-100 mb-8 max-w-3xl leading-relaxed">
              {t("hero.description")}
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-blue-300" />
                <span className="text-blue-100">
                  {t("hero.features.quick")}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-blue-300" />
                <span className="text-blue-100">
                  {t("hero.features.expert")}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Globe className="w-5 h-5 text-blue-300" />
                <span className="text-blue-100">
                  {t("hero.features.remote")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Breadcrumb />

      {/* FAQ Content */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6">
          {/* Quick Navigation */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              {t("quickNav.title")}
            </h2>
            <div className="grid md:grid-cols-5 gap-4">
              {faqCategories.map((category) => {
                const Icon = category.icon;
                return (
                  <a
                    key={category.id}
                    href={`#${category.id}`}
                    className="group flex flex-col items-center p-6 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-300"
                  >
                    <Icon className="w-8 h-8 text-blue-600 mb-3 group-hover:scale-110 transition-transform duration-300" />
                    <span className="text-sm font-medium text-gray-700 text-center group-hover:text-blue-600 transition-colors duration-300">
                      {category.title}
                    </span>
                  </a>
                );
              })}
            </div>
          </div>

          {/* FAQ Categories */}
          {faqCategories.map((category, categoryIndex) => (
            <div key={category.id} id={category.id} className="mb-16">
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                  <category.icon className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">
                  {category.title}
                </h2>
              </div>

              <div className="space-y-4">
                {category.questions.map((faq, questionIndex) => {
                  const globalIndex = categoryIndex * 100 + questionIndex;
                  const isOpen = openItems.includes(globalIndex);

                  return (
                    <div
                      key={questionIndex}
                      className="bg-white rounded-lg border border-gray-200 overflow-hidden"
                    >
                      <button
                        onClick={() => toggleItem(globalIndex)}
                        className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                      >
                        <span className="text-lg font-medium text-gray-900 pr-4">
                          {faq.question}
                        </span>
                        {isOpen ? (
                          <ChevronUp className="w-5 h-5 text-blue-600 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        )}
                      </button>

                      {isOpen && (
                        <div className="px-6 pb-5">
                          <div className="text-gray-600 leading-relaxed whitespace-pre-line">
                            {faq.answer}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="bg-blue-900 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            {t("cta.title")}
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            {t("cta.description")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center space-x-2 bg-white text-blue-900 px-8 py-4 rounded-lg font-bold hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <Mail className="w-5 h-5" />
              <span>{t("cta.contact")}</span>
            </Link>

            <Link
              href="/book"
              className="inline-flex items-center justify-center space-x-2 border-2 border-blue-300 text-blue-300 px-8 py-4 rounded-lg font-bold hover:bg-blue-300 hover:text-blue-900 transition-all duration-300"
            >
              <Calendar className="w-5 h-5" />
              <span>{t("cta.book")}</span>
            </Link>

            <a
              href="tel:+31680149947"
              className="inline-flex items-center justify-center space-x-2 border-2 border-blue-300 text-blue-300 px-8 py-4 rounded-lg font-bold hover:bg-blue-300 hover:text-blue-900 transition-all duration-300"
            >
              <Phone className="w-5 h-5" />
              <span>{t("cta.call")}</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
