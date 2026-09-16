const BOOKING_DRAFT_STORAGE_KEY = "hilmar-booking-form-state";

export function readBookingDraft(onDraft: (raw: string | null) => void): void {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(BOOKING_DRAFT_STORAGE_KEY);
  } catch (error) {
    console.warn("Failed to load booking form state from localStorage:", error);
  }
  onDraft(raw);
}

export function writeBookingDraft(raw: string): void {
  try {
    localStorage.setItem(BOOKING_DRAFT_STORAGE_KEY, raw);
  } catch (error) {
    console.warn("Failed to save booking form state to localStorage:", error);
  }
}

export function clearBookingDraft(): void {
  try {
    localStorage.removeItem(BOOKING_DRAFT_STORAGE_KEY);
  } catch (error) {
    console.warn("Failed to clear booking form state from localStorage:", error);
  }
}
