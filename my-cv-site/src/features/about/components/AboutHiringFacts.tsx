import { useTranslations } from "next-intl";
import { Card } from "@/components/Card";
import { BUSINESS_PROFILE } from "@/lib/seo/constants/meta-constants";

type HiringFact = {
  label: string;
  value: string;
  detail?: string;
};

export const AboutHiringFacts = () => {
  const t = useTranslations("about");
  const facts = t.raw("hiring.facts") as HiringFact[];
  const identity = {
    company: BUSINESS_PROFILE.REGISTRATION.LEGAL_NAME,
    kvk: BUSINESS_PROFILE.REGISTRATION.KVK,
  };

  return (
    <Card variant="tinted">
      <dl className="grid gap-x-10 gap-y-6 sm:grid-cols-2">
        {facts.map((fact, index) => (
          <div key={fact.label}>
            <dt className="text-xs font-bold uppercase tracking-widest text-primary">
              {fact.label}
            </dt>
            <dd className="mt-1 text-base font-bold text-textMain">
              {t(`hiring.facts.${index}.value`, identity)}
              {fact.detail && (
                <span className="block text-sm font-normal text-gray-600">
                  {t(`hiring.facts.${index}.detail`, identity)}
                </span>
              )}
            </dd>
          </div>
        ))}
      </dl>
    </Card>
  );
};
