import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

type CardProps = {
  className?: string;
  children: ReactNode;
};

/**
 * Shared card surface: white, rounded, hairline border, soft shadow. The
 * pattern previously hand-rolled across features as
 * "bg-white rounded-xl border border-gray-200 shadow-sm p-*".
 */
export const Card = ({ className, children }: CardProps) => (
  <div
    className={twMerge(
      "bg-white rounded-xl border border-gray-200 shadow-sm p-7",
      className
    )}
  >
    {children}
  </div>
);
