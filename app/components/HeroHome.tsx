import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import {
  getWhatsAppChatHref,
  isWhatsAppChatHref,
} from "../lib/whatsapp";
import { HeroCarouselBackground } from "./HeroCarouselBackground";

export async function HeroHome() {
  const t = await getTranslations("Hero");
  const whatsappHref = getWhatsAppChatHref();
  const whatsAppExternal = isWhatsAppChatHref(whatsappHref);

  return (
    <section id="inicio" className="relative overflow-hidden bg-fci-void">
      <div className="relative border-b border-white/5 bg-gradient-to-b from-fci-void via-fci-void to-fci-base/80">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_100%_80%_at_50%_0%,rgba(148,88,255,0.14),transparent_55%)]"
          aria-hidden
        />
        <div className="fci-hero-anim relative z-10 mx-auto max-w-6xl px-4 py-16 text-center sm:px-6 sm:py-20 md:py-24">
          <h1 className="font-serif text-3xl font-semibold uppercase leading-tight tracking-[0.12em] text-fci-foreground sm:text-4xl md:text-5xl">
            {t("h1")}
          </h1>
          <div className="mx-auto mt-6 h-px w-24 bg-fci-gold/80" />
          <p className="mx-auto mt-6 max-w-3xl text-balance font-serif text-sm uppercase italic leading-relaxed tracking-[0.14em] text-fci-foreground/95 sm:text-base md:text-lg">
            {t.rich("lead", {
              gold: (chunks) => (
                <span className="text-fci-gold">{chunks}</span>
              ),
            })}
          </p>
          <p className="mx-auto mt-3 font-serif text-xs uppercase tracking-[0.35em] text-fci-gold/85 sm:text-sm">
            {t("kicker")}
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            {whatsAppExternal ? (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-fci-earth-rich via-fci-earth to-teal-700 px-8 py-3.5 text-sm font-semibold uppercase tracking-wide text-white shadow-[0_8px_28px_rgba(38,115,74,0.45)] outline-none transition hover:brightness-110 focus-visible:ring-2 focus-visible:ring-fci-gold/70 focus-visible:ring-offset-2 focus-visible:ring-offset-fci-base/80"
              >
                {t("ctaContact")}
                <ArrowRight className="size-4" aria-hidden />
              </a>
            ) : (
              <Link
                href="/contacto"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-fci-earth-rich via-fci-earth to-teal-700 px-8 py-3.5 text-sm font-semibold uppercase tracking-wide text-white shadow-[0_8px_28px_rgba(38,115,74,0.45)] outline-none transition hover:brightness-110 focus-visible:ring-2 focus-visible:ring-fci-gold/70 focus-visible:ring-offset-2 focus-visible:ring-offset-fci-base/80"
              >
                {t("ctaContact")}
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            )}
            <Link
              href="/blog"
              className="rounded-md text-sm font-medium text-fci-gold underline-offset-4 outline-none transition hover:underline focus-visible:ring-2 focus-visible:ring-fci-gold/55 focus-visible:ring-offset-2 focus-visible:ring-offset-fci-base/80"
            >
              {t("ctaPublications")}
            </Link>
          </div>
        </div>
      </div>

      <div className="relative h-[26rem] sm:h-[30rem] md:h-[34rem] lg:h-[38rem] xl:h-[42rem]">
        <HeroCarouselBackground />
      </div>
    </section>
  );
}
