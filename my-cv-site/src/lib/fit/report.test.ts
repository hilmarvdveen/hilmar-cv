import { describe, expect, it } from "vitest";
import { workHistory } from "@/data/workHistory";
import {
  EMPTY_FIT_REPORT,
  FIT_LIMITS,
  FIT_VERDICTS,
  FIT_DAILY_CAP_RETRY_SECONDS,
  RECORD_ENGAGEMENT_COMPANIES,
  RECORD_ENGAGEMENT_IDS,
  companyNamesForEngagements,
  countFitVerdicts,
  fitTechnologyDuration,
  isDailyCapRetry,
  retryAfterSecondsFromBody,
  isFitAnswer,
  isFitReport,
  isFitVerdict,
  readFitCvStatus,
  FIT_REFUSAL_REASONS,
  readFitRefusalReason,
  readStoredFitResult,
  sanitizeFitAnswer,
  sanitizeFitReport,
  sanitizeSessionId,
} from "./report";
import type { FitReport } from "./types";
import fitResponse from "./fixtures/fitResponse.json";
import storedResult from "./fixtures/storedResult.json";

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
    expect(FIT_LIMITS.vacancyMinimum).toBe(200);
    expect(FIT_LIMITS.vacancyMaximum).toBe(10_000);
    expect(FIT_LIMITS.questionMinimum).toBe(5);
    expect(FIT_LIMITS.questionMaximum).toBe(500);
  });

  it("carries the length caps the agent schema allows", () => {
    expect(FIT_LIMITS.requirement).toBe(500);
    expect(FIT_LIMITS.company).toBe(120);
    expect(FIT_LIMITS.note).toBe(400);
    expect(FIT_LIMITS.summary).toBe(1_200);
  });

  it("names the six refusal reasons the agent can answer", () => {
    expect(FIT_REFUSAL_REASONS).toEqual([
      "tooShort",
      "notAVacancy",
      "codeBlock",
      "encodedBlob",
      "tooManyLinks",
      "instruction",
    ]);
  });

  it("reads a refusal reason and refuses anything else", () => {
    expect(readFitRefusalReason({ error: "no", reason: "codeBlock" })).toBe("codeBlock");
    expect(readFitRefusalReason({ error: "no", reason: "invented" })).toBeNull();
    expect(readFitRefusalReason(null)).toBeNull();
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

describe("retryAfterSecondsFromBody", () => {
  it("reads a positive number and rounds it up", () => {
    expect(retryAfterSecondsFromBody({ retryAfterSeconds: 30 })).toBe(30);
    expect(retryAfterSecondsFromBody({ retryAfterSeconds: 30.2 })).toBe(31);
    expect(retryAfterSecondsFromBody({ retryAfterSeconds: "45" })).toBe(45);
  });

  it("answers zero for anything else", () => {
    expect(retryAfterSecondsFromBody(null)).toBe(0);
    expect(retryAfterSecondsFromBody(["nope"])).toBe(0);
    expect(retryAfterSecondsFromBody({})).toBe(0);
    expect(retryAfterSecondsFromBody({ retryAfterSeconds: 0 })).toBe(0);
    expect(retryAfterSecondsFromBody({ retryAfterSeconds: -5 })).toBe(0);
    expect(retryAfterSecondsFromBody({ retryAfterSeconds: "later" })).toBe(0);
  });
});

describe("isDailyCapRetry", () => {
  it("separates the daily cap from the per-minute limit", () => {
    expect(isDailyCapRetry(0)).toBe(false);
    expect(isDailyCapRetry(60)).toBe(false);
    expect(isDailyCapRetry(FIT_DAILY_CAP_RETRY_SECONDS)).toBe(false);
    expect(isDailyCapRetry(FIT_DAILY_CAP_RETRY_SECONDS + 1)).toBe(true);
    expect(isDailyCapRetry(28_800)).toBe(true);
  });
});

describe("companyNamesForEngagements", () => {
  it("names every engagement in the record once, in the order given", () => {
    expect(companyNamesForEngagements(["bol", "bol"])).toEqual(["bol.com"]);
    expect(RECORD_ENGAGEMENT_COMPANIES.get("bol")).toBe("bol.com");
  });

  it("drops an engagement the record does not hold", () => {
    expect(companyNamesForEngagements(["invented"])).toEqual([]);
    expect(
      companyNamesForEngagements(["one", "two"], new Map([["one", "One"], ["two", "Two"]]))
    ).toEqual(["One", "Two"]);
  });
});

describe("fitTechnologyDuration", () => {
  it("reports a year or more in years", () => {
    expect(fitTechnologyDuration(7.5)).toEqual({ unit: "years", value: 7.5 });
    expect(fitTechnologyDuration(1)).toEqual({ unit: "years", value: 1 });
  });

  it("reports less than a year in months", () => {
    expect(fitTechnologyDuration(0.5)).toEqual({ unit: "months", value: 6 });
    expect(fitTechnologyDuration(0.25)).toEqual({ unit: "months", value: 3 });
  });

  it("drops a figure that rounds to nothing", () => {
    expect(fitTechnologyDuration(0)).toBeNull();
    expect(fitTechnologyDuration(0.02)).toBeNull();
  });
});

describe("readStoredFitResult", () => {
  const stored = {
    report: {
      summary: "React sits in the record",
      requirements: [
        {
          requirement: "React",
          verdict: "inRecord",
          note: "Since 2017",
          engagements: [
            { id: workHistory[0]!.id, company: workHistory[0]!.company },
            { id: "invented", company: "Invented" },
          ],
        },
      ],
      technologies: [],
    },
    vacancy: "The vacancy text",
    locale: "nl",
    title: "Senior Frontend Engineer",
    createdAt: "2026-09-17T09:12:44.000Z",
    hasCv: true,
  };

  it("reads the report, the vacancy and the locale, and sanitizes the report", () => {
    const result = readStoredFitResult(stored);
    expect(result?.vacancy).toBe("The vacancy text");
    expect(result?.locale).toBe("nl");
    expect(result?.title).toBe("Senior Frontend Engineer");
    expect(result?.createdAt).toBe("2026-09-17T09:12:44.000Z");
    expect(result?.hasCv).toBe(true);
    expect(result?.report.requirements[0]!.engagements).toEqual([
      { id: workHistory[0]!.id, company: workHistory[0]!.company },
    ]);
  });

  it("reads a missing cv flag as false and a missing title as empty", () => {
    const result = readStoredFitResult({
      ...stored,
      hasCv: undefined,
      title: undefined,
      createdAt: 42,
    });
    expect(result?.hasCv).toBe(false);
    expect(result?.title).toBe("");
    expect(result?.createdAt).toBe("");
  });

  it("refuses anything that is not a stored result", () => {
    expect(readStoredFitResult(null)).toBeNull();
    expect(readStoredFitResult({ ...stored, report: { summary: 1 } })).toBeNull();
    expect(readStoredFitResult({ ...stored, vacancy: 42 })).toBeNull();
    expect(readStoredFitResult({ ...stored, locale: "de" })).toBeNull();
  });
});

describe("readFitCvStatus", () => {
  it("reads the flag and the page count", () => {
    expect(readFitCvStatus({ ready: true, pages: 2 })).toEqual({
      ready: true,
      pages: 2,
      failed: false,
    });
  });

  it("reads a build that failed", () => {
    expect(readFitCvStatus({ ready: false, failed: true })).toEqual({
      ready: false,
      pages: 0,
      failed: true,
    });
  });

  it("answers a not ready status for anything unusable", () => {
    expect(readFitCvStatus(null)).toEqual({ ready: false, pages: 0, failed: false });
    expect(readFitCvStatus({ ready: "yes", pages: "nonsense" })).toEqual({
      ready: false,
      pages: 0,
      failed: false,
    });
    expect(readFitCvStatus({ ready: true, pages: 2.8 })).toEqual({
      ready: true,
      pages: 2,
      failed: false,
    });
  });
});

describe("the golden answers of the agent", () => {
  it("accepts the report of a full POST /fit answer and keeps its longest sentences", () => {
    expect(isFitReport(fitResponse.report)).toBe(true);
    const sanitized = sanitizeFitReport(fitResponse.report as FitReport);
    expect(sanitized.requirements).toHaveLength(fitResponse.report.requirements.length);
    expect(sanitized.requirements[0]!.requirement).toBe(
      fitResponse.report.requirements[0]!.requirement
    );
    expect(sanitized.summary).toBe(fitResponse.report.summary);
    expect(sanitizeSessionId(fitResponse.sessionId)).toBe(fitResponse.sessionId);
    expect(sanitized.technologies).toHaveLength(fitResponse.report.technologies.length);
  });

  it("reads the golden stored result with its title and date", () => {
    const stored = readStoredFitResult(storedResult);
    expect(stored?.title).toBe("Senior frontend engineer InnovatieLab");
    expect(stored?.createdAt).toBe("2026-09-17T08:12:44.000Z");
    expect(stored?.hasCv).toBe(true);
    expect(stored?.locale).toBe("nl");
    expect(stored?.report.requirements).toHaveLength(4);
  });
});
