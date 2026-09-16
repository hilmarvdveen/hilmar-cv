import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FitReopenedResult } from "./FitReopenedResult";

vi.mock("next-intl", async () => (await import("@/test/intl")).intlMock());

const trackFitEvent = vi.fn();
vi.mock("@/lib/fit", async () => {
  const actual = await vi.importActual<typeof import("@/lib/fit")>("@/lib/fit");
  return { ...actual, trackFitEvent: (...parameters: unknown[]) => trackFitEvent(...parameters) };
});

const LABELS = {
  title: "Your result",
  intro: "This is the result you ran",
  loading: "Getting the result",
  failed: "The result is no longer there",
  download: "Download the CV",
  downloading: "Building the CV",
  downloadNote: "The first download builds the file",
};

const REPORT = {
  summary: "React sits in the record",
  requirements: [],
  technologies: [{ name: "React", years: 7, engagements: [] }],
};

const renderView = () =>
  render(
    <FitReopenedResult
      sessionId="session-id-value"
      resultKey="signature-value"
      labels={LABELS}
    />
  );

const resultResponse = () => ({
  ok: true,
  status: 200,
  json: async () => ({ report: REPORT, locale: "nl", hasCv: true }),
});

beforeEach(() => {
  trackFitEvent.mockReset();
  Object.assign(URL, {
    createObjectURL: vi.fn(() => "blob:cv"),
    revokeObjectURL: vi.fn(),
  });
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(resultResponse()));
});

describe("FitReopenedResult", () => {
  it("asks the route for the stored result with the session and the key", async () => {
    renderView();
    expect(screen.getByText(LABELS.loading, { selector: "p:not(.sr-only)" })).toBeInTheDocument();

    await waitFor(() => expect(screen.getByText(REPORT.summary)).toBeInTheDocument());
    expect(vi.mocked(fetch).mock.calls[0][0]).toBe(
      "/api/fit/result?session=session-id-value&key=signature-value"
    );
  });

  it("offers the download once the report is there", async () => {
    renderView();
    await waitFor(() =>
      expect(screen.getByRole("button", { name: LABELS.download })).toBeInTheDocument()
    );
    expect(screen.getByText(LABELS.downloadNote)).toBeInTheDocument();
  });

  it("says the result is gone when the route refuses it", async () => {
    vi.mocked(fetch).mockResolvedValue({ ok: false, status: 404, json: async () => ({}) } as Response);
    renderView();
    await waitFor(() => expect(screen.getByText(LABELS.failed)).toBeInTheDocument());
    expect(screen.queryByRole("button", { name: LABELS.download })).not.toBeInTheDocument();
  });

  it("says the result is gone when the network throws", async () => {
    vi.mocked(fetch).mockRejectedValue(new Error("network"));
    renderView();
    await waitFor(() => expect(screen.getByText(LABELS.failed)).toBeInTheDocument());
  });

  it("downloads the CV, names the file and reports the event", async () => {
    renderView();
    const download = await waitFor(() => screen.getByRole("button", { name: LABELS.download }));

    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      status: 200,
      blob: async () => new Blob(["pdf-bytes"]),
    } as unknown as Response);

    await userEvent.setup().click(download);

    await waitFor(() => expect(trackFitEvent).toHaveBeenCalledWith("fit_cv_downloaded", { locale: "en" }));
    expect(vi.mocked(fetch).mock.lastCall?.[0]).toBe(
      "/api/fit/cv?session=session-id-value&key=signature-value&locale=en"
    );
    expect(URL.createObjectURL).toHaveBeenCalled();
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:cv");
  });

  it("ignores a second click while the CV is still being built", async () => {
    renderView();
    const download = await waitFor(() => screen.getByRole("button", { name: LABELS.download }));

    vi.mocked(fetch).mockReturnValue(new Promise(() => undefined) as Promise<Response>);
    const user = userEvent.setup();
    await user.click(download);

    const waiting = await waitFor(() =>
      screen.getByRole("button", { name: LABELS.downloading })
    );
    await user.click(waiting);
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it("says it did not work when the CV call refuses", async () => {
    renderView();
    const download = await waitFor(() => screen.getByRole("button", { name: LABELS.download }));

    vi.mocked(fetch).mockResolvedValue({ ok: false, status: 429, json: async () => ({}) } as Response);
    await userEvent.setup().click(download);

    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent(LABELS.failed));
    expect(trackFitEvent).not.toHaveBeenCalled();
  });
});
