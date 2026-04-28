import { Globe, Rocket, Shield, Target, TrendingUp } from "lucide-react";

const items = [
  { icon: Globe, label: "Visión global" },
  { icon: Target, label: "Estrategia" },
  { icon: TrendingUp, label: "Desarrollo" },
  { icon: Shield, label: "Seguridad" },
  { icon: Rocket, label: "Expansión" },
] as const;

export function ValuesPillars() {
  return (
    <section className="border-t border-white/5 bg-fci-void/40 py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.25em] text-fci-gold">
          Pilares
        </p>
        <h2 className="mt-2 text-center font-serif text-2xl text-fci-foreground sm:text-3xl">
          Cómo pensamos el poder
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-fci-muted text-balance">
          Conectamos conocimiento global con progreso local: proyectos que
          transforman realidades en la Tierra y exploran el espacio como motor de
          innovación y adaptación.
        </p>
        <ul className="mt-10 flex flex-wrap items-stretch justify-center gap-3 sm:gap-4">
          {items.map(({ icon: Icon, label }) => (
            <li
              key={label}
              className="flex w-[calc(50%-0.5rem)] flex-col items-center gap-2 rounded-lg border border-white/10 bg-fci-surface/50 px-3 py-4 transition duration-300 ease-out hover:scale-[1.02] hover:border-fci-gold/30 sm:w-40 sm:px-4"
            >
              <div className="flex size-12 items-center justify-center rounded-full border border-fci-gold/30 bg-fci-void/80 text-fci-gold">
                <Icon className="size-5" strokeWidth={1.35} />
              </div>
              <span className="text-center text-[11px] font-medium uppercase leading-snug tracking-wide text-fci-foreground/90 sm:text-xs">
                {label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
