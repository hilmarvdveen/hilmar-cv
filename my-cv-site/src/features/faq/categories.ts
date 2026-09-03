export const FAQ_CATEGORY_IDS = [
  "general",
  "services",
  "pricing",
  "process",
  "collaboration",
] as const;

export type FaqCategoryId = (typeof FAQ_CATEGORY_IDS)[number];
