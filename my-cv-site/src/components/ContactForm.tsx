import { useState } from "react";
import { useTranslation } from "next-i18next";

export default function ContactForm() {
  const { t } = useTranslation("contact");
  const interestTags = t("form.interests", { returnObjects: true }) as string[];

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
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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
    <form
      onSubmit={handleSubmit}
      className="bg-[#f1f5f9] p-6 rounded-lg shadow space-y-6"
    >
      <h2 className="text-xl font-semibold">{t("form.title", "Contact me")}</h2>

      <div>
        <p className="text-sm font-medium text-gray-800 mb-2">
          {t("form.interestsLabel")}
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {interestTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className={`px-4 py-1 rounded-full text-sm font-medium transition ${
                selectedTags.includes(tag)
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="sr-only" htmlFor="name">
          {t("form.name")}
        </label>
        <input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          type="text"
          placeholder={t("form.name")}
          className="w-full border border-gray-300 rounded px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-600"
          required
        />
      </div>

      <div>
        <label className="sr-only" htmlFor="email">
          {t("form.email")}
        </label>
        <input
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          type="email"
          placeholder={t("form.email")}
          className="w-full border border-gray-300 rounded px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-600"
          required
        />
      </div>

      <div>
        <label className="sr-only" htmlFor="message">
          {t("form.message")}
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder={t("form.message")}
          className="w-full border border-gray-300 rounded px-4 py-2 text-sm h-32 resize-none focus:ring-2 focus:ring-emerald-600"
          required
        />
      </div>

      {successMessage && (
        <p className="text-green-600 text-sm font-medium">{successMessage}</p>
      )}
      {errorMessage && (
        <p className="text-red-600 text-sm font-medium">{errorMessage}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full font-semibold py-2 rounded transition ${
          isSubmitting
            ? "bg-emerald-300 cursor-not-allowed"
            : "bg-emerald-600 hover:bg-emerald-500 text-white"
        }`}
      >
        {isSubmitting ? t("form.sending") : t("form.submit")}
      </button>
    </form>
  );
}
