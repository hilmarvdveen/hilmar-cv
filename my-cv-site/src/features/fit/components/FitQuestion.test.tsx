import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FitQuestion } from "./FitQuestion";

vi.mock("next-intl", async () => (await import("@/test/intl")).intlMock());

const trackFitEvent = vi.fn();
vi.mock("@/lib/fit", async () => {
  const actual = await vi.importActual<typeof import("@/lib/fit")>("@/lib/fit");
  return { ...actual, trackFitEvent: (...parameters: unknown[]) => trackFitEvent(...parameters) };
});

const ANSWER = {
  answer: "React runs through the record since 2017.",
  engagements: [{ id: "bol", company: "bol.com" }],
};

const ask = async (question = "How many years of React?") => {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText("question.label"), question);
  await user.click(screen.getByRole("button", { name: /question.submit/ }));
};

beforeEach(() => {
  trackFitEvent.mockReset();
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => ({ answer: ANSWER }) })
  );
});

describe("FitQuestion", () => {
  it("disables the button until the visitor writes something", () => {
    render(<FitQuestion sessionId="session-id-value" />);
    expect(screen.getByRole("button", { name: /question.submit/ })).toBeDisabled();
  });

  it("posts the question with the session id and shows the answer", async () => {
    render(<FitQuestion sessionId="session-id-value" />);
    await ask();

    await waitFor(() => expect(screen.getByText(ANSWER.answer)).toBeInTheDocument());
    const [url, options] = vi.mocked(fetch).mock.calls[0] as [string, RequestInit];
    expect(url).toBe("/api/fit/question");
    expect(JSON.parse(String(options.body))).toEqual({
      question: "How many years of React?",
      sessionId: "session-id-value",
      locale: "en",
    });
    expect(screen.getByRole("link", { name: "bol.com" })).toHaveAttribute(
      "href",
      "/experience/bol"
    );
  });

  it("reports the submitted and answered events", async () => {
    render(<FitQuestion sessionId="session-id-value" />);
    await ask();
    await waitFor(() => expect(screen.getByText(ANSWER.answer)).toBeInTheDocument());
    expect(trackFitEvent).toHaveBeenCalledWith("fit_question_submitted", { characters: 24 });
    expect(trackFitEvent).toHaveBeenCalledWith("fit_question_answered", { engagements: 1 });
  });

  it("refuses a question under five characters without calling the route", async () => {
    render(<FitQuestion sessionId="session-id-value" />);
    await ask("why");
    expect(screen.getByRole("alert")).toHaveTextContent("question.errors.tooShort");
    expect(fetch).not.toHaveBeenCalled();
  });

  it("shows the rate limit message on a 429", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 429 }));
    render(<FitQuestion sessionId="session-id-value" />);
    await ask();
    await waitFor(() =>
      expect(screen.getByRole("alert")).toHaveTextContent("question.errors.rateLimited")
    );
    expect(trackFitEvent).toHaveBeenCalledWith("fit_question_failed", { status: 429 });
  });

  it("shows the general failure message on any other status", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 500 }));
    render(<FitQuestion sessionId="session-id-value" />);
    await ask();
    await waitFor(() =>
      expect(screen.getByRole("alert")).toHaveTextContent("question.errors.failed")
    );
  });

  it("shows the general failure message when the network throws", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    render(<FitQuestion sessionId="session-id-value" />);
    await ask();
    await waitFor(() =>
      expect(screen.getByRole("alert")).toHaveTextContent("question.errors.failed")
    );
    expect(trackFitEvent).toHaveBeenCalledWith("fit_question_failed", { status: 0 });
  });

  it("leaves the engagement row out when the answer cites none", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ answer: { answer: "Nothing in the record.", engagements: [] } }),
      })
    );
    render(<FitQuestion sessionId="session-id-value" />);
    await ask();
    await waitFor(() =>
      expect(screen.getByText("Nothing in the record.")).toBeInTheDocument()
    );
    expect(screen.queryByText("report.evidenceLabel")).toBeNull();
  });
});
