import { Cpu, Network } from "lucide-react";

export function NexusTeaser() {
  return (
    <section
      id="nexus-fci"
      className="scroll-mt-24 border-t border-white/5 bg-gradient-to-b from-fci-void/80 to-fci-base py-16 sm:py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-2xl border border-fci-violet/35 bg-fci-navy/60 p-6 shadow-[0_0_40px_rgba(148,88,255,0.12)] sm:p-10">
          <div
            className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-fci-violet/15 blur-3xl"
            aria-hidden
          />
          <div className="relative flex flex-col gap-4 md:flex-row md:items-start md:gap-8">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-xl border border-fci-violet/40 bg-fci-space/30 text-fci-violet">
              <Network className="size-7" strokeWidth={1.25} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-fci-gold">
                Plataforma · Inteligencia aplicada
              </p>
              <h2 className="mt-2 font-serif text-2xl text-fci-foreground sm:text-3xl">
                NEXUS FCI
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-fci-muted sm:text-base">
                Herramienta tecnológica que integra inteligencia artificial,
                aprendizaje automático y arquitecturas en la nube para
                procesar, analizar y articular información estratégica en
                entornos complejos —con énfasis en la curaduría y validación de
                fuentes para reducir incertidumbre y fortalecer decisiones en
                geopolítica, desarrollo internacional y economía del espacio.
              </p>
              <p className="mt-3 flex items-center gap-2 text-xs text-fci-muted sm:text-sm">
                <Cpu className="size-4 shrink-0 text-fci-gold" aria-hidden />
                Nodo de integración entre datos, conocimiento especializado y
                redes de cooperación —Tierra y Espacio.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
