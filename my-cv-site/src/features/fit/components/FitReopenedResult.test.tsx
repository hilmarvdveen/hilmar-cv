import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FitReopenedResult } from "./FitReopenedResult";

vi.mock("next-intl", async () => (await import("@/test/intl")).intlMock());

const trackFitEvent = vi.fn();
vi.mock("@/lib/fit/client", async () => {
  const actual = await vi.importActual<typeof import("@/lib/fit/client")>("@/lib/fit/client");
  return { ...actual, trackFitEvent: (...parameters: unknown[]) => trackFitEvent(...parameters) };
});

const LABELS = {
  loading: "Getting the result",
  ready: "Your result is below",
  failed: "The result is no longer there",
  rateLimited: "There is a queue right now",
  checkedOn: "Checked on {date}",
  untitled: "This vacancy",
  download: "Download the CV",
  downloading: "Building the CV",
  downloadNote: "The first download builds the file",
  downloaded: "The CV is in your downloads",
  downloadFailed: "The CV did not come through",
  downloadTimedOut: "Building the CV is taking longer than expected",
  downloadRateLimited: "There is a queue of downloads right now",
  nextSteps: "Rather go through the requirements together?",
  nextStepsLink: "Book a 30-minute call",
  mailAction: "Mail me the CV",
};

const REPORT = {
  summary: "React sits in the record",
  requirements: [],
  technologies: [{ name: "React", years: 7, engagements: [] }],
};

const STORED = {
  report: REPORT,
  locale: "nl",
  title: "Senior Frontend Engineer",
  createdAt: "2026-09-17T09:12:44.000Z",
  hasCv: true,
};

const renderView = () =>
  render(
    <FitReopenedResult sessionId="session-id-value" resultKey="signature-value" labels={LABELS} />
  );

const jsonResponse = (body: unknown, status = 200) =>
  ({ ok: status < 400, status, json: async () => body }) as unknown as Response;

const storedResponse = (overrides: Record<string, unknown> = {}) =>
  jsonResponse({ ...STORED, ...overrides });

const documentResponse = () =>
  ({
    ok: true,
    status: 200,
    blob: async () => new Blob(["pdf-bytes"]),
  }) as unknown as Response;

const pageStatusRegion = () => screen.getAllByRole("status")[0]!;

const downloadButton = () =>
  waitFor(() => screen.getByRole("button", { name: LABELS.download }));

beforeEach(() => {
  trackFitEvent.mockReset();
  Object.assign(URL, {
    createObjectURL: vi.fn(() => "blob:cv"),
    revokeObjectURL: vi.fn(),
  });
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(storedResponse()));
});

afterEach(() => {
  vi.useRealTimers();
});

