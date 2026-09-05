import type { NextRequest } from "next/server";
import { renderSocialCard } from "@/app/[locale]/social-card";
import { socialCardTitle } from "@/lib/seo/socialCard";

const CACHE_CONTROL = "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get("locale") === "en" ? "en" : "nl";
  const title = socialCardTitle(searchParams.get("title") ?? "");
  return renderSocialCard(locale, title || undefined, { "Cache-Control": CACHE_CONTROL });
}
