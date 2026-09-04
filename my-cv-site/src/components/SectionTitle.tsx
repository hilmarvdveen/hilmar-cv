import { twMerge } from "tailwind-merge";

export type SectionTitleSize = "display" | "default" | "compact";

const SIZES: Record<SectionTitleSize, string> = {
  display: "text-3xl sm:text-4xl md:text-5xl",
  default: "text-3xl md:text-4xl",
  compact: "text-[26px] leading-[1.15] sm:text-3xl md:text-4xl",
};

type SectionTitleProps = {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  size?: SectionTitleSize;
  onDark?: boolean;
  id?: string;
  className?: string;
};

export const SectionTitle = ({
  title,
  subtitle,
  align = "left",
  size = "default",
  onDark = false,
  id,
  className,
}: SectionTitleProps) => (
  <div
    className={twMerge(
      "mb-10 max-w-3xl",
      align === "center" && "text-center mx-auto",
      className
    )}
  >
    <h2
      id={id}
      className={twMerge(
        SIZES[size],
        "font-extrabold tracking-tight text-balance",
        onDark ? "text-white" : "text-textMain"
      )}
    >
      {title}
    </h2>
    {subtitle && (
      <p
        className={twMerge(
          "mt-3 text-lg leading-relaxed",
          onDark ? "text-slate-300" : "text-gray-600"
        )}
      >
        {subtitle}
      </p>
    )}
  </div>
);
