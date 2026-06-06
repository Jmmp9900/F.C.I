import Image from "next/image";
import { getTranslations } from "next-intl/server";

const earthKeys = [
  "agriculture",
  "energy",
  "transport",
  "communications",
  "finance",
  "manufacturing",
  "mining",
  "science",
  "tourism",
] as const;

const spaceKeys = [
  "satellite",
  "infrastructure",
  "resources",
  "transportation",
  "human",
  "manufacturing",
] as const;

/** Posición vertical de cada etiqueta sobre la infografía (desktop). */
const earthTops = ["5%", "14%", "23%", "32%", "41%", "50%", "59%", "68%", "77%"];
const spaceTops = ["8%", "23%", "38%", "53%", "68%", "83%"];

export async function EconomyTransitionInfographic() {
  const t = await getTranslations("EconomyTransition");

  return (
    <section
      id="economia-transicion"
      className="scroll-mt-24 border-t border-white/5 bg-fci-void/20 py-16 sm:py-24"
      aria-labelledby="economy-transition-title"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.25em] text-fci-gold">
          {t("eyebrow")}
        </p>
        <h2
          id="economy-transition-title"
          className="mt-2 text-center font-serif text-2xl text-fci-foreground sm:text-3xl"
        >
          {t("title")}
        </h2>
        <p className="mx-auto mt-4 max-w-3xl text-center text-sm leading-relaxed text-fci-muted text-balance sm:text-base">
          {t("intro")}
        </p>

        <figure className="mt-10 sm:mt-12">
          <div className="relative mx-auto aspect-[1024/682] w-full max-w-5xl overflow-hidden rounded-xl border border-white/10 bg-white shadow-[0_0_48px_rgba(0,0,0,0.35)]">
            <Image
              src="/images/brand/economy-transition-infographic.png"
              alt={t("imageAlt")}
              fill
              sizes="(min-width: 1024px) 896px, 100vw"
              className="object-contain"
              priority={false}
            />

            {/* Etiquetas superpuestas — solo en pantallas grandes */}
            <div
              className="pointer-events-none absolute inset-0 hidden lg:block"
              aria-hidden
            >
              {earthKeys.map((key, i) => (
                <div
                  key={key}
                  className="absolute left-[0.5%] max-w-[13%] text-left leading-tight"
                  style={{ top: earthTops[i] }}
                >
                  <p className="text-[0.62rem] font-semibold text-neutral-900 xl:text-xs">
                    {t(`earth.${key}`)}
                  </p>
                </div>
              ))}

              {spaceKeys.map((key, i) => (
                <div
                  key={key}
                  className="absolute right-[0.5%] max-w-[22%] text-right leading-tight"
                  style={{ top: spaceTops[i] }}
                >
                  <p className="text-[0.62rem] font-semibold text-white xl:text-xs">
                    {t(`space.${key}.title`)}
                  </p>
                  <p className="mt-0.5 text-[0.55rem] leading-snug text-white/75 xl:text-[0.62rem]">
                    {t(`space.${key}.subtitle`)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Listas accesibles y legibles en móvil / tablet */}
          <figcaption className="mt-8 grid gap-8 md:grid-cols-2 lg:sr-only">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-fci-earth">
                {t("earthColumnTitle")}
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-fci-muted">
                {earthKeys.map((key) => (
                  <li key={key} className="border-l-2 border-fci-earth/50 pl-3">
                    {t(`earth.${key}`)}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-fci-violet">
                {t("spaceColumnTitle")}
              </h3>
              <ul className="mt-3 space-y-3 text-sm text-fci-muted">
                {spaceKeys.map((key) => (
                  <li
                    key={key}
                    className="border-l-2 border-fci-violet/50 pl-3"
                  >
                    <span className="font-medium text-fci-foreground">
                      {t(`space.${key}.title`)}
                    </span>
                    <span className="mt-0.5 block text-xs">
                      {t(`space.${key}.subtitle`)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
