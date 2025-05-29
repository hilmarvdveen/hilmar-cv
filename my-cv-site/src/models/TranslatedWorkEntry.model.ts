import { WorkMode } from "../data/workHistory";

export interface TranslatedWorkEntry {
    company: string;
    location: string;
    role: string;
    mode: WorkMode;
    language: string;
    body: {
      title: string;
      paragraph: string;
    }[];
    heading?: string;
  }
  