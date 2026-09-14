import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FitVacancyForm } from "./FitVacancyForm";

vi.mock("next-intl", async () => (await import("@/test/intl")).intlMock());

const renderForm = (overrides: Partial<Parameters<typeof FitVacancyForm>[0]> = {}) => {
  const props = {
    vacancy: "",
    onVacancyChange: vi.fn(),
    onSubmit: vi.fn((event: { preventDefault: () => void }) => event.preventDefault()),
    isChecking: false,
    errorMessage: "",
    honeypotValue: "",
    onHoneypotChange: vi.fn(),
    ...overrides,
  };
  render(<FitVacancyForm {...props} />);
  return props;
};

describe("FitVacancyForm", () => {
  it("labels the textarea and caps it at ten thousand characters", () => {
    renderForm();
    const field = screen.getByLabelText("form.label");
    expect(field).toHaveAttribute("maxLength", "10000");
    expect(field).toHaveAttribute("placeholder", "form.placeholder");
  });

  it("disables the submit button while the vacancy is empty", () => {
    renderForm();
    expect(screen.getByRole("button", { name: /form.submit/ })).toBeDisabled();
  });

  it("enables the submit button once there is text", () => {
    renderForm({ vacancy: "A senior frontend engineer with React." });
    expect(screen.getByRole("button", { name: /form.submit/ })).toBeEnabled();
  });

  it("shows the checking label and disables the button while a check runs", () => {
    renderForm({ vacancy: "A senior frontend engineer.", isChecking: true });
    expect(screen.getByRole("button", { name: /form.checking/ })).toBeDisabled();
  });

  it("reports every keystroke to the parent", async () => {
    const user = userEvent.setup();
    const props = renderForm();
    await user.type(screen.getByLabelText("form.label"), "Re");
    expect(props.onVacancyChange).toHaveBeenCalledTimes(2);
  });

  it("submits the form", async () => {
    const user = userEvent.setup();
    const props = renderForm({ vacancy: "A senior frontend engineer with React." });
    await user.click(screen.getByRole("button", { name: /form.submit/ }));
    expect(props.onSubmit).toHaveBeenCalled();
  });

  it("shows an error as an alert", () => {
    renderForm({ errorMessage: "Paste a bit more of the vacancy." });
    expect(screen.getByRole("alert")).toHaveTextContent("Paste a bit more of the vacancy.");
  });

  it("carries the honeypot field for robots", () => {
    renderForm();
    expect(screen.getByLabelText("Company website (leave empty)")).toBeInTheDocument();
  });
});
