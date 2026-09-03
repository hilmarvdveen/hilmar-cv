"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { Card } from "@/components/Card";
import { SectionTitle } from "@/components/SectionTitle";
import { useHoneypot } from "@/hooks/useHoneypot";
import { HoneypotField } from "@/components/HoneypotField";

export default function ContactForm() {
  const t = useTranslations("contact");
  const interestTags = t.raw("form.interests") as string[];
  const honeypot = useHoneypot();

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag)
        ? prev.filter((selectedTag) => selectedTag !== tag)
        : [...prev, tag]
    );
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
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
      setFormData({ name: "", email: "", message: "" });
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
        align="center"
        title={t("form.title")}
        subtitle={t("form.description")}
      />

      <Card>
        <form onSubmit={handleSubmit} className="space-y-8" noValidate>
          <HoneypotField value={honeypot.value} onChange={honeypot.setValue} />

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
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border-2 ${
                    selectedTags.includes(tag)
                      ? "bg-emerald-700 border-emerald-700 text-white shadow-md hover:bg-emerald-800 hover:border-emerald-700"
                      : "bg-white border-gray-200 text-gray-700 hover:border-emerald-300 hover:bg-emerald-50"
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
              </label>
              <input
                id="contact-name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                type="text"
                autoComplete="name"
                maxLength={100}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:border-emerald-500 focus:ring-0 transition-colors duration-200"
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
              </label>
              <input
                id="contact-email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                autoComplete="email"
                maxLength={254}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:border-emerald-500 focus:ring-0 transition-colors duration-200"
                required
                aria-required="true"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="contact-message"
              className="block text-sm font-semibold text-gray-900 mb-3"
            >
              {t("form.message")}
            </label>
            <textarea
              id="contact-message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={6}
              maxLength={5000}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:border-emerald-500 focus:ring-0 transition-colors duration-200 resize-none"
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
            className="w-full rounded-xl text-lg"
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
