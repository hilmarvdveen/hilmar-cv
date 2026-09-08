"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { Card } from "@/components/Card";
import { SectionTitle } from "@/components/SectionTitle";
import { useHoneypot } from "@/hooks/useHoneypot";
import { HoneypotField } from "@/components/HoneypotField";
import { LIMITS } from "@/lib/security";
import { pushSiteEvent } from "@/lib/analytics/events";

export default function ContactForm() {
  const t = useTranslations("contact");
  const locale = useLocale();
  const interestTags = t.raw("form.interests") as string[];
  const honeypot = useHoneypot();

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    start: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const toggleTag = (tag: string) => {
    setSelectedTags((previous) =>
      previous.includes(tag)
        ? previous.filter((selectedTag) => selectedTag !== tag)
        : [...previous, tag]
    );
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          interests: selectedTags,
          locale,
          ...honeypot.payload(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Contact submission failed:", response.status, data.error);
        setErrorMessage(
          response.status === 429
            ? t("form.tooManyRequests")
            : t("form.serverError")
        );
        return;
      }

      setSuccessMessage(t("form.successMessage"));
      pushSiteEvent("contact_submit", { locale });
      setFormData({ name: "", email: "", company: "", start: "", message: "" });
      setSelectedTags([]);
    } catch (error: unknown) {
      console.error(error);
      setErrorMessage(t("form.serverError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container width="narrow">
      <SectionTitle
        id="contact-form-heading"
        align="left"
        title={t("form.title")}
        subtitle={t("form.description")}
      />

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <HoneypotField value={honeypot.value} onChange={honeypot.setValue} />

          <p className="text-sm text-gray-600">{t("form.requiredNote")}</p>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-4">
              {t("form.interestsLabel")}
            </label>
            <div className="flex flex-wrap gap-3">
              {interestTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 ${
                    selectedTags.includes(tag)
                      ? "bg-emerald-700 border-emerald-700 text-white shadow-md hover:bg-emerald-800 hover:border-emerald-700"
                      : "bg-white border-gray-500 text-gray-800 hover:border-emerald-300 hover:bg-emerald-50"
                  }`}
                  aria-pressed={selectedTags.includes(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="contact-name"
                className="block text-sm font-semibold text-gray-900 mb-3"
              >
                {t("form.name")}
                <span aria-hidden="true" className="text-emerald-700"> *</span>
              </label>
              <input
                id="contact-name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                type="text"
                autoComplete="name"
                maxLength={100}
                className="w-full px-4 py-3 border border-gray-500 rounded-lg text-gray-900 placeholder-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 transition-colors duration-200"
                required
                aria-required="true"
              />
            </div>

            <div>
              <label
                htmlFor="contact-email"
                className="block text-sm font-semibold text-gray-900 mb-3"
              >
                {t("form.email")}
                <span aria-hidden="true" className="text-emerald-700"> *</span>
              </label>
              <input
                id="contact-email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                autoComplete="email"
                maxLength={254}
                className="w-full px-4 py-3 border border-gray-500 rounded-lg text-gray-900 placeholder-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 transition-colors duration-200"
                required
                aria-required="true"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="contact-company"
                className="block text-sm font-semibold text-gray-900 mb-3"
              >
                {t("form.company")}
              </label>
              <input
                id="contact-company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                type="text"
                autoComplete="organization"
                maxLength={LIMITS.name}
                className="w-full px-4 py-3 border border-gray-500 rounded-lg text-gray-900 placeholder-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 transition-colors duration-200"
              />
            </div>

            <div>
              <label
                htmlFor="contact-start"
                className="block text-sm font-semibold text-gray-900 mb-3"
              >
                {t("form.start")}
              </label>
              <input
                id="contact-start"
                name="start"
                value={formData.start}
                onChange={handleChange}
                type="text"
                maxLength={LIMITS.start}
                placeholder={t("form.startPlaceholder")}
                className="w-full px-4 py-3 border border-gray-500 rounded-lg text-gray-900 placeholder-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 transition-colors duration-200"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="contact-message"
              className="block text-sm font-semibold text-gray-900 mb-3"
            >
              {t("form.message")}
              <span aria-hidden="true" className="text-emerald-700"> *</span>
            </label>
            <textarea
              id="contact-message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={6}
              maxLength={5000}
              className="w-full px-4 py-3 border border-gray-500 rounded-lg text-gray-900 placeholder-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 transition-colors duration-200 resize-none"
              required
              aria-required="true"
            />
          </div>

          {successMessage && (
            <div
              className="bg-emerald-50 border-2 border-emerald-200 text-emerald-800 px-6 py-4 rounded-xl text-center font-medium"
              role="alert"
              aria-live="polite"
            >
              {successMessage}
            </div>
          )}

          {successMessage && (
            <div className="text-center">
              <Button href="/book" variant="primary" size="lg" data-placement="contact-success">
                {t("cta.button")}
              </Button>
            </div>
          )}

          {errorMessage && (
            <div
              className="bg-red-50 border-2 border-red-200 text-red-800 px-6 py-4 rounded-xl text-center font-medium"
              role="alert"
              aria-live="assertive"
            >
              {errorMessage}
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isSubmitting}
            className="w-full sm:w-auto"
            aria-describedby={isSubmitting ? "submit-status" : undefined}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                <span id="submit-status">{t("form.sending")}</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" aria-hidden="true" />
                {t("form.submit")}
              </>
            )}
          </Button>
        </form>
      </Card>
    </Container>
  );
}
