import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { FitReport } from "./FitReport";
import type { FitReport as FitReportData } from "@/lib/fit";

vi.mock("next-intl", async () => (await import("@/test/intl")).intlMock());

const report: FitReportData = {
  summary: "React, Angular and a reversible cut-over all sit in the record.",
  requirements: [
    {
      requirement: "Five years of React",
      verdict: "inRecord",
      note: "React since 2017, most recently at bol.com.",
      engagements: [{ id: "bol", company: "bol.com" }],
    },
    {
      requirement: "Kubernetes operations",
      verdict: "partly",
      note: "Deployed on Kubernetes, not operated it.",
      engagements: [{ id: "omniplan", company: "Omniplan" }],
    },
    {
      requirement: "Salesforce administration",
      verdict: "notInRecord",
      note: "The record holds no Salesforce work.",
      engagements: [],
    },
  ],
  technologies: [
    { name: "React", years: 7.5, engagements: ["bol"] },
    { name: "Angular", years: 5, engagements: ["athlon"] },
  ],
};

const renderReport = (overrides: Partial<FitReportData> = {}, sessionId = "") =>
  render(<FitReport report={{ ...report, ...overrides }} sessionId={sessionId} />);

describe("FitReport", () => {
  it("puts the result under its own second level heading", () => {
    renderReport();
    const heading = screen.getByRole("heading", { level: 2, name: "report.title" });
    expect(heading).toHaveAttribute("tabIndex", "-1");
    expect(screen.getByRole("region", { name: "report.title" })).toBeInTheDocument();
  });

  it("shows the verdict counts above the summary and one entry per requirement", () => {
    renderReport();
    expect(screen.getByText("report.counts")).toBeInTheDocument();
    expect(screen.getByText(report.summary)).toBeInTheDocument();
    expect(screen.getByText("Five years of React")).toBeInTheDocument();
    expect(screen.getByText("Kubernetes operations")).toBeInTheDocument();
    expect(screen.getByText("Salesforce administration")).toBeInTheDocument();
  });

  it("explains the three labels once, above the requirement list", () => {
    renderReport();
    expect(screen.getByText("report.legend.title")).toBeInTheDocument();
    expect(screen.getByText("report.legend.inRecord")).toBeInTheDocument();
    expect(screen.getByText("report.legend.partly")).toBeInTheDocument();
    expect(screen.getByText("report.legend.notInRecord")).toBeInTheDocument();
  });

  it("names the verdict of every requirement", () => {
    renderReport();
    expect(screen.getByText("report.verdicts.inRecord")).toBeInTheDocument();
    expect(screen.getByText("report.verdicts.partly")).toBeInTheDocument();
    expect(screen.getByText("report.verdicts.notInRecord")).toBeInTheDocument();
  });

  it("links the evidence to the engagement page and leaves an empty list out", () => {
    renderReport();
    expect(screen.getByRole("link", { name: "bol.com" })).toHaveAttribute(
      "href",
      "/experience/bol"
    );
    expect(screen.getByRole("link", { name: "Omniplan" })).toHaveAttribute(
      "href",
      "/experience/omniplan"
    );
    expect(screen.getAllByText("report.evidenceLabel")).toHaveLength(2);
  });

  it("lists the years per technology with the basis and the engagements behind each figure", () => {
    renderReport();
    expect(screen.getByText("report.technologiesBasis")).toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("Angular")).toBeInTheDocument();
    expect(screen.getByText("bol.com", { selector: "p" })).toBeInTheDocument();
    expect(screen.getByText("Athlon")).toBeInTheDocument();
    expect(screen.getAllByText("report.years")).toHaveLength(2);
  });

  it("prints a technology under one year in months and drops one that rounds to nothing", () => {
    renderReport({
      technologies: [
        { name: "Terraform", years: 0.5, engagements: [] },
        { name: "Nothing", years: 0, engagements: [] },
      ],
    });
    expect(screen.getByText("Terraform")).toBeInTheDocument();
    expect(screen.getByText("report.months")).toBeInTheDocument();
    expect(screen.queryByText("Nothing")).toBeNull();
  });

  it("leaves the technology block out when no figure survives", () => {
    renderReport({ technologies: [] });
    expect(screen.queryByText("report.technologiesTitle")).toBeNull();
  });

  it("carries no booking button of its own, because the booking card closes the page", () => {
    renderReport();
    const bookLinks = screen
      .getAllByRole("link")
      .filter((link) => link.getAttribute("href") === "/book");
    expect(bookLinks).toHaveLength(0);
  });

  it("keeps the summary and the technologies in the empty state", () => {
    renderReport({ requirements: [] });
    expect(screen.getByText(report.summary)).toBeInTheDocument();
    expect(screen.getByText("report.technologiesTitle")).toBeInTheDocument();
    expect(screen.queryByText("report.requirementsTitle")).toBeNull();
    expect(screen.queryByText("report.counts")).toBeNull();
  });

  it("leaves the empty sentence out when the summary already says it", () => {
    renderReport({ requirements: [] });
    expect(screen.queryByText("report.empty")).toBeNull();
  });

  it("says nothing was read when neither a requirement nor a summary came back", () => {
    renderReport({ requirements: [], summary: "" });
    expect(screen.getByText("report.empty")).toBeInTheDocument();
  });

  it("names what waits below the report when the parent offers it", () => {
    render(
      <FitReport
        report={report}
        sessionId="session-id-value"
        nextStepsNote="The CV and the call are below."
      />
    );
    expect(screen.getByText("The CV and the call are below.")).toBeInTheDocument();
  });

  it("leaves the next step line out when the parent offers nothing below", () => {
    renderReport();
    expect(screen.queryByText("The CV and the call are below.")).toBeNull();
  });

  it("names the number of the stored result when there is one", () => {
    renderReport({}, "session-id-value");
    expect(screen.getByText("report.sessionLabel")).toBeInTheDocument();
  });

  it("leaves the number line out when no session came back", () => {
    renderReport();
    expect(screen.queryByText("report.sessionLabel")).toBeNull();
  });
});
