import type { ComponentType, ReactNode } from "react";
import { Section } from "@/components/Section";
import { Container } from "@/components/Container";

const DEFAULT_TITLE_ID = "page-hero-title";

type PageHeroProps = {
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
};

export const PageHero = ({
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
}: PageHeroProps) => {
  const headingId = titleId ?? DEFAULT_TITLE_ID;

  const heroContent = (
    <>
      {badge && (
        <p className="mb-4 inline-flex items-center gap-2 text-[13px] font-bold uppercase tracking-widest text-emerald-300">
          {BadgeIcon && <BadgeIcon className="h-4 w-4" aria-hidden="true" />}
          {badge}
        </p>
      )}
      <h1
        id={headingId}
        className="text-[1.75rem] leading-[1.15] sm:text-5xl font-extrabold tracking-tight text-white text-balance"
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
        <div className="mt-8 flex flex-col gap-4 sm:flex-row">{actions}</div>
      )}
    </>
  );

  return (
    <Section background="navy" aria-labelledby={headingId}>
      <Container>
        {breadcrumb}
        {aside ? (
          <div className="grid gap-12 md:grid-cols-2 lg:gap-16 items-center">
            <div>{heroContent}</div>
            <div>{aside}</div>
          </div>
        ) : (
          <div className="max-w-4xl">{heroContent}</div>
        )}
      </Container>
    </Section>
  );
};
