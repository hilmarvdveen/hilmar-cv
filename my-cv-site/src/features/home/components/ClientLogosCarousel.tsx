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
};

const clients: CarouselClient[] = [
  { name: "bol.com", logo: "/logos/bol.svg", id: "bol" },
  { name: "Belastingdienst", logo: "/logos/belastingdienst.svg", id: "belastingdienst" },
  {
    name: "Nationale Postcode Loterij",
    logo: "/logos/nationale-postcode-loterij-mark.png",
    id: "postcode-loterij",
  },
  { name: "Athlon", logo: "/logos/athlon.svg", id: "athlon" },
  { name: "Randstad", logo: "/logos/randstad.svg", id: "randstad" },
  { name: "Conclusion", logo: "/logos/conclusion.svg", id: "conclusion" },
  { name: "Ortec", logo: "/logos/ortec.png", id: "ortec" },
  { name: "Omniplan", logo: "/logos/omniplan.svg", id: "omniplan" },
  { name: "Niped", logo: "/logos/niped.svg", id: "niped" },
  { name: "Opinity", logo: "/logos/opinity-mark.png", id: "opinity" },
  { name: "Bluefield", logo: "/logos/bluefield.png", id: "bluefield" },
  { name: "Transdev", logo: "/logos/transdev.png", id: "transdev" },
];

type ClientCardProps = {
  name: string;
  id: string;
  logo: string;
  priority: boolean;
};

const ClientCard = ({ name, id, logo, priority }: ClientCardProps) => {
  const commonT = useTranslations("common");

  return (
    <Link
      href={`/experience#experience-${id}`}
      title={commonT("images.viewExperience", { company: name })}
      aria-label={commonT("images.viewExperience", { company: name })}
      className="group flex items-center justify-center rounded-lg bg-white p-3 ring-1 ring-gray-200 transition-colors hover:ring-emerald-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
    >
      <span className="relative h-12 w-full">
        <Image
          src={logo}
          alt={commonT("images.companyLogoAlt", { company: name })}
          fill
          sizes="(min-width: 1024px) 160px, 40vw"
          className="object-contain grayscale opacity-80 transition-all duration-300 group-hover:grayscale-0 group-hover:opacity-100 group-focus-visible:grayscale-0 group-focus-visible:opacity-100"
          loading={priority ? "eager" : "lazy"}
        />
      </span>
    </Link>
  );
};

export const ClientLogosCarousel = () => {
  const t = useTranslations("home.clientLogos");

  return (
    <Section background="light">
      <Container>
        <SectionTitle
          title={t("title")}
          subtitle={t("subtitle")}
          align="center"
          className="mb-6"
        />
        <p className="mb-10 text-center text-sm text-gray-600">{t("invite")}</p>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {clients.map((client, index) => (
            <ClientCard
              key={client.id}
              name={client.name}
              id={client.id}
              logo={client.logo}
              priority={index < 4}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
};
