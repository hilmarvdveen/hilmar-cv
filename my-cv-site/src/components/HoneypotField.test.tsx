import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HoneypotField } from "./HoneypotField";
import { HONEYPOT_FIELD } from "@/lib/security/honeypot";

describe("HoneypotField", () => {
  it("renders a hidden decoy input and forwards changes", async () => {
    const onChange = vi.fn();
    render(<HoneypotField value="" onChange={onChange} />);
    const input = document.getElementById(HONEYPOT_FIELD) as HTMLInputElement;
    expect(input).toBeTruthy();
    expect(input).toHaveAttribute("tabIndex", "-1");
    await userEvent.type(input, "x");
    expect(onChange).toHaveBeenCalledWith("x");
  });

  it("shows the controlled value", () => {
    render(<HoneypotField value="filled" onChange={() => {}} />);
    expect((document.getElementById(HONEYPOT_FIELD) as HTMLInputElement).value).toBe("filled");
    // label is present for the decoy
    expect(screen.getByText(/company website/i)).toBeInTheDocument();
  });
});
