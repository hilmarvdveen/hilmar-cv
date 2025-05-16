import { useTranslation } from "next-i18next";
import Link from "next/link";
import Image from "next/image";

export const HeroSection = () => {
  const { t } = useTranslation("home");

  return (
    <section
      aria-labelledby="hero-heading"
      className="bg-[#12314e] text-gray-800 py-24 sm:py-28"
    >
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
        <div>
          <p className="text-md text-gray-100 mb-2 tracking-widest uppercase">
            {t("hero.greeting")}
          </p>

          <h1
            id="hero-heading"
            className="text-4xl sm:text-5xl font-extrabold leading-tight text-gray-300 mb-4 tracking-tight"
          >
            {t("hero.title.first")}
            <br />
            {t("hero.title.second")}
            <span className="text-emerald-600"> {t("hero.title.name")} </span>
          </h1>

          <p className="text-lg text-gray-300 mb-10 max-w-xl leading-relaxed">
            {t("hero.description")}
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/cv/hilmar-van-der-veen.pdf"
              className="px-6 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-500 transition focus:outline-none focus:ring-2 focus:ring-emerald-700"
            >
              {t("hero.contact")}
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 border border-emerald-600 text-emerald-700 font-medium rounded-lg hover:bg-emerald-600 hover:text-white transition focus:outline-none focus:ring-2 focus:ring-emerald-600"
            >
              {t("hero.downloadCv")}
            </Link>
          </div>
        </div>

        <div className="flex justify-center">
          <figure className="rounded-2xl overflow-hidden shadow-lg bg-white p-2">
            <Image
              src="/images/profile.jpg"
              alt={t("hero.imageAlt")}
              width={250}
              height={250}
              className="rounded-xl object-cover"
              priority
            />
            <figcaption className="sr-only">{t("hero.name")}</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
};
