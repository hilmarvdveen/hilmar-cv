import { extendTailwindMerge } from "tailwind-merge";

export const TYPE_ROLE_CLASSES = [
  "text-display",
  "text-section-title",
  "text-subsection-title",
  "text-figure",
  "text-code-inline",
];

export const mergeClasses = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": TYPE_ROLE_CLASSES,
    },
  },
});
