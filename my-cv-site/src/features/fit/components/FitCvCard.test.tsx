import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FitCvCard } from "./FitCvCard";

vi.mock("next-intl", async () => (await import("@/test/intl")).intlMock());

const trackFitEvent = vi.fn();
vi.mock("@/lib/fit", async () => {
  const actual = await vi.importActual<typeof import("@/lib/fit")>("@/lib/fit");
  return { ...actual, trackFitEvent: (...parameters: unknown[]) => trackFitEvent(...parameters) };
});

const fill = async (name = "Jane Doe", email = "jane@example.com", organisation = "Acme") => {
  const user = userEvent.setup();
  if (name) await user.type(screen.getByLabelText("nameLabel"), name);
  if (email) await user.type(screen.getByLabelText("emailLabel"), email);
  if (organisation) await user.type(screen.getByLabelText("organisationLabel"), organisation);
  await user.click(screen.getByRole("button", { name: /submit/ }));
};

beforeEach(() => {
  trackFitEvent.mockReset();
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => ({ sent: true }) })
  );
});

describe("FitCvCard", () => {
  it("asks for a name, an address and an optional organisation", () => {
    render(<FitCvCard sessionId="session-id-value" />);
    expect(screen.getByRole("heading", { name: "title" })).toBeInTheDocument();
    expect(screen.getByLabelText("nameLabel")).toBeRequired();
    expect(screen.getByLabelText("emailLabel")).toBeRequired();
    expect(screen.getByLabelText("organisationLabel")).not.toBeRequired();
  });

  it("keeps the button in the tab order and never disables it", () => {
    render(<FitCvCard sessionId="session-id-value" />);
    const submit = screen.getByRole("button", { name: /submit/ });
    expect(submit).toBeEnabled();
    expect(submit).not.toHaveAttribute("aria-disabled", "true");
  });

  it("names the blank name and the unusable address without calling the route", async () => {
    render(<FitCvCard sessionId="session-id-value" />);
    await fill(" ", "jane@example", "");

    const alerts = screen.getAllByRole("alert");
    expect(alerts.map((alert) => alert.textContent)).toEqual(["errors.name", "errors.email"]);
    expect(fetch).not.toHaveBeenCalled();
  });

  it("posts the lead with the session id and reports the event", async () => {
    render(<FitCvCard sessionId="session-id-value" />);
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

  it("says where the mail went once it is sent", async () => {
    render(<FitCvCard sessionId="session-id-value" />);
    await fill();
    await waitFor(() => expect(screen.getByText("sentText")).toBeInTheDocument());
    expect(screen.queryByRole("button", { name: /submit/ })).not.toBeInTheDocument();
  });

  it("shows the queue sentence on 429 and the general one on any other refusal", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 429,
      json: async () => ({}),
    } as Response);
    render(<FitCvCard sessionId="session-id-value" />);
    await fill();
    await waitFor(() =>
      expect(screen.getByRole("alert")).toHaveTextContent("errors.rateLimited")
    );

    vi.mocked(fetch).mockResolvedValue({ ok: false, status: 500, json: async () => ({}) } as Response);
    await userEvent.setup().click(screen.getByRole("button", { name: /submit/ }));
    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("errors.failed"));
  });

  it("ignores a second submit while the first request is still running", async () => {
    vi.stubGlobal("fetch", vi.fn().mockReturnValue(new Promise(() => undefined)));
    render(<FitCvCard sessionId="session-id-value" />);
    await fill();
    await waitFor(() =>
      expect(screen.getByRole("button", { name: /sending/ })).toBeInTheDocument()
    );
    await userEvent.setup().click(screen.getByRole("button", { name: /sending/ }));
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("shows the general sentence when the network throws", async () => {
    vi.mocked(fetch).mockRejectedValue(new Error("network"));
    render(<FitCvCard sessionId="session-id-value" />);
    await fill();
    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("errors.failed"));
  });
});
