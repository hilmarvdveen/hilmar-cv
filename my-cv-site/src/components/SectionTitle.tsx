import { twMerge } from "tailwind-merge";

type SectionTitleProps = {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  onDark?: boolean;
  id?: string;
  className?: string;
};

/**
 * Shared section heading. Every section heading goes through this component
 * so the type scale and spacing stay consistent across the site.
 */
export const SectionTitle = ({
  title,
  subtitle,
  align = "left",
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
        "text-3xl md:text-4xl font-extrabold tracking-tight",
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
