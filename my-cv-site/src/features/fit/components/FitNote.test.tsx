import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FitNote, FIT_NOTE_CLAMP_FROM_CHARACTERS } from "./FitNote";

vi.mock("next-intl", async () => (await import("@/test/intl")).intlMock());

const shortNote = "React since 2017, most recently at bol.com.";
const longNote = "React ".repeat(FIT_NOTE_CLAMP_FROM_CHARACTERS).trim();

describe("FitNote", () => {
  it("prints a short note as one paragraph without a control", () => {
    render(<FitNote note={shortNote} requirement="Five years of React" />);
    expect(screen.getByText(shortNote)).toBeInTheDocument();
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("clamps a long note and names what the control opens", () => {
    render(<FitNote note={longNote} requirement="Five years of React" />);
    const toggle = screen.getByRole("button", { name: /noteMore/ });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(toggle).toHaveTextContent("noteSubject");
    expect(toggle.getAttribute("aria-controls")).toBe(screen.getByText(longNote).id);
  });

  it("opens and closes the long note again", async () => {
    const user = userEvent.setup();
    render(<FitNote note={longNote} requirement="Five years of React" />);

    await user.click(screen.getByRole("button", { name: /noteMore/ }));
    expect(screen.getByRole("button", { name: /noteLess/ })).toHaveAttribute(
      "aria-expanded",
      "true"
    );

    await user.click(screen.getByRole("button", { name: /noteLess/ }));
    expect(screen.getByRole("button", { name: /noteMore/ })).toHaveAttribute(
      "aria-expanded",
      "false"
    );
  });
});
