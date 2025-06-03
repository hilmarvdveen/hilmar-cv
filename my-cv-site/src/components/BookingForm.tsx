"use client";

import { useEffect } from "react";
import { useBookingForm } from "@/contexts/BookingFormContext";
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
      title: "Frontend Development",
      description: "React, Next.js, Vue.js applications",
      icon: Code,
      popular: true,
    },
    {
      id: "fullstack",
      title: "Full-Stack Development",
      description: "Complete web applications with backend",
      icon: Zap,
      popular: false,
    },
    {
      id: "design-system",
      title: "Design System",
      description: "Component libraries and style guides",
      icon: Palette,
      popular: false,
    },
    {
      id: "consultation",
      title: "Technical Consultation",
      description: "Architecture review and team mentoring",
      icon: Users,
      popular: false,
    },
  ];

  const projectTypes = [
    {
      id: "project",
      title: "Fixed-Price Project",
      description: "Complete project with defined scope and deliverables",
      icon: Briefcase,
      pricing: "€5k - €50k+",
      benefits: [
        "Fixed timeline",
        "Defined scope",
        "Better value for larger projects",
      ],
    },
    {
      id: "hourly",
      title: "Hourly Consulting",
      description: "Flexible consulting and development work",
      icon: Clock,
      pricing: "€85/hour standard",
      benefits: [
        "Maximum flexibility",
        "Pay as you go",
        "Perfect for ongoing work",
      ],
    },
    {
      id: "hourly-urgent",
      title: "Urgent Consulting",
      description: "Rush projects with 1-2 week delivery",
      icon: Zap,
      pricing: "€150/hour",
      benefits: ["Immediate start", "Priority support", "Fast turnaround"],
      urgent: true,
    },
  ];

  const projectBudgets: ProjectBudget[] = [
    { id: "5k-10k", label: "€5k - €10k" },
    { id: "10k-25k", label: "€10k - €25k" },
    { id: "25k-50k", label: "€25k - €50k" },
    { id: "50k+", label: "€50k+" },
  ];

  const hourlyBudgets: HourlyBudget[] = [
    { id: "10-25h", label: "10-25 hours", estimate: "€850 - €3,750" },
    { id: "25-50h", label: "25-50 hours", estimate: "€2,125 - €7,500" },
    { id: "50-100h", label: "50-100 hours", estimate: "€4,250 - €15,000" },
    { id: "100h+", label: "100+ hours", estimate: "€8,500+" },
  ];

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
  const loadAvailableSlots = async (date: string) => {
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

      // Clear selected time if it's no longer available
      if (
        formData.bookingTime &&
        !data.slots.some(
          (slot: TimeSlot) => slot.value === formData.bookingTime
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
  };

  // Handle date change
  const handleDateChange = (date: string) => {
    updateFormData("bookingDate", date);
    updateFormData("bookingTime", ""); // Clear selected time
    loadAvailableSlots(date);
  };

  // Load slots when component mounts and has a date
  useEffect(() => {
    if (formData.bookingDate) {
      loadAvailableSlots(formData.bookingDate);
    }
  }, []); // Only run on mount

  // Show success message if form was submitted successfully
  if (formState.isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Request Submitted Successfully!
          </h2>

          <p className="text-gray-600 mb-8 leading-relaxed">
            Thank you, <strong>{formData.name}</strong>! I&apos;ve received your
            booking request and will get back to you within 24 hours with a
            detailed proposal.
          </p>

          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-emerald-900 mb-3 flex items-center justify-center">
              <Calendar className="w-5 h-5 mr-2" />
              What&apos;s Next?
            </h3>
            <ul className="text-emerald-700 text-sm space-y-2 text-left max-w-md mx-auto">
              <li className="flex items-start">
                <Clock className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                I&apos;ll review your request and prepare a tailored proposal
              </li>
              <li className="flex items-start">
                <Headphones className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                We&apos;ll schedule a free 30-minute discovery call
              </li>
              <li className="flex items-start">
                <Rocket className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                Start building something amazing together!
              </li>
            </ul>
          </div>

          <div className="text-sm text-gray-500 mb-6">
            You should receive a confirmation email at{" "}
            <strong>{formData.email}</strong> shortly.
          </div>

          <button
            onClick={resetForm}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors duration-200"
          >
            <span>Submit Another Request</span>
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
              What can I help you with?
            </h2>
            <p className="text-gray-600 mb-8">
              Choose the service and engagement type that best fits your needs.
            </p>

            {/* Service Selection */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Service Type
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
                          Popular
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
                Engagement Type
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
                      {type.urgent && (
                        <span className="absolute top-4 right-4 bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded-full">
                          €150/h for urgent
                        </span>
                      )}
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
                            <span className="text-sm font-medium text-blue-600">
                              {type.pricing}
                            </span>
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
              Project Details
            </h2>
            <p className="text-gray-600 mb-8">
              Help me understand your timeline and{" "}
              {isHourlyType ? "estimated hours" : "budget"} expectations.
            </p>

            <div className="space-y-8">
              {/* Date */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-4">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  When do you need this {isHourlyType ? "started" : "completed"}
                  ?
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
                  What time works best for you?
                </label>

                {formState.loadingSlots ? (
                  <div className="w-full p-4 border border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mr-2" />
                    <span className="text-gray-600">
                      Loading available time slots...
                    </span>
                  </div>
                ) : !formData.bookingDate ? (
                  <div className="w-full p-4 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 text-center">
                    Please select a date first to see available time slots
                  </div>
                ) : availableSlots.length === 0 ? (
                  <div className="w-full p-4 border border-gray-300 rounded-lg bg-orange-50 text-orange-700 text-center">
                    No available time slots for this date. Please choose another
                    date.
                  </div>
                ) : (
                  <select
                    value={formData.bookingTime}
                    onChange={(e) =>
                      updateFormData("bookingTime", e.target.value)
                    }
                    className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-colors duration-200"
                  >
                    <option value="">-- Select a time slot --</option>
                    {availableSlots.map((slot) => (
                      <option key={slot.value} value={slot.value}>
                        {slot.label}
                      </option>
                    ))}
                  </select>
                )}

                {availableSlots.length > 0 && (
                  <p className="mt-2 text-sm text-gray-600">
                    {availableSlots.length} available time slot
                    {availableSlots.length !== 1 ? "s" : ""} for{" "}
                    {formData.bookingDate}
                  </p>
                )}
              </div>

              {/* Budget */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-4">
                  <Euro className="w-4 h-4 inline mr-2" />
                  {isHourlyType
                    ? "Estimated hours needed?"
                    : "What's your budget range?"}
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
                      <strong>Hourly rates:</strong>{" "}
                      {isUrgentType
                        ? "€150/hour for urgent projects"
                        : "€85/hour standard rate"}
                    </p>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-4">
                  <MessageSquare className="w-4 h-4 inline mr-2" />
                  Tell me about your project
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    updateFormData("description", e.target.value)
                  }
                  placeholder={`Describe your project goals, current challenges, and what success looks like to you...${
                    isHourlyType
                      ? "\n\nFor hourly work: What specific tasks or areas do you need help with?"
                      : "\n\nFor project work: What are your main requirements and expected deliverables?"
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
              Contact Information
            </h2>
            <p className="text-gray-600 mb-8">
              How can I reach you to discuss your project?
            </p>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    <User className="w-4 h-4 inline mr-2" />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => updateFormData("name", e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-colors duration-200"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    <Building className="w-4 h-4 inline mr-2" />
                    Company
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => updateFormData("company", e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-colors duration-200"
                    placeholder="Company name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData("email", e.target.value)}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-colors duration-200"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateFormData("phone", e.target.value)}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-colors duration-200"
                  placeholder="+31 6 12345678"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Confirmation */}
        {currentStep === 4 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Ready to Submit
            </h2>
            <p className="text-gray-600 mb-8">
              Please review your information before submitting.
            </p>

            <div className="space-y-6">
              {/* Summary */}
              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Service & Type
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
                  <h3 className="font-semibold text-gray-900">Date & Time</h3>
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
                      "Not selected"
                    )}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">Budget</h3>
                  <p className="text-gray-600">
                    {budgetOptions.find((b) => b.id === formData.budget)
                      ?.label || "Not selected"}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">Contact</h3>
                  <p className="text-gray-600">
                    {formData.name} • {formData.email}
                  </p>
                </div>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
                <h3 className="font-semibold text-emerald-900 mb-2 flex items-center">
                  <Rocket className="w-5 h-5 mr-2" />
                  What happens next?
                </h3>
                <ul className="text-emerald-700 text-sm space-y-2">
                  <li className="flex items-start">
                    <Clock className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                    I&apos;ll review your request within 24 hours
                  </li>
                  <li className="flex items-start">
                    <Headphones className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                    Schedule a free 30-minute discovery call
                  </li>
                  <li className="flex items-start">
                    <Star className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                    Provide a detailed proposal and timeline
                  </li>
                  <li className="flex items-start">
                    <Shield className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                    Start building something amazing together
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
              <p className="font-medium">Submission failed</p>
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
          <span>Back</span>
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
            <span>Continue</span>
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
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <span>Send Request</span>
                <Check className="w-4 h-4" />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
