import { renderSocialCard, SOCIAL_CARD_SIZE } from "./social-card";

export const alt = "Hilmar van der Veen, senior frontend engineer, Randstad and remote";
export const size = SOCIAL_CARD_SIZE;
export const contentType = "image/png";

type OpengraphImageProps = {
  params?: Promise<{ locale: string }>;
};

export default async function OpengraphImage({ params }: OpengraphImageProps = {}) {
  const resolvedParams = params ? await params : undefined;
  const locale = resolvedParams?.locale === "en" ? "en" : "nl";
  return renderSocialCard(locale);
}
