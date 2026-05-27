import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { brandImage } from "../lib/brand-assets";
import {
  getWhatsAppChatHref,
  isWhatsAppChatHref,
} from "../lib/whatsapp";
import { HeroParallaxLayer } from "./HeroParallaxLayer";

const heroCityLights: { left: string; top: string; size: number }[] = [
  { left: "12%", top: "58%", size: 4 },
  { left: "22%", top: "52%", size: 3 },
  { left: "31%", top: "61%", size: 5 },
  { left: "38%", top: "48%", size: 2 },
  { left: "46%", top: "55%", size: 4 },
  { left: "54%", top: "49%", size: 3 },
  { left: "62%", top: "58%", size: 5 },
  { left: "71%", top: "46%", size: 2 },
  { left: "78%", top: "54%", size: 4 },
  { left: "86%", top: "51%", size: 3 },
  { left: "18%", top: "68%", size: 2 },
  { left: "68%", top: "65%", size: 3 },
];

export async function HeroHome() {
  const t = await getTranslations("Hero");
  const whatsappHref = getWhatsAppChatHref();
  const whatsAppExternal = isWhatsAppChatHref(whatsappHref);

  return (
    <section
      id="inicio"
      className="relative min-h-[26rem] overflow-hidden sm:min-h-[32rem] md:min-h-[36rem]"
    >
      <div className="absolute inset-0 bg-fci-void" aria-hidden />
      <HeroParallaxLayer className="absolute inset-0 z-0">
        <div className="absolute inset-0 overflow-hidden">
          <div className="fci-hero-drift" aria-hidden>
            <Image
              src={brandImage("hero")}
              alt=""
              fill
              priority
              quality={92}
              className="fci-hero-img object-cover opacity-90"
              sizes="100vw"
            />
          </div>
        </div>
      </HeroParallaxLayer>
      <div
        className="fci-hero-stars pointer-events-none absolute inset-0 z-0"
        aria-hidden
      />
      <div
        className="absolute inset-0 z-[1] bg-gradient-to-b from-fci-void/35 via-fci-void/68 to-fci-base"
        aria-hidden
      />
      <div
        className="absolute inset-0 z-[1] bg-[radial-gradient(ellipse_100%_80%_at_50%_0%,rgba(148,88,255,0.2),transparent_55%)]"
        aria-hidden
      />
      <div
        className="absolute inset-0 z-[1] bg-[radial-gradient(ellipse_60%_50%_at_80%_40%,rgba(35,100,64,0.24),transparent_50%)]"
        aria-hidden
      />
      <div className="fci-hero-lights" aria-hidden>
        {heroCityLights.map((l, i) => (
          <span
            key={i}
            className="fci-hero-light"
            style={{
              left: l.left,
              top: l.top,
              width: l.size,
              height: l.size,
            }}
          />
        ))}
      </div>

      <div className="fci-hero-anim relative z-10 mx-auto max-w-6xl px-4 py-20 text-center sm:px-6 sm:py-28">
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
        <p className="mx-auto mt-5 max-w-3xl font-serif text-sm uppercase leading-relaxed tracking-[0.2em] text-fci-gold/90 sm:text-base">
          {t("line2")}
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
    </section>
  );
}
