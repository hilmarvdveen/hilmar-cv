import type {
  VacancyLead,
  VacancyLeadContact,
  VacancyLeadRate,
  VacancyLeadRecord,
} from "./types";

export const LEAD_LIMITS = {
  text: 160,
  requirements: 30,
  leads: 50,
} as const;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const readText = (value: unknown): string => {
  if (typeof value === "string") return value.trim().slice(0, LEAD_LIMITS.text);
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return "";
};

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

const readTextList = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];
  return value
    .map(readText)
    .filter((entry) => entry !== "")
    .slice(0, LEAD_LIMITS.requirements);
};

const readLead = (value: unknown): VacancyLead => {
  if (!isRecord(value)) {
    return {
      title: "",
      endClient: "",
      intermediary: "",
      contractForm: "",
      location: "",
      workMode: "",
      hoursPerWeek: "",
      startDate: "",
      durationMonths: "",
      extensionOptions: "",
      closingDate: "",
      rate: readRate(null),
      contact: readContact(null),
    };
  }
  return {
    title: readText(value.title),
    endClient: readText(value.endClient),
    intermediary: readText(value.intermediary),
    contractForm: readText(value.contractForm),
    location: readText(value.location),
    workMode: readText(value.workMode),
    hoursPerWeek: readText(value.hoursPerWeek),
    startDate: readText(value.startDate),
    durationMonths: readText(value.durationMonths),
    extensionOptions: readText(value.extensionOptions),
    closingDate: readText(value.closingDate),
    rate: readRate(value.rate),
    contact: readContact(value.contact),
  };
};

export function readVacancyLeadRecord(value: unknown): VacancyLeadRecord | null {
  if (!isRecord(value)) return null;
  const sessionId = readText(value.sessionId);
  if (!sessionId) return null;
  return {
    sessionId,
    sessionIds: readTextList(value.sessionIds),
    lead: readLead(value.lead),
    verdictCounts: readVerdictCounts(value.verdictCounts),
    notInRecord: readTextList(value.notInRecord),
    requesterEmailDomain: readText(value.requesterEmailDomain),
    seenCount: readCount(value.seenCount),
    firstSeenAt: readText(value.firstSeenAt),
    lastSeenAt: readText(value.lastSeenAt),
  };
}

export function normalizeVacancyLeads(value: unknown): VacancyLeadRecord[] {
  const entries = Array.isArray(value)
    ? value
    : isRecord(value) && Array.isArray(value.leads)
      ? value.leads
      : [];
  const records: VacancyLeadRecord[] = [];
  for (const entry of entries.slice(0, LEAD_LIMITS.leads)) {
    const record = readVacancyLeadRecord(entry);
    if (record) records.push(record);
  }
  return records;
}

export function digestSinceDate(now: Date, days = 7): string {
  const since = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  return since.toISOString().slice(0, 10);
}
