"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { X, Download, Mail, MessageSquare, User } from "lucide-react";

interface CVDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  locale: string;
}

interface FormData {
  email: string;
  name: string;
  purpose: string;
}

export const CVDownloadModal = ({
  isOpen,
  onClose,
  locale,
}: CVDownloadModalProps) => {
  const t = useTranslations("cvModal");
  const [formData, setFormData] = useState<FormData>({
    email: "",
    name: "",
    purpose: "",
  });
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Send the lead data to your API
      const response = await fetch("/api/cv-download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          locale,
          timestamp: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        // Open CV in new tab
        window.open("/data/cv/hilmar_van_der_veen_cv.pdf", "_blank");

        // Close modal and reset form
        onClose();
        setFormData({ email: "", name: "", purpose: "" });
        setErrors({});
      } else {
        // If API fails, still allow download but show a message
        console.warn("Lead tracking failed, but allowing download");
        window.open("/data/cv/hilmar_van_der_veen_cv.pdf", "_blank");
        onClose();
      }
    } catch (error) {
      console.error("Error submitting CV download form:", error);
      // On error, still allow download
      window.open("/data/cv/hilmar_van_der_veen_cv.pdf", "_blank");
      onClose();
    } finally {
      setIsSubmitting(false);
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
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full mx-4 transform transition-all">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label={t("close")}
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="p-6 pb-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Download className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {t("title")}
                </h2>
                <p className="text-sm text-gray-600">{t("subtitle")}</p>
              </div>
            </div>

            <p className="text-gray-700 text-sm leading-relaxed">
              {t("description")}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 pb-6">
            <div className="space-y-4">
              {/* Name field */}
              <div>
                <label
                  htmlFor="cv-name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {t("fields.name")} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <input
                    id="cv-name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                      errors.name ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder={t("placeholders.name")}
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-xs text-red-600">{errors.name}</p>
                )}
              </div>

              {/* Email field */}
              <div>
                <label
                  htmlFor="cv-email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {t("fields.email")} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <input
                    id="cv-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                      errors.email ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder={t("placeholders.email")}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-xs text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Purpose field */}
              <div>
                <label
                  htmlFor="cv-purpose"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {t("fields.purpose")} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <select
                    id="cv-purpose"
                    value={formData.purpose}
                    onChange={(e) =>
                      handleInputChange("purpose", e.target.value)
                    }
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 appearance-none bg-white ${
                      errors.purpose ? "border-red-300" : "border-gray-300"
                    }`}
                  >
                    <option value="">{t("placeholders.purpose")}</option>
                    <option value="recruitment">
                      {t("purposes.recruitment")}
                    </option>
                    <option value="project_inquiry">
                      {t("purposes.projectInquiry")}
                    </option>
                    <option value="business_partnership">
                      {t("purposes.businessPartnership")}
                    </option>
                    <option value="networking">
                      {t("purposes.networking")}
                    </option>
                    <option value="research">{t("purposes.research")}</option>
                    <option value="other">{t("purposes.other")}</option>
                  </select>
                </div>
                {errors.purpose && (
                  <p className="mt-1 text-xs text-red-600">{errors.purpose}</p>
                )}
              </div>
            </div>

            {/* Privacy notice */}
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600">{t("privacy")}</p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                {t("buttons.cancel")}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{t("buttons.downloading")}</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>{t("buttons.download")}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
