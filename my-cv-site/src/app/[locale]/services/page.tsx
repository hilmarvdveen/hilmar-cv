import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { ServicesHero } from "@/features/services";
import { Section } from "@/components/Section";
import { Container } from "@/components/Container";
import { Card } from "@/components/Card";
import { SectionTitle } from "@/components/SectionTitle";
import { Button } from "@/components/Button";
import { ArrowRight, CheckCircle, Code, Palette, Users, Zap } from "lucide-react";
import { SEOFactory } from "@/lib/seo";
import type { Locale } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const seoData = SEOFactory.services(locale as Locale);

  return seoData.metadata;
}

export default async function ServicesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("services");

  const seoData = SEOFactory.services(locale as Locale);

  const services = [
    {
      id: "frontend",
      title: t("main.services.frontend.title"),
      Icon: Code,
      shortDescription: t("main.services.frontend.shortDescription"),
      fullDescription: t("main.services.frontend.fullDescription"),
      technologies: [
        "React",
        "Angular",
        "TypeScript",
        "Next.js",
        "React Router",
        "RxJS",
        "GraphQL",
        "Tailwind CSS",
        "Storybook",
      ],
      benefits: t.raw("main.services.frontend.benefits.items") as string[],
      href: "/services/frontend",
    },
    {
      id: "fullstack",
      title: t("main.services.fullstack.title"),
      Icon: Zap,
      shortDescription: t("main.services.fullstack.shortDescription"),
      fullDescription: t("main.services.fullstack.fullDescription"),
      technologies: [
        "React",
        "Angular",
        "TypeScript",
        ".NET Core",
        "Kotlin",
        "GraphQL",
        "REST",
        "MSSQL",
        "MySQL",
        "Docker",
        "Kubernetes",
      ],
      benefits: t.raw("main.services.fullstack.benefits.items") as string[],
      href: "/services/fullstack",
    },
    {
      id: "designSystems",
      title: t("main.services.designSystems.title"),
      Icon: Palette,
      shortDescription: t("main.services.designSystems.shortDescription"),
      fullDescription: t("main.services.designSystems.fullDescription"),
      technologies: [
        "Stencil",
        "Web Components",
        "Storybook",
        "Tailwind CSS",
        "SCSS",
        "Design Tokens",
        "WCAG 2.1 and 2.2 AA",
        "Storyblok",
      ],
      benefits: t.raw("main.services.designSystems.benefits.items") as string[],
      href: "/services/design-systems",
    },
    {
      id: "consulting",
      title: t("main.services.consulting.title"),
      Icon: Users,
      shortDescription: t("main.services.consulting.shortDescription"),
      fullDescription: t("main.services.consulting.fullDescription"),
      technologies: [
        "Angular",
        "React",
        "RxJS",
        "GraphQL",
        "Nx",
        "Playwright",
        "Vitest",
        "Azure DevOps",
        "GitLab CI",
      ],
      benefits: t.raw("main.services.consulting.benefits.items") as string[],
      href: "/services/consulting",
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: seoData.structuredData,
        }}
      />

      <ServicesHero />

      <Section background="light" aria-labelledby="services-overview-heading">
        <Container>
          <SectionTitle
            id="services-overview-heading"
            title={t("main.title")}
            subtitle={t("main.description")}
            align="center"
          />

          <div className="grid gap-8 lg:grid-cols-2">
            {services.map((service) => (
              <Card
                key={service.id}
                className="transition-shadow duration-300 hover:shadow-lg"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                    <service.Icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-textMain">
                      {service.title}
                    </h3>
                    <p className="mt-1 text-gray-600">
                      {service.shortDescription}
                    </p>
                  </div>
                </div>

                <p className="mt-6 leading-relaxed text-gray-700">
                  {service.fullDescription}
                </p>

                <div className="mt-6">
                  <h4 className="mb-3 font-semibold text-textMain">
                    {t("main.services.frontend.technologies.title")}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {service.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="mb-3 font-semibold text-textMain">
                    {t("main.services.frontend.benefits.title")}
                  </h4>
                  <ul className="space-y-2">
                    {service.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-center gap-2">
                        <CheckCircle
                          className="h-4 w-4 text-emerald-700"
                          aria-hidden="true"
                        />
                        <span className="text-gray-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  href={service.href}
                  variant="outline"
                  size="sm"
                  className="mt-8"
                >
                  <span>{t("main.learnMore")}</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <Section background="navy" aria-labelledby="services-final-cta-heading">
        <Container width="narrow">
          <SectionTitle
            id="services-final-cta-heading"
            title={t("finalCta.title")}
            subtitle={t("finalCta.description")}
            align="center"
            onDark
          />

          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button href="/book" variant="primary" size="lg">
              {t("finalCta.bookConsultation")}
            </Button>
            <Button href="/contact" variant="outlineOnDark" size="lg">
              {t("finalCta.getInTouch")}
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
