import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import {
  BookingFormProvider,
  INITIAL_BOOKING_DETAILS,
  restoreBookingState,
  useBookingForm,
} from "./BookingFormContext";

const NOW = 1_800_000_000_000;
const HOUR = 60 * 60 * 1000;

const saved = (details: Record<string, string>, step: number, ageHours = 1) =>
  JSON.stringify({ details, step, timestamp: NOW - ageHours * HOUR });

describe("restoreBookingState", () => {
  it("returns null for nothing saved, garbage, or an expired draft", () => {
    expect(restoreBookingState(null, NOW)).toBeNull();
    expect(restoreBookingState("{not json", NOW)).toBeNull();
    expect(restoreBookingState(saved({ name: "Jane" }, 1, 24 * 8), NOW)).toBeNull();
    expect(restoreBookingState(JSON.stringify({ details: {} }), NOW)).toBeNull();
  });

  it("keeps a draft that is under seven days old", () => {
    const restored = restoreBookingState(saved({ name: "Jane" }, 1, 24 * 6), NOW);
    expect(restored?.details.name).toBe("Jane");
  });

  it("keeps only known string fields", () => {
    const restored = restoreBookingState(
      saved({ name: "Jane", extra: "ignored", email: 5 as unknown as string }, 1),
      NOW
    );
    expect(restored?.details).toEqual({ ...INITIAL_BOOKING_DETAILS, name: "Jane" });
  });

  it("only restores a step whose prerequisites are present", () => {
    expect(restoreBookingState(saved({}, 3), NOW)?.step).toBe(1);
    expect(restoreBookingState(saved({ time: "2026-10-07T08:00:00.000Z" }, 3), NOW)?.step).toBe(2);
    expect(
      restoreBookingState(
        saved({ time: "2026-10-07T08:00:00.000Z", name: "Jane", email: "j@x.io" }, 3),
        NOW
      )?.step
    ).toBe(3);
  });
});

const Consumer = () => {
  const { details, step, status, updateDetail, goToStep, setStatus } = useBookingForm();
  return (
    <div>
      <output data-testid="state">{`${step}|${status}|${details.name}`}</output>
      <button onClick={() => updateDetail("name", "Jane")}>name</button>
      <button onClick={() => goToStep(2)}>step</button>
      <button onClick={() => setStatus("submitted")}>done</button>
    </div>
  );
};

describe("BookingFormProvider", () => {
  beforeEach(() => localStorage.clear());

  it("restores a saved draft and persists changes", async () => {
    localStorage.setItem(
      "hilmar-booking-form-state",
      JSON.stringify({ details: { name: "Saved" }, step: 1, timestamp: Date.now() })
    );
    render(
      <BookingFormProvider>
        <Consumer />
      </BookingFormProvider>
    );
    expect(await screen.findByText("1|idle|Saved")).toBeInTheDocument();

    await act(async () => {
      screen.getByText("name").click();
      screen.getByText("step").click();
    });
    expect(screen.getByText("2|idle|Jane")).toBeInTheDocument();
    const stored = JSON.parse(localStorage.getItem("hilmar-booking-form-state") ?? "{}");
    expect(stored.details.name).toBe("Jane");
    expect(stored.step).toBe(2);
  });

  it("clears the draft once the booking is submitted", async () => {
    render(
      <BookingFormProvider>
        <Consumer />
      </BookingFormProvider>
    );
    await act(async () => {
      screen.getByText("name").click();
    });
    expect(localStorage.getItem("hilmar-booking-form-state")).not.toBeNull();
    await act(async () => {
      screen.getByText("done").click();
    });
    expect(localStorage.getItem("hilmar-booking-form-state")).toBeNull();
  });

  it("throws when used outside the provider", () => {
    expect(() => render(<Consumer />)).toThrow(/BookingFormProvider/);
  });
});
