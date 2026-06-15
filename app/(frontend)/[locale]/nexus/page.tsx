import type { Metadata } from "next";
import { Network } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SitePageLayout } from "../../../components/SitePageLayout";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "NexusComingSoon" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    openGraph: {
      title: t("metaTitle"),
      description: t("metaDescription"),
      type: "website",
      locale: locale === "en" ? "en_US" : "es_ES",
    },
    alternates: {
      languages: {
        es: "/es/nexus",
        en: "/en/nexus",
      },
    },
  };
}

export default async function NexusComingSoonPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("NexusComingSoon");

  return (
    <SitePageLayout>
      <section className="relative flex min-h-[calc(100vh-12rem)] items-center overflow-hidden border-b border-white/5 bg-gradient-to-b from-fci-void via-fci-navy/40 to-fci-base py-20 sm:py-28">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_20%,rgba(148,88,255,0.22),transparent_60%)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -right-24 top-1/4 h-64 w-64 rounded-full bg-fci-violet/10 blur-3xl"
          aria-hidden
        />
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          <div className="mx-auto flex size-16 items-center justify-center rounded-2xl border border-fci-violet/40 bg-fci-space/25 text-fci-violet shadow-[0_0_32px_rgba(148,88,255,0.2)]">
            <Network className="size-8" strokeWidth={1.25} aria-hidden />
          </div>
          <p className="mt-8 text-xs font-semibold uppercase tracking-[0.3em] text-fci-gold">
            {t("eyebrow")}
          </p>
          <h1 className="mt-4 font-serif text-4xl font-semibold uppercase tracking-[0.08em] text-fci-foreground sm:text-5xl md:text-6xl">
            {t("title")}
          </h1>
          <div className="mx-auto mt-8 h-px w-24 bg-fci-gold/70" />
          <p className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-fci-muted text-balance sm:text-lg">
            {t("body")}
          </p>
          <Link
            href="/"
            className="mt-12 inline-flex items-center justify-center rounded-xl border border-fci-violet/40 bg-fci-violet/10 px-8 py-3.5 text-sm font-semibold uppercase tracking-wide text-fci-foreground transition hover:border-fci-violet/60 hover:bg-fci-violet/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fci-gold/55"
          >
            {t("backHome")}
          </Link>
        </div>
      </section>
    </SitePageLayout>
  );
}
