import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Section } from "@/components/Section";
import { Container } from "@/components/Container";
import { SectionTitle } from "@/components/SectionTitle";

type MarkHeight = "h-7" | "h-8" | "h-9" | "h-10" | "h-12";

type CarouselClient = {
  name: string;
  id: string;
  logo: string;
  markHeight: MarkHeight;
};

const clients: CarouselClient[] = [
  { name: "bol.com", logo: "/logos/bol.svg", id: "bol", markHeight: "h-7" },
  { name: "Belastingdienst", logo: "/logos/belastingdienst.svg", id: "belastingdienst", markHeight: "h-12" },
  {
    name: "Nationale Postcode Loterij",
    logo: "/logos/nationale-postcode-loterij-mark.png",
    id: "postcode-loterij",
    markHeight: "h-12",
  },
  { name: "Athlon", logo: "/logos/athlon.svg", id: "athlon", markHeight: "h-8" },
  { name: "Randstad", logo: "/logos/randstad.svg", id: "randstad", markHeight: "h-8" },
  { name: "Conclusion", logo: "/logos/conclusion.svg", id: "conclusion", markHeight: "h-7" },
  { name: "Ortec", logo: "/logos/ortec.png", id: "ortec", markHeight: "h-10" },
  { name: "Omniplan", logo: "/logos/omniplan.svg", id: "omniplan", markHeight: "h-8" },
  { name: "Niped", logo: "/logos/niped.svg", id: "niped", markHeight: "h-9" },
  { name: "Opinity", logo: "/logos/opinity-mark.png", id: "opinity", markHeight: "h-9" },
  { name: "Bluefield", logo: "/logos/bluefield.png", id: "bluefield", markHeight: "h-10" },
  { name: "Transdev", logo: "/logos/transdev.png", id: "transdev", markHeight: "h-10" },
];

type ClientCardProps = {
  name: string;
  id: string;
  logo: string;
  markHeight: MarkHeight;
  priority: boolean;
};

const ClientCard = ({ name, id, logo, markHeight, priority }: ClientCardProps) => {
  const commonT = useTranslations("common");

  return (
    <Link
      href={`/experience/${id}`}
      title={commonT("images.viewExperience", { company: name })}
      aria-label={commonT("images.viewExperience", { company: name })}
      className="group flex h-[4.5rem] items-center justify-center rounded-lg bg-white p-3 ring-1 ring-gray-200 transition-colors hover:ring-emerald-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
    >
      <span className={`relative w-full ${markHeight}`}>
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
              markHeight={client.markHeight}
              priority={index < 4}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
};
