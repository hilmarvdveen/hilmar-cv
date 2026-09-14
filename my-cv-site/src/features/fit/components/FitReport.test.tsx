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

describe("FitReport", () => {
  it("shows the summary and one entry per requirement", () => {
    render(<FitReport report={report} />);
    expect(screen.getByText(report.summary)).toBeInTheDocument();
    expect(screen.getByText("Five years of React")).toBeInTheDocument();
    expect(screen.getByText("Kubernetes operations")).toBeInTheDocument();
    expect(screen.getByText("Salesforce administration")).toBeInTheDocument();
  });

  it("names the verdict of every requirement", () => {
    render(<FitReport report={report} />);
    expect(screen.getByText("report.verdicts.inRecord")).toBeInTheDocument();
    expect(screen.getByText("report.verdicts.partly")).toBeInTheDocument();
    expect(screen.getByText("report.verdicts.notInRecord")).toBeInTheDocument();
  });

  it("links the evidence to the engagement page and leaves an empty list out", () => {
    render(<FitReport report={report} />);
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

  it("lists the years per technology", () => {
    render(<FitReport report={report} />);
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("Angular")).toBeInTheDocument();
  });

  it("leaves the technology block out when the agent found none", () => {
    render(<FitReport report={{ ...report, technologies: [] }} />);
    expect(screen.queryByText("report.technologiesTitle")).toBeNull();
  });

  it("carries exactly one booking button with the fit placement", () => {
    render(<FitReport report={report} />);
    const bookLinks = screen
      .getAllByRole("link")
      .filter((link) => link.getAttribute("href") === "/book");
    expect(bookLinks).toHaveLength(1);
    expect(bookLinks[0]).toHaveAttribute("data-placement", "fit-report");
  });

  it("shows the empty state instead of the panels when there are no requirements", () => {
    render(<FitReport report={{ summary: "", requirements: [], technologies: [] }} />);
    expect(screen.getByText("report.empty")).toBeInTheDocument();
    expect(screen.queryByText("report.requirementsTitle")).toBeNull();
  });
});
