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

/**
 * Shared content container. Owns the max width and horizontal padding of
 * page content so every section aligns to the same grid.
 */
export const Container = ({
  width = "default",
  className,
  children,
}: ContainerProps) => (
  <div className={twMerge(WIDTHS[width], "mx-auto px-6", className)}>
    {children}
  </div>
);
