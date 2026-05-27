import { ArrowRight, Compass } from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { BrandImageDrift } from "./BrandImageDrift";
import {
  getWhatsAppChatHref,
  isWhatsAppChatHref,
} from "../lib/whatsapp";

function HireServiceButton({
  label,
  href,
  isExternal,
}: {
  label: string;
  href: string;
  isExternal: boolean;
}) {
  const externalProps = isExternal
    ? ({ target: "_blank", rel: "noopener noreferrer" } as const)
    : {};

  return (
    <div className="w-full">
      <Link
        href={href}
        {...externalProps}
        className="fci-glow-gold flex min-h-[3.25rem] w-full items-center justify-center rounded-lg bg-gradient-to-r from-fci-gold-dim via-fci-gold to-fci-gold-hover px-4 py-3 text-center text-xs font-semibold uppercase leading-snug tracking-wide text-fci-void text-balance shadow-[0_0_24px_rgba(226,189,58,0.22)] outline-none transition hover:brightness-110 active:brightness-[0.98] focus-visible:ring-2 focus-visible:ring-fci-gold-hover/80 focus-visible:ring-offset-2 focus-visible:ring-offset-fci-base sm:min-h-[3.5rem] sm:py-3.5 sm:text-sm"
      >
        {label}
      </Link>
    </div>
  );
}

function DomainAnchorCta({
  href,
  label,
  variant,
}: {
  href: string;
  label: string;
  variant: "earth" | "space";
}) {
  const surface =
    variant === "earth"
      ? "border-cyan-400/30 bg-gradient-to-b from-cyan-500/[0.12] to-cyan-950/10 hover:border-cyan-300/50 hover:from-cyan-400/18"
      : "border-violet-400/30 bg-gradient-to-b from-violet-500/[0.14] to-violet-950/10 hover:border-violet-300/50 hover:from-violet-400/18";

  return (
    <a
      href={href}
      className={`inline-flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium text-fci-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fci-gold/55 ${surface}`}
    >
      {label}
      <ArrowRight className="size-4 shrink-0 text-fci-gold/90" strokeWidth={2} />
    </a>
  );
}

export async function SplitDomains() {
  const t = await getTranslations("SplitDomains");
  const whatsappHref = getWhatsAppChatHref();
  const whatsAppExternal = isWhatsAppChatHref(whatsappHref);
  return (
    <section className="border-t border-white/5 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.25em] text-fci-gold">
          {t("eyebrow")}
        </p>
        <div className="mx-auto mt-4 max-w-3xl space-y-3 text-center text-sm leading-relaxed text-fci-muted text-balance sm:text-base">
          <p>{t("introP1")}</p>
          <p>{t("introP2")}</p>
        </div>

        <div className="relative mt-14 grid gap-0 md:grid-cols-2 md:items-stretch">
          <div
            className="pointer-events-none absolute left-1/2 top-0 z-10 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-fci-gold/0 via-fci-gold/60 to-fci-gold/0 md:block"
            aria-hidden
          />
          <div className="absolute left-1/2 top-1/2 z-10 hidden -translate-x-1/2 -translate-y-1/2 md:block">
            <div className="flex size-10 items-center justify-center rounded-full border border-fci-gold/50 bg-fci-void/90 text-fci-gold shadow-[0_0_20px_rgba(197,160,89,0.2)]">
              <Compass className="size-5" strokeWidth={1.5} />
            </div>
          </div>

          <div className="relative flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-fci-earth/50 bg-gradient-to-br from-cyan-950/30 via-fci-earth/15 to-fci-void ring-1 ring-cyan-500/10 fci-glow-earth md:rounded-r-none md:border-r-0">
            <div className="relative h-56 w-full shrink-0 overflow-hidden sm:h-64 md:h-80 lg:h-96">
              <BrandImageDrift
                k="tierra"
                alt={t("earthAlt")}
                sizes="(min-width: 768px) 50vw, 100vw"
                quality={93}
                variant="split-earth"
              />
              <div
                className="pointer-events-none absolute inset-0 z-[8] fci-split-earth-hud-grid"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute inset-0 z-[9] overflow-hidden mix-blend-screen"
                aria-hidden
              >
                <div className="fci-split-earth-hud-scan-bar" />
              </div>
              <div
                className="pointer-events-none absolute inset-0 z-10"
                style={{
                  background: `linear-gradient(180deg, rgba(8,28,32,0.45) 0%, rgba(5,7,10,0.9) 100%),
                    radial-gradient(ellipse 90% 55% at 50% 18%, rgba(47, 143, 94, 0.38), transparent),
                    radial-gradient(ellipse 55% 45% at 72% 12%, rgba(56, 189, 198, 0.12), transparent)`,
                }}
              />
            </div>
            <div className="flex min-h-0 flex-1 flex-col p-5 sm:p-6">
              <p className="inline-block rounded-sm bg-fci-earth px-3 py-1 font-serif text-sm font-semibold uppercase tracking-widest text-fci-foreground">
                {t("earthTitle")}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-fci-muted">
                {t("earthBody")}
              </p>
              <div className="mt-auto flex w-full flex-col gap-4 pt-4">
                <HireServiceButton
                  label={t("hireService")}
                  href={whatsappHref}
                  isExternal={whatsAppExternal}
                />
                <DomainAnchorCta
                  href="#nosotros"
                  label={t("ctaLines")}
                  variant="earth"
                />
              </div>
            </div>
          </div>

          <div className="relative mt-6 flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-fci-space/40 bg-gradient-to-br from-fci-space/25 to-fci-void fci-glow-space md:mt-0 md:rounded-l-none">
            <div className="relative h-56 w-full shrink-0 overflow-hidden sm:h-64 md:h-80 lg:h-96">
              <BrandImageDrift
                k="espacio"
                alt={t("spaceAlt")}
                sizes="(min-width: 768px) 50vw, 100vw"
                quality={93}
                variant="split-space"
              />
              <div
                className="pointer-events-none absolute inset-0 z-[7] fci-split-space-stars"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute inset-[-15%] z-[8] fci-split-space-plexus"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute inset-0 z-[9] fci-split-space-shimmer"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute inset-0 z-10"
                style={{
                  background: `linear-gradient(180deg, rgba(2,4,8,0.25) 0%, rgba(5,7,10,0.92) 100%),
                    radial-gradient(ellipse 80% 60% at 50% 15%, rgba(124, 58, 237, 0.25), transparent)`,
                }}
              />
            </div>
            <div className="flex min-h-0 flex-1 flex-col p-5 sm:p-6">
              <p className="inline-block rounded-sm bg-fci-space px-3 py-1 font-serif text-sm font-semibold uppercase tracking-widest text-fci-foreground">
                {t("spaceTitle")}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-fci-muted">
                {t("spaceBody")}
              </p>
              <div className="mt-auto flex w-full flex-col gap-4 pt-4">
                <HireServiceButton
                  label={t("hireService")}
                  href={whatsappHref}
                  isExternal={whatsAppExternal}
                />
                <DomainAnchorCta
                  href="#nosotros"
                  label={t("ctaLines")}
                  variant="space"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="font-serif text-lg text-balance text-fci-foreground sm:text-xl">
            {t("closing")}
          </p>
          <Link
            href={whatsappHref}
            {...(whatsAppExternal
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-fci-gold-dim via-fci-gold to-fci-gold-hover px-8 py-3.5 text-sm font-semibold uppercase tracking-wide text-fci-void fci-glow-gold transition hover:brightness-110"
          >
            {t("ctaConsult")}
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
