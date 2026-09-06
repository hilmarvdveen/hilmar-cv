import type { ComponentType } from "react";
import { Link } from "@/i18n/navigation";
import { CheckCircle } from "lucide-react";
import { Breadcrumb } from "@/components/Breadcrumb";
import { PageHero } from "@/components/PageHero";
import { Section, type SectionBackground } from "@/components/Section";
import { Container } from "@/components/Container";
import { Card } from "@/components/Card";
import { SectionTitle } from "@/components/SectionTitle";
import { Button } from "@/components/Button";

export type ServiceIcon = ComponentType<{ className?: string }>;

export type ServiceTitledItem = {
  title: string;
  description: string;
  Icon: ServiceIcon;
};

export type ServiceTechnologyItem = {
  name: string;
};

export type ServiceTechnologyGroup = {
  name?: string;
  items: ServiceTechnologyItem[];
};

export type ServiceProcessStep = {
  label?: string;
  title: string;
  description: string;
  details: string[];
  Icon: ServiceIcon;
};

export type ServiceEngagementDeliverable = {
  title: string;
  description: string;
};

export type ServiceDetailPageProps = {
  structuredData: string;
  hero: {
    badge: string;
    Icon: ServiceIcon;
    title: string;
    titleAccent: string;
    description: string;
    features: string[];
    bookLabel: string;
    actionLabel: string;
  };
  engagement: {
    title: string;
    description: string;
    deliverables: ServiceEngagementDeliverable[];
    terms: string[];
    termsLabel: string;
  };
  deliverables?: {
    title: string;
    description: string;
    items: ServiceTitledItem[];
  };
  benefits: {
    title: string;
    description: string;
    items: ServiceTitledItem[];
    article?: { href: string; label: string };
  };
  technologies?: {
    title: string;
    description: string;
    groups: ServiceTechnologyGroup[];
  };
  process: {
    title: string;
    description: string;
    steps: ServiceProcessStep[];
  };
  callToAction: {
    title: string;
    description: string;
    bookLabel: string;
    viewAllLabel: string;
  };
};

const flipBackground = (background: SectionBackground): SectionBackground =>
  background === "white" ? "light" : "white";

const TitledItemCard = ({ title, description, Icon }: ServiceTitledItem) => (
  <Card>
    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
      <Icon className="h-6 w-6" aria-hidden="true" />
    </div>
    <h3 className="mt-4 text-lg font-bold text-textMain">{title}</h3>
    <p className="mt-2 text-gray-600">{description}</p>
  </Card>
);

