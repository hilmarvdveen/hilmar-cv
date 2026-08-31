import { useTranslations } from "next-intl";
import { Section } from "@/components/Section";
import { Container } from "@/components/Container";
import { Card } from "@/components/Card";
import { SectionTitle } from "@/components/SectionTitle";
import { Shield, Accessibility, ClipboardCheck } from "lucide-react";

type StandardsColumn = {
  title: string;
  body: string;
};

const columnIcons = [Shield, Accessibility, ClipboardCheck];

export const StandardsSection = () => {
  const t = useTranslations("home.standards");
  const columns = t.raw("columns") as StandardsColumn[];

  return (
    <Section background="white" padding="default" aria-labelledby="standards-heading">
      <Container>
        <SectionTitle id="standards-heading" title={t("title")} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {columns.map((column, index) => {
            const ColumnIcon = columnIcons[index];
            return (
              <Card key={column.title} className="bg-bgLight">
                <ColumnIcon className="w-6 h-6 text-primary mb-3" />
                <h3 className="text-lg font-bold text-textMain mb-2">
                  {column.title}
                </h3>
                <p className="text-[14.5px] leading-relaxed text-gray-600">
                  {column.body}
                </p>
              </Card>
            );
          })}
        </div>
      </Container>
    </Section>
  );
};
