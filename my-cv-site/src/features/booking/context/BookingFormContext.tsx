"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

interface BookingFormData {
  service: string;
  projectType: string;
  bookingDate: string;
  bookingTime: string;
  budget: string;
  description: string;
  name: string;
  email: string;
  phone: string;
  company: string;
}

interface FormState {
  isSubmitting: boolean;
  isSubmitted: boolean;
  error: string | null;
  loadingSlots: boolean;
}

interface BookingFormContextType {
  formData: BookingFormData;
  formState: FormState;
  currentStep: number;
  availableSlots: TimeSlot[];
  updateFormData: (field: keyof BookingFormData, value: string) => void;
  setFormState: React.Dispatch<React.SetStateAction<FormState>>;
  setCurrentStep: (step: number) => void;
  setAvailableSlots: React.Dispatch<React.SetStateAction<TimeSlot[]>>;
  resetForm: () => void;
}

interface TimeSlot {
  value: string;
  label: string;
}

const initialFormData: BookingFormData = {
  service: "",
  projectType: "",
  bookingDate: "",
  bookingTime: "",
  budget: "",
  description: "",
  name: "",
  email: "",
  phone: "",
  company: "",
};

const initialFormState: FormState = {
  isSubmitting: false,
  isSubmitted: false,
  error: null,
  loadingSlots: false,
};

const BookingFormContext = createContext<BookingFormContextType | undefined>(
  undefined
);

const STORAGE_KEY = "hilmar-booking-form-state";

export function BookingFormProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [formData, setFormData] = useState<BookingFormData>(initialFormData);
  const [formState, setFormState] = useState<FormState>(initialFormState);
  const [currentStep, setCurrentStep] = useState(1);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsedState = JSON.parse(saved);
        if (parsedState.formData) {
          setFormData(parsedState.formData);
        }
        if (parsedState.currentStep) {
          setCurrentStep(parsedState.currentStep);
        }
        // Don't restore availableSlots - they should be fetched fresh
      }
    } catch (error) {
      console.warn(
        "Failed to load booking form state from localStorage:",
        error
      );
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (!isInitialized) return;

    try {
      const stateToSave = {
        formData,
        currentStep,
        timestamp: Date.now(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (error) {
      console.warn("Failed to save booking form state to localStorage:", error);
    }
  }, [formData, currentStep, isInitialized]);

  const updateFormData = useCallback(
    (field: keyof BookingFormData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setFormState(initialFormState);
    setCurrentStep(1);
    setAvailableSlots([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.warn(
        "Failed to clear booking form state from localStorage:",
        error
      );
    }
  }, []);

  const contextValue: BookingFormContextType = {
    formData,
    formState,
    currentStep,
    availableSlots,
    updateFormData,
    setFormState,
    setCurrentStep,
    setAvailableSlots,
    resetForm,
  };

  return (
    <BookingFormContext.Provider value={contextValue}>
      {children}
    </BookingFormContext.Provider>
  );
}

export function useBookingForm() {
  const context = useContext(BookingFormContext);
  if (context === undefined) {
    throw new Error("useBookingForm must be used within a BookingFormProvider");
  }
  return context;
}
