const steps = [
  { n: "1", t: "Diagnóstico" },
  { n: "2", t: "Análisis" },
  { n: "3", t: "Estrategia" },
  { n: "4", t: "Acompañamiento" },
] as const;

export function MethodologyStrip() {
  return (
    <section className="border-t border-white/5 py-12 sm:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <h2 className="text-center font-serif text-xl text-fci-foreground sm:text-2xl">
          Nuestra metodología unificada
        </h2>
        <p className="mt-1 text-center text-sm text-fci-muted">
          Mismas etapas, aplicables en ambos dominios
        </p>
        <ol className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-3">
          {steps.map((s) => (
            <li key={s.n} className="flex flex-col items-center text-center">
              <div className="mb-2 flex size-10 items-center justify-center rounded-full border-2 border-fci-gold font-serif text-lg text-fci-gold">
                {s.n}
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-fci-foreground">
                {s.t}
              </span>
              <span className="mt-2 text-[10px] text-fci-muted">
                <span className="text-fci-earth">Tierra</span>
                <span className="mx-1 text-fci-muted/50">|</span>
                <span className="text-fci-violet/90">Espacio</span>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
