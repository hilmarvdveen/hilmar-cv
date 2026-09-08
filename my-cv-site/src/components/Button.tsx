import { Link } from "@/i18n/navigation";
import { mergeClasses } from "@/lib/mergeClasses";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

export type ButtonVariant =
  | "primary"
  | "outline"
  | "outlineOnDark"
  | "white"
  | "neutral";
export type ButtonSize = "sm" | "md" | "lg";

const BASE =
  "group inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-semibold " +
  "transition-colors duration-200 focus:outline-none focus-visible:ring-2 " +
  "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none";

const SIZES: Record<ButtonSize, string> = {
  sm: "px-3.5 py-2 text-sm",
  md: "px-5 py-2.5 text-base",
  lg: "px-6 py-3 text-lg",
};

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    "bg-emerald-700 text-white hover:bg-emerald-800 active:bg-emerald-900 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 shadow-sm hover:shadow-md",
  outline:
    "border-2 border-emerald-600 text-emerald-700 hover:bg-emerald-700 hover:text-white active:bg-emerald-800 active:text-white focus-visible:ring-emerald-500",
  outlineOnDark:
    "border-2 border-emerald-500/60 text-emerald-300 hover:bg-emerald-700 hover:text-white hover:border-emerald-700 active:bg-emerald-800 active:text-white focus-visible:ring-emerald-400",
  white:
    "bg-white text-emerald-700 hover:bg-emerald-50 active:bg-emerald-100 focus-visible:ring-white shadow-sm hover:shadow-md",
  neutral:
    "bg-gray-100 text-gray-800 border border-gray-300 hover:bg-gray-200 active:bg-gray-300 focus-visible:ring-gray-400",
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
  return mergeClasses(BASE, SIZES[size], VARIANTS[variant], className);
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
