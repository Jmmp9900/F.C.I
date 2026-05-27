import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { routing } from "@/i18n/routing";
import { SetHtmlLang } from "../../components/SetHtmlLang";

const locales = routing.locales;

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/$/, "");

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  const canonical = `/${locale}`;
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: t("title"),
      template: `%s · ${t("title").split(" |")[0] ?? t("title")}`,
    },
    description: t("description"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      locale: locale === "en" ? "en_US" : "es_ES",
      type: "website",
      url: `${SITE_URL}${canonical}`,
      siteName: "Fundación Consultores Internacionales",
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
    },
    alternates: {
      canonical,
      languages: {
        "es-ES": "/es",
        "en-US": "/en",
        "x-default": "/es",
      },
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!locales.includes(locale as (typeof locales)[number])) {
    notFound();
  }
  setRequestLocale(locale);
  const messages = await getMessages();
  const t = await getTranslations({ locale, namespace: "Common" });

  return (
    <NextIntlClientProvider messages={messages}>
      <SetHtmlLang />
      <a href="#contenido-principal" className="skip-link">
        {t("skipToContent")}
      </a>
      {children}
    </NextIntlClientProvider>
  );
}
