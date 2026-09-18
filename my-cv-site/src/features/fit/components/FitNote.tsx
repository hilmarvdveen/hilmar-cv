"use client";

import { useId, useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown } from "lucide-react";
import { mergeClasses } from "@/lib/mergeClasses";

export const FIT_NOTE_CLAMP_FROM_CHARACTERS = 220;

type FitNoteProps = {
  note: string;
  requirement: string;
};

export const FitNote = ({ note, requirement }: FitNoteProps) => {
  const t = useTranslations("fit.check.report");
  const noteId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const isLong = note.length > FIT_NOTE_CLAMP_FROM_CHARACTERS;

  if (!isLong) {
    return <p className="mt-2 text-base leading-relaxed text-gray-700">{note}</p>;
  }

  return (
    <>
      <p
        id={noteId}
        className={mergeClasses(
          "mt-2 text-base leading-relaxed text-gray-700",
          !isOpen && "line-clamp-3"
        )}
      >
        {note}
      </p>
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-controls={noteId}
        className="mt-1 inline-flex min-h-6 cursor-pointer items-center gap-1 rounded-sm text-sm font-semibold text-primary underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
      >
        {isOpen ? t("noteLess") : t("noteMore")}
        <span className="sr-only"> {t("noteSubject", { requirement })}</span>
        <ChevronDown
          className={mergeClasses(
            "h-4 w-4 transition-transform motion-reduce:transition-none",
            isOpen && "rotate-180"
          )}
          aria-hidden="true"
        />
      </button>
    </>
  );
};
