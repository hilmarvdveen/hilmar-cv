import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { showFinishedFitJob, startPendingFitJob } from "@/lib/fit/jobStore";
import type { FitReport } from "@/lib/fit/types";
import { FitJobNotifier } from "./FitJobNotifier";

vi.mock("next-intl", async () => (await import("@/test/intl")).intlMock());

let currentPath = "/";

vi.mock("@/i18n/navigation", () => ({
  Link: ({
    href,
    children,
    ...rest
  }: {
    href: string;
    children: React.ReactNode;
    "data-placement"?: string;
  }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
  usePathname: () => currentPath,
}));

const JOB_ID = "b".repeat(32);
const SESSION_ID = "session-id-value";

const report: FitReport = {
  summary: "React sits in the work history.",
  requirements: [
    {
      requirement: "React",
      verdict: "inRecord",
      note: "React at bol.com.",
      engagements: [{ id: "bol", company: "bol.com" }],
    },
  ],
  technologies: [],
};

const answer = (body: unknown) =>
  ({ ok: true, status: 200, json: async () => body }) as unknown as Response;

const rememberARunningJob = () =>
  startPendingFitJob({ jobId: JOB_ID, startedAt: Date.now(), locale: "nl" });

const rememberAResult = (seen: boolean) =>
  showFinishedFitJob({ report, sessionId: SESSION_ID, finishedAt: Date.now(), seen });

const letTimePass = async (milliseconds: number) => {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(milliseconds);
  });
};

const refuseTheJob = () => {
  vi.mocked(fetch).mockResolvedValue(answer({ state: "failed", status: 500 }));
};

beforeEach(() => {
  currentPath = "/";
  window.sessionStorage.clear();
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue(answer({ state: "running", phase: "reading", toolCalls: 0 }))
  );
});

afterEach(() => {
  vi.useRealTimers();
  window.sessionStorage.clear();
});

describe("FitJobNotifier", () => {
  it("stays out of the way on the vacancy check page itself", () => {
    currentPath = "/fit";
    rememberAResult(false);
    const { container } = render(<FitJobNotifier />);
    expect(container).toBeEmptyDOMElement();
  });

  it("shows nothing while no check has run", () => {
    const { container } = render(<FitJobNotifier />);
    expect(container).toBeEmptyDOMElement();
  });

  it("says the check is still running, with nothing to click but the close", () => {
    rememberARunningJob();
    render(<FitJobNotifier />);

    expect(screen.getByRole("region", { name: "label" })).toBeInTheDocument();
    expect(screen.getByText("running")).toBeInTheDocument();
    expect(screen.queryByRole("link")).toBeNull();
    expect(screen.getByRole("status")).toBeEmptyDOMElement();
  });

  it("offers the result the moment it is ready", () => {
    rememberAResult(false);
    render(<FitJobNotifier />);

    expect(screen.getByText("ready")).toBeInTheDocument();
    const link = screen.getByRole("link", { name: "readyLink" });
    expect(link).toHaveAttribute("href", "/fit");
    expect(link).toHaveAttribute("data-placement", "fit-notifier-ready");
    expect(screen.getByRole("status")).toHaveTextContent("announceReady");
  });

  it("says nothing about a result the visitor has already seen", () => {
    rememberAResult(true);
    const { container } = render(<FitJobNotifier />);
    expect(container).toBeEmptyDOMElement();
  });

  it("offers the way back when the check did not finish", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    refuseTheJob();
    rememberARunningJob();
    render(<FitJobNotifier />);
    await letTimePass(1_000);

    expect(screen.getByText("failed")).toBeInTheDocument();
    const link = screen.getByRole("link", { name: "failedLink" });
    expect(link).toHaveAttribute("href", "/fit");
    expect(link).toHaveAttribute("data-placement", "fit-notifier-failed");
    expect(screen.getByRole("status")).toHaveTextContent("announceFailed");
  });

  it("closes on its own button", async () => {
    const user = userEvent.setup();
    rememberAResult(false);
    render(<FitJobNotifier />);

    await user.click(screen.getByRole("button", { name: "dismiss" }));
    expect(screen.queryByRole("region", { name: "label" })).toBeNull();
  });

  it("closes on Escape", async () => {
    const user = userEvent.setup();
    rememberAResult(false);
    render(<FitJobNotifier />);

    screen.getByRole("button", { name: "dismiss" }).focus();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("region", { name: "label" })).toBeNull();
  });

  it("stays open on any other key", async () => {
    const user = userEvent.setup();
    rememberAResult(false);
    render(<FitJobNotifier />);

    screen.getByRole("button", { name: "dismiss" }).focus();
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("region", { name: "label" })).toBeInTheDocument();
  });

  it("forgets a dismissed failure, so the standing result speaks again", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    refuseTheJob();
    rememberAResult(false);
    rememberARunningJob();
    render(<FitJobNotifier />);
    await letTimePass(1_000);
    expect(screen.getByText("failed")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "dismiss" }));
    expect(screen.queryByText("failed")).toBeNull();
    expect(screen.getByText("ready")).toBeInTheDocument();
  });
});
