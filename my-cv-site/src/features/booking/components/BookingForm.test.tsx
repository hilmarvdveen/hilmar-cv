import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BookingForm } from "./BookingForm";
import { BookingFormProvider } from "../context/BookingFormContext";

// next-intl: keys echo back; raw() returns arrays so option lists render.
vi.mock("next-intl", () => {
  const t = ((key: string) => key) as ((key: string) => string) & {
    raw: (key: string) => unknown;
  };
  t.raw = () => [];
  return { useTranslations: () => t };
});

function renderForm() {
  return render(
    <BookingFormProvider>
      <BookingForm />
    </BookingFormProvider>
  );
}

describe("BookingForm step gating", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders step 1 with the continue button disabled until a choice is made", () => {
    renderForm();
    expect(screen.getByText("steps.step1.title")).toBeInTheDocument();
    const cont = screen.getByRole("button", { name: /navigation\.continue/ });
    expect(cont).toBeDisabled();
  });

  it("enables continue once a service and project type are selected", async () => {
    const user = userEvent.setup();
    renderForm();

    await user.click(
      screen.getByRole("button", { name: /steps\.step1\.services\.frontend\.title/ })
    );
    // still disabled: project type not chosen yet
    expect(screen.getByRole("button", { name: /navigation\.continue/ })).toBeDisabled();

    await user.click(
      screen.getByRole("button", { name: /steps\.step1\.projectTypes\.project\.title/ })
    );
    expect(screen.getByRole("button", { name: /navigation\.continue/ })).toBeEnabled();
  });
});