describe("FitReopenedResult", () => {
  it("asks the route for the stored result with the session and the key", async () => {
    renderView();
    expect(pageStatusRegion()).toHaveTextContent(LABELS.loading);

    await waitFor(() => expect(screen.getByText(REPORT.summary)).toBeInTheDocument());
    expect(vi.mocked(fetch).mock.calls[0][0]).toBe(
      "/api/fit/result?session=session-id-value&key=signature-value"
    );
  });

  it("takes the key out of the address bar once the report is in", async () => {
    const replaceState = vi.spyOn(window.history, "replaceState");
    renderView();
    await waitFor(() => expect(screen.getByText(REPORT.summary)).toBeInTheDocument());
    expect(replaceState).toHaveBeenCalledWith(null, "", window.location.pathname);
    replaceState.mockRestore();
  });

  it("names the vacancy and the date of the check above the download button", async () => {
    renderView();
    await waitFor(() =>
      expect(
        screen.getByRole("heading", { level: 2, name: "Senior Frontend Engineer" })
      ).toBeInTheDocument()
    );
    expect(screen.getByText("Checked on 17 september 2026")).toBeInTheDocument();
    expect(pageStatusRegion()).toHaveTextContent(LABELS.ready);
  });

  it("falls back to the neutral title and leaves the date out", async () => {
    vi.mocked(fetch).mockResolvedValue(storedResponse({ title: "", createdAt: "" }));
    renderView();
    await waitFor(() =>
      expect(screen.getByRole("heading", { level: 2, name: LABELS.untitled })).toBeInTheDocument()
    );
    expect(screen.queryByText(/Checked on/)).toBeNull();
  });

  it("promises the half minute only when the document is not built yet", async () => {
    renderView();
    await downloadButton();
    expect(screen.queryByText(LABELS.downloadNote)).toBeNull();

    vi.mocked(fetch).mockResolvedValue(storedResponse({ hasCv: false }));
    renderView();
    await waitFor(() => expect(screen.getByText(LABELS.downloadNote)).toBeInTheDocument());
  });

  it("carries the way on to a call in the summary card", async () => {
    renderView();
    await waitFor(() => expect(screen.getByText(LABELS.nextSteps)).toBeInTheDocument());
    expect(screen.getByRole("link", { name: LABELS.nextStepsLink })).toHaveAttribute(
      "data-placement",
      "fit-result-next"
    );
  });

  it("ends the band with the question box and the booking card", async () => {
    renderView();
    await waitFor(() => expect(screen.getByLabelText("question.label")).toBeInTheDocument());

    const question = screen.getByRole("heading", { level: 3, name: "question.title" });
    const booking = screen.getByRole("heading", { level: 2, name: "report.bookTitle" });
    expect(
      question.compareDocumentPosition(booking) & Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
    expect(screen.getByRole("link", { name: "report.bookButton" })).toHaveAttribute(
      "data-placement",
      "fit-report"
    );
  });

  it("says the result is gone when the route refuses it", async () => {
    vi.mocked(fetch).mockResolvedValue(jsonResponse({}, 404));
    renderView();
    await waitFor(() => expect(pageStatusRegion()).toHaveTextContent(LABELS.failed));
    expect(screen.queryByRole("button", { name: LABELS.download })).not.toBeInTheDocument();
  });

  it("says there is a queue when the read bucket refuses it", async () => {
    vi.mocked(fetch).mockResolvedValue(jsonResponse({}, 429));
    renderView();
    await waitFor(() => expect(pageStatusRegion()).toHaveTextContent(LABELS.rateLimited));
  });

  it("sets nothing once the visitor has left the page", async () => {
    let answer: (response: Response) => void = () => undefined;
    vi.stubGlobal(
      "fetch",
      vi.fn(() => new Promise<Response>((resolve) => {
        answer = resolve;
      }))
    );
    const replaceState = vi.spyOn(window.history, "replaceState");
    const { unmount } = renderView();
    unmount();
    answer(storedResponse());
    await waitFor(() => expect(fetch).toHaveBeenCalled());
    expect(replaceState).not.toHaveBeenCalled();
    replaceState.mockRestore();
  });

  it("says the result is gone when the network throws", async () => {
    vi.mocked(fetch).mockRejectedValue(new Error("network"));
    renderView();
    await waitFor(() => expect(pageStatusRegion()).toHaveTextContent(LABELS.failed));
  });

  it("starts the build, streams the document and reports the event", async () => {
    renderView();
    const download = await downloadButton();
    const appendChild = vi.spyOn(document.body, "appendChild");

    vi.mocked(fetch)
      .mockResolvedValueOnce(jsonResponse({ ready: true, pages: 2, failed: false }))
      .mockResolvedValueOnce(documentResponse());

    await userEvent.setup().click(download);

    await waitFor(() =>
      expect(trackFitEvent).toHaveBeenCalledWith("fit_cv_downloaded", { locale: "nl" })
    );

    const [buildUrl, buildOptions] = vi.mocked(fetch).mock.calls[1] as [string, RequestInit];
    expect(buildUrl).toBe("/api/fit/cv");
    expect(buildOptions.method).toBe("POST");
    expect(JSON.parse(String(buildOptions.body))).toEqual({
      session: "session-id-value",
      key: "signature-value",
      locale: "nl",
    });
    expect(vi.mocked(fetch).mock.lastCall?.[0]).toBe(
      "/api/fit/cv?session=session-id-value&key=signature-value&locale=nl"
    );

    const anchors = appendChild.mock.calls
      .map(([node]) => node as HTMLElement)
      .filter((node) => node.tagName === "A");
    expect(anchors[0]).toHaveAttribute(
      "download",
      "cv-hilmar-van-der-veen-nl-senior-frontend-engineer.pdf"
    );
    expect(document.body.querySelector("a[download]")).toBeNull();
    expect(URL.createObjectURL).toHaveBeenCalled();
    await waitFor(() => expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:cv"));
    expect(pageStatusRegion()).toHaveTextContent(LABELS.downloaded);
    appendChild.mockRestore();
  });

  it("waits for the build, asking the status route until the document is ready", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    renderView();
    const download = await downloadButton();

    vi.mocked(fetch)
      .mockResolvedValueOnce(jsonResponse({ ready: false, pages: 0, failed: false }))
      .mockResolvedValueOnce(jsonResponse({ ready: false, pages: 0, failed: false }))
      .mockResolvedValueOnce(jsonResponse({ ready: true, pages: 2, failed: false }))
      .mockResolvedValueOnce(documentResponse());

    await user.click(download);
    await vi.advanceTimersByTimeAsync(12_000);

    await waitFor(() =>
      expect(trackFitEvent).toHaveBeenCalledWith("fit_cv_downloaded", { locale: "nl" })
    );
    expect(vi.mocked(fetch).mock.calls[2]?.[0]).toBe(
      "/api/fit/cv/status?session=session-id-value&key=signature-value&locale=nl"
    );
  });

  it("gives up after three minutes of building", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    renderView();
    const download = await downloadButton();

    vi.mocked(fetch).mockResolvedValue(jsonResponse({ ready: false, pages: 0, failed: false }));

    await user.click(download);
    await vi.advanceTimersByTimeAsync(200_000);

    await waitFor(() => expect(pageStatusRegion()).toHaveTextContent(LABELS.downloadTimedOut));
    expect(screen.getAllByText(LABELS.downloadTimedOut)).toHaveLength(2);
    expect(trackFitEvent).not.toHaveBeenCalledWith("fit_cv_downloaded", { locale: "nl" });
  });

  it("says the build did not come through when the agent reports a failure", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    renderView();
    const download = await downloadButton();

    vi.mocked(fetch)
      .mockResolvedValueOnce(jsonResponse({ ready: false, pages: 0, failed: false }))
      .mockResolvedValueOnce(jsonResponse({ ready: false, pages: 0, failed: true }));

    await user.click(download);
    await vi.advanceTimersByTimeAsync(8_000);

    await waitFor(() => expect(pageStatusRegion()).toHaveTextContent(LABELS.downloadFailed));
    expect(trackFitEvent).toHaveBeenCalledWith("fit_cv_failed", { status: 0 });
  });

  it("says there is a queue when the status route refuses the wait", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    renderView();
    const download = await downloadButton();

    vi.mocked(fetch)
      .mockResolvedValueOnce(jsonResponse({ ready: false, pages: 0, failed: false }))
      .mockResolvedValueOnce(jsonResponse({}, 429));

    await user.click(download);
    await vi.advanceTimersByTimeAsync(8_000);

    await waitFor(() => expect(pageStatusRegion()).toHaveTextContent(LABELS.downloadRateLimited));
  });

  it("says the build did not come through when the status route fails", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    renderView();
    const download = await downloadButton();

    vi.mocked(fetch)
      .mockResolvedValueOnce(jsonResponse({ ready: false, pages: 0, failed: false }))
      .mockResolvedValueOnce(jsonResponse({}, 500));

    await user.click(download);
    await vi.advanceTimersByTimeAsync(8_000);

    await waitFor(() => expect(pageStatusRegion()).toHaveTextContent(LABELS.downloadFailed));
    expect(trackFitEvent).toHaveBeenCalledWith("fit_cv_failed", { status: 500 });
  });

  it("says there is a queue when the build itself is refused", async () => {
    renderView();
    const download = await downloadButton();

    vi.mocked(fetch).mockResolvedValue(jsonResponse({}, 429));
    await userEvent.setup().click(download);

    await waitFor(() => expect(pageStatusRegion()).toHaveTextContent(LABELS.downloadRateLimited));
    expect(trackFitEvent).not.toHaveBeenCalled();
  });

  it("says the build did not come through when the build route fails", async () => {
    renderView();
    const download = await downloadButton();

    vi.mocked(fetch).mockResolvedValue(jsonResponse({}, 500));
    await userEvent.setup().click(download);

    await waitFor(() => expect(pageStatusRegion()).toHaveTextContent(LABELS.downloadFailed));
    expect(trackFitEvent).toHaveBeenCalledWith("fit_cv_failed", { status: 500 });
    expect(screen.getByText(REPORT.summary)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: LABELS.mailAction })).toHaveAttribute(
      "data-placement",
      "fit-download-mail"
    );
  });

  it("says the document is not ready when the stream refuses it", async () => {
    renderView();
    const download = await downloadButton();

    vi.mocked(fetch)
      .mockResolvedValueOnce(jsonResponse({ ready: true, pages: 2, failed: false }))
      .mockResolvedValueOnce(jsonResponse({ ready: false }, 409));

    await userEvent.setup().click(download);

    await waitFor(() => expect(pageStatusRegion()).toHaveTextContent(LABELS.downloadFailed));
    expect(trackFitEvent).toHaveBeenCalledWith("fit_cv_failed", { status: 409 });
  });

  it("says there is a queue when the stream is rate limited", async () => {
    renderView();
    const download = await downloadButton();

    vi.mocked(fetch)
      .mockResolvedValueOnce(jsonResponse({ ready: true, pages: 2, failed: false }))
      .mockResolvedValueOnce(jsonResponse({}, 429));

    await userEvent.setup().click(download);

    await waitFor(() => expect(pageStatusRegion()).toHaveTextContent(LABELS.downloadRateLimited));
  });

  it("says the build did not come through when the network throws", async () => {
    renderView();
    const download = await downloadButton();

    vi.mocked(fetch).mockRejectedValue(new Error("network"));
    await userEvent.setup().click(download);

    await waitFor(() => expect(pageStatusRegion()).toHaveTextContent(LABELS.downloadFailed));
    expect(trackFitEvent).toHaveBeenCalledWith("fit_cv_failed", { status: 0 });
  });

  it("ignores a second click while the CV is still being built", async () => {
    renderView();
    const download = await downloadButton();

    vi.mocked(fetch).mockReturnValue(new Promise(() => undefined) as Promise<Response>);
    const user = userEvent.setup();
    await user.click(download);

    const waiting = await waitFor(() => screen.getByRole("button", { name: LABELS.downloading }));
    await user.click(waiting);
    expect(fetch).toHaveBeenCalledTimes(2);
  });
});
