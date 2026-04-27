const stats = [
  { n: "15+", label: "Años" },
  { n: "40+", label: "Países" },
  { n: "200+", label: "Proyectos" },
  { n: "89", label: "Operadores orbitales" },
] as const;

export function StatsBar() {
  return (
    <div className="border-y border-white/5 bg-gradient-to-r from-fci-void/80 via-fci-surface/40 to-fci-void/80">
      <div className="mx-auto grid max-w-5xl grid-cols-2 divide-x divide-white/10 md:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="flex flex-col items-center justify-center py-6 text-center"
          >
            <span className="font-serif text-3xl font-semibold text-fci-gold sm:text-4xl">
              {s.n}
            </span>
            <span className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-fci-muted sm:text-xs">
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
