"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";

const clients = [
  { name: "Belastingdienst", logo: "/logos/belastingdienst.svg" },
  { name: "Randstad", logo: "/logos/randstad.svg" },
  { name: "Athlon", logo: "/logos/athlon.svg" },
  { name: "Conclusion", logo: "/logos/conclusion.svg" },
  { name: "Ortec", logo: "/logos/ortec.png" },
  { name: "Omniplan", logo: "/logos/omniplan.svg", color: "#324e64" },
  { name: "Niped", logo: "/logos/niped.svg" },
  { name: "Opinity", logo: "/logos/opinity.png" },
  { name: "Bluefield", logo: "/logos/bluefield.png" },
  { name: "Transdev", logo: "/logos/transdev.webp", color: "#DB0717" },
  {
    name: "Nationale Postcode Loterij",
    logo: "/logos/nationale-postcode-loterij.png",
  },
];

interface ClientCardProps {
  name: string;
  logo: string;
  color?: string;
  priority: boolean;
  position: number;
}

const ClientCard = ({
  name,
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
      <Image
        src={logo}
        alt={commonT("images.companyLogoAlt", { company: name })}
        width={120}
        height={60}
        className="max-w-full max-h-full object-contain"
        priority={priority}
      />
    </div>
  );
};

export const ClientLogosCarousel = () => {
  const t = useTranslations("home");

  return (
    <section className="py-16 bg-gray-50 overflow-hidden">
      <div className="container max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
            {t("clientLogos.title")}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t("clientLogos.subtitle")}
          </p>
        </div>

        {/* Infinite Scroll Container */}
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
                logo={client.logo}
                color={client.color}
                priority={index < 3}
                position={index + 1}
              />
            ))}
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500">
          {["indicator1", "indicator2", "indicator3"].map((key) => (
            <div key={key} className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full" />
              <span>{t(`clientLogos.${key}`)}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
