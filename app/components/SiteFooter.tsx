import { Mail, Share2 } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import { getPathname, Link } from "@/i18n/navigation";
import { NewsletterForm } from "./NewsletterForm";
import { SocialNav } from "./SocialNav";
import { socialIconButtonClass } from "./social-icon-button";

export async function SiteFooter() {
  const t = await getTranslations("Footer");
  const tc = await getTranslations("Common");
  const locale = await getLocale();
  const homePath = getPathname({ locale, href: "/" });
  const year = new Date().getFullYear();

  return (
    <footer
      id="contacto"
      className="scroll-mt-24 border-t border-white/5 bg-gradient-to-b from-fci-void/40 to-fci-base"
    >
      {/* Bloque 1: marca + newsletter en 2 columnas en desktop, apilado en móvil */}
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.8fr] lg:items-start lg:gap-16">
          {/* Marca */}
          <div className="text-center lg:text-left">
            <p className="font-serif text-xl text-fci-foreground">
              {tc("brandAcronym")}
            </p>
            <p className="text-xs text-fci-gold">{tc("tagline")}</p>
            <p className="mt-3 max-w-sm text-sm text-fci-muted lg:max-w-none">
              {t("blurb")}
            </p>
          </div>

          {/* Newsletter */}
          <div className="mx-auto w-full max-w-xl lg:mx-0">
            <NewsletterForm variant="compact" />
          </div>
        </div>
      </div>

      {/* Bloque 2: barra inferior con iconos sociales + copyright */}
      <div className="border-t border-white/5">
        <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row sm:gap-6">
            {/* Píldora de iconos — sin wrap, alineada en una sola fila */}
            <div className="inline-flex items-center gap-1 rounded-full border border-white/[0.09] bg-fci-base/25 px-2 py-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
              <SocialNav className="gap-0.5" />
              <span
                className="mx-1 h-6 w-px shrink-0 bg-gradient-to-b from-transparent via-white/18 to-transparent"
                aria-hidden
              />
              <a
                href={`${homePath}#nosotros`}
                className={`${socialIconButtonClass} shrink-0`}
                aria-label={t("servicesAria")}
              >
                <Share2 className="size-[15px]" strokeWidth={1.75} />
              </a>
              <Link
                href="/contacto"
                className={`${socialIconButtonClass} shrink-0`}
                aria-label={t("mailAria")}
              >
                <Mail className="size-[15px]" strokeWidth={1.75} />
              </Link>
            </div>

            <p className="text-center text-xs text-fci-muted sm:text-right">
              {t("copyright", { year })}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
