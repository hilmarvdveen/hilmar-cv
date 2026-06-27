import { WorkMode } from "@/data/workHistory";

export type TranslatedWorkEntry = {
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
  