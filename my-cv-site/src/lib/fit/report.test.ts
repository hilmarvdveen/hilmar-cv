import { describe, expect, it } from "vitest";
import { workHistory } from "@/data/workHistory";
import {
  EMPTY_FIT_REPORT,
  FIT_LIMITS,
  FIT_VERDICTS,
  RECORD_ENGAGEMENT_IDS,
  countFitVerdicts,
  isFitAnswer,
  isFitReport,
  isFitVerdict,
  sanitizeFitAnswer,
  sanitizeFitReport,
  sanitizeSessionId,
} from "./report";
import type { FitReport } from "./types";

const report = (overrides: Partial<FitReport> = {}): FitReport => ({
  summary: "The record covers React and a reversible cut-over.",
  requirements: [
    {
      requirement: "Five years of React",
      verdict: "inRecord",
      note: "React since 2017, most recently at bol.com.",
      engagements: [{ id: "bol", company: "bol.com" }],
    },
  ],
  technologies: [{ name: "React", years: 7.25, engagements: ["bol", "niped"] }],
  ...overrides,
});

describe("the fit limits and verdicts", () => {
  it("names the three verdicts and an empty report", () => {
    expect(FIT_VERDICTS).toEqual(["inRecord", "partly", "notInRecord"]);
    expect(EMPTY_FIT_REPORT).toEqual({ summary: "", requirements: [], technologies: [] });
    expect(FIT_LIMITS.vacancyMinimum).toBe(20);
    expect(FIT_LIMITS.vacancyMaximum).toBe(10_000);
    expect(FIT_LIMITS.questionMinimum).toBe(5);
    expect(FIT_LIMITS.questionMaximum).toBe(500);
  });

  it("knows every engagement id in the work history", () => {
    expect(RECORD_ENGAGEMENT_IDS.size).toBe(workHistory.length);
    expect(RECORD_ENGAGEMENT_IDS.has("bol")).toBe(true);
    expect(RECORD_ENGAGEMENT_IDS.has("not-a-client")).toBe(false);
  });

  it("recognises a verdict and refuses anything else", () => {
    expect(isFitVerdict("partly")).toBe(true);
    expect(isFitVerdict("maybe")).toBe(false);
    expect(isFitVerdict(3)).toBe(false);
  });
});

describe("isFitReport", () => {
  it("accepts a well formed report", () => {
    expect(isFitReport(report())).toBe(true);
  });

  it("refuses anything that is not an object with the three fields", () => {
    expect(isFitReport(null)).toBe(false);
    expect(isFitReport([report()])).toBe(false);
    expect(isFitReport("report")).toBe(false);
    expect(isFitReport({ ...report(), summary: 1 })).toBe(false);
    expect(isFitReport({ ...report(), requirements: "none" })).toBe(false);
    expect(isFitReport({ ...report(), technologies: "none" })).toBe(false);
  });

  it("refuses a requirement with a wrong field", () => {
    expect(isFitReport(report({ requirements: [{ requirement: 1 }] as never }))).toBe(false);
    expect(
      isFitReport(
        report({
          requirements: [
            { requirement: "React", verdict: "unknown", note: "", engagements: [] },
          ] as never,
        })
      )
    ).toBe(false);
    expect(
      isFitReport(
        report({
          requirements: [
            { requirement: "React", verdict: "partly", note: "", engagements: "bol" },
          ] as never,
        })
      )
    ).toBe(false);
    expect(
      isFitReport(
        report({
          requirements: [
            { requirement: "React", verdict: "partly", note: "", engagements: [{ id: 1 }] },
          ] as never,
        })
      )
    ).toBe(false);
    expect(
      isFitReport(
        report({
          requirements: [
            { requirement: "React", verdict: "partly", note: 2, engagements: [] },
          ] as never,
        })
      )
    ).toBe(false);
  });

  it("refuses a technology with a wrong field", () => {
    expect(isFitReport(report({ technologies: [{ name: 1 }] as never }))).toBe(false);
    expect(
      isFitReport(report({ technologies: [{ name: "React", years: "seven", engagements: [] }] as never }))
    ).toBe(false);
    expect(
      isFitReport(
        report({ technologies: [{ name: "React", years: Number.NaN, engagements: [] }] as never })
      )
    ).toBe(false);
    expect(
      isFitReport(report({ technologies: [{ name: "React", years: 2, engagements: "bol" }] as never }))
    ).toBe(false);
    expect(
      isFitReport(report({ technologies: [{ name: "React", years: 2, engagements: [4] }] as never }))
    ).toBe(false);
  });
});

describe("isFitAnswer", () => {
  it("accepts an answer and refuses a broken one", () => {
    expect(isFitAnswer({ answer: "Seven years.", engagements: [] })).toBe(true);
    expect(isFitAnswer({ answer: 7, engagements: [] })).toBe(false);
    expect(isFitAnswer({ answer: "Seven years.", engagements: {} })).toBe(false);
    expect(isFitAnswer({ answer: "Seven years.", engagements: [{ id: "bol" }] })).toBe(false);
    expect(isFitAnswer(undefined)).toBe(false);
  });
});

