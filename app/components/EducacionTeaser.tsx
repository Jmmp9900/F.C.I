import Link from "next/link";
import { ArrowRight, BarChart2, BookOpen, Users } from "lucide-react";
import { BrandImageDrift } from "./BrandImageDrift";

const microStats = [
  { icon: BookOpen, v: "30+", l: "Programas" },
  { icon: Users, v: "8.000+", l: "Horas" },
  { icon: BarChart2, v: "12", l: "Aliados" },
] as const;

export function EducacionTeaser() {
  return (
    <section className="relative overflow-hidden border-t border-white/5">
      <div className="absolute inset-0 bg-gradient-to-b from-fci-void/90 to-fci-base" />
      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="order-2 lg:order-1">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-fci-gold">
              Capacitación y sensibilización
            </p>
            <h2 className="mt-2 font-serif text-2xl text-fci-foreground sm:text-3xl text-balance">
              Formamos líderes para ambos dominios del poder
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-fci-muted sm:text-base">
              Cursos, talleres y artículos académicos con enfoque en gobernanza
              global, análisis coyuntural y literacidad en astropolítica.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {microStats.map(({ icon: Icon, v, l }) => (
                <div
                  key={l}
                  className="flex min-w-[7rem] flex-1 items-center gap-2 rounded border border-fci-gold/25 bg-black/20 px-3 py-2"
                >
                  <Icon className="size-5 text-fci-gold" strokeWidth={1.25} />
                  <div>
                    <p className="font-serif text-lg text-fci-gold">{v}</p>
                    <p className="text-[10px] font-semibold uppercase text-fci-muted">
                      {l}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Link
              href="#"
              className="mt-8 inline-flex items-center gap-2 rounded-sm bg-fci-gold px-6 py-3 text-sm font-bold uppercase tracking-wide text-fci-void fci-glow-gold"
            >
              Explorar programas
              <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="relative order-1 aspect-[4/3] w-full overflow-hidden rounded-xl border border-white/10 lg:order-2">
            <BrandImageDrift
              k="educacion"
              alt="Educación e internacionalización"
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
