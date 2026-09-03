import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Section } from "@/components/Section";
import { Container } from "@/components/Container";
import { SectionTitle } from "@/components/SectionTitle";

type CarouselClient = {
  name: string;
  id: string;
  logo: string;
  color?: string;
}

const clients: CarouselClient[] = [
  { name: "bol.com", logo: "/logos/bol.svg", id: "bol" },
  { name: "Belastingdienst", logo: "/logos/belastingdienst.svg", id: "belastingdienst" },
  { name: "Randstad", logo: "/logos/randstad.svg", id: "randstad" },
  { name: "Athlon", logo: "/logos/athlon.svg", id: "athlon" },
  { name: "Conclusion", logo: "/logos/conclusion.svg", id: "conclusion" },
  { name: "Ortec", logo: "/logos/ortec.png", id: "ortec" },
  { name: "Omniplan", logo: "/logos/omniplan.svg", color: "#324e64", id: "omniplan" },
  { name: "Niped", logo: "/logos/niped.svg", id: "niped" },
  { name: "Opinity", logo: "/logos/opinity.png", id: "opinity" },
  { name: "Bluefield", logo: "/logos/bluefield.png", id: "bluefield" },
  { name: "Transdev", logo: "/logos/transdev.webp", color: "#DB0717", id: "transdev" },
  {
    name: "Nationale Postcode Loterij",
    logo: "/logos/nationale-postcode-loterij.png",
    id: "postcode-loterij",
  },
];

type ClientCardProps = {
  name: string;
  id: string;
  logo: string;
  color?: string;
  priority: boolean;
  position: number;
}

const ClientCard = ({
  name,
  id,
  logo,
  color,
  priority,
  position,
}: ClientCardProps) => {
  const commonT = useTranslations("common");

  return (
    <div
      className={`item ${color ? "branded" : ""}`}
      style={
        {
          "--position": position,
          "--brand-color": color || undefined,
          color: color || undefined,
        } as React.CSSProperties & {
          "--position": number;
          "--brand-color"?: string;
        }
      }
    >
      <Link
        href={`/experience#experience-${id}`}
        title={commonT("images.viewExperience", { company: name })}
        aria-label={commonT("images.viewExperience", { company: name })}
        className="flex h-full w-full items-center justify-center"
      >
        <Image
          src={logo}
          alt={commonT("images.companyLogoAlt", { company: name })}
          width={120}
          height={60}
          style={{ width: "auto", height: "auto" }}
          className="max-w-full max-h-full object-contain"
          loading={priority ? "eager" : "lazy"}
        />
      </Link>
    </div>
  );
};

export const ClientLogosCarousel = () => {
  const t = useTranslations("home.clientLogos");

  return (
    <Section background="light" className="overflow-hidden">
      <Container>
        <SectionTitle
          title={t("title")}
          subtitle={t("subtitle")}
          align="center"
          className="mb-6"
        />
        <p className="mb-12 text-center text-sm text-gray-600">{t("invite")}</p>

        <div
          className="slider"
          style={
            {
              "--width": "180px",
              "--height": "90px",
              "--quantity": clients.length,
            } as React.CSSProperties & {
              "--width": string;
              "--height": string;
              "--quantity": number;
            }
          }
        >
          <div className="list">
            {clients.map((client, index) => (
              <ClientCard
                key={client.name}
                name={client.name}
                id={client.id}
                logo={client.logo}
                color={client.color}
                priority={index < 3}
                position={index + 1}
              />
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500">
          {["indicator1", "indicator2", "indicator3"].map((key) => (
            <div key={key} className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full" />
              <span>{t(key)}</span>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
};
