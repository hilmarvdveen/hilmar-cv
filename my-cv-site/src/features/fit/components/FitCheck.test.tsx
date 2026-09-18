import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { finishedFitJobSnapshot, showFinishedFitJob } from "@/lib/fit/jobStore";
import { FitCheck } from "./FitCheck";
import type { FitReport } from "@/lib/fit";

vi.mock("next-intl", async () => (await import("@/test/intl")).intlMock());

const trackFitEvent = vi.fn();
vi.mock("@/lib/fit/client", async () => {
  const actual = await vi.importActual<typeof import("@/lib/fit/client")>("@/lib/fit/client");
  return { ...actual, trackFitEvent: (...parameters: unknown[]) => trackFitEvent(...parameters) };
});

const REPORT: FitReport = {
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

const VACANCY = [
  "Senior Frontend Engineer, Randstad.",
  "Je werkt in een team dat de winkelomgeving vernieuwt.",
  "Wij vragen: minimaal vijf jaar React en TypeScript, ervaring met een GraphQL-laag,",
  "ervaring met Azure DevOps en ervaring met een designsysteem.",
  "Wij bieden een opdracht van twaalf maanden met optie tot verlenging.",
  "Sluitingsdatum 30 september 2026.",
].join(" ");

const renderCheck = (turnstileSiteKey?: string) =>
  render(
    <FitCheck
      heading="Paste the vacancy"
      intro="Paste the whole text or just the requirements section."
      disclosure={<p>How this works</p>}
      turnstileSiteKey={turnstileSiteKey}
    />
  );

const JOB_ID = "c".repeat(32);

const pageStatusRegion = () => screen.getAllByRole("status")[0]!;

const check = async (vacancy = VACANCY, user = userEvent.setup()) => {
  await user.click(screen.getByLabelText("form.label"));
  await user.paste(vacancy);
  await user.click(screen.getByRole("button", { name: /form.submit/ }));
};

const queuedJob = (statusBody: unknown) =>
  vi.fn(async (url: string) =>
    url.startsWith("/api/fit/status")
      ? { ok: true, status: 200, json: async () => statusBody }
      : { ok: true, status: 202, json: async () => ({ jobId: JOB_ID }) }
  );

const letTheJobRun = async (milliseconds = 1_000) => {
  await waitFor(() => expect(fetch).toHaveBeenCalled());
  await vi.advanceTimersByTimeAsync(milliseconds);
};

const rememberAResult = (seen: boolean) =>
  showFinishedFitJob({
    report: REPORT,
    sessionId: "session-id-value",
    finishedAt: Date.now(),
    seen,
  });

beforeEach(() => {
  trackFitEvent.mockReset();
  window.sessionStorage.clear();
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ report: REPORT, sessionId: "session-id-value" }),
    })
  );
});

afterEach(() => {
  vi.useRealTimers();
  window.sessionStorage.clear();
});

