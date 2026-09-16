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
