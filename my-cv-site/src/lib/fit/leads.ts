import type { VacancyLead, VacancyLeadContact, VacancyLeadRate } from "./types";

export const LEAD_LIMITS = {
  text: 160,
  leads: 50,
} as const;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const readText = (value: unknown): string =>
  typeof value === "string" ? value.trim().slice(0, LEAD_LIMITS.text) : "";

const readNumber = (value: unknown): number | null => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
};

const readCount = (value: unknown): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 0;
};

const readRate = (value: unknown): VacancyLeadRate => {
  if (!isRecord(value)) return { minimum: null, maximum: null, unit: "", currency: "" };
  return {
    minimum: readNumber(value.minimum),
    maximum: readNumber(value.maximum),
    unit: readText(value.unit),
    currency: readText(value.currency),
  };
};

const readContact = (value: unknown): VacancyLeadContact => {
  if (!isRecord(value)) return { name: "", email: "", phone: "", organisation: "" };
  return {
    name: readText(value.name),
    email: readText(value.email),
    phone: readText(value.phone),
    organisation: readText(value.organisation),
  };
};

const readVerdictCounts = (value: unknown) => {
  if (!isRecord(value)) return { inRecord: 0, partly: 0, notInRecord: 0 };
  return {
    inRecord: readCount(value.inRecord),
    partly: readCount(value.partly),
    notInRecord: readCount(value.notInRecord),
  };
};

const readLead = (value: unknown): VacancyLead | null => {
  if (!isRecord(value)) return null;
  const sessionId = readText(value.sessionId);
  if (!sessionId) return null;
  return {
    sessionId,
    title: readText(value.title),
    endClient: readText(value.endClient),
    intermediary: readText(value.intermediary),
    contractForm: readText(value.contractForm),
    location: readText(value.location),
    closingDate: readText(value.closingDate),
    rate: readRate(value.rate),
    contact: readContact(value.contact),
    verdictCounts: readVerdictCounts(value.verdictCounts),
  };
};

export function normalizeVacancyLeads(value: unknown): VacancyLead[] {
  const entries = Array.isArray(value)
    ? value
    : isRecord(value) && Array.isArray(value.leads)
      ? value.leads
      : [];
  const leads: VacancyLead[] = [];
  for (const entry of entries.slice(0, LEAD_LIMITS.leads)) {
    const lead = readLead(entry);
    if (lead) leads.push(lead);
  }
  return leads;
}

export function digestSinceDate(now: Date, days = 7): string {
  const since = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  return since.toISOString().slice(0, 10);
}