describe("sanitizeFitReport", () => {
  it("keeps the record's engagements and drops the invented ones", () => {
    const sanitized = sanitizeFitReport(
      report({
        requirements: [
          {
            requirement: "React",
            verdict: "inRecord",
            note: "Yes.",
            engagements: [
              { id: "bol", company: "bol.com" },
              { id: "made-up", company: "Made Up" },
            ],
          },
        ],
        technologies: [{ name: "React", years: 7, engagements: ["bol", "made-up"] }],
      })
    );
    expect(sanitized.requirements[0].engagements).toEqual([{ id: "bol", company: "bol.com" }]);
    expect(sanitized.technologies[0].engagements).toEqual(["bol"]);
  });

  it("uses the known ids it is given", () => {
    const sanitized = sanitizeFitReport(report(), new Set(["niped"]));
    expect(sanitized.requirements[0].engagements).toEqual([]);
    expect(sanitized.technologies[0].engagements).toEqual(["niped"]);
  });

  it("trims the text, the counts and the years", () => {
    const longRequirements = Array.from({ length: 40 }, (value, position) => ({
      requirement: `Requirement ${position}`,
      verdict: "partly" as const,
      note: "x".repeat(600),
      engagements: [],
    }));
    const longTechnologies = Array.from({ length: 50 }, (value, position) => ({
      name: `Technology ${position}`,
      years: -2,
      engagements: [],
    }));
    const sanitized = sanitizeFitReport(
      report({
        summary: "s".repeat(2000),
        requirements: longRequirements,
        technologies: longTechnologies,
      })
    );
    expect(sanitized.summary).toHaveLength(FIT_LIMITS.summary);
    expect(sanitized.requirements).toHaveLength(FIT_LIMITS.requirements);
    expect(sanitized.requirements[0].note).toHaveLength(FIT_LIMITS.note);
    expect(sanitized.technologies).toHaveLength(FIT_LIMITS.technologies);
    expect(sanitized.technologies[0].years).toBe(0);
  });

  it("rounds the years to one decimal and caps the engagements per item", () => {
    const manyEngagements = workHistory.map((entry) => ({
      id: entry.id,
      company: entry.company,
    }));
    const sanitized = sanitizeFitReport(
      report({
        requirements: [
          {
            requirement: "React",
            verdict: "partly",
            note: "",
            engagements: [...manyEngagements, ...manyEngagements],
          },
        ],
      })
    );
    expect(sanitized.requirements[0].engagements).toHaveLength(FIT_LIMITS.engagementsPerItem);
    expect(sanitized.technologies[0].years).toBe(7.3);
  });
});

describe("sanitizeFitAnswer", () => {
  it("clamps the answer and keeps only known engagements", () => {
    const sanitized = sanitizeFitAnswer({
      answer: "a".repeat(2000),
      engagements: [
        { id: "bol", company: "bol.com" },
        { id: "elsewhere", company: "Elsewhere" },
      ],
    });
    expect(sanitized.answer).toHaveLength(FIT_LIMITS.answer);
    expect(sanitized.engagements).toEqual([{ id: "bol", company: "bol.com" }]);
  });

  it("uses the known ids it is given", () => {
    const sanitized = sanitizeFitAnswer(
      { answer: "Yes.", engagements: [{ id: "bol", company: "bol.com" }] },
      new Set<string>()
    );
    expect(sanitized.engagements).toEqual([]);
  });
});

describe("sanitizeSessionId", () => {
  it("accepts a base64url session id of a plausible length", () => {
    expect(sanitizeSessionId("  aBcD-1234_efGH5678  ")).toBe("aBcD-1234_efGH5678");
  });

  it("refuses anything else", () => {
    expect(sanitizeSessionId(undefined)).toBe("");
    expect(sanitizeSessionId(42)).toBe("");
    expect(sanitizeSessionId("short")).toBe("");
    expect(sanitizeSessionId("x".repeat(80))).toBe("");
    expect(sanitizeSessionId("has spaces in it here")).toBe("");
  });
});

describe("countFitVerdicts", () => {
  it("counts each verdict", () => {
    const counts = countFitVerdicts(
      report({
        requirements: [
          { requirement: "a", verdict: "inRecord", note: "", engagements: [] },
          { requirement: "b", verdict: "inRecord", note: "", engagements: [] },
          { requirement: "c", verdict: "partly", note: "", engagements: [] },
          { requirement: "d", verdict: "notInRecord", note: "", engagements: [] },
        ],
      })
    );
    expect(counts).toEqual({ inRecord: 2, partly: 1, notInRecord: 1 });
  });
});
