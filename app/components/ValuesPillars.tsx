import {
  Building2,
  Orbit,
  Satellite,
  ShieldCheck,
  Waypoints,
} from "lucide-react";
import { getTranslations } from "next-intl/server";

const iconKeys = ["vision", "strategy", "development", "security", "expansion"] as const;

/** Orbit = Tierra + órbita · Waypoints = ruta · Building2 = ejecución · ShieldCheck = confianza · Satellite = frontera espacial */
const icons = [Orbit, Waypoints, Building2, ShieldCheck, Satellite] as const;

export async function ValuesPillars() {
  const t = await getTranslations("ValuesPillars");

  return (
    <section className="border-t border-white/5 bg-fci-void/40 py-14 sm:py-20">
      <div className="mx-auto max-w-[88rem] px-4 sm:px-6">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.25em] text-fci-gold">
          {t("label")}
        </p>
        <h2 className="mt-2 text-center font-serif text-2xl text-fci-foreground sm:text-3xl">
          {t("title")}
        </h2>
        <div className="mx-auto mt-3 max-w-xl space-y-2.5 text-center text-sm leading-relaxed text-fci-muted sm:max-w-2xl">
          <p className="text-balance text-fci-foreground/90">
            {t("introOpening")}
          </p>
          <p className="text-balance">{t("introLine2")}</p>
          <p className="text-balance">{t("introLine3")}</p>
        </div>
        <ul className="mt-8 grid grid-cols-1 gap-5 sm:mt-10 sm:grid-cols-2 sm:gap-6 lg:grid-cols-5 lg:items-start">
          {iconKeys.map((key, i) => {
            const Icon = icons[i]!;
            const name = t(`items.${key}.name`);
            const desc = t(`items.${key}.desc`);
            return (
              <li key={key} className="min-w-0">
                <article
                  tabIndex={0}
                  aria-describedby={`pillar-${key}-desc`}
                  className="group flex h-full min-h-[11rem] cursor-default flex-col rounded-2xl border border-white/10 bg-gradient-to-b from-fci-surface/80 to-fci-void/60 px-4 pb-5 pt-6 text-inherit shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition duration-300 ease-out hover:border-fci-gold/45 hover:shadow-[0_0_36px_rgba(212,181,110,0.18)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fci-gold/55 sm:min-h-[12rem] sm:px-5 sm:pb-6"
                  aria-labelledby={`pillar-${key}-title`}
                >
                  <div className="flex w-full flex-col items-center group-hover:items-start group-focus-within:items-start">
                    <div
                      className="relative flex size-[4.25rem] shrink-0 items-center justify-center rounded-full border-2 border-fci-gold/50 bg-gradient-to-br from-fci-gold/40 via-fci-gold/15 to-fci-void shadow-[0_0_26px_rgba(212,181,110,0.42)] transition duration-300 ease-out group-hover:scale-[1.06] group-hover:border-fci-gold group-hover:from-fci-gold/48 group-hover:shadow-[0_0_42px_rgba(212,181,110,0.52)] group-focus-within:scale-[1.06] group-focus-within:border-fci-gold sm:size-[4.75rem]"
                      aria-hidden
                    >
                      <span
                        className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_22%,rgba(255,255,255,0.18),transparent_58%)]"
                        aria-hidden
                      />
                      <Icon
                        className="relative z-[1] size-8 text-fci-gold drop-shadow-[0_0_10px_rgba(212,181,110,0.8)] transition duration-300 group-hover:scale-105 group-hover:text-fci-gold-hover group-focus-within:scale-105 group-focus-within:text-fci-gold-hover sm:size-9"
                        strokeWidth={key === "strategy" || key === "security" ? 1.95 : 2.05}
                        aria-hidden
                      />
                    </div>
                    <div className="mt-0 grid w-full grid-rows-[0fr] opacity-0 transition-[grid-template-rows,opacity,margin] duration-300 ease-out group-hover:mt-4 group-hover:grid-rows-[1fr] group-hover:opacity-100 group-focus-within:mt-4 group-focus-within:grid-rows-[1fr] group-focus-within:opacity-100">
                      <div className="min-h-0 overflow-hidden">
                        <h3
                          id={`pillar-${key}-title`}
                          className="text-left text-xs font-semibold uppercase tracking-[0.14em] text-fci-gold sm:text-sm"
                        >
                          {name}
                        </h3>
                        <p
                          id={`pillar-${key}-desc`}
                          className="mt-2.5 text-left text-xs leading-relaxed text-fci-muted/95 sm:text-sm"
                        >
                          {desc}
                        </p>
                      </div>
                    </div>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
