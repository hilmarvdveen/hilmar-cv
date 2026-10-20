import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SmartEnergyCaptureFrame } from "@/features/blog/components/SmartEnergyCaptureFrame";
import { smartEnergyFilmLabels } from "@/features/blog/smartEnergyFilmLabels";
import { filmFrameAtMilliseconds, filmFrameCount, filmMillisecondsForFrame } from "@/lib/smartEnergyFilm/film";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  alternates: { canonical: null },
};

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const frameIndexFrom = (value: string | string[] | undefined): number => {
  const parsed = typeof value === "string" ? Number.parseInt(value, 10) : 0;
  return Number.isInteger(parsed) && parsed >= 0 && parsed < filmFrameCount ? parsed : 0;
};

export default async function SmartEnergyCapturePage({ params, searchParams }: Props) {
  if (process.env.SMART_ENERGY_CAPTURE !== "enabled") notFound();
  const { locale } = await params;
  const { frame } = await searchParams;
  const labels = smartEnergyFilmLabels(locale === "nl" ? "nl" : "en");
  return <SmartEnergyCaptureFrame frame={filmFrameAtMilliseconds(filmMillisecondsForFrame(frameIndexFrom(frame)))} labels={labels} />;
}
