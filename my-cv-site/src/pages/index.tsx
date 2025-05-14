import Head from "next/head";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { HeroSection } from "@/components/HeroSection";
import { UspSection } from "@/components/UspSection";
import { ProjectHighlightsSection } from "@/components/ProjectHighlightsSection";
import { TechStackSection } from "@/components/TechSTackSection";
import { CallToActionSection } from "@/components/CallToActionSection";
import { AboutSection } from "@/components/AboutSection";
import { NetherlandsMap } from "@/components/NetherlandsMap";

export default function Home() {
  return (
    <>
      <Head>
        <title>Hilmar van der Veen – Senior Frontend Developer</title>
        <meta
          name="description"
          content="Schaalbare, toegankelijke en toekomstbestendige frontends in React, Angular en Next.js."
        />
      </Head>

      <main>
        <HeroSection />
        <AboutSection />
        <UspSection />
        <TechStackSection />
        <ProjectHighlightsSection />
        <CallToActionSection />
        <NetherlandsMap />
      </main>
    </>
  );
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "home"])),
    },
  };
}
