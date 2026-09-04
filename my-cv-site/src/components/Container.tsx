import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export type ContainerWidth = "default" | "narrow" | "prose";

const WIDTHS: Record<ContainerWidth, string> = {
  default: "max-w-7xl",
  narrow: "max-w-4xl",
  prose: "max-w-3xl",
};

type ContainerProps = {
  width?: ContainerWidth;
  className?: string;
  children: ReactNode;
};

export const Container = ({
  width = "default",
  className,
  children,
}: ContainerProps) => (
  <div className={twMerge(WIDTHS[width], "mx-auto px-4 sm:px-6", className)}>
    {children}
  </div>
);
