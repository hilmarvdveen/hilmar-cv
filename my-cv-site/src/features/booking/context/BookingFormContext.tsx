"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export type BookingDetails = {
  date: string;
  time: string;
  name: string;
  email: string;
  company: string;
  topic: string;
};

export type BookingStep = 1 | 2 | 3;

export type BookingStatus = "idle" | "submitting" | "submitted";

type BookingFormContextValue = {
  details: BookingDetails;
  step: BookingStep;
  status: BookingStatus;
  submitError: string | null;
  updateDetail: (field: keyof BookingDetails, value: string) => void;
  goToStep: (step: BookingStep) => void;
  setStatus: (status: BookingStatus) => void;
  setSubmitError: (message: string | null) => void;
  resetBooking: () => void;
};

export const INITIAL_BOOKING_DETAILS: BookingDetails = {
  date: "",
  time: "",
  name: "",
  email: "",
  company: "",
  topic: "",
};

const STORAGE_KEY = "hilmar-booking-form-state";
const STORAGE_TTL_MILLISECONDS = 7 * 24 * 60 * 60 * 1000;

type StoredState = {
  details?: Partial<BookingDetails>;
  step?: number;
  timestamp?: number;
};

const BookingFormContext = createContext<BookingFormContextValue | undefined>(
  undefined
);

export function restoreBookingState(
  raw: string | null,
  now: number
): { details: BookingDetails; step: BookingStep } | null {
  if (!raw) return null;
  try {
    const stored = JSON.parse(raw) as StoredState;
    if (!stored.timestamp || now - stored.timestamp > STORAGE_TTL_MILLISECONDS) {
      return null;
    }
    const details: BookingDetails = { ...INITIAL_BOOKING_DETAILS };
    for (const key of Object.keys(INITIAL_BOOKING_DETAILS) as (keyof BookingDetails)[]) {
      const value = stored.details?.[key];
      if (typeof value === "string") details[key] = value;
    }
    let step: BookingStep = 1;
    if (stored.step === 3 && details.time && details.name && details.email) step = 3;
    else if ((stored.step === 2 || stored.step === 3) && details.time) step = 2;
    return { details, step };
  } catch {
    return null;
  }
}

export function BookingFormProvider({ children }: { children: React.ReactNode }) {
  const [details, setDetails] = useState<BookingDetails>(INITIAL_BOOKING_DETAILS);
  const [step, setStep] = useState<BookingStep>(1);
  const [status, setStatus] = useState<BookingStatus>("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const restored = restoreBookingState(
        localStorage.getItem(STORAGE_KEY),
        Date.now()
      );
      if (restored) {
        setDetails(restored.details);
        setStep(restored.step);
      }
    } catch (error) {
      console.warn("Failed to load booking form state from localStorage:", error);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  useEffect(() => {
    if (!isInitialized) return;
    try {
      if (status === "submitted") {
        localStorage.removeItem(STORAGE_KEY);
        return;
      }
      const stateToSave: StoredState = { details, step, timestamp: Date.now() };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (error) {
      console.warn("Failed to save booking form state to localStorage:", error);
    }
  }, [details, step, isInitialized, status]);

  const updateDetail = useCallback((field: keyof BookingDetails, value: string) => {
    setDetails((previous) => ({ ...previous, [field]: value }));
  }, []);

  const goToStep = useCallback((nextStep: BookingStep) => {
    setStep(nextStep);
  }, []);

  const resetBooking = useCallback(() => {
    setDetails(INITIAL_BOOKING_DETAILS);
    setStep(1);
    setStatus("idle");
    setSubmitError(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.warn("Failed to clear booking form state from localStorage:", error);
    }
  }, []);

  const value: BookingFormContextValue = {
    details,
    step,
    status,
    submitError,
    updateDetail,
    goToStep,
    setStatus,
    setSubmitError,
    resetBooking,
  };

  return (
    <BookingFormContext.Provider value={value}>{children}</BookingFormContext.Provider>
  );
}

export function useBookingForm(): BookingFormContextValue {
  const context = useContext(BookingFormContext);
  if (context === undefined) {
    throw new Error("useBookingForm must be used within a BookingFormProvider");
  }
  return context;
}
