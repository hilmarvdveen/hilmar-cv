import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

type CardProps = {
  className?: string;
  children: ReactNode;
};

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
