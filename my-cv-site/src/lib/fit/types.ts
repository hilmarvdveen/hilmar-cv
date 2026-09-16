export type FitLocale = "nl" | "en";

export type FitVerdict = "inRecord" | "partly" | "notInRecord";

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
  hasCv: boolean;
};

export type FitCvStatus = {
  ready: boolean;
  pages: number;
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
  sessionId: string;
  title: string;
  endClient: string;
  intermediary: string;
  contractForm: string;
  location: string;
  closingDate: string;
  rate: VacancyLeadRate;
  contact: VacancyLeadContact;
  verdictCounts: FitVerdictCounts;
};
