import type { Metadata } from "next";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { SitePageLayout } from "../../../../components/SitePageLayout";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ContactPage.thanks" });
  return {
    title: t("metaTitle"),
    robots: { index: false, follow: false },
  };
}

export default async function GraciasPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("ContactPage.thanks");

  return (
    <SitePageLayout>
      <section className="py-20 sm:py-32">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
          <CheckCircle2
            className="mx-auto size-16 text-fci-gold"
            strokeWidth={1.5}
            aria-hidden
          />
          <h1 className="mt-6 font-serif text-3xl text-fci-foreground sm:text-4xl">
            {t("title")}
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-base text-fci-muted">
            {t("body")}
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-md border border-white/10 px-5 py-3 text-sm font-medium text-fci-foreground transition hover:border-fci-gold/50 hover:text-fci-gold"
            >
              {t("backHome")}
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 rounded-md bg-fci-gold px-5 py-3 text-sm font-semibold text-fci-base transition hover:bg-fci-gold-hover"
            >
              {t("explore")}
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
        </div>
      </section>
    </SitePageLayout>
  );
}
