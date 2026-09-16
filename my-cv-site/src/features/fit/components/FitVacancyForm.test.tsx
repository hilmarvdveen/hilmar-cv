import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FitVacancyForm } from "./FitVacancyForm";

vi.mock("next-intl", async () => (await import("@/test/intl")).intlMock());
vi.mock("@/i18n/navigation", () => ({
  Link: ({
    children,
    href,
    ...rest
  }: {
    children: React.ReactNode;
    href: string;
    "data-placement"?: string;
  }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

const renderForm = (overrides: Partial<Parameters<typeof FitVacancyForm>[0]> = {}) => {
  const props = {
    heading: "Paste the vacancy",
    intro: "Paste the whole text or just the requirements section.",
    vacancy: "",
    onVacancyChange: vi.fn(),
    onSubmit: vi.fn((event: { preventDefault: () => void }) => event.preventDefault()),
    isChecking: false,
    failure: null,
    honeypotValue: "",
    onHoneypotChange: vi.fn(),
    ...overrides,
  };
  render(<FitVacancyForm {...props} />);
  return props;
};

describe("FitVacancyForm", () => {
  it("leads the section with its own heading and the intro", () => {
    renderForm();
    expect(
      screen.getByRole("heading", { level: 2, name: "Paste the vacancy" })
    ).toBeInTheDocument();
    expect(
      screen.getByText("Paste the whole text or just the requirements section.")
    ).toBeInTheDocument();
  });

  it("labels the textarea and caps it at ten thousand characters", () => {
    renderForm();
    const field = screen.getByLabelText("form.label");
    expect(field).toHaveAttribute("maxLength", "10000");
    expect(field).toHaveAttribute("placeholder", "form.placeholder");
  });

  it("ties the hint and the counter to the field", () => {
    renderForm();
    const field = screen.getByLabelText("form.label");
    expect(field).toHaveAccessibleDescription("form.hint form.counter");
    expect(field).toHaveAttribute("aria-invalid", "false");
  });

  it("keeps the submit button enabled and in the tab order on arrival", () => {
    renderForm();
    const submit = screen.getByRole("button", { name: /form.submit/ });
    expect(submit).toBeEnabled();
    expect(submit).not.toHaveAttribute("aria-disabled", "true");
  });

  it("marks the button busy without taking it out of the document while a check runs", () => {
    renderForm({ vacancy: "A senior frontend engineer.", isChecking: true });
    const submit = screen.getByRole("button", { name: /form.checking/ });
    expect(submit).toBeEnabled();
    expect(submit).toHaveAttribute("aria-disabled", "true");
    expect(screen.getByText("form.checkingNote")).toBeInTheDocument();
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

  it("warns under the counter once the text reaches the cap", () => {
    renderForm({ vacancy: "x".repeat(10_000) });
    expect(screen.getByText("form.capNote")).toBeInTheDocument();
    expect(screen.getByLabelText("form.label")).toHaveAccessibleDescription(
      "form.hint form.counter form.capNote"
    );
  });

  it("shows a recoverable error as a plain alert tied to the field", () => {
    renderForm({ failure: { message: "Paste a bit more of the vacancy.", recoverable: true } });
    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent("Paste a bit more of the vacancy.");
    expect(screen.queryByRole("link", { name: "report.bookButton" })).toBeNull();
    const field = screen.getByLabelText("form.label");
    expect(field).toHaveAttribute("aria-invalid", "true");
    expect(field).toHaveAccessibleDescription(
      "form.hint form.counter Paste a bit more of the vacancy."
    );
  });

  it("shows a failure as a card with the booking action and the mail link", () => {
    renderForm({ failure: { message: "The check did not come through.", recoverable: false } });
    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent("The check did not come through.");
    const booking = screen.getByRole("link", { name: "report.bookButton" });
    expect(booking).toHaveAttribute("href", "/book");
    expect(booking).toHaveAttribute("data-placement", "fit-failed");
    expect(screen.getByRole("link", { name: "errors.mailAction" })).toHaveAttribute(
      "href",
      "mailto:hilmar@hilmarvanderveen.com"
    );
  });

  it("carries the honeypot field for robots", () => {
    renderForm();
    expect(screen.getByLabelText("Company website (leave empty)")).toBeInTheDocument();
  });
});
