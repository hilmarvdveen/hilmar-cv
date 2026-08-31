"use client";


import { useTranslations, useMessages } from "next-intl";
import { workHistory } from "@/data/workHistory";
import { useExperienceScrollSpy } from "../hooks/useExperienceScrollSpy";
import Image from "next/image";
import { MapPin, Globe, Languages } from "lucide-react";

const hasBrandColor = (color?: string) => /^#([0-9A-F]{3}){1,2}$/i.test(color || "");

const SECTION_IDS = workHistory.map((entry) => entry.id);

export const WorkExperienceSection = () => {
  const t = useTranslations("work");
  const commonT = useTranslations("common");
  const messages = useMessages();
  const { activeId, listRef, registerChip, activateFromClick } =
    useExperienceScrollSpy(SECTION_IDS);

  return (
    <section className="bg-gray-50">
      <nav
        aria-label={t("sectionTitle", { defaultValue: "Werkervaring" })}
        className="sticky top-[var(--header-height)] z-40 border-b border-gray-200 bg-white/95 shadow-sm backdrop-blur-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <ul ref={listRef} className="flex gap-2 overflow-x-auto overscroll-x-contain py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {workHistory.map((entry) => {
              const active = activeId === entry.id;
              return (
                <li key={entry.id} ref={registerChip(entry.id)}>
                  <a
                    href={`#experience-${entry.id}`}
                    onClick={() => activateFromClick(entry.id)}
                    aria-current={active ? "location" : undefined}
                    className={`group inline-flex h-10 items-center gap-2 whitespace-nowrap rounded-full border px-3.5 text-[13px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 ${
                      active
                        ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                        : "border-gray-300 bg-white text-gray-700 hover:border-emerald-600 hover:text-emerald-800"
                    }`}
                  >
                    <span
                      className={`relative h-5 w-8 shrink-0 overflow-hidden rounded-sm transition ${
                        active ? "" : "grayscale group-hover:grayscale-0"
                      }`}
                      style={hasBrandColor(entry.color) ? { backgroundColor: entry.color } : undefined}
                    >
                      <Image
                        src={`/logos/${entry.logo}`}
                        alt=""
                        fill
                        sizes="32px"
                        className="object-contain"
                      />
                    </span>
                    {entry.company}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
      <div className="container max-w-7xl mx-auto py-16 px-4 sm:px-6">
        <h2 className="text-3xl font-bold mb-10 text-gray-900">
          {t("sectionTitle", { defaultValue: "Werkervaring" })}
        </h2>

        <div className="grid grid-cols-1 gap-8">
          {workHistory.map((entry) => {
            const id = entry.id;
            const company = t(`${id}.company`, { defaultValue: entry.company });
            const location = t(`${id}.location`, {
              defaultValue: entry.location,
            });
            const role = t(`${id}.role`);
            const heading = t(`${id}.heading`, { defaultValue: "" });

            const isHexColor = hasBrandColor(entry.color);

            // ✅ Get body array from raw messages safely
            const bodyItems =
              (messages?.work?.[id]?.body as
                | Array<{ paragraph: string }>
                | undefined) ?? [];

            return (
              <div
                key={`${company}-${entry.from}`}
                id={`experience-${id}`}
                // scroll-mt offsets the fixed header when jumped to via #anchor.
                className="scroll-mt-16 bg-white shadow-sm border border-gray-100 p-6 rounded-2xl hover:shadow-md transition-shadow"
              >
                <div className="flex items-center mb-4">
                  <div
                    className="relative w-32 h-10 mr-4 rounded"
                    style={
                      isHexColor ? { backgroundColor: entry.color } : undefined
                    }
                  >
                    <Image
                      src={`/logos/${entry.logo}`}
                      alt={commonT("images.companyLogoAlt", {
                        company: entry.company,
                      })}
                      fill
                      // The logo box is a fixed 128px (w-32); tell Next so it
                      // serves a small image instead of assuming 100vw.
                      sizes="128px"
                      className="object-contain rounded"
                    />
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {company}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {entry.from} – {entry.to}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600 mb-4">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {location}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Globe className="w-4 h-4" />
                    {t(entry.mode, { defaultValue: entry.mode })}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Languages className="w-4 h-4" />
                    {t(entry.language, { defaultValue: entry.language })}
                  </span>
                </div>

                <p className="text-sm text-gray-700 mb-2">
                  <span className="font-semibold">
                    {t("role", { defaultValue: "Rol" })}:
                  </span>{" "}
                  {role}
                </p>

                {entry.tech.length > 0 && (
                  <div className="flex flex-wrap gap-2 text-sm mb-4">
                    <span className="font-semibold w-full">
                      {t("technologies", { defaultValue: "Technieken" })}:
                    </span>
                    {entry.tech.map((tech) => (
                      <span
                        key={tech}
                        className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md text-xs font-medium"
                      >
                        {t(tech, { defaultValue: tech })}
                      </span>
                    ))}
                  </div>
                )}

                {heading && (
                  <p className="text-md font-semibold text-gray-900 mb-2">
                    {heading}
                  </p>
                )}

                <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
                  {bodyItems.map((item, index) =>
                    item?.paragraph ? <p key={index}>{item.paragraph}</p> : null
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
