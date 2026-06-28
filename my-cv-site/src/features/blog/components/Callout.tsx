import type { ReactNode } from "react";
import { Info, Lightbulb, AlertTriangle, CheckCircle2 } from "lucide-react";

export type CalloutVariant = "info" | "tip" | "warning" | "success";

type CalloutProps = {
  variant?: CalloutVariant;
  title?: string;
  children: ReactNode;
};

const STYLES: Record<
  CalloutVariant,
  { wrap: string; icon: string; title: string; Icon: typeof Info }
> = {
  info: {
    wrap: "border-blue-200 bg-blue-50",
    icon: "text-blue-600",
    title: "text-blue-900",
    Icon: Info,
  },
  tip: {
    wrap: "border-emerald-200 bg-emerald-50",
    icon: "text-emerald-600",
    title: "text-emerald-900",
    Icon: Lightbulb,
  },
  warning: {
    wrap: "border-amber-200 bg-amber-50",
    icon: "text-amber-600",
    title: "text-amber-900",
    Icon: AlertTriangle,
  },
  success: {
    wrap: "border-green-200 bg-green-50",
    icon: "text-green-600",
    title: "text-green-900",
    Icon: CheckCircle2,
  },
};

/** Coloured aside for tips, warnings and key notes inside an article. */
export function Callout({ variant = "info", title, children }: CalloutProps) {
  const style = STYLES[variant];
  const { Icon } = style;
  return (
    <div className={`my-6 flex gap-3 rounded-xl border p-4 ${style.wrap}`} role="note">
      <Icon className={`mt-0.5 h-5 w-5 flex-shrink-0 ${style.icon}`} aria-hidden="true" />
      <div className="text-[1.0625rem] leading-relaxed text-gray-700">
        {title && <p className={`mb-1 font-semibold ${style.title}`}>{title}</p>}
        {children}
      </div>
    </div>
  );
}
