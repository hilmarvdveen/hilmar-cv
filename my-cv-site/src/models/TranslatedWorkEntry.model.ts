import { WorkMode } from "../../public/data/workHistory";

export interface TranslatedWorkEntry {
    company: string;
    location: string;
    role: string;
    mode: WorkMode;
    language: string;
    heading?: string;
    body: {
      title: string;
      paragraph: string;
    }[];
  }
  