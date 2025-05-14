import { Header } from "@/components/Header";
import "@/styles/globals.css";
import { appWithTranslation } from "next-i18next";
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

function App({ Component, pageProps }: AppProps) {
  return (
    <div className={`${inter.variable} font-sans`}>
      <Header />
      <Component {...pageProps} />
    </div>
  );
}

export default appWithTranslation(App);
