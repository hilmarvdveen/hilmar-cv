import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { GoogleAnalytics } from "./GoogleAnalytics";

vi.mock("next/script", () => ({
  default: ({ children }: { children?: React.ReactNode }) => <script>{children}</script>,
}));

beforeEach(() => localStorage.clear());
afterEach(() => vi.unstubAllGlobals());

describe("GoogleAnalytics", () => {
  it("shows the consent banner when no choice has been made", () => {
    render(<GoogleAnalytics gaId="G-X" />);
    expect(screen.getByText(/Accept/)).toBeInTheDocument();
    expect(screen.getByText(/Decline/)).toBeInTheDocument();
  });

  it("grants consent (and updates gtag) on Accept", async () => {
    const gtag = vi.fn();
    vi.stubGlobal("gtag", gtag);
    const user = userEvent.setup();
    render(<GoogleAnalytics gaId="G-X" />);
    await user.click(screen.getByText(/Accept/));
    expect(localStorage.getItem("ga-consent")).toBe("granted");
    expect(gtag).toHaveBeenCalledWith("consent", "update", { analytics_storage: "granted" });
  });

  it("denies consent on Decline", async () => {
    const user = userEvent.setup();
    render(<GoogleAnalytics gaId="G-X" />);
    await user.click(screen.getByText(/Decline/));
    expect(localStorage.getItem("ga-consent")).toBe("denied");
  });

  it("loads scripts when consent was previously granted", () => {
    localStorage.setItem("ga-consent", "granted");
    const { container } = render(<GoogleAnalytics gaId="G-X" />);
    expect(container.querySelector("script")).toBeTruthy();
  });

  it("renders nothing extra when consent was previously denied", () => {
    localStorage.setItem("ga-consent", "denied");
    render(<GoogleAnalytics gaId="G-X" />);
    expect(screen.queryByText(/Accept/)).not.toBeInTheDocument();
  });
});
