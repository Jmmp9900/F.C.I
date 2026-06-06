import { Globe, Menu } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { getPathname, Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { SocialNav } from "./SocialNav";

type NavKey =
  | "inicio"
  | "servicios"
  | "nosotros"
  | "publicaciones"
  | "comunidad"
  | "contacto";

const navKeys: readonly NavKey[] = [
  "inicio",
  "servicios",
  "nosotros",
  "publicaciones",
  "comunidad",
  "contacto",
];

/** Secciones del home (anchors). Desde otras páginas hay que ir a `/` + hash. */
const homeSectionHash: Record<
  "inicio" | "servicios" | "nosotros" | "comunidad",
  string
> = {
  inicio: "inicio",
  servicios: "servicios",
  nosotros: "nosotros",
  comunidad: "comunidad",
};

const navLinkClass =
  "rounded-md px-3 py-2 text-xs font-medium uppercase tracking-[0.12em] text-fci-foreground/90 transition duration-200 hover:text-fci-gold";

const navLinkMobileClass =
  "block rounded-lg px-3 py-2.5 text-xs font-medium uppercase tracking-wide text-fci-foreground/90 transition hover:bg-white/[0.06] hover:text-fci-gold";

function NavItem({
  navKey,
  label,
  className,
  homePath,
}: {
  navKey: NavKey;
  label: string;
  className: string;
  homePath: string;
}) {
  /* `publicaciones` y `contacto` son páginas con URL traducida (next-intl).
     El resto son secciones del home: URL absoluta `/es#…`, no `#…` relativo. */
  if (navKey === "publicaciones") {
    return (
      <Link href="/blog" className={className}>
        {label}
      </Link>
    );
  }
  if (navKey === "contacto") {
    return (
      <Link href="/contacto" className={className}>
        {label}
      </Link>
    );
  }
  return (
    <a
      href={`${homePath}#${homeSectionHash[navKey]}`}
      className={className}
    >
      {label}
    </a>
  );
}

export async function SiteHeader() {
  const t = await getTranslations("Header");
  const tc = await getTranslations("Common");
  const locale = await getLocale();
  const homePath = getPathname({ locale, href: "/" });

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-fci-void/90 backdrop-blur-md">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        {/* Fila 1: marca + acciones (móvil/tablet/escritorio) */}
        <div className="flex items-center justify-between gap-4 py-3.5 lg:border-b lg:border-white/[0.08] lg:py-4">
          <a
            href={`${homePath}#inicio`}
            className="min-w-0 shrink focus-visible:outline focus-visible:outline-2 focus-visible:outline-fci-gold/60 focus-visible:outline-offset-2"
          >
            <p className="font-serif text-xl font-semibold tracking-wide text-fci-foreground sm:text-2xl">
              {tc("brandAcronym")}
            </p>
            <p className="mt-0.5 max-w-[min(100%,22rem)] text-xs font-medium uppercase leading-snug tracking-[0.18em] text-fci-gold/95 sm:text-sm lg:text-base">
              {tc("tagline")}
            </p>
          </a>

          <div className="flex shrink-0 items-center gap-3 sm:gap-4 lg:gap-6">
            {/* Redes: solo escritorio (segunda fila lleva el menú; aquí no compiten por ancho) */}
            <div className="hidden items-center lg:flex">
              <SocialNav variant="header" className="gap-2" />
            </div>
            <span
              className="hidden h-9 w-px shrink-0 bg-gradient-to-b from-transparent via-white/20 to-transparent lg:block"
              aria-hidden
            />

            <div className="flex items-center gap-2 rounded-full border border-white/[0.1] bg-fci-base/30 px-2.5 py-1 text-fci-muted shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:gap-2 sm:px-3 sm:py-1.5">
              <Globe
                className="size-4 shrink-0 text-fci-gold/90"
                strokeWidth={1.5}
                aria-hidden
              />
              <LocaleSwitcher />
            </div>

            <details className="group relative z-[60] lg:hidden">
              <summary className="list-none cursor-pointer rounded-lg p-2 text-fci-foreground transition hover:bg-white/[0.06] marker:content-none [&::-webkit-details-marker]:hidden">
                <span className="sr-only">{t("openMenu")}</span>
                <Menu className="size-6" aria-hidden />
              </summary>
              <div className="absolute right-0 top-full z-[60] mt-2 w-[min(100vw-2rem,18rem)] rounded-xl border border-white/10 bg-fci-void/95 p-2 shadow-xl backdrop-blur-md">
                <ul className="flex flex-col gap-0.5" role="list">
                  {navKeys.map((key) => (
                    <li key={key}>
                      <NavItem
                        navKey={key}
                        label={t(`nav.${key}`)}
                        className={navLinkMobileClass}
                        homePath={homePath}
                      />
                    </li>
                  ))}
                </ul>
                <div className="mt-3 space-y-3 border-t border-white/10 px-1 pt-3">
                  <div className="rounded-lg border border-white/[0.08] bg-fci-base/35 px-2 py-3">
                    <SocialNav className="gap-1.5" />
                  </div>
                  <div className="flex items-center justify-center gap-2 pb-1 text-fci-muted">
                    <Globe
                      className="size-4 shrink-0 text-fci-gold/90"
                      strokeWidth={1.5}
                      aria-hidden
                    />
                    <LocaleSwitcher />
                  </div>
                </div>
              </div>
            </details>
          </div>
        </div>

        {/* Fila 2: menú principal a ancho completo (solo lg+) — sin solapes con redes */}
        <nav
          aria-label={t("navAria")}
          className="hidden w-full justify-center py-3 lg:flex lg:py-3.5"
        >
          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 sm:gap-x-8 lg:flex-nowrap lg:gap-x-10 xl:gap-x-12">
            {navKeys.map((key) => (
              <li key={key}>
                <NavItem
                  navKey={key}
                  label={t(`nav.${key}`)}
                  className={navLinkClass}
                  homePath={homePath}
                />
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
