import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  alternates: { canonical: null },
};

export default async function UnmatchedRoutePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  notFound();
}