export const ServiceDetailPage = ({
  structuredData,
  hero,
  engagement,
  deliverables,
  benefits,
  technologies,
  process,
  callToAction,
}: ServiceDetailPageProps) => {
  const deliverablesBackground = flipBackground("white");
  const benefitsBackground = deliverables
    ? flipBackground(deliverablesBackground)
    : flipBackground("white");
  const technologiesBackground = flipBackground(benefitsBackground);
  const processBackground = flipBackground(technologiesBackground);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: structuredData }}
      />

      <PageHero
        breadcrumb={<Breadcrumb />}
        badge={hero.badge}
        badgeIcon={hero.Icon}
        title={hero.title}
        titleAccent={hero.titleAccent}
        description={hero.description}
        actions={
          <>
            <Button href="/book" variant="primary" size="lg" data-placement="service-hero">
              {hero.bookLabel}
            </Button>
            <Button href="/contact" variant="outlineOnDark" size="lg">
              {hero.actionLabel}
            </Button>
          </>
        }
      >
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {hero.features.map((feature) => (
            <li key={feature} className="flex items-center gap-3 text-slate-200">
              <CheckCircle
                className="h-4 w-4 shrink-0 text-emerald-400"
                aria-hidden="true"
              />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </PageHero>

      <Section background="navy" padding="compact">
        <Container>
          <ul
            aria-label={engagement.termsLabel}
            className="flex flex-wrap justify-center gap-2"
          >
            {engagement.terms.map((term) => (
              <li
                key={term}
                className="rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-200 sm:rounded-lg sm:px-4 sm:py-2 sm:text-sm"
              >
                {term}
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section background="white" aria-labelledby="service-engagement-heading">
        <Container>
          <SectionTitle
            id="service-engagement-heading"
            title={engagement.title}
            subtitle={engagement.description}
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {engagement.deliverables.map((deliverable, index) => (
              <Card key={deliverable.title}>
                <p className="text-xs font-bold uppercase tracking-widest text-emerald-700">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-3 text-lg font-bold text-textMain">
                  {deliverable.title}
                </h3>
                <p className="mt-2 text-gray-600">{deliverable.description}</p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {deliverables && (
        <Section
          background={deliverablesBackground}
          aria-labelledby="service-deliverables-heading"
        >
          <Container>
            <SectionTitle
              id="service-deliverables-heading"
              title={deliverables.title}
              subtitle={deliverables.description}
            />
            <div className="grid gap-6 sm:grid-cols-2">
              {deliverables.items.map((item) => (
                <TitledItemCard key={item.title} {...item} />
              ))}
            </div>
          </Container>
        </Section>
      )}

      <Section background={benefitsBackground} aria-labelledby="service-benefits-heading">
        <Container>
          <SectionTitle
            id="service-benefits-heading"
            title={benefits.title}
            subtitle={benefits.description}
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.items.map((item) => (
              <TitledItemCard key={item.title} {...item} />
            ))}
          </div>
          {benefits.article && (
            <p className="mt-6 text-center text-sm text-gray-600">
              <Link href={benefits.article.href} className="inline-flex min-h-6 items-center rounded-md font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2">
                {benefits.article.label}
              </Link>
            </p>
          )}
        </Container>
      </Section>

      {technologies && (
        <Section
          background={technologiesBackground}
          aria-labelledby="service-technologies-heading"
        >
          <Container>
            <SectionTitle
              id="service-technologies-heading"
              title={technologies.title}
              subtitle={technologies.description}
            />
            <div className="space-y-10">
              {technologies.groups.map((group, groupIndex) => (
                <div key={group.name ?? `technology-group-${groupIndex}`}>
                  {group.name && (
                    <h3 className="mb-4 text-xl font-bold text-textMain">{group.name}</h3>
                  )}
                  <ul
                    aria-label={group.name ?? technologies.title}
                    className="flex flex-wrap gap-2"
                  >
                    {group.items.map((item) => (
                      <li
                        key={item.name}
                        className="rounded-full bg-bgLight px-3 py-1 text-sm font-medium text-textMain ring-1 ring-gray-200"
                      >
                        {item.name}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Container>
        </Section>
      )}

      <Section background={processBackground} aria-labelledby="service-process-heading">
        <Container>
          <SectionTitle
            id="service-process-heading"
            title={process.title}
            subtitle={process.description}
          />
          <div className="grid gap-8 lg:grid-cols-2">
            {process.steps.map((step, index) => (
              <Card key={step.title}>
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                    <step.Icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="mb-1 text-xs font-bold uppercase tracking-widest text-emerald-700">
                      {String(index + 1).padStart(2, "0")}
                    </p>
                    <h3 className="text-xl font-bold text-textMain">{step.title}</h3>
                    <p className="mt-2 text-gray-600">{step.description}</p>
                  </div>
                </div>
                <ul className="mt-6 space-y-2">
                  {step.details.map((detail) => (
                    <li key={detail} className="flex items-center gap-2 text-gray-700">
                      <CheckCircle
                        className="h-4 w-4 shrink-0 text-emerald-700"
                        aria-hidden="true"
                      />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <Section background="navy" aria-labelledby="service-cta-heading">
        <Container width="narrow">
          <SectionTitle
            id="service-cta-heading"
            title={callToAction.title}
            subtitle={callToAction.description}
            align="center"
            onDark
          />
          <div className="flex justify-center">
            <Button href="/book" variant="white" size="lg" data-placement="service-close">
              {callToAction.bookLabel}
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
};
