import { ArrowRight, BarChart2, BookOpen, Users } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { BrandImageDrift } from "./BrandImageDrift";

const statConfig = [
  { icon: BookOpen, v: "30+", key: "programs" as const },
  { icon: Users, v: "8.000+", key: "hours" as const },
  { icon: BarChart2, v: "12", key: "allies" as const },
];

export async function EducacionTeaser() {
  const t = await getTranslations("Educacion");

  return (
    <section className="relative overflow-hidden border-t border-white/5">
      <div className="absolute inset-0 bg-gradient-to-b from-fci-void/90 to-fci-base" />
      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="order-2 lg:order-1">
            <p className="fci-section-label">
              {t("eyebrow")}
            </p>
            <h2 className="fci-section-subtitle mt-2 text-balance">
              {t("title")}
            </h2>
            <p className="fci-section-body mt-4">
              {t("body")}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {statConfig.map(({ icon: Icon, v, key }) => (
                <div
                  key={key}
                  className="flex min-w-[7rem] flex-1 items-center gap-2 rounded border border-fci-gold/25 bg-fci-void/20 px-3 py-2"
                >
                  <Icon className="size-5 text-fci-gold" strokeWidth={1.25} />
                  <div>
                    <p className="font-serif text-lg text-fci-gold">{v}</p>
                    <p className="text-xs font-semibold uppercase text-fci-muted">
                      {t(`stats.${key}`)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <a
              href="#"
              className="mt-8 inline-flex items-center gap-2 rounded-sm bg-fci-gold px-6 py-3 text-sm font-bold uppercase tracking-wide text-fci-void fci-glow-gold"
            >
              {t("cta")}
              <ArrowRight className="size-4" />
            </a>
          </div>
          <div className="relative order-1 aspect-square w-full overflow-hidden rounded-xl border border-white/10 sm:aspect-[5/4] md:aspect-[4/3] lg:order-2">
            <BrandImageDrift
              k="educacion"
              alt={t("imageAlt")}
              sizes="(min-width: 1024px) 45vw, 100vw"
              variant="educacion"
            />
            <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-l from-fci-base/90 via-fci-base/20 to-transparent lg:bg-gradient-to-t" />
          </div>
        </div>
      </div>
    </section>
  );
}
