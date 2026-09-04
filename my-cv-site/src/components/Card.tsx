import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export type CardVariant = "default" | "tinted";

const VARIANTS: Record<CardVariant, string> = {
  default: "bg-white border-gray-200",
  tinted: "bg-bgLight border-gray-200",
};

type CardProps = {
  variant?: CardVariant;
  className?: string;
  children: ReactNode;
};

export const Card = ({ variant = "default", className, children }: CardProps) => (
  <div
    className={twMerge(
      "rounded-xl border shadow-sm p-7",
      VARIANTS[variant],
      className
    )}
  >
    {children}
  </div>
);