describe("FitCheck", () => {
  it("shows the form and the disclosure before a check runs", () => {
    renderCheck();
    expect(screen.getByLabelText("form.label")).toBeInTheDocument();
    expect(screen.getByText("How this works")).toBeInTheDocument();
    expect(screen.queryByText("report.requirementsTitle")).toBeNull();
    expect(screen.queryByLabelText("question.label")).toBeNull();
  });

  it("posts the trimmed vacancy with the locale and the honeypot payload", async () => {
    renderCheck();
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

  it("starts the timing at the first change of the textarea, not at mount", async () => {
    const mountedAt = Date.now();
    renderCheck();
    const user = userEvent.setup();
    await user.click(screen.getByLabelText("form.label"));
    await user.paste(VACANCY);
    const pastedAt = Date.now();
    await user.click(screen.getByRole("button", { name: /form.submit/ }));

    await waitFor(() => expect(screen.getByText(REPORT.summary)).toBeInTheDocument());
    const [, options] = vi.mocked(fetch).mock.calls[0] as [string, RequestInit];
    const body = JSON.parse(String(options.body));
    expect(body.formStartedAt).toBeGreaterThanOrEqual(mountedAt);
    expect(body.formStartedAt).toBeLessThanOrEqual(pastedAt);
  });

  it("reports the submitted and completed events with the verdict counts", async () => {
    renderCheck();
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

  it("shows the report, then the question box, then the CV card, then the booking card", async () => {
    renderCheck();
    await check();
    await waitFor(() => expect(screen.getByLabelText("question.label")).toBeInTheDocument());

    const result = screen.getByRole("region", { name: "report.title" });
    const question = screen.getByRole("heading", { level: 3, name: "question.title" });
    const tailoredCv = screen.getByRole("heading", { level: 3, name: "title" });
    const booking = screen.getByRole("heading", { level: 2, name: "report.bookTitle" });
    expect(result.compareDocumentPosition(question) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(
      question.compareDocumentPosition(tailoredCv) & Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
    expect(
      tailoredCv.compareDocumentPosition(booking) & Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
    expect(screen.getByText("report.nextSteps")).toBeInTheDocument();
  });

  it("offers no CV and promises nothing below when the check read no requirements", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({
          report: { ...REPORT, requirements: [] },
          sessionId: "session-id-value",
        }),
      })
    );
    renderCheck();
    await check();
    await waitFor(() => expect(screen.getByText(REPORT.summary)).toBeInTheDocument());
    expect(screen.queryByLabelText("nameLabel")).toBeNull();
    expect(screen.queryByText("report.nextSteps")).toBeNull();
    expect(screen.getByRole("heading", { level: 2, name: "report.bookTitle" })).toBeInTheDocument();
  });

  it("hands the live region the sent sentence once the CV request is away", async () => {
    renderCheck();
    await check();
    await waitFor(() => expect(screen.getByLabelText("nameLabel")).toBeInTheDocument());

    const user = userEvent.setup();
    await user.type(screen.getByLabelText("nameLabel"), "Jane Doe");
    await user.type(screen.getByLabelText("emailLabel"), "jane@example.com");
    await user.click(screen.getByRole("button", { name: "submit" }));

    await waitFor(() => expect(pageStatusRegion()).toHaveTextContent("sentText"));
  });

  it("announces the arrival and moves focus to the result heading", async () => {
    renderCheck();
    await check();
    await waitFor(() => expect(pageStatusRegion()).toHaveTextContent("status.ready"));
    expect(document.activeElement).toBe(
      screen.getByRole("heading", { level: 2, name: "report.title" })
    );
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
    renderCheck();
    await check();
    await waitFor(() => expect(screen.getByText(REPORT.summary)).toBeInTheDocument());
    expect(screen.queryByLabelText("question.label")).toBeNull();
    expect(screen.getByRole("heading", { level: 2, name: "report.bookTitle" })).toBeInTheDocument();
  });

  it("refuses a vacancy under two hundred characters without calling the route", async () => {
    renderCheck();
    await check("React please");
    expect(screen.getByRole("alert")).toHaveTextContent("errors.reasons.tooShort");
    expect(fetch).not.toHaveBeenCalled();
  });

  it("shows one sentence per reason when the agent refuses the text", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 422,
        json: async () => ({ reason: "codeBlock" }),
      })
    );
    renderCheck();
    await check();
    await waitFor(() =>
      expect(screen.getByRole("alert")).toHaveTextContent("errors.reasons.codeBlock")
    );
    expect(trackFitEvent).toHaveBeenCalledWith("fit_failed", { status: 422 });
  });

  it("falls back to the vacancy sentence when a refusal names no reason", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, status: 422, json: async () => ({}) })
    );
    renderCheck();
    await check();
    await waitFor(() =>
      expect(screen.getByRole("alert")).toHaveTextContent("errors.reasons.notAVacancy")
    );
  });

  it("keeps the finished report and the question box when a re-check is refused", async () => {
    renderCheck();
    await check();
    await waitFor(() => expect(screen.getByLabelText("question.label")).toBeInTheDocument());

    const user = userEvent.setup();
    await user.clear(screen.getByLabelText("form.label"));
    await user.paste("React please");
    await user.click(screen.getByRole("button", { name: /form.submit/ }));

    expect(screen.getByRole("alert")).toHaveTextContent("errors.reasons.tooShort");
    expect(screen.getByText(REPORT.summary)).toBeInTheDocument();
    expect(screen.getByLabelText("question.label")).toBeInTheDocument();
  });

  it("keeps the finished report when a re-check fails upstream", async () => {
    renderCheck();
    await check();
    await waitFor(() => expect(screen.getByText(REPORT.summary)).toBeInTheDocument());

    vi.mocked(fetch).mockResolvedValue({ ok: false, status: 500 } as Response);
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /form.submit/ }));

    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("errors.failed"));
    expect(screen.getByText(REPORT.summary)).toBeInTheDocument();
  });

  it("shows the queue message on a 429 with a short wait", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 429,
        json: async () => ({ retryAfterSeconds: 42 }),
      })
    );
    renderCheck();
    await check();
    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("errors.rateLimited"));
    expect(trackFitEvent).toHaveBeenCalledWith("fit_failed", { status: 429 });
  });

  it("shows the daily cap message on a 429 that waits for tomorrow", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 429,
        json: async () => ({ retryAfterSeconds: 28_800 }),
      })
    );
    renderCheck();
    await check();
    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("errors.capReached"));
  });

  it("falls back to the queue message when a 429 carries no readable body", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 429 }));
    renderCheck();
    await check();
    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("errors.rateLimited"));
  });

  it("ignores a second submit while the first check is still starting", async () => {
    vi.stubGlobal("fetch", vi.fn().mockReturnValue(new Promise(() => undefined)));
    renderCheck();
    await check();
    await waitFor(() =>
      expect(screen.getByRole("button", { name: /form.checking/ })).toBeInTheDocument()
    );
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /form.checking/ }));
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("shows the general failure message on any other status", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 500 }));
    renderCheck();
    await check();
    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("errors.failed"));
  });

  it("shows the general failure message when the network throws", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    renderCheck();
    await check();
    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("errors.failed"));
    expect(trackFitEvent).toHaveBeenCalledWith("fit_failed", { status: 0 });
  });
});

