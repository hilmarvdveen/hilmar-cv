import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProseDetails } from "./ProseDetails";

describe("ProseDetails", () => {
  it("is closed by default and shows its content after the summary is activated", async () => {
    const user = userEvent.setup();
    render(
      <ProseDetails summary="More detail">
        <p>Hidden until opened</p>
      </ProseDetails>,
    );
    const summary = screen.getByText("More detail");
    const details = summary.closest("details");
    expect(details).not.toHaveAttribute("open");
    await user.click(summary);
    expect(details).toHaveAttribute("open");
    expect(screen.getByText("Hidden until opened")).toBeVisible();
  });
});
