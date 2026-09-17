import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FitCvCard } from "./FitCvCard";

vi.mock("next-intl", async () => (await import("@/test/intl")).intlMock());

const trackFitEvent = vi.fn();
vi.mock("@/lib/fit/client", async () => {
  const actual = await vi.importActual<typeof import("@/lib/fit/client")>("@/lib/fit/client");
  return { ...actual, trackFitEvent: (...parameters: unknown[]) => trackFitEvent(...parameters) };
});

const onSent = vi.fn();

const renderCard = () => render(<FitCvCard sessionId="session-id-value" onSent={onSent} />);

const fill = async (name = "Jane Doe", email = "jane@example.com", organisation = "Acme") => {
  const user = userEvent.setup();
  if (name) await user.type(screen.getByLabelText("nameLabel"), name);
  if (email) await user.type(screen.getByLabelText("emailLabel"), email);
  if (organisation) await user.type(screen.getByLabelText("organisationLabel"), organisation);
  await user.click(screen.getByRole("button", { name: /submit/ }));
};

beforeEach(() => {
  trackFitEvent.mockReset();
  onSent.mockReset();
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => ({ sent: true }) })
  );
});

describe("FitCvCard", () => {
  it("asks for a name, an address and an optional organisation", () => {
    renderCard();
    expect(screen.getByRole("heading", { name: "title" })).toBeInTheDocument();
    expect(screen.getByLabelText("nameLabel")).toBeRequired();
    expect(screen.getByLabelText("emailLabel")).toBeRequired();
    expect(screen.getByLabelText("organisationLabel")).not.toBeRequired();
  });

  it("says where the name and the address go, with the privacy statement behind a link", () => {
    renderCard();
    expect(screen.getByText("privacyNote", { exact: false })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "privacyLink" })).toHaveAttribute("href", "/privacy");
  });

  it("keeps the button in the tab order and never disables it", () => {
    renderCard();
    const submit = screen.getByRole("button", { name: /submit/ });
    expect(submit).toBeEnabled();
    expect(submit).not.toHaveAttribute("aria-disabled", "true");
  });

  it("leaves the browser bubbles out so the written sentences are the ones that show", () => {
    renderCard();
    const form = screen.getByRole("button", { name: /submit/ }).closest("form");
    expect(form).toHaveAttribute("noValidate");
  });

  it("names the blank name and the unusable address without calling the route", async () => {
    renderCard();
    await fill(" ", "jane@example", "");

    const alerts = screen.getAllByRole("alert");
    expect(alerts.map((alert) => alert.textContent)).toEqual(["errors.name", "errors.email"]);
    expect(fetch).not.toHaveBeenCalled();
  });

  it("posts the lead with the session id and reports the event", async () => {
    renderCard();
    await fill();

    await waitFor(() => expect(screen.getByRole("heading", { name: "sentTitle" })).toBeInTheDocument());
    const [url, options] = vi.mocked(fetch).mock.calls[0] as [string, RequestInit];
    expect(url).toBe("/api/fit/cv-request");
    const posted = JSON.parse(String(options.body));
    expect(posted).toMatchObject({
      sessionId: "session-id-value",
      name: "Jane Doe",
      email: "jane@example.com",
      organisation: "Acme",
      locale: "en",
      company_website: "",
    });
    expect(trackFitEvent).toHaveBeenCalledWith("fit_cv_requested");
  });

  it("replaces the form inside the same card, takes focus to the sent heading and hands the page the sentence", async () => {
    renderCard();
    await fill();

    const sentHeading = await waitFor(() => screen.getByRole("heading", { name: "sentTitle" }));
    expect(screen.getByText("sentText")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /submit/ })).not.toBeInTheDocument();
    expect(sentHeading).toHaveAttribute("tabIndex", "-1");
    expect(document.activeElement).toBe(sentHeading);
    expect(onSent).toHaveBeenCalledWith("sentText");
  });

  it("shows the queue sentence on 429 and the general one on any other refusal", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 429,
      json: async () => ({}),
    } as Response);
    renderCard();
    await fill();
    await waitFor(() =>
      expect(screen.getByRole("alert")).toHaveTextContent("errors.rateLimited")
    );

    vi.mocked(fetch).mockResolvedValue({ ok: false, status: 500, json: async () => ({}) } as Response);
    await userEvent.setup().click(screen.getByRole("button", { name: /submit/ }));
    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("errors.failed"));
    expect(trackFitEvent).toHaveBeenCalledWith("fit_cv_failed", { status: 429 });
    expect(trackFitEvent).toHaveBeenCalledWith("fit_cv_failed", { status: 500 });
    expect(trackFitEvent).not.toHaveBeenCalledWith("fit_cv_requested");
  });

  it("puts the mail address behind a labelled link when the request does not come through", async () => {
    vi.mocked(fetch).mockResolvedValue({ ok: false, status: 500, json: async () => ({}) } as Response);
    renderCard();
    await fill();
    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("errors.failed"));
    const mailLink = screen.getByRole("link", { name: "mailAction" });
    expect(mailLink.getAttribute("href")).toMatch(/^mailto:/);
    expect(mailLink).toHaveAttribute("data-placement", "fit-cv-mail");
  });

  it("ignores a second submit while the first request is still running", async () => {
    vi.stubGlobal("fetch", vi.fn().mockReturnValue(new Promise(() => undefined)));
    renderCard();
    await fill();
    await waitFor(() =>
      expect(screen.getByRole("button", { name: /sending/ })).toBeInTheDocument()
    );
    await userEvent.setup().click(screen.getByRole("button", { name: /sending/ }));
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("shows the general sentence when the network throws", async () => {
    vi.mocked(fetch).mockRejectedValue(new Error("network"));
    renderCard();
    await fill();
    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("errors.failed"));
    expect(trackFitEvent).toHaveBeenCalledWith("fit_cv_failed", { status: 0 });
  });
});
