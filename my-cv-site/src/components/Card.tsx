import type { ReactNode } from "react";
import { mergeClasses } from "@/lib/mergeClasses";

export type CardVariant = "default" | "tinted" | "quiet";

const VARIANTS: Record<CardVariant, string> = {
  default: "bg-white border-gray-200",
  tinted: "bg-bgLight border-gray-200",
  quiet: "bg-transparent border-0 border-t-2 border-emerald-700 rounded-none shadow-none p-0 pt-4",
};

type CardProps = {
  variant?: CardVariant;
  className?: string;
  children: ReactNode;
};

export const Card = ({ variant = "default", className, children }: CardProps) => (
  <div
    className={mergeClasses(
      "rounded-xl border shadow-sm p-7",
      VARIANTS[variant],
      className
    )}
  >
    {children}
  </div>
);
