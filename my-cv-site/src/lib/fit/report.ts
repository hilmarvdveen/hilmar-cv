import { workHistory } from "@/data/workHistory";
import type {
  FitAnswer,
  FitEngagementReference,
  FitReport,
  FitRequirement,
  FitTechnology,
  FitVerdict,
  FitVerdictCounts,
} from "./types";

export const FIT_LIMITS = {
  vacancyMinimum: 20,
  vacancyMaximum: 10_000,
  questionMinimum: 5,
  questionMaximum: 500,
  requirements: 30,
  technologies: 40,
  summary: 1_200,
  note: 400,
  answer: 1_500,
  engagementsPerItem: 12,
  sessionIdMinimum: 16,
  sessionIdMaximum: 64,
} as const;

export const FIT_VERDICTS: readonly FitVerdict[] = ["inRecord", "partly", "notInRecord"];

export const EMPTY_FIT_REPORT: FitReport = {
  summary: "",
  requirements: [],
  technologies: [],
};

export const RECORD_ENGAGEMENT_IDS: ReadonlySet<string> = new Set(
  workHistory.map((entry) => entry.id)
);

const SESSION_ID_PATTERN = /^[A-Za-z0-9_-]+$/;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export function isFitVerdict(value: unknown): value is FitVerdict {
  return typeof value === "string" && FIT_VERDICTS.includes(value as FitVerdict);
}

function isEngagementReference(value: unknown): value is FitEngagementReference {
  return isRecord(value) && typeof value.id === "string" && typeof value.company === "string";
}

function isRequirement(value: unknown): value is FitRequirement {
  return (
    isRecord(value) &&
    typeof value.requirement === "string" &&
    typeof value.note === "string" &&
    isFitVerdict(value.verdict) &&
    Array.isArray(value.engagements) &&
    value.engagements.every(isEngagementReference)
  );
}

function isTechnology(value: unknown): value is FitTechnology {
  return (
    isRecord(value) &&
    typeof value.name === "string" &&
    typeof value.years === "number" &&
    Number.isFinite(value.years) &&
    Array.isArray(value.engagements) &&
    value.engagements.every((entry) => typeof entry === "string")
  );
}

export function isFitReport(value: unknown): value is FitReport {
  return (
    isRecord(value) &&
    typeof value.summary === "string" &&
    Array.isArray(value.requirements) &&
    value.requirements.every(isRequirement) &&
    Array.isArray(value.technologies) &&
    value.technologies.every(isTechnology)
  );
}

export function isFitAnswer(value: unknown): value is FitAnswer {
  return (
    isRecord(value) &&
    typeof value.answer === "string" &&
    Array.isArray(value.engagements) &&
    value.engagements.every(isEngagementReference)
  );
}

const clamp = (text: string, maximum: number): string => text.trim().slice(0, maximum);

const keepKnownEngagements = (
  engagements: FitEngagementReference[],
  knownIds: ReadonlySet<string>
): FitEngagementReference[] =>
  engagements
    .filter((engagement) => knownIds.has(engagement.id))
    .slice(0, FIT_LIMITS.engagementsPerItem)
    .map((engagement) => ({ id: engagement.id, company: clamp(engagement.company, 80) }));

export function sanitizeFitReport(
  report: FitReport,
  knownIds: ReadonlySet<string> = RECORD_ENGAGEMENT_IDS
): FitReport {
  return {
    summary: clamp(report.summary, FIT_LIMITS.summary),
    requirements: report.requirements.slice(0, FIT_LIMITS.requirements).map((requirement) => ({
      requirement: clamp(requirement.requirement, FIT_LIMITS.note),
      verdict: requirement.verdict,
      note: clamp(requirement.note, FIT_LIMITS.note),
      engagements: keepKnownEngagements(requirement.engagements, knownIds),
    })),
    technologies: report.technologies.slice(0, FIT_LIMITS.technologies).map((technology) => ({
      name: clamp(technology.name, 60),
      years: Math.max(0, Math.round(technology.years * 10) / 10),
      engagements: technology.engagements.filter((id) => knownIds.has(id)),
    })),
  };
}

export function sanitizeFitAnswer(
  answer: FitAnswer,
  knownIds: ReadonlySet<string> = RECORD_ENGAGEMENT_IDS
): FitAnswer {
  return {
    answer: clamp(answer.answer, FIT_LIMITS.answer),
    engagements: keepKnownEngagements(answer.engagements, knownIds),
  };
}

export function sanitizeSessionId(value: unknown): string {
  if (typeof value !== "string") return "";
  const trimmed = value.trim();
  if (trimmed.length < FIT_LIMITS.sessionIdMinimum) return "";
  if (trimmed.length > FIT_LIMITS.sessionIdMaximum) return "";
  return SESSION_ID_PATTERN.test(trimmed) ? trimmed : "";
}

export function countFitVerdicts(report: FitReport): FitVerdictCounts {
  const counts: FitVerdictCounts = { inRecord: 0, partly: 0, notInRecord: 0 };
  for (const requirement of report.requirements) {
    counts[requirement.verdict] += 1;
  }
  return counts;
}
