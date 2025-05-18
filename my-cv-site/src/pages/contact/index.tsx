import Head from "next/head";
import { useTranslation } from "next-i18next";
import ContactForm from "@/components/ContactForm";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export default function ContactPage() {
  const { t } = useTranslation("contact");

  return (
    <>
      <Head>
        <title>{t("meta.title")}</title>
        <meta name="description" content={t("meta.description")} />
      </Head>

      <main className="bg-gray-50 py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {t("title")}
          </h1>
          <p className="text-gray-600 mb-10">{t("intro")}</p>

          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <ContactForm />
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold">{t("emailTitle")}</h2>
                <a
                  href="mailto:hilmar.van.der.veen@the-future-group.com"
                  className="text-blue-700 hover:underline"
                >
                  hilmar.van.der.veen@the-future-group.com
                </a>
              </div>

              <div>
                <h2 className="text-lg font-semibold">{t("phoneTitle")}</h2>
                <a
                  href="tel:+31680149947"
                  className="text-blue-700 hover:underline"
                >
                  +31 6 8014 9947
                </a>
              </div>

              <div>
                <h2 className="text-lg font-semibold">{t("calendlyTitle")}</h2>
                <a
                  href="https://calendly.com/hilmar-ict/kennismaking"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 hover:underline"
                >
                  {t("calendlyLink")}
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "contact"])),
    },
  };
}
