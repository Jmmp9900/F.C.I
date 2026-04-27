import { ArrowRight, Compass, GraduationCap, LineChart, Search } from "lucide-react";
import Link from "next/link";
import { BrandImageDrift } from "./BrandImageDrift";

const tiles = [
  { icon: Compass, label: "Consultoría" },
  { icon: GraduationCap, label: "Capacitación" },
  { icon: LineChart, label: "Investigación" },
  { icon: Search, label: "Proyectos" },
] as const;

function IconRow() {
  return (
    <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
      {tiles.map(({ icon: Icon, label }) => (
        <li
          key={label}
          className="flex flex-col items-center gap-2 rounded border border-fci-gold/25 bg-black/20 px-2 py-3 text-center"
        >
          <Icon className="size-6 text-fci-gold" strokeWidth={1.25} />
          <span className="text-[10px] font-medium uppercase tracking-wide text-fci-foreground/90">
            {label}
          </span>
        </li>
      ))}
    </ul>
  );
}

export function SplitDomains() {
  return (
    <section className="border-t border-white/5 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative grid gap-0 md:grid-cols-2">
          {/* Divisor central */}
          <div
            className="pointer-events-none absolute left-1/2 top-0 z-10 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-fci-gold/0 via-fci-gold/60 to-fci-gold/0 md:block"
            aria-hidden
          />
          <div className="absolute left-1/2 top-1/2 z-10 hidden -translate-x-1/2 -translate-y-1/2 md:block">
            <div className="flex size-10 items-center justify-center rounded-full border border-fci-gold/50 bg-fci-void/90 text-fci-gold shadow-[0_0_20px_rgba(197,160,89,0.2)]">
              <Compass className="size-5" strokeWidth={1.5} />
            </div>
          </div>

          {/* Tierra */}
          <div className="relative overflow-hidden rounded-xl border border-fci-earth/40 bg-gradient-to-br from-fci-earth/20 to-fci-void fci-glow-earth md:rounded-r-none md:border-r-0">
            <div className="relative h-40 w-full sm:h-48">
              <BrandImageDrift
                k="tierra"
                alt=""
                sizes="(min-width: 768px) 50vw, 100vw"
                variant="split-earth"
              />
              <div
                className="pointer-events-none absolute inset-0 z-10"
                style={{
                  background: `linear-gradient(180deg, rgba(2,4,8,0.2) 0%, rgba(5,7,10,0.9) 100%),
                    radial-gradient(ellipse 80% 60% at 50% 20%, rgba(26, 77, 46, 0.5), transparent)`,
                }}
              />
            </div>
            <div className="p-5 sm:p-6">
              <p className="inline-block rounded-sm bg-fci-earth px-3 py-1 font-serif text-sm font-semibold uppercase tracking-widest text-fci-foreground">
                Tierra
              </p>
              <p className="mt-3 text-sm text-fci-muted">
                Geopolítica, geoeconomía y gobernanza con foco en decisiones
                presentes.
              </p>
              <IconRow />
              <Link
                href="#"
                className="mt-6 inline-flex items-center gap-2 border border-fci-foreground/30 px-4 py-2.5 text-sm font-medium text-fci-foreground transition hover:border-fci-gold hover:text-fci-gold"
              >
                Explorar dominio Tierra
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>

          {/* Espacio */}
          <div className="relative mt-6 overflow-hidden rounded-xl border border-fci-space/40 bg-gradient-to-br from-fci-space/25 to-fci-void fci-glow-space md:mt-0 md:rounded-l-none">
            <div className="relative h-40 w-full sm:h-48">
              <BrandImageDrift
                k="espacio"
                alt=""
                sizes="(min-width: 768px) 50vw, 100vw"
                variant="split-space"
              />
              <div
                className="pointer-events-none absolute inset-0 z-10"
                style={{
                  background: `linear-gradient(180deg, rgba(2,4,8,0.25) 0%, rgba(5,7,10,0.92) 100%),
                    radial-gradient(ellipse 80% 60% at 50% 15%, rgba(124, 58, 237, 0.25), transparent)`,
                }}
              />
            </div>
            <div className="p-5 sm:p-6">
              <p className="inline-block rounded-sm bg-fci-space px-3 py-1 font-serif text-sm font-semibold uppercase tracking-widest text-fci-foreground">
                Espacio
              </p>
              <p className="mt-3 text-sm text-fci-muted">
                Astropolítica, New Space e inteligencia estratégica del entorno
                orbital.
              </p>
              <IconRow />
              <Link
                href="#"
                className="mt-6 inline-flex items-center gap-2 border border-fci-foreground/30 px-4 py-2.5 text-sm font-medium text-fci-foreground transition hover:border-fci-gold hover:text-fci-gold"
              >
                Explorar dominio Espacio
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="font-serif text-lg text-balance text-fci-foreground sm:text-xl">
            Un mismo equipo. Dos dominios. Una visión integrada.
          </p>
          <Link
            href="#"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-fci-gold-dim via-fci-gold to-fci-gold-hover px-8 py-3.5 text-sm font-semibold uppercase tracking-wide text-fci-void fci-glow-gold transition hover:brightness-110"
          >
            Agendar consultoría
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
