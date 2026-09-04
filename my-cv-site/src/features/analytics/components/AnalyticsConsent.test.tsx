import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AnalyticsConsent, ANALYTICS_CONSENT_EVENT, readStoredConsent } from "./AnalyticsConsent";

const labels = { text: "We count visits anonymously.", decline: "Decline", accept: "Accept" };

beforeEach(() => localStorage.clear());

describe("AnalyticsConsent", () => {
  it("shows the banner with the given labels when no choice has been made", () => {
    render(<AnalyticsConsent labels={labels} />);
    expect(screen.getByText(labels.text)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Accept" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Decline" })).toBeInTheDocument();
  });

  it("sits above the mobile booking bar through the shared offset variable", () => {
    render(<AnalyticsConsent labels={labels} />);
    expect(screen.getByRole("region", { name: labels.accept })).toHaveClass(
      "bottom-[var(--bottom-bar-offset,0px)]"
    );
  });

  it("stores the grant, announces it and hides the banner on Accept", async () => {
    const announced = vi.fn();
    window.addEventListener(ANALYTICS_CONSENT_EVENT, announced);
    const user = userEvent.setup();
    render(<AnalyticsConsent labels={labels} />);
    await user.click(screen.getByRole("button", { name: "Accept" }));
    expect(localStorage.getItem("analytics-consent")).toBe("granted");
    expect(announced).toHaveBeenCalledTimes(1);
    expect((announced.mock.calls[0][0] as CustomEvent<boolean>).detail).toBe(true);
    expect(screen.queryByRole("button", { name: "Accept" })).not.toBeInTheDocument();
    window.removeEventListener(ANALYTICS_CONSENT_EVENT, announced);
  });

  it("stores the refusal on Decline", async () => {
    const user = userEvent.setup();
    render(<AnalyticsConsent labels={labels} />);
    await user.click(screen.getByRole("button", { name: "Decline" }));
    expect(localStorage.getItem("analytics-consent")).toBe("denied");
    expect(screen.queryByRole("button", { name: "Decline" })).not.toBeInTheDocument();
  });

  it("stays hidden when a choice was stored earlier", () => {
    localStorage.setItem("analytics-consent", "granted");
    render(<AnalyticsConsent labels={labels} />);
    expect(screen.queryByRole("button", { name: "Accept" })).not.toBeInTheDocument();
  });

  it("reads the stored choice and treats a broken storage as no choice", () => {
    expect(readStoredConsent()).toBeNull();
    localStorage.setItem("analytics-consent", "granted");
    expect(readStoredConsent()).toBe(true);
    localStorage.setItem("analytics-consent", "denied");
    expect(readStoredConsent()).toBe(false);
    const getItem = vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    expect(readStoredConsent()).toBeNull();
    getItem.mockRestore();
  });
});
