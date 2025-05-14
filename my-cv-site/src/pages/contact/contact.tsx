import Head from "next/head";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export default function ContactPage() {
  const { t } = useTranslation("contact");

  return (
    <>
      <Head>
        <title>{t("title")} – Hilmar van der Veen</title>
        <meta name="description" content={t("description")} />
      </Head>

      <main className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">{t("title")}</h1>
        <p className="text-lg text-gray-700">{t("description")}</p>
      </main>
    </>
  );
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["contact"])),
    },
  };
}