describe("FitCheck with a queued job", () => {
  const checkWithTheClockRunning = async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    renderCheck();
    await check(VACANCY, user);
    return user;
  };

  it("waits for the job and shows the report once it is done", async () => {
    vi.stubGlobal(
      "fetch",
      queuedJob({ state: "done", report: REPORT, sessionId: "session-id-value" })
    );
    await checkWithTheClockRunning();
    await letTheJobRun();

    await waitFor(() => expect(screen.getByText(REPORT.summary)).toBeInTheDocument());
    expect(screen.getByLabelText("form.label")).toBeInTheDocument();
    expect(document.activeElement).toBe(
      screen.getByRole("heading", { level: 2, name: "report.title" })
    );
    expect(trackFitEvent).toHaveBeenCalledWith("fit_completed", {
      requirements: 2,
      inRecord: 1,
      partly: 0,
      notInRecord: 1,
    });
  });

  it("puts the waiting panel where the form was, so a second check cannot start", async () => {
    vi.stubGlobal("fetch", queuedJob({ state: "running", phase: "searching", toolCalls: 2 }));
    await checkWithTheClockRunning();
    await letTheJobRun();

    expect(screen.getByRole("heading", { level: 2, name: "title" })).toBeInTheDocument();
    expect(screen.queryByLabelText("form.label")).toBeNull();
    expect(screen.queryByRole("button", { name: /form.submit/ })).toBeNull();
  });

  it("names the reason when the agent refused the text while the job ran", async () => {
    vi.stubGlobal("fetch", queuedJob({ state: "failed", status: 400, reason: "instruction" }));
    await checkWithTheClockRunning();
    await letTheJobRun();

    await waitFor(() =>
      expect(screen.getByRole("alert")).toHaveTextContent("errors.reasons.instruction")
    );
    expect(screen.getByLabelText("form.label")).toBeInTheDocument();
  });

  it("says the daily cap is reached when the job waits for tomorrow", async () => {
    vi.stubGlobal(
      "fetch",
      queuedJob({ state: "failed", status: 429, retryAfterSeconds: 28_800 })
    );
    await checkWithTheClockRunning();
    await letTheJobRun();

    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("errors.capReached"));
  });

  it("falls back to the general sentence on any other failed job", async () => {
    vi.stubGlobal("fetch", queuedJob({ state: "failed", status: 500 }));
    await checkWithTheClockRunning();
    await letTheJobRun();

    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("errors.failed"));
    expect(trackFitEvent).toHaveBeenCalledWith("fit_failed", { status: 500 });
  });

  it("keeps the standing report in place while the next job runs", async () => {
    rememberAResult(true);
    vi.stubGlobal("fetch", queuedJob({ state: "running", phase: "reading", toolCalls: 0 }));
    await checkWithTheClockRunning();
    await letTheJobRun();

    expect(screen.getByRole("heading", { level: 2, name: "title" })).toBeInTheDocument();
    expect(screen.getByText(REPORT.summary)).toBeInTheDocument();
  });
});

