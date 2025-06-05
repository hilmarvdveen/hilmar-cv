"use client";

import { useEffect, useCallback } from "react";
import { useBookingForm } from "@/contexts/BookingFormContext";
import { useTranslations } from "next-intl";
import {
  ChevronRight,
  ChevronLeft,
  Check,
  Code,
  Palette,
  Zap,
  Users,
  Calendar,
  Euro,
  Mail,
  Phone,
  Building,
  User,
  MessageSquare,
  Clock,
  Briefcase,
  Star,
  Rocket,
  Shield,
  Headphones,
  CheckCircle,
} from "lucide-react";

interface ProjectBudget {
  id: string;
  label: string;
}

interface HourlyBudget {
  id: string;
  label: string;
  estimate: string;
}

interface TimeSlot {
  value: string; // ISO string
  label: string; // formatted time like "09:00"
}

export const BookingForm = () => {
  const t = useTranslations("booking.form");

  const {
    formData,
    formState,
    currentStep,
    availableSlots,
    updateFormData,
    setFormState,
    setCurrentStep,
    setAvailableSlots,
    resetForm,
  } = useBookingForm();

  const services = [
    {
      id: "frontend",
      title: t("steps.step1.services.frontend.title"),
      description: t("steps.step1.services.frontend.description"),
      icon: Code,
      popular: true,
    },
    {
      id: "fullstack",
      title: t("steps.step1.services.fullstack.title"),
      description: t("steps.step1.services.fullstack.description"),
      icon: Zap,
      popular: false,
    },
    {
      id: "design-system",
      title: t("steps.step1.services.designSystem.title"),
      description: t("steps.step1.services.designSystem.description"),
      icon: Palette,
      popular: false,
    },
    {
      id: "consultation",
      title: t("steps.step1.services.consultation.title"),
      description: t("steps.step1.services.consultation.description"),
      icon: Users,
      popular: false,
    },
  ];

  const projectTypes = [
    {
      id: "project",
      title: t("steps.step1.projectTypes.project.title"),
      description: t("steps.step1.projectTypes.project.description"),
      icon: Briefcase,
      pricing: t("steps.step1.projectTypes.project.pricing"),
      benefits: t.raw("steps.step1.projectTypes.project.benefits") as string[],
    },
    {
      id: "hourly",
      title: t("steps.step1.projectTypes.hourly.title"),
      description: t("steps.step1.projectTypes.hourly.description"),
      icon: Clock,
      pricing: t("steps.step1.projectTypes.hourly.pricing"),
      benefits: t.raw("steps.step1.projectTypes.hourly.benefits") as string[],
    },
    {
      id: "hourly-urgent",
      title: t("steps.step1.projectTypes.hourlyUrgent.title"),
      description: t("steps.step1.projectTypes.hourlyUrgent.description"),
      icon: Zap,
      pricing: t("steps.step1.projectTypes.hourlyUrgent.pricing"),
      benefits: t.raw(
        "steps.step1.projectTypes.hourlyUrgent.benefits"
      ) as string[],
      urgent: true,
    },
  ];

  const projectBudgets: ProjectBudget[] = t.raw(
    "steps.step2.budgets.project"
  ) as ProjectBudget[];
  const hourlyBudgets: HourlyBudget[] = t.raw(
    "steps.step2.budgets.hourly"
  ) as HourlyBudget[];

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.service !== "" && formData.projectType !== "";
      case 2:
        return (
          formData.bookingDate !== "" &&
          formData.bookingTime !== "" &&
          formData.budget !== ""
        );
      case 3:
        return formData.name !== "" && formData.email !== "";
      case 4:
        return true;
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    setFormState({
      isSubmitting: true,
      isSubmitted: false,
      error: null,
      loadingSlots: false,
    });

    try {
      // Get selected options labels for better readability
      const selectedService = services.find((s) => s.id === formData.service);
      const selectedProjectType = projectTypes.find(
        (t) => t.id === formData.projectType
      );

      // Prepare the booking data
      const bookingData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || "",
        company: formData.company || "",
        service: selectedService?.title || formData.service,
        projectType: selectedProjectType?.title || formData.projectType,
        bookingDate: formData.bookingDate,
        bookingTime: formData.bookingTime,
        budget: formData.budget,
        description: formData.description,
        date: formData.bookingTime,
        message: `
Service: ${selectedService?.title || formData.service}
Project Type: ${selectedProjectType?.title || formData.projectType}
Date: ${formData.bookingDate}
Time: ${new Date(formData.bookingTime).toLocaleTimeString("nl-NL", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Europe/Amsterdam",
        })}
Budget: ${formData.budget}
Company: ${formData.company || "Not specified"}
Phone: ${formData.phone || "Not provided"}

Project Description:
${formData.description}
        `.trim(),
      };

      const response = await fetch("/api/booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit booking request");
      }

      // Success!
      setFormState({
        isSubmitting: false,
        isSubmitted: true,
        error: null,
        loadingSlots: false,
      });
    } catch (error) {
      console.error("Booking submission error:", error);
      setFormState({
        isSubmitting: false,
        isSubmitted: false,
        error:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
        loadingSlots: false,
      });
    }
  };

  const isHourlyType =
    formData.projectType === "hourly" ||
    formData.projectType === "hourly-urgent";
  const isUrgentType = formData.projectType === "hourly-urgent";
  const budgetOptions = isHourlyType ? hourlyBudgets : projectBudgets;

  // Load available slots when date changes
  const loadAvailableSlots = useCallback(
    async (date: string, currentBookingTime: string) => {
      if (!date) {
        setAvailableSlots([]);
        return;
      }

      setFormState((prev) => ({ ...prev, loadingSlots: true }));

      try {
        const response = await fetch(`/api/booking/slots?date=${date}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to load available slots");
        }

        setAvailableSlots(data.slots || []);

        if (
          currentBookingTime &&
          !data.slots.some(
            (slot: TimeSlot) => slot.value === currentBookingTime
          )
        ) {
          updateFormData("bookingTime", "");
        }
      } catch (error) {
        console.error("Error loading slots:", error);
        setAvailableSlots([]);
        setFormState((prev) => ({
          ...prev,
          error:
            error instanceof Error
              ? error.message
              : "Failed to load available time slots",
        }));
      } finally {
        setFormState((prev) => ({ ...prev, loadingSlots: false }));
      }
    },
    [setAvailableSlots, setFormState, updateFormData]
  );

  const handleDateChange = (date: string) => {
    updateFormData("bookingDate", date);
    updateFormData("bookingTime", ""); // Clear selected time
    loadAvailableSlots(date, formData.bookingTime);
  };

  useEffect(() => {
    if (formData.bookingDate) {
      loadAvailableSlots(formData.bookingDate, formData.bookingTime);
    }
  }, [formData.bookingDate, formData.bookingTime, loadAvailableSlots]);

  // Show success message if form was submitted successfully
  if (formState.isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {t("success.title")}
          </h2>

          <p className="text-gray-600 mb-8 leading-relaxed">
            {t("success.message", { name: formData.name })}
          </p>

          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-emerald-900 mb-3 flex items-center justify-center">
              <Calendar className="w-5 h-5 mr-2" />
              {t("success.nextSteps.title")}
            </h3>
            <ul className="text-emerald-700 text-sm space-y-2 text-left max-w-md mx-auto">
              {(t.raw("success.nextSteps.steps") as string[]).map(
                (step, index) => (
                  <li key={index} className="flex items-start">
                    {index === 0 && (
                      <Clock className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                    )}
                    {index === 1 && (
                      <Headphones className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                    )}
                    {index === 2 && (
                      <Rocket className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                    )}
                    {step}
                  </li>
                )
              )}
            </ul>
          </div>

          <div className="text-sm text-gray-500 mb-6">
            {t("success.emailConfirmation", { email: formData.email })}
          </div>

          <button
            onClick={resetForm}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors duration-200"
          >
            <span>{t("success.submitAnother")}</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                currentStep >= step
                  ? "bg-emerald-600 border-emerald-600 text-white"
                  : "border-gray-300 text-gray-400"
              }`}
            >
              {currentStep > step ? (
                <Check className="w-5 h-5" />
              ) : (
                <span className="text-sm font-semibold">{step}</span>
              )}
            </div>
          ))}
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-600 transition-all duration-500 ease-out"
            style={{ width: `${(currentStep / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
        {/* Step 1: Service & Project Type Selection */}
        {currentStep === 1 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {t("steps.step1.title")}
            </h2>
            <p className="text-gray-600 mb-8">{t("steps.step1.description")}</p>

            {/* Service Selection */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {t("steps.step1.serviceType")}
              </h3>
              <div className="space-y-3">
                {services.map((service) => {
                  const Icon = service.icon;
                  return (
                    <button
                      key={service.id}
                      onClick={() => updateFormData("service", service.id)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 relative ${
                        formData.service === service.id
                          ? "border-emerald-600 bg-emerald-50"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {service.popular && (
                        <span className="absolute top-3 right-3 bg-emerald-600 text-white text-xs px-2 py-1 rounded-full">
                          {t("steps.step1.popular")}
                        </span>
                      )}
                      <div className="flex items-center space-x-3">
                        <div
                          className={`p-2 rounded-lg ${
                            formData.service === service.id
                              ? "bg-emerald-600 text-white"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {service.title}
                          </h4>
                          <p className="text-gray-600 text-sm">
                            {service.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Project Type Selection */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {t("steps.step1.engagementType")}
              </h3>
              <div className="space-y-4">
                {projectTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.id}
                      onClick={() => updateFormData("projectType", type.id)}
                      className={`w-full text-left p-6 rounded-lg border-2 transition-all duration-200 relative ${
                        formData.projectType === type.id
                          ? "border-blue-600 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-start space-x-4">
                        <div
                          className={`p-3 rounded-lg ${
                            formData.projectType === type.id
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          <Icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-semibold text-gray-900">
                              {type.title}
                            </h4>
                            {type.urgent ? (
                              <span className="bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded-full">
                                {type.pricing}
                              </span>
                            ) : (
                              <span className="text-sm font-medium text-blue-600">
                                {type.pricing}
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 text-sm mb-3">
                            {type.description}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {type.benefits.map((benefit, index) => (
                              <span
                                key={index}
                                className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                              >
                                {benefit}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Project Details */}
        {currentStep === 2 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {t("steps.step2.title")}
            </h2>
            <p className="text-gray-600 mb-8">{t("steps.step2.description")}</p>

            <div className="space-y-8">
              {/* Date */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-4">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  {t("steps.step2.when")}
                </label>
                <input
                  type="date"
                  value={formData.bookingDate}
                  onChange={(e) => handleDateChange(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-colors duration-200"
                />
              </div>

              {/* Time */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-4">
                  <Clock className="w-4 h-4 inline mr-2" />
                  {t("steps.step2.whatTimeWorksBest")}
                </label>

                {formState.loadingSlots ? (
                  <div className="w-full p-4 border border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mr-2" />
                    <span className="text-gray-600">
                      {t("steps.step2.loadingSlots")}
                    </span>
                  </div>
                ) : !formData.bookingDate ? (
                  <div className="w-full p-4 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 text-center">
                    {t("steps.step2.pleaseSelectDate")}
                  </div>
                ) : availableSlots.length === 0 ? (
                  <div className="w-full p-4 border border-gray-300 rounded-lg bg-orange-50 text-orange-700 text-center">
                    {t("steps.step2.noAvailableTimeSlots")}
                  </div>
                ) : (
                  <select
                    value={formData.bookingTime}
                    onChange={(e) =>
                      updateFormData("bookingTime", e.target.value)
                    }
                    className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-colors duration-200"
                  >
                    <option value="">
                      -- {t("steps.step2.selectTimeSlot")} --
                    </option>
                    {availableSlots.map((slot) => (
                      <option key={slot.value} value={slot.value}>
                        {slot.label}
                      </option>
                    ))}
                  </select>
                )}

                {availableSlots.length > 0 && (
                  <p className="mt-2 text-sm text-gray-600">
                    {availableSlots.length}{" "}
                    {t("steps.step2.availableTimeSlots")}
                  </p>
                )}
              </div>

              {/* Budget */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-4">
                  <Euro className="w-4 h-4 inline mr-2" />
                  {t("steps.step2.budget")}
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {budgetOptions.map((budget) => (
                    <button
                      key={budget.id}
                      onClick={() => updateFormData("budget", budget.id)}
                      className={`p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                        formData.budget === budget.id
                          ? "border-blue-600 bg-blue-50 text-blue-700"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{budget.label}</span>
                        {isHourlyType && "estimate" in budget && (
                          <span className="text-sm text-gray-500">
                            {(budget as HourlyBudget).estimate}
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
                {isHourlyType && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700">
                      <Clock className="w-4 h-4 inline mr-1" />
                      <strong>{t("steps.step2.hourlyRates")}:</strong>{" "}
                      {isUrgentType
                        ? t("steps.step2.rateInfo.urgent")
                        : t("steps.step2.rateInfo.standard")}
                    </p>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-4">
                  <MessageSquare className="w-4 h-4 inline mr-2" />
                  {t("steps.step2.tellAboutProject")}
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    updateFormData("description", e.target.value)
                  }
                  placeholder={`${t("steps.step2.descriptionPlaceholder.base")}${
                    isHourlyType
                      ? t("steps.step2.descriptionPlaceholder.hourly")
                      : t("steps.step2.descriptionPlaceholder.project")
                  }`}
                  className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-colors duration-200"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Contact Information */}
        {currentStep === 3 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {t("steps.step3.title")}
            </h2>
            <p className="text-gray-600 mb-8">{t("steps.step3.description")}</p>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    <User className="w-4 h-4 inline mr-2" />
                    {t("steps.step3.fullName")} *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => updateFormData("name", e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-colors duration-200"
                    placeholder={t("steps.step3.fullNamePlaceholder")}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    <Building className="w-4 h-4 inline mr-2" />
                    {t("steps.step3.company")}
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => updateFormData("company", e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-colors duration-200"
                    placeholder={t("steps.step3.companyPlaceholder")}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  <Mail className="w-4 h-4 inline mr-2" />
                  {t("steps.step3.email")} *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData("email", e.target.value)}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-colors duration-200"
                  placeholder={t("steps.step3.emailPlaceholder")}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  <Phone className="w-4 h-4 inline mr-2" />
                  {t("steps.step3.phone")}
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateFormData("phone", e.target.value)}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-colors duration-200"
                  placeholder={t("steps.step3.phonePlaceholder")}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Confirmation */}
        {currentStep === 4 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {t("steps.step4.title")}
            </h2>
            <p className="text-gray-600 mb-8">{t("steps.step4.description")}</p>

            <div className="space-y-6">
              {/* Summary */}
              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {t("steps.step4.serviceType")}
                  </h3>
                  <p className="text-gray-600">
                    {services.find((s) => s.id === formData.service)?.title} •{" "}
                    {
                      projectTypes.find((t) => t.id === formData.projectType)
                        ?.title
                    }
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">
                    {t("steps.step4.dateTime")}
                  </h3>
                  <p className="text-gray-600">
                    {formData.bookingDate && formData.bookingTime ? (
                      <>
                        {new Date(formData.bookingDate).toLocaleDateString(
                          "nl-NL"
                        )}{" "}
                        at{" "}
                        {new Date(formData.bookingTime).toLocaleTimeString(
                          "nl-NL",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                            timeZone: "Europe/Amsterdam",
                          }
                        )}
                      </>
                    ) : (
                      t("steps.step4.notSelected")
                    )}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">
                    {t("steps.step4.budget")}
                  </h3>
                  <p className="text-gray-600">
                    {budgetOptions.find((b) => b.id === formData.budget)
                      ?.label || t("steps.step4.notSelected")}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">
                    {t("steps.step4.contact")}
                  </h3>
                  <p className="text-gray-600">
                    {formData.name} • {formData.email}
                  </p>
                </div>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
                <h3 className="font-semibold text-emerald-900 mb-2 flex items-center">
                  <Rocket className="w-5 h-5 mr-2" />
                  {t("steps.step4.whatHappensNext")}
                </h3>
                <ul className="text-emerald-700 text-sm space-y-2">
                  <li className="flex items-start">
                    <Clock className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                    {t("steps.step4.reviewRequest")}
                  </li>
                  <li className="flex items-start">
                    <Headphones className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                    {t("steps.step4.scheduleCall")}
                  </li>
                  <li className="flex items-start">
                    <Star className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                    {t("steps.step4.provideProposal")}
                  </li>
                  <li className="flex items-start">
                    <Shield className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                    {t("steps.step4.startBuilding")}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {formState.error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 text-red-600">⚠️</div>
            <div className="text-red-800">
              <p className="font-medium">{t("errors.submissionFailed")}</p>
              <p className="text-sm">{formState.error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <button
          onClick={prevStep}
          disabled={currentStep === 1 || formState.isSubmitting}
          className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
            currentStep === 1 || formState.isSubmitting
              ? "text-gray-400 cursor-not-allowed"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>{t("navigation.back")}</span>
        </button>

        {currentStep < 4 ? (
          <button
            onClick={nextStep}
            disabled={!canProceed() || formState.isSubmitting}
            className={`flex items-center space-x-2 px-8 py-3 rounded-lg font-medium transition-all duration-200 ${
              canProceed() && !formState.isSubmitting
                ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-md hover:shadow-lg"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            <span>{t("navigation.continue")}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={formState.isSubmitting}
            className={`flex items-center space-x-2 px-8 py-3 rounded-lg font-medium transition-all duration-200 shadow-md ${
              formState.isSubmitting
                ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                : "bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-lg"
            }`}
          >
            {formState.isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>{t("navigation.submitting")}</span>
              </>
            ) : (
              <>
                <span>{t("navigation.sendRequest")}</span>
                <Check className="w-4 h-4" />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
