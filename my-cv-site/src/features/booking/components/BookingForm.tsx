"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CalendarCheck,
  Check,
} from "lucide-react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { HoneypotField } from "@/components/HoneypotField";
import { useHoneypot } from "@/hooks/useHoneypot";
import {
  firstInvalidField,
  formatDayLabel,
  formatLongDate,
  formatShortDate,
  formatSlotTime,
  getUpcomingWorkingDays,
  toDateKey,
  trackBookingEvent,
  validateDetails,
  type DetailsErrors,
  type DetailsField,
} from "@/lib/booking";
import {
  useBookingForm,
  type BookingDetails,
  type BookingStep,
} from "../context/BookingFormContext";
import { BookingSummary } from "./BookingSummary";

type TimeSlot = {
  value: string;
  label: string;
};

type SlotsStatus = "idle" | "loading" | "ready" | "failed";

const STEP_COUNT = 3;
const VISIBLE_DAYS = 10;
const FURTHEST_BOOKING_DAYS = 90;
export const STEP_HEADING_ID = "booking-step-heading";

const STEP_KEYS: Record<BookingStep, string> = {
  1: "moment",
  2: "details",
  3: "confirm",
};

const INPUT_CLASS =
  "w-full rounded-lg border bg-white px-4 py-3 text-base text-textMain placeholder:text-gray-400 " +
  "transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-600";

const inputClass = (hasError: boolean) =>
  `${INPUT_CLASS} ${hasError ? "border-red-500" : "border-gray-300 focus:border-emerald-600"}`;

