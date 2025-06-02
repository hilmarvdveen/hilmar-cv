"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

type ClientCardProps = {
  name: string;
  logo: string;
  color?: string;
  priority?: boolean;
  index?: number;
};

export const ClientCard = ({
  name,
  logo,
  color,
  priority = false,
  index = 0,
}: ClientCardProps) => {
  const isImage = /\.(svg|png|webp)$/.test(logo);
  const t = useTranslations("common");

  return (
    <div
      className="group flex-shrink-0 w-48 h-24 mx-4 flex items-center justify-center p-6 rounded-lg bg-white border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-300"
      style={color ? { backgroundColor: color } : undefined}
    >
      <div className="relative w-full h-full flex items-center justify-center">
        {isImage ? (
          <Image
            src={logo}
            alt={t("images.companyLogoAlt", { company: name })}
            width={120}
            height={60}
            className={`max-w-full max-h-full object-contain transition-all duration-300 group-hover:scale-110 ${
              color
                ? "brightness-0 invert filter grayscale group-hover:brightness-100 group-hover:invert-0 group-hover:grayscale-0"
                : "filter grayscale group-hover:grayscale-0"
            }`}
            priority={priority || index < 12}
          />
        ) : (
          <span className="text-lg font-semibold text-gray-400 group-hover:text-gray-600 transition-colors duration-300 text-center px-2">
            {name}
          </span>
        )}
      </div>
    </div>
  );
};
