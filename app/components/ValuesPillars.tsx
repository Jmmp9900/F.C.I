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
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
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
        <p className="mx-auto mt-8 max-w-md text-center text-xs leading-relaxed text-fci-muted/80 sm:text-sm">
          {t("iconsHint")}
        </p>
        <ul className="mt-6 grid grid-cols-5 gap-2 sm:mt-8 sm:gap-3 md:gap-4 lg:gap-5">
          {iconKeys.map((key, i) => {
            const Icon = icons[i]!;
            const name = t(`items.${key}.name`);
            const desc = t(`items.${key}.desc`);
            return (
              <li key={key} className="min-w-0">
                <article
                  tabIndex={0}
                  aria-describedby={`pillar-${key}-desc`}
                  className="group flex h-full min-h-[10.5rem] cursor-default flex-col rounded-2xl border border-white/10 bg-gradient-to-b from-fci-surface/80 to-fci-void/60 px-3 pb-4 pt-5 text-inherit shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition duration-300 ease-out hover:border-fci-gold/45 hover:shadow-[0_0_36px_rgba(212,181,110,0.18)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fci-gold/55 sm:min-h-[11rem] sm:px-3.5 sm:pb-5 sm:pt-6"
                  aria-labelledby={`pillar-${key}-title`}
                >
                  <div className="flex flex-col items-center">
                    <div
                      className="relative flex size-[4.25rem] items-center justify-center rounded-full border-2 border-fci-gold/50 bg-gradient-to-br from-fci-gold/40 via-fci-gold/15 to-fci-void shadow-[0_0_26px_rgba(212,181,110,0.42)] transition duration-300 ease-out group-hover:scale-[1.06] group-hover:border-fci-gold group-hover:from-fci-gold/48 group-hover:shadow-[0_0_42px_rgba(212,181,110,0.52)] group-focus-within:scale-[1.06] group-focus-within:border-fci-gold sm:size-[4.75rem]"
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
                    <div
                      className="mt-0 max-h-0 w-full overflow-hidden opacity-0 transition-[max-height,opacity,margin] duration-300 ease-out group-hover:mt-3 group-hover:max-h-64 group-hover:opacity-100 group-focus-within:mt-3 group-focus-within:max-h-64 group-focus-within:opacity-100 sm:group-hover:max-h-72 sm:group-focus-within:max-h-72"
                    >
                      <h3
                        id={`pillar-${key}-title`}
                        className="text-center text-xs font-semibold uppercase tracking-[0.14em] text-fci-gold sm:text-sm"
                      >
                        {name}
                      </h3>
                      <p
                        id={`pillar-${key}-desc`}
                        className="mt-2 text-center text-xs leading-snug text-fci-muted/95 sm:text-sm sm:leading-relaxed"
                      >
                        {desc}
                      </p>
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
