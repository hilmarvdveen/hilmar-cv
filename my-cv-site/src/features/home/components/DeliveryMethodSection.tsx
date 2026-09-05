import { useTranslations } from "next-intl";
import { Section } from "@/components/Section";
import { Container } from "@/components/Container";
import { SectionTitle } from "@/components/SectionTitle";

type MethodStep = {
  title: string;
  body: string;
};

export const DeliveryMethodSection = () => {
  const t = useTranslations("home.method");
  const steps = t.raw("steps") as MethodStep[];

  return (
    <Section background="navy" aria-labelledby="method-heading">
      <div data-track-section="method">
      <Container>
        <SectionTitle
          id="method-heading"
          title={t("title")}
          subtitle={t("subtitle")}
          onDark
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="border-t-2 border-emerald-300/50 pt-4"
            >
              <p className="text-[13px] font-bold text-emerald-300 mb-2">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="text-base font-bold text-white mb-2">
                {step.title}
              </h3>
              <p className="text-[13.5px] leading-relaxed text-slate-400">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </Container>
      </div>
    </Section>
  );
};
