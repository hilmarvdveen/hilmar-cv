"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Download } from "lucide-react";
import { mergeClasses } from "@/lib/mergeClasses";

const CVDownloadModal = dynamic(
  () => import("@/features/cv-download").then((module) => module.CVDownloadModal),
  { ssr: false }
);

const TRIGGER_CLASS =
  "inline-flex items-center justify-center gap-2 rounded font-medium underline underline-offset-4 transition-colors sm:justify-start focus-visible:outline-none focus-visible:ring-2";

const ON_NAVY_CLASS = "text-slate-400 hover:text-white focus-visible:ring-emerald-300";

type CvDownloadTriggerProps = {
  label: string;
  locale: string;
  placement?: string;
  className?: string;
};

export const CvDownloadTrigger = ({
  label,
  locale,
  placement,
  className = ON_NAVY_CLASS,
}: CvDownloadTriggerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        data-placement={placement}
        className={mergeClasses(TRIGGER_CLASS, className)}
      >
        <Download className="w-4 h-4" aria-hidden="true" />
        <span>{label}</span>
      </button>
      {isOpen && (
        <CVDownloadModal isOpen={isOpen} onClose={() => setIsOpen(false)} locale={locale} />
      )}
    </>
  );
};
