import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export type SectionBackground = "white" | "light" | "navy";
export type SectionPadding = "default" | "compact" | "spacious";

const BACKGROUNDS: Record<SectionBackground, string> = {
  white: "bg-white",
  light: "bg-bgLight",
  navy: "bg-brand-navy",
};

const PADDINGS: Record<SectionPadding, string> = {
  compact: "py-12 sm:py-14",
  default: "py-16 sm:py-20",
  spacious: "py-20 sm:py-24",
};

type SectionProps = {
  background?: SectionBackground;
  padding?: SectionPadding;
  className?: string;
  id?: string;
  "aria-labelledby"?: string;
  children: ReactNode;
};

export const Section = ({
  background = "white",
  padding = "default",
  className,
  id,
  "aria-labelledby": ariaLabelledby,
  children,
}: SectionProps) => (
  <section
    id={id}
    aria-labelledby={ariaLabelledby}
    className={twMerge(BACKGROUNDS[background], PADDINGS[padding], className)}
  >
    {children}
  </section>
);
