import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FitCheck } from "./FitCheck";

vi.mock("next-intl", async () => (await import("@/test/intl")).intlMock());

const trackFitEvent = vi.fn();
vi.mock("@/lib/fit", async () => {
  const actual = await vi.importActual<typeof import("@/lib/fit")>("@/lib/fit");
  return { ...actual, trackFitEvent: (...parameters: unknown[]) => trackFitEvent(...parameters) };
});

const REPORT = {
  summary: "React and a reversible cut-over sit in the record.",
  requirements: [
    {
      requirement: "Five years of React",
      verdict: "inRecord",
      note: "React since 2017.",
      engagements: [{ id: "bol", company: "bol.com" }],
    },
    {
      requirement: "Salesforce administration",
      verdict: "notInRecord",
      note: "The record holds no Salesforce work.",
      engagements: [],
    },
  ],
  technologies: [{ name: "React", years: 7, engagements: ["bol"] }],
};

const VACANCY = "We are looking for a senior frontend engineer with React experience.";

const check = async (vacancy = VACANCY) => {
  const user = userEvent.setup();
  await user.click(screen.getByLabelText("form.label"));
  await user.paste(vacancy);
  await user.click(screen.getByRole("button", { name: /form.submit/ }));
};

beforeEach(() => {
  trackFitEvent.mockReset();
  vi.stubGlobal(
    "fetch",
    vi
      .fn()
      .mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ report: REPORT, sessionId: "session-id-value" }),
      })
  );
});

describe("FitCheck", () => {
  it("shows only the form before a check runs", () => {
    render(<FitCheck />);
    expect(screen.getByLabelText("form.label")).toBeInTheDocument();
    expect(screen.queryByText("report.requirementsTitle")).toBeNull();
    expect(screen.queryByLabelText("question.label")).toBeNull();
  });

  it("posts the trimmed vacancy with the locale and the honeypot payload", async () => {
    render(<FitCheck />);
    await check(`  ${VACANCY}  `);

    await waitFor(() => expect(screen.getByText(REPORT.summary)).toBeInTheDocument());
    const [url, options] = vi.mocked(fetch).mock.calls[0] as [string, RequestInit];
    expect(url).toBe("/api/fit");
    const body = JSON.parse(String(options.body));
    expect(body.vacancy).toBe(VACANCY);
    expect(body.locale).toBe("en");
    expect(body.company_website).toBe("");
    expect(typeof body.formStartedAt).toBe("number");
  });

  it("reports the submitted and completed events with the verdict counts", async () => {
    render(<FitCheck />);
    await check();
    await waitFor(() => expect(screen.getByText(REPORT.summary)).toBeInTheDocument());
    expect(trackFitEvent).toHaveBeenCalledWith("fit_submitted", { characters: VACANCY.length });
    expect(trackFitEvent).toHaveBeenCalledWith("fit_completed", {
      requirements: 2,
      inRecord: 1,
      partly: 0,
      notInRecord: 1,
    });
  });

  it("shows the report and the follow-up question once a session id comes back", async () => {
    render(<FitCheck />);
    await check();
    await waitFor(() => expect(screen.getByLabelText("question.label")).toBeInTheDocument());
    expect(screen.getByText("Five years of React")).toBeInTheDocument();
  });

  it("leaves the follow-up question out when no session id comes back", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ report: REPORT, sessionId: "" }),
      })
    );
    render(<FitCheck />);
    await check();
    await waitFor(() => expect(screen.getByText(REPORT.summary)).toBeInTheDocument());
    expect(screen.queryByLabelText("question.label")).toBeNull();
  });

  it("refuses a vacancy under twenty characters without calling the route", async () => {
    render(<FitCheck />);
    await check("React please");
    expect(screen.getByRole("alert")).toHaveTextContent("errors.tooShort");
    expect(fetch).not.toHaveBeenCalled();
  });

  it("shows the rate limit message on a 429 and reports the failure", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 429 }));
    render(<FitCheck />);
    await check();
    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("errors.rateLimited"));
    expect(trackFitEvent).toHaveBeenCalledWith("fit_failed", { status: 429 });
  });

  it("shows the general failure message on any other status", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 500 }));
    render(<FitCheck />);
    await check();
    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("errors.failed"));
  });

  it("shows the general failure message when the network throws", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    render(<FitCheck />);
    await check();
    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("errors.failed"));
    expect(trackFitEvent).toHaveBeenCalledWith("fit_failed", { status: 0 });
  });
});
