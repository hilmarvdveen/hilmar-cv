"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { X, Download, Mail, MessageSquare, User } from "lucide-react";
import { Button } from "@/components/Button";
import { useHoneypot } from "@/hooks/useHoneypot";
import { HoneypotField } from "@/components/HoneypotField";

export type CvLanguage = "nl" | "en";

export const cvDocumentPath = (language: CvLanguage) =>
  `/data/cv/hilmar_van_der_veen_cv_${language}.pdf`;

const CV_LANGUAGES: CvLanguage[] = ["nl", "en"];

type CVDownloadModalProps = {
  isOpen: boolean;
  onClose: () => void;
  locale: string;
};

type FormData = {
  email: string;
  name: string;
  purpose: string;
};

const INPUT_CLASS =
  "w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600";

export const CVDownloadModal = ({ isOpen, onClose, locale }: CVDownloadModalProps) => {
  const t = useTranslations("cvModal");
  const honeypot = useHoneypot();
  const [formData, setFormData] = useState<FormData>({ email: "", name: "", purpose: "" });
  const [cvLanguage, setCvLanguage] = useState<CvLanguage>(locale === "nl" ? "nl" : "en");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  if (!isOpen) return null;

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.email.trim()) {
      newErrors.email = t("validation.emailRequired");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t("validation.emailInvalid");
    }

    if (!formData.name.trim()) {
      newErrors.name = t("validation.nameRequired");
    }

    if (!formData.purpose.trim()) {
      newErrors.purpose = t("validation.purposeRequired");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const openDocument = () => {
    try {
      window.open(cvDocumentPath(cvLanguage), "_blank");
    } catch (error) {
      console.error("Error opening the CV document:", error);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    openDocument();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/cv-download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          locale,
          cvLanguage,
          timestamp: new Date().toISOString(),
          ...honeypot.payload(),
        }),
      });

      if (!response.ok) {
        console.warn("Lead tracking failed, but the download already started");
      }
    } catch (error) {
      console.error("Error submitting CV download form:", error);
    } finally {
      setIsSubmitting(false);
      setFormData({ email: "", name: "", purpose: "" });
      setErrors({});
      onClose();
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full mx-4 transform transition-all">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
            aria-label={t("close")}
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>

          <div className="p-6 pb-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Download className="w-6 h-6 text-emerald-700" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{t("title")}</h2>
                <p className="text-sm text-gray-600">{t("subtitle")}</p>
              </div>
            </div>

            <p className="text-gray-700 text-sm leading-relaxed">{t("description")}</p>
          </div>

          <form onSubmit={handleSubmit} className="px-6 pb-6">
            <HoneypotField value={honeypot.value} onChange={honeypot.setValue} />
            <div className="space-y-4">
              <fieldset>
                <legend className="block text-sm font-medium text-gray-700 mb-2">
                  {t("language.label")}
                </legend>
                <div className="grid grid-cols-2 gap-2">
                  {CV_LANGUAGES.map((language) => {
                    const selected = cvLanguage === language;
                    return (
                      <label
                        key={language}
                        className={`flex cursor-pointer items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold transition-colors focus-within:ring-2 focus-within:ring-emerald-600 focus-within:ring-offset-2 ${
                          selected
                            ? "border-emerald-700 bg-emerald-50 text-emerald-800"
                            : "border-gray-300 text-gray-700 hover:border-emerald-600"
                        }`}
                      >
                        <input
                          type="radio"
                          name="cv-language"
                          value={language}
                          checked={selected}
                          onChange={() => setCvLanguage(language)}
                          className="sr-only"
                        />
                        {t(`language.${language}`)}
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              <div>
                <label htmlFor="cv-name" className="block text-sm font-medium text-gray-700 mb-1">
                  {t("fields.name")} <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-gray-500" aria-hidden="true" />
                  <input
                    id="cv-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={formData.name}
                    onChange={(event) => handleInputChange("name", event.target.value)}
                    className={`${INPUT_CLASS} ${errors.name ? "border-red-400" : "border-gray-500"}`}
                    placeholder={t("placeholders.name")}
                  />
                </div>
                {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="cv-email" className="block text-sm font-medium text-gray-700 mb-1">
                  {t("fields.email")} <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-500" aria-hidden="true" />
                  <input
                    id="cv-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={(event) => handleInputChange("email", event.target.value)}
                    className={`${INPUT_CLASS} ${errors.email ? "border-red-400" : "border-gray-500"}`}
                    placeholder={t("placeholders.email")}
                  />
                </div>
                {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="cv-purpose" className="block text-sm font-medium text-gray-700 mb-1">
                  {t("fields.purpose")} <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-gray-500" aria-hidden="true" />
                  <select
                    id="cv-purpose"
                    value={formData.purpose}
                    onChange={(event) => handleInputChange("purpose", event.target.value)}
                    className={`${INPUT_CLASS} appearance-none bg-white ${errors.purpose ? "border-red-400" : "border-gray-500"}`}
                  >
                    <option value="">{t("placeholders.purpose")}</option>
                    <option value="recruitment">{t("purposes.recruitment")}</option>
                    <option value="project_inquiry">{t("purposes.projectInquiry")}</option>
                    <option value="business_partnership">{t("purposes.businessPartnership")}</option>
                    <option value="networking">{t("purposes.networking")}</option>
                    <option value="research">{t("purposes.research")}</option>
                    <option value="other">{t("purposes.other")}</option>
                  </select>
                </div>
                {errors.purpose && <p className="mt-1 text-xs text-red-600">{errors.purpose}</p>}
              </div>
            </div>

            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600">{t("privacy")}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <Button type="button" variant="neutral" size="sm" onClick={onClose} className="flex-1">
                {t("buttons.cancel")}
              </Button>
              <Button type="submit" variant="primary" size="sm" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{t("buttons.downloading")}</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" aria-hidden="true" />
                    <span>{t("buttons.download")}</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
