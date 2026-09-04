"use client";

import { useMemo } from "react";
import { Container } from "@/components/Container";
import { useExperienceScrollSpy } from "../hooks/useExperienceScrollSpy";

export type ExperienceChip = {
  id: string;
  company: string;
};

type ExperienceQuickNavProps = {
  chips: ExperienceChip[];
  label: string;
};

export const ExperienceQuickNav = ({ chips, label }: ExperienceQuickNavProps) => {
  const sectionIds = useMemo(() => chips.map((chip) => chip.id), [chips]);
  const { activeId, listRef, registerChip, activateFromClick } =
    useExperienceScrollSpy(sectionIds);

  return (
    <nav
      aria-label={label}
      className="sticky top-[var(--header-height)] z-40 border-b border-gray-200 bg-white/95 shadow-sm backdrop-blur-sm"
    >
      <Container>
        <ul
          ref={listRef}
          className="quick-nav-fade flex gap-2 overflow-x-auto overscroll-x-contain py-2 pr-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {chips.map((chip) => {
            const active = activeId === chip.id;
            return (
              <li key={chip.id} ref={registerChip(chip.id)}>
                <a
                  href={`#experience-${chip.id}`}
                  onClick={(event) => activateFromClick(chip.id, event)}
                  aria-current={active ? "location" : undefined}
                  className={`inline-flex h-10 items-center whitespace-nowrap rounded-full border px-3.5 text-[13px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 ${
                    active
                      ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                      : "border-gray-300 bg-white text-gray-700 hover:border-emerald-600 hover:text-emerald-800"
                  }`}
                >
                  {chip.company}
                </a>
              </li>
            );
          })}
        </ul>
      </Container>
    </nav>
  );
};