describe("FitCheck with an answer it cannot use", () => {
  it("shows the repeat report even when no session came with it", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => ({ report: REPORT }) })
    );
    renderCheck();
    await check();

    await waitFor(() => expect(screen.getByText(REPORT.summary)).toBeInTheDocument());
    expect(screen.queryByLabelText("question.label")).toBeNull();
  });

  it("keeps the form and says nothing when the answer holds neither job nor report", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => ({}) })
    );
    renderCheck();
    await check();

    await waitFor(() => expect(fetch).toHaveBeenCalled());
    expect(screen.getByLabelText("form.label")).toBeInTheDocument();
    expect(screen.queryByText(REPORT.summary)).toBeNull();
    expect(screen.queryByRole("alert")).toBeNull();
  });
});

describe("FitCheck with a result from an earlier page", () => {
  it("shows the result the session kept and marks it as seen", async () => {
    rememberAResult(false);
    renderCheck();

    expect(screen.getByText(REPORT.summary)).toBeInTheDocument();
    await waitFor(() => expect(finishedFitJobSnapshot()?.seen).toBe(true));
    await waitFor(() => expect(pageStatusRegion()).toHaveTextContent("status.ready"));
  });
});

describe("FitCheck with a challenge widget", () => {
  it("posts an empty token while the widget has answered nothing", async () => {
    renderCheck("site-key");
    await check();
    await waitFor(() => expect(fetch).toHaveBeenCalled());
    const [, options] = vi.mocked(fetch).mock.calls[0] as [string, RequestInit];
    expect(JSON.parse(String(options.body)).turnstileToken).toBe("");
  });

  it("posts the token the widget wrote into the form", async () => {
    renderCheck("site-key");
    const form = screen.getByRole("button", { name: /form.submit/ }).closest("form");
    const token = document.createElement("input");
    token.type = "hidden";
    token.name = "cf-turnstile-response";
    token.value = "turnstile-token-value";
    form?.appendChild(token);

    await check();
    await waitFor(() => expect(fetch).toHaveBeenCalled());
    const [, options] = vi.mocked(fetch).mock.calls[0] as [string, RequestInit];
    expect(JSON.parse(String(options.body)).turnstileToken).toBe("turnstile-token-value");
  });
});
