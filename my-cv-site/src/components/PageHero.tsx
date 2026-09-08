import type { ComponentType, ReactNode } from "react";
import { Section } from "@/components/Section";
import { Container, type ContainerWidth } from "@/components/Container";

const DEFAULT_TITLE_ID = "page-hero-title";

export type PageHeroAsideWidth = "half" | "rail";

const ASIDE_GRIDS: Record<PageHeroAsideWidth, string> = {
  half: "grid gap-12 md:grid-cols-2 lg:gap-16 items-center",
  rail: "grid gap-12 md:grid-cols-[1fr_320px] lg:gap-16 items-start",
};

type PageHeroProps = {
  width?: ContainerWidth;
  title: string;
  titleAccent?: string;
  description: string;
  badge?: string;
  badgeIcon?: ComponentType<{ className?: string }>;
  titleId?: string;
  breadcrumb?: ReactNode;
  children?: ReactNode;
  actions?: ReactNode;
  aside?: ReactNode;
  asideWidth?: PageHeroAsideWidth;
  asideLeadsOnMobile?: boolean;
};

export const PageHero = ({
  width = "default",
  title,
  titleAccent,
  description,
  badge,
  badgeIcon: BadgeIcon,
  titleId,
  breadcrumb,
  children,
  actions,
  aside,
  asideWidth = "half",
  asideLeadsOnMobile = false,
}: PageHeroProps) => {
  const headingId = titleId ?? DEFAULT_TITLE_ID;

  const heroContent = (
    <>
      {badge && (
        <p className="mb-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-300">
          {BadgeIcon && <BadgeIcon className="h-4 w-4" aria-hidden="true" />}
          {badge}
        </p>
      )}
      <h1
        id={headingId}
        className="text-display text-white text-balance"
      >
        {title}{" "}
        {titleAccent && (
          <span className="block text-emerald-300">{titleAccent}</span>
        )}
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-300">
        {description}
      </p>
      {children && <div className="mt-6">{children}</div>}
      {actions && (
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          {actions}
        </div>
      )}
    </>
  );

  return (
    <Section background="navy" aria-labelledby={headingId}>
      <Container width={width}>
        {breadcrumb}
        {aside ? (
          <div className={ASIDE_GRIDS[asideWidth]}>
            <div>{heroContent}</div>
            <div className={asideLeadsOnMobile ? "order-first md:order-none" : undefined}>
              {aside}
            </div>
          </div>
        ) : (
          <div className="max-w-4xl">{heroContent}</div>
        )}
      </Container>
    </Section>
  );
};
