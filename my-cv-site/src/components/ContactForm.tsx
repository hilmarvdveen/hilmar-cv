"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Send, Loader2 } from "lucide-react";

export default function ContactForm() {
  const t = useTranslations("contact");
  const interestTags = t.raw("form.interests") as string[];

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
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, interests: selectedTags }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || t("form.serverError"));
      }

      console.log("Submitted:", { ...formData, interests: selectedTags });
      setSuccessMessage(t("form.successMessage"));
      setFormData({ name: "", email: "", message: "" });
      setSelectedTags([]);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage(t("form.serverError"));
      }
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          {t("form.title")}
        </h2>
        <p className="text-lg text-gray-600 max-w-lg mx-auto">
          {t("form.description")}
        </p>
      </div>

      {/* Form Container */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-8 space-y-8" noValidate>
          {/* Interest Tags */}
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
                      ? "bg-emerald-600 border-emerald-600 text-white shadow-md hover:bg-emerald-700 hover:border-emerald-700"
                      : "bg-white border-gray-200 text-gray-700 hover:border-emerald-300 hover:bg-emerald-50"
                  }`}
                  aria-pressed={selectedTags.includes(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Name Field */}
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
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:border-emerald-500 focus:ring-0 transition-colors duration-200"
                required
                aria-required="true"
              />
            </div>

            {/* Email Field */}
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
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:border-emerald-500 focus:ring-0 transition-colors duration-200"
                required
                aria-required="true"
              />
            </div>
          </div>

          {/* Message Field */}
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
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:border-emerald-500 focus:ring-0 transition-colors duration-200 resize-none"
              required
              aria-required="true"
            />
          </div>

          {/* Status Messages */}
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center justify-center gap-3 ${
              isSubmitting
                ? "bg-gray-300 cursor-not-allowed text-gray-600"
                : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            }`}
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
          </button>
        </form>
      </div>
    </div>
  );
}
