import { Link } from "@/i18n/navigation";
import { twMerge } from "tailwind-merge";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

/**
 * Single source of truth for CTA buttons across the site. Centralising the
 * colour/shading here means accessibility (AA contrast) and hover feedback are
 * fixed in one place. Renders as a <button>, a Next <Link> (internal href), or
 * an <a> (external/mailto/tel href) depending on the props passed.
 *
 * Variants:
 *  - primary       filled emerald (white text) for the main action
 *  - outline       emerald border + text on light backgrounds
 *  - outlineOnDark emerald outline that reads on dark/navy sections
 *  - white         white fill (emerald text) for use on dark/coloured CTAs
 */
export type ButtonVariant =
  | "primary"
  | "outline"
  | "outlineOnDark"
  | "white"
  | "neutral";
export type ButtonSize = "sm" | "md" | "lg";

const BASE =
  "group inline-flex items-center justify-center gap-2 rounded-lg font-semibold " +
  "transition-all duration-200 focus:outline-none focus-visible:ring-2 " +
  "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none";

const SIZES: Record<ButtonSize, string> = {
  sm: "px-4 py-2.5 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-base",
};

// Every filled state stays at emerald-700+ (>= 4.5:1 on white text) and darkens
// on hover; outline variants fill on hover. No state lightens under white text.
const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    "bg-emerald-700 text-white hover:bg-emerald-800 focus-visible:ring-emerald-500 shadow-sm hover:shadow-lg hover:scale-105",
  outline:
    "border-2 border-emerald-600 text-emerald-700 hover:bg-emerald-700 hover:text-white focus-visible:ring-emerald-500",
  outlineOnDark:
    "border-2 border-emerald-500/60 text-emerald-300 hover:bg-emerald-700 hover:text-white hover:border-emerald-700 focus-visible:ring-emerald-400",
  white:
    "bg-white text-emerald-700 hover:bg-emerald-50 focus-visible:ring-white shadow-sm hover:shadow-lg hover:scale-105",
  neutral:
    "bg-gray-100 text-gray-800 border border-gray-300 hover:bg-gray-200 focus-visible:ring-gray-400",
};

export function buttonClassName({
  variant = "primary",
  size = "md",
  className = "",
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}): string {
  // twMerge so caller `className` (e.g. w-full, rounded-xl) reliably overrides
  // the variant/size defaults instead of producing conflicting utilities.
  return twMerge(BASE, SIZES[size], VARIANTS[variant], className);
}

type StyleProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
};

type ButtonOwnProps = StyleProps & { href?: undefined };
type LinkOwnProps = StyleProps & { href: string };

type ButtonProps = ButtonOwnProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof StyleProps | "href">;
type LinkProps = LinkOwnProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof StyleProps | "href">;

const isExternal = (href: string) => /^(https?:|mailto:|tel:|#)/.test(href);

export function Button(props: ButtonProps): React.JSX.Element;
export function Button(props: LinkProps): React.JSX.Element;
export function Button(props: ButtonProps | LinkProps): React.JSX.Element {
  const { variant, size, className, children, href, ...rest } = props as
    & StyleProps
    & { href?: string }
    & Record<string, unknown>;
  const cls = buttonClassName({ variant, size, className });

  if (typeof href === "string") {
    if (isExternal(href)) {
      return (
        <a
          href={href}
          className={cls}
          {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {children}
        </a>
      );
    }
    return (
      <Link
        href={href}
        className={cls}
        {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      className={cls}
      {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </button>
  );
}
