import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { GoogleAnalytics, ANALYTICS_CONSENT_EVENT, readStoredConsent } from "./GoogleAnalytics";

vi.mock("next/script", () => ({
  default: ({ children }: { children?: React.ReactNode }) => <script>{children}</script>,
}));

const labels = { text: "We count visits anonymously.", decline: "Decline", accept: "Accept" };

beforeEach(() => localStorage.clear());
afterEach(() => vi.unstubAllGlobals());

describe("GoogleAnalytics", () => {
  it("shows the consent banner with the given labels when no choice has been made", () => {
    render(<GoogleAnalytics gaId="G-X" labels={labels} />);
    expect(screen.getByText(labels.text)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Accept" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Decline" })).toBeInTheDocument();
  });

  it("grants consent, updates gtag and announces the decision on Accept", async () => {
    const gtag = vi.fn();
    vi.stubGlobal("gtag", gtag);
    const announced = vi.fn();
    window.addEventListener(ANALYTICS_CONSENT_EVENT, announced);
    const user = userEvent.setup();
    render(<GoogleAnalytics gaId="G-X" labels={labels} />);
    await user.click(screen.getByRole("button", { name: "Accept" }));
    expect(localStorage.getItem("ga-consent")).toBe("granted");
    expect(gtag).toHaveBeenCalledWith("consent", "update", { analytics_storage: "granted" });
    expect(announced).toHaveBeenCalledTimes(1);
    window.removeEventListener(ANALYTICS_CONSENT_EVENT, announced);
  });

  it("denies consent on Decline", async () => {
    const user = userEvent.setup();
    render(<GoogleAnalytics gaId="G-X" labels={labels} />);
    await user.click(screen.getByRole("button", { name: "Decline" }));
    expect(localStorage.getItem("ga-consent")).toBe("denied");
    expect(screen.queryByRole("button", { name: "Accept" })).not.toBeInTheDocument();
  });

  it("loads scripts when consent was previously granted", () => {
    localStorage.setItem("ga-consent", "granted");
    const { container } = render(<GoogleAnalytics gaId="G-X" labels={labels} />);
    expect(container.querySelector("script")).toBeTruthy();
  });

  it("renders nothing extra when consent was previously denied", () => {
    localStorage.setItem("ga-consent", "denied");
    render(<GoogleAnalytics gaId="G-X" labels={labels} />);
    expect(screen.queryByRole("button", { name: "Accept" })).not.toBeInTheDocument();
  });

  it("reads the stored choice and treats a broken storage as no choice", () => {
    expect(readStoredConsent()).toBeNull();
    localStorage.setItem("ga-consent", "granted");
    expect(readStoredConsent()).toBe(true);
    localStorage.setItem("ga-consent", "denied");
    expect(readStoredConsent()).toBe(false);
    const getItem = vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    expect(readStoredConsent()).toBeNull();
    getItem.mockRestore();
  });
});
