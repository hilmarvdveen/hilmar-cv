import { mergeClasses } from "@/lib/mergeClasses";

type SectionTitleProps = {
  title: string;
  eyebrow?: string;
  subtitle?: string;
  align?: "left" | "center";
  onDark?: boolean;
  id?: string;
  className?: string;
};

export const SectionTitle = ({
  title,
  eyebrow,
  subtitle,
  align = "left",
  onDark = false,
  id,
  className,
}: SectionTitleProps) => (
  <div
    className={mergeClasses(
      "mb-10 max-w-3xl",
      align === "center" && "text-center mx-auto",
      className
    )}
  >
    {eyebrow && (
      <p
        className={mergeClasses(
          "mb-3 text-xs font-bold uppercase tracking-widest",
          onDark ? "text-emerald-300" : "text-primary"
        )}
      >
        {eyebrow}
      </p>
    )}
    <h2
      id={id}
      className={mergeClasses("text-section-title text-balance", onDark ? "text-white" : "text-textMain")}
    >
      {title}
    </h2>
    {subtitle && (
      <p
        className={mergeClasses(
          "mt-3 text-lg leading-relaxed",
          onDark ? "text-slate-300" : "text-gray-600"
        )}
      >
        {subtitle}
      </p>
    )}
  </div>
);
