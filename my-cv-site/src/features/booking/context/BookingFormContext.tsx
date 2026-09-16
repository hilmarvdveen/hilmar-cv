"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  clearBookingDraft,
  readBookingDraft,
  writeBookingDraft,
} from "@/lib/booking/draftStorage";

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
    readBookingDraft((raw) => {
      const restored = restoreBookingState(raw, Date.now());
      if (restored) {
        setDetails(restored.details);
        setStep(restored.step);
      }
      setIsInitialized(true);
    });
  }, []);

  useEffect(() => {
    if (!isInitialized) return;
    if (status === "submitted") {
      clearBookingDraft();
      return;
    }
    const stateToSave: StoredState = { details, step, timestamp: Date.now() };
    writeBookingDraft(JSON.stringify(stateToSave));
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
    clearBookingDraft();
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
