export type FitLocale = "nl" | "en";

export type FitVerdict = "inRecord" | "partly" | "notInRecord";

export type FitRefusalReason =
  | "tooShort"
  | "notAVacancy"
  | "codeBlock"
  | "encodedBlob"
  | "tooManyLinks"
  | "instruction";

export type FitEngagementReference = {
  id: string;
  company: string;
};

export type FitRequirement = {
  requirement: string;
  verdict: FitVerdict;
  note: string;
  engagements: FitEngagementReference[];
};

export type FitTechnology = {
  name: string;
  years: number;
  engagements: string[];
};

export type FitReport = {
  summary: string;
  requirements: FitRequirement[];
  technologies: FitTechnology[];
};

export type FitAnswer = {
  answer: string;
  engagements: FitEngagementReference[];
};

export type FitVerdictCounts = Record<FitVerdict, number>;

export type FitTechnologyDuration = {
  unit: "years" | "months";
  value: number;
};

export type FitReportResponse = {
  report: FitReport;
  sessionId: string;
};

export type FitAnswerResponse = {
  answer: FitAnswer;
};

export type FitStoredResult = {
  report: FitReport;
  vacancy: string;
  locale: FitLocale;
  title: string;
  createdAt: string;
  hasCv: boolean;
};

export type FitCvStatus = {
  ready: boolean;
  pages: number;
  failed: boolean;
};

export type VacancyLeadRate = {
  minimum: number | null;
  maximum: number | null;
  unit: string;
  currency: string;
};

export type VacancyLeadContact = {
  name: string;
  email: string;
  phone: string;
  organisation: string;
};

export type VacancyLead = {
  title: string;
  endClient: string;
  intermediary: string;
  contractForm: string;
  location: string;
  workMode: string;
  hoursPerWeek: string;
  startDate: string;
  durationMonths: string;
  extensionOptions: string;
  closingDate: string;
  rate: VacancyLeadRate;
  contact: VacancyLeadContact;
};

export type VacancyLeadRecord = {
  sessionId: string;
  sessionIds: string[];
  lead: VacancyLead;
  verdictCounts: FitVerdictCounts;
  notInRecord: string[];
  requesterEmailDomain: string;
  seenCount: number;
  firstSeenAt: string;
  lastSeenAt: string;
};
