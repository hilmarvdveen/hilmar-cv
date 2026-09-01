import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const { loaded } = vi.hoisted(() => ({ loaded: [] as Promise<unknown>[] }));

vi.mock("next/dynamic", () => ({
  default: (loader: () => Promise<unknown>) => {
    loaded.push(loader());
    const Modal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) =>
      isOpen ? (
        <div role="dialog" aria-label="cv modal">
          <button type="button" onClick={onClose}>
            close
          </button>
        </div>
      ) : null;
    return Modal;
  },
}));

import { CvDownloadTrigger } from "./CvDownloadTrigger";

describe("CvDownloadTrigger", () => {
  it("loads the real modal component on demand", async () => {
    const [component] = await Promise.all(loaded);
    expect(typeof component).toBe("function");
  });

  it("renders the label and keeps the modal out of the tree until clicked", () => {
    render(<CvDownloadTrigger label="Download CV" locale="en" />);
    expect(screen.getByRole("button", { name: "Download CV" })).toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("opens the modal on click and closes it again", async () => {
    const user = userEvent.setup();
    render(<CvDownloadTrigger label="Download CV" locale="nl" />);
    await user.click(screen.getByRole("button", { name: "Download CV" }));
    expect(screen.getByRole("dialog", { name: "cv modal" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "close" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
