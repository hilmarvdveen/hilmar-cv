"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Download } from "lucide-react";

const CVDownloadModal = dynamic(
  () => import("@/features/cv-download").then((module) => module.CVDownloadModal),
  { ssr: false }
);

type CvDownloadTriggerProps = {
  label: string;
  locale: string;
};

export const CvDownloadTrigger = ({ label, locale }: CvDownloadTriggerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center justify-center gap-2 rounded text-slate-400 hover:text-white font-medium underline underline-offset-4 transition-colors sm:justify-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
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