function scrollAndFocus(
  element: HTMLElement | null,
  block: ScrollLogicalPosition = "center"
) {
  if (!element) return;
  const reduceMotion =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  element.scrollIntoView?.({ behavior: reduceMotion ? "auto" : "smooth", block });
  element.focus({ preventScroll: true });
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export const BookingForm = () => {
  const t = useTranslations("booking");
  const locale = useLocale();
  const honeypot = useHoneypot();
  const {
    details,
    step,
    status,
    submitError,
    updateDetail,
    goToStep,
    setStatus,
    setSubmitError,
    resetBooking,
  } = useBookingForm();

  const [slotsByDate, setSlotsByDate] = useState<Record<string, TimeSlot[]>>({});
  const [slotsStatus, setSlotsStatus] = useState<SlotsStatus>("idle");
  const [showDateInput, setShowDateInput] = useState(false);
  const [timeError, setTimeError] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<DetailsErrors>({});

  const requestedDate = useRef("");
  const previousStep = useRef<BookingStep>(step);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const slotGroupRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  const workingDays = useMemo(() => getUpcomingWorkingDays(new Date(), VISIBLE_DAYS), []);
  const todayKey = useMemo(() => toDateKey(new Date()), []);
  const furthestKey = useMemo(
    () => toDateKey(addDays(new Date(), FURTHEST_BOOKING_DAYS)),
    []
  );
  const slots = useMemo(
    () => slotsByDate[details.date] ?? [],
    [slotsByDate, details.date]
  );
  const dateInStrip = workingDays.includes(details.date);
  const dateInputVisible = showDateInput || (details.date !== "" && !dateInStrip);

  const loadSlots = useCallback(async (date: string) => {
    requestedDate.current = date;
    setSlotsStatus("loading");
    try {
      const response = await fetch(`/api/booking/slots?date=${date}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Failed to load available slots");
      if (requestedDate.current !== date) return;
      const loaded = (data.slots ?? []) as TimeSlot[];
      setSlotsByDate((prev) => ({ ...prev, [date]: loaded }));
      setSlotsStatus("ready");
      if (loaded.length === 0) trackBookingEvent("booking_slots_empty", { date });
    } catch (error) {
      console.error("Error loading slots:", error);
      if (requestedDate.current !== date) return;
      setSlotsStatus("failed");
      trackBookingEvent("booking_slots_failed", { date });
    }
  }, []);

  useEffect(() => {
    if (!details.date || details.date < todayKey) {
      updateDetail("date", workingDays[0]);
      updateDetail("time", "");
    }
  }, [details.date, todayKey, workingDays, updateDetail]);

  useEffect(() => {
    if (!details.date || details.date < todayKey) return;
    if (slotsByDate[details.date]) {
      setSlotsStatus("ready");
      return;
    }
    void loadSlots(details.date);
  }, [details.date, todayKey, slotsByDate, loadSlots]);

  useEffect(() => {
    if (slotsStatus !== "ready" || !details.time) return;
    if (!slots.some((slot) => slot.value === details.time)) updateDetail("time", "");
  }, [slotsStatus, slots, details.time, updateDetail]);

  useEffect(() => {
    trackBookingEvent("booking_step_view", { step });
    if (previousStep.current !== step) {
      previousStep.current = step;
      scrollAndFocus(headingRef.current, "start");
    }
  }, [step]);

  const selectDay = (date: string) => {
    if (date === details.date) return;
    updateDetail("date", date);
    updateDetail("time", "");
    setTimeError(false);
    trackBookingEvent("booking_day_selected", { date });
  };

  const selectSlot = (value: string) => {
    updateDetail("time", value);
    setTimeError(false);
    trackBookingEvent("booking_slot_selected", { date: details.date });
  };

  const changeField = (field: keyof BookingDetails, value: string) => {
    updateDetail(field, value);
    if (field in fieldErrors) {
      const next = validateDetails({ ...details, [field]: value });
      setFieldErrors((prev) => ({ ...prev, [field]: next[field as DetailsField] }));
    }
  };

  const focusField = (field: DetailsField) => {
    scrollAndFocus(field === "name" ? nameRef.current : emailRef.current);
  };

  const handleNext = () => {
    if (step === 1) {
      if (!details.time) {
        setTimeError(true);
        trackBookingEvent("booking_validation_error", { step, field: "time" });
        const firstSlot = slotGroupRef.current?.querySelector<HTMLElement>("button");
        scrollAndFocus(firstSlot ?? slotGroupRef.current);
        return;
      }
      goToStep(2);
      return;
    }
    if (step === 2) {
      const errors = validateDetails(details);
      const first = firstInvalidField(errors);
      if (first) {
        setFieldErrors(errors);
        trackBookingEvent("booking_validation_error", { step, field: first });
        focusField(first);
        return;
      }
      goToStep(3);
    }
  };

  const handleBack = () => {
    if (step > 1) goToStep((step - 1) as BookingStep);
  };

  const handleSubmit = async () => {
    setStatus("submitting");
    setSubmitError(null);
    trackBookingEvent("booking_submitted");

    const message = [
      `Topic: ${details.topic.trim() || "(not given)"}`,
      `Company: ${details.company.trim() || "(not given)"}`,
      `Requested: ${formatLongDate(details.date, "en")} ${formatSlotTime(details.time)} (Europe/Amsterdam)`,
    ].join("\n");

    try {
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: details.name.trim(),
          email: details.email.trim(),
          date: details.time,
          message,
          ...honeypot.payload(),
        }),
      });
      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        console.error("Booking submission failed:", response.status, result.error);
        setStatus("idle");
        setSubmitError(
          response.status === 429
            ? t("errors.tooManyRequests")
            : t("errors.submissionFailedDetail")
        );
        trackBookingEvent("booking_failed", { status: response.status });
        return;
      }
      setStatus("submitted");
      trackBookingEvent("booking_completed");
    } catch (error) {
      console.error("Booking submission error:", error);
      setStatus("idle");
      setSubmitError(t("errors.submissionFailedDetail"));
      trackBookingEvent("booking_failed", { status: 0 });
    }
  };

  const primaryAction = () => {
    if (status === "submitting") return;
    if (step === 3) void handleSubmit();
    else handleNext();
  };

  if (status === "submitted") {
    return (
      <div className="mx-auto max-w-xl">
        <Card className="p-8 text-center sm:p-10">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
            <CalendarCheck className="h-7 w-7 text-emerald-700" aria-hidden="true" />
          </div>
          <h2 className="mt-5 text-2xl font-extrabold tracking-tight text-textMain">
            {t("success.title")}
          </h2>
          <p className="mt-3 leading-relaxed text-gray-600">
            {t("success.message", { name: details.name.trim() })}
          </p>
          <div className="mt-6 rounded-lg bg-emerald-50 p-5 text-left">
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
              {t("success.detailsLabel")}
            </p>
            <p className="mt-1 text-lg font-bold text-textMain">
              {formatLongDate(details.date, locale)}, {formatSlotTime(details.time)}
            </p>
            <p className="mt-1 text-sm text-gray-600">
              {t("success.email", { email: details.email.trim() })}
            </p>
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button href="/" variant="primary">
              {t("success.home")}
            </Button>
            <Button variant="outline" onClick={resetBooking}>
              {t("success.another")}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const primaryLabel =
    step === 3
      ? status === "submitting"
        ? t("navigation.submitting")
        : t("navigation.confirm")
      : t("navigation.next");

  const selectionText =
    details.date && details.time
      ? `${formatShortDate(details.date, locale)}, ${formatSlotTime(details.time)}`
      : t("summary.whenEmpty");

  const slotStatusText =
    slotsStatus === "loading"
      ? t("flow.moment.loading")
      : slotsStatus === "ready"
        ? t("flow.moment.count", { count: slots.length })
        : "";

  const renderMoment = () => (
    <div>
      <fieldset>
        <legend className="text-sm font-semibold text-textMain">
          {t("flow.moment.dayLabel")}
        </legend>
        <div className="mt-3 grid grid-cols-5 gap-2">
          {workingDays.map((day) => {
            const label = formatDayLabel(day, locale);
            const selected = day === details.date;
            return (
              <button
                key={day}
                type="button"
                aria-pressed={selected}
                aria-label={formatLongDate(day, locale)}
                onClick={() => selectDay(day)}
                className={`flex h-[68px] flex-col items-center justify-center rounded-lg border text-center transition-colors ${
                  selected
                    ? "border-emerald-700 bg-emerald-700 text-white"
                    : "border-gray-200 bg-white text-textMain hover:border-emerald-600"
                }`}
              >
                <span className="text-[11px] font-semibold uppercase leading-none">
                  {label.weekday}
                </span>
                <span className="mt-1 text-lg font-bold leading-none">{label.day}</span>
                <span className="mt-1 text-[11px] leading-none opacity-80">
                  {label.month}
                </span>
              </button>
            );
          })}
        </div>
        <div className="mt-3 min-h-11">
          {dateInputVisible ? (
            <div className="flex flex-wrap items-center gap-3">
              <label htmlFor="booking-other-date" className="text-sm text-gray-600">
                {t("flow.moment.otherDateLabel")}
              </label>
              <input
                id="booking-other-date"
                type="date"
                min={todayKey}
                max={furthestKey}
                value={details.date}
                onChange={(event) => {
                  if (event.target.value) selectDay(event.target.value);
                }}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-textMain focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowDateInput(true)}
              className="text-sm font-semibold text-primary underline underline-offset-4"
            >
              {t("flow.moment.otherDate")}
            </button>
          )}
        </div>
      </fieldset>

      <div className="mt-7">
        <div className="flex items-baseline justify-between gap-4">
          <p id="booking-slot-label" className="text-sm font-semibold text-textMain">
            {t("flow.moment.timeLabel")}
          </p>
          <p className="text-xs text-gray-500" aria-live="polite">
            {slotStatusText}
          </p>
        </div>
        <div
          ref={slotGroupRef}
          role="group"
          aria-labelledby="booking-slot-label"
          aria-describedby={timeError ? "booking-slot-error" : undefined}
          tabIndex={-1}
          className="mt-3 min-h-[200px] scroll-mt-28 outline-none"
        >
          {slotsStatus === "loading" && (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4" aria-hidden="true">
              {Array.from({ length: 8 }, (_, index) => (
                <div key={index} className="h-11 animate-pulse rounded-lg bg-gray-100" />
              ))}
            </div>
          )}
          {slotsStatus === "failed" && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="text-sm text-red-800">{t("errors.loadSlotsFailed")}</p>
              <button
                type="button"
                onClick={() => void loadSlots(details.date)}
                className="mt-3 text-sm font-semibold text-red-800 underline underline-offset-4"
              >
                {t("flow.moment.retry")}
              </button>
            </div>
          )}
          {slotsStatus === "ready" && slots.length === 0 && (
            <p className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
              {t("flow.moment.none")}
            </p>
          )}
          {slotsStatus === "ready" && slots.length > 0 && (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {slots.map((slot) => {
                const selected = slot.value === details.time;
                return (
                  <button
                    key={slot.value}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => selectSlot(slot.value)}
                    className={`inline-flex h-11 items-center justify-center gap-1.5 rounded-lg border text-sm font-semibold transition-colors ${
                      selected
                        ? "border-emerald-700 bg-emerald-700 text-white"
                        : "border-gray-200 bg-white text-textMain hover:border-emerald-600 hover:text-emerald-800"
                    }`}
                  >
                    {selected && <Check className="h-4 w-4" aria-hidden="true" />}
                    {slot.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
        <div className="mt-2 flex items-start justify-between gap-4">
          <p className="text-xs text-gray-500">{t("flow.moment.timezone")}</p>
          <p
            id="booking-slot-error"
            aria-live="polite"
            className="min-h-5 text-right text-sm font-medium text-red-600"
          >
            {timeError ? t("flow.moment.pickTime") : ""}
          </p>
        </div>
      </div>
    </div>
  );

  const renderDetails = () => (
    <div className="space-y-5">
      <Field
        id="booking-name"
        label={t("flow.details.name")}
        error={fieldErrors.name ? t(`flow.details.errors.${fieldErrors.name}`) : ""}
      >
        <input
          ref={nameRef}
          id="booking-name"
          name="name"
          type="text"
          autoComplete="name"
          maxLength={100}
          value={details.name}
          onChange={(event) => changeField("name", event.target.value)}
          aria-invalid={fieldErrors.name ? true : undefined}
          aria-describedby="booking-name-error"
          placeholder={t("flow.details.namePlaceholder")}
          className={inputClass(Boolean(fieldErrors.name))}
        />
      </Field>
      <Field
        id="booking-email"
        label={t("flow.details.email")}
        error={fieldErrors.email ? t(`flow.details.errors.${fieldErrors.email}`) : ""}
      >
        <input
          ref={emailRef}
          id="booking-email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          maxLength={254}
          value={details.email}
          onChange={(event) => changeField("email", event.target.value)}
          aria-invalid={fieldErrors.email ? true : undefined}
          aria-describedby="booking-email-error"
          placeholder={t("flow.details.emailPlaceholder")}
          className={inputClass(Boolean(fieldErrors.email))}
        />
      </Field>
      <Field id="booking-company" label={t("flow.details.company")} optional>
        <input
          id="booking-company"
          name="organization"
          type="text"
          autoComplete="organization"
          maxLength={100}
          value={details.company}
          onChange={(event) => changeField("company", event.target.value)}
          placeholder={t("flow.details.companyPlaceholder")}
          className={inputClass(false)}
        />
      </Field>
      <Field id="booking-topic" label={t("flow.details.topic")} optional>
        <textarea
          id="booking-topic"
          name="topic"
          rows={3}
          maxLength={1000}
          value={details.topic}
          onChange={(event) => changeField("topic", event.target.value)}
          placeholder={t("flow.details.topicPlaceholder")}
          className={`${inputClass(false)} resize-none`}
        />
      </Field>
    </div>
  );

  const renderConfirm = () => (
    <div>
      <dl className="divide-y divide-gray-200">
        <ConfirmRow
          label={t("flow.confirm.when")}
          editLabel={t("flow.confirm.edit")}
          onEdit={() => goToStep(1)}
        >
          {formatLongDate(details.date, locale)}, {formatSlotTime(details.time)}
        </ConfirmRow>
        <ConfirmRow
          label={t("flow.confirm.who")}
          editLabel={t("flow.confirm.edit")}
          onEdit={() => goToStep(2)}
        >
          {details.name.trim()}
          {details.company.trim() && `, ${details.company.trim()}`}
          <span className="block font-normal text-gray-600">{details.email.trim()}</span>
        </ConfirmRow>
        <ConfirmRow
          label={t("flow.confirm.topic")}
          editLabel={t("flow.confirm.edit")}
          onEdit={() => goToStep(2)}
        >
          {details.topic.trim() || (
            <span className="font-normal text-gray-500">{t("flow.confirm.topicEmpty")}</span>
          )}
        </ConfirmRow>
      </dl>
      <p className="mt-5 text-sm leading-relaxed text-gray-600">
        {t("flow.confirm.afterConfirm", { email: details.email.trim() })}
      </p>
      {submitError && (
        <div
          role="alert"
          className="mt-5 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4"
        >
          <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" aria-hidden="true" />
          <div>
            <p className="font-semibold text-red-800">{t("errors.submissionFailed")}</p>
            <p className="mt-1 text-sm text-red-800">{submitError}</p>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        primaryAction();
      }}
      className="pb-24 lg:pb-0"
    >
      <HoneypotField value={honeypot.value} onChange={honeypot.setValue} />
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-10 lg:items-start">
        <div>
          <div className="scroll-mt-28">
            <p className="text-xs font-bold uppercase tracking-widest text-primary">
              {t("flow.stepLabel", { current: step, total: STEP_COUNT })}
            </p>
            <h2
              ref={headingRef}
              id={STEP_HEADING_ID}
              tabIndex={-1}
              className="mt-1 scroll-mt-28 text-2xl font-extrabold tracking-tight text-textMain outline-none sm:text-3xl"
            >
              {t(`flow.steps.${STEP_KEYS[step]}`)}
            </h2>
            <div className="mt-4 grid grid-cols-3 gap-1.5" aria-hidden="true">
              {Array.from({ length: STEP_COUNT }, (_, index) => (
                <div
                  key={index}
                  className={`h-1.5 rounded-full ${
                    index < step ? "bg-emerald-600" : "bg-gray-200"
                  }`}
                />
              ))}
            </div>
          </div>

          <Card className="mt-6 p-5 sm:p-8">
            {step === 1 && renderMoment()}
            {step === 2 && renderDetails()}
            {step === 3 && renderConfirm()}
          </Card>

          <div className="mt-6 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                disabled={status === "submitting"}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-textMain disabled:opacity-50"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                {t("navigation.back")}
              </button>
            ) : (
              <span />
            )}
            <div className="hidden lg:block">
              <Button type="submit" variant="primary" disabled={status === "submitting"}>
                {primaryLabel}
                {step < 3 && <ArrowRight className="h-4 w-4" aria-hidden="true" />}
              </Button>
            </div>
          </div>

          <div className="mt-8 lg:hidden">
            <BookingSummary details={details} compact />
          </div>
        </div>

        <aside className="hidden lg:block lg:sticky lg:top-28">
          <BookingSummary details={details} />
        </aside>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-7xl items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
              {t("summary.when")}
            </p>
            <p className="truncate text-sm font-semibold text-textMain">{selectionText}</p>
          </div>
          <Button type="submit" variant="primary" size="sm" disabled={status === "submitting"}>
            {primaryLabel}
            {step < 3 && <ArrowRight className="h-4 w-4" aria-hidden="true" />}
          </Button>
        </div>
      </div>
    </form>
  );
};

type FieldProps = {
  id: string;
  label: string;
  optional?: boolean;
  error?: string;
  children: ReactNode;
};

const Field = ({ id, label, optional = false, error = "", children }: FieldProps) => {
  const t = useTranslations("booking.flow.details");
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-textMain">
        {label}
        {optional && (
          <span className="ml-1.5 font-normal text-gray-500">({t("optional")})</span>
        )}
      </label>
      <div className="mt-1.5">{children}</div>
      <p
        id={`${id}-error`}
        aria-live="polite"
        className="mt-1 min-h-5 text-sm font-medium text-red-600"
      >
        {error}
      </p>
    </div>
  );
};

type ConfirmRowProps = {
  label: string;
  editLabel: string;
  onEdit: () => void;
  children: ReactNode;
};

const ConfirmRow = ({ label, editLabel, onEdit, children }: ConfirmRowProps) => (
  <div className="flex items-start justify-between gap-4 py-4 first:pt-0 last:pb-0">
    <div className="min-w-0">
      <dt className="text-xs font-semibold uppercase tracking-wider text-gray-500">{label}</dt>
      <dd className="mt-1 text-base font-semibold text-textMain">{children}</dd>
    </div>
    <button
      type="button"
      onClick={onEdit}
      className="flex-shrink-0 text-sm font-semibold text-primary underline underline-offset-4"
      aria-label={`${editLabel}: ${label}`}
    >
      {editLabel}
    </button>
  </div>
);
