import type { LucideIcon } from "lucide-react";
import { ArrowRight, BookOpen, Orbit, Satellite, Search } from "lucide-react";
import Link from "next/link";

const tierra = [
  {
    n: "01",
    title: "Consultoría",
    text: "Acompañamiento en decisiones en entornos internacionales complejos.",
    icon: Search,
  },
  {
    n: "02",
    title: "Capacitación",
    text: "Formación ejecutiva y sensibilización en lineamientos de política.",
    icon: BookOpen,
  },
  {
    n: "03",
    title: "Investigación",
    text: "Estudios y diagnósticos con marco lógico y enfoque comparado.",
    icon: Orbit,
  },
  {
    n: "04",
    title: "Proyectos",
    text: "Formulación y seguimiento de iniciativas de cooperación.",
    icon: Search,
  },
] as const;

const espacio = [
  {
    n: "01",
    title: "Consultoría",
    text: "Astropolítica, New Space y economía del sector satelital.",
    icon: Satellite,
  },
  {
    n: "02",
    title: "Capacitación",
    text: "Cursos y talleres en seguridad y gobernanza del espacio.",
    icon: BookOpen,
  },
  {
    n: "03",
    title: "Investigación",
    text: "Inteligencia y prospectiva en órbita y cadenas de valor.",
    icon: Orbit,
  },
  {
    n: "04",
    title: "Gestión",
    text: "Alineación con estándares y escenarios de riesgo espacial.",
    icon: Search,
  },
] as const;

type CardProps = {
  n: string;
  title: string;
  text: string;
  icon: LucideIcon;
  variant: "earth" | "space";
};

function ServiceCard({ n, title, text, icon: Icon, variant }: CardProps) {
  const border =
    variant === "earth"
      ? "border-fci-earth/50 shadow-[0_0_20px_rgba(26,77,46,0.2)]"
      : "border-fci-space/50 shadow-[0_0_20px_rgba(76,32,130,0.2)]";
  return (
    <li
      className={`flex flex-col gap-2 rounded-lg border ${border} bg-fci-void/60 p-4 sm:flex-row sm:items-center sm:justify-between`}
    >
      <div className="flex min-w-0 flex-1 gap-3 sm:items-center">
        <span className="font-serif text-lg text-fci-gold">{n}</span>
        <div className="flex size-10 shrink-0 items-center justify-center rounded border border-fci-gold/30 text-fci-gold">
          <Icon className="size-5" strokeWidth={1.2} />
        </div>
        <div className="min-w-0">
          <h3 className="font-sans text-xs font-bold uppercase tracking-wide text-fci-foreground">
            {title}
          </h3>
          <p className="mt-0.5 text-sm text-fci-muted">{text}</p>
        </div>
      </div>
      <Link
        href="#"
        className="shrink-0 self-end text-sm font-medium text-fci-gold sm:self-center"
      >
        Explorar →
      </Link>
    </li>
  );
}

export function ServicesGrid() {
  return (
    <section
      id="servicios"
      className="scroll-mt-24 border-t border-white/5 py-16 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.25em] text-fci-gold">
          Líneas de servicio
        </p>
        <h2 className="mt-2 text-center font-serif text-2xl text-fci-foreground sm:text-3xl">
          Nuestros servicios
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-center text-sm text-fci-muted text-balance">
          Cuatro líneas de servicio. Dos dominios estratégicos. Una visión
          integrada.
        </p>

        <div className="relative mt-12 grid gap-8 md:grid-cols-2">
          <div
            className="pointer-events-none absolute left-1/2 top-0 z-0 hidden w-px -translate-x-1/2 bg-gradient-to-b from-fci-gold/0 via-fci-gold/40 to-fci-gold/0 md:block"
            style={{ height: "100%" }}
            aria-hidden
          />
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-fci-earth/50 bg-fci-earth/15 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-fci-foreground">
              Tierra — Geopolítica · Geoeconomía
            </div>
            <ul className="space-y-3">
              {tierra.map((c) => (
                <ServiceCard key={`e-${c.n}`} {...c} variant="earth" />
              ))}
            </ul>
          </div>
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-fci-violet/40 bg-fci-space/20 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-fci-foreground">
              Espacio — Astropolítica · New Space
            </div>
            <ul className="space-y-3">
              {espacio.map((c) => (
                <ServiceCard key={`s-${c.n}`} {...c} variant="space" />
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-12 text-center font-serif text-lg text-fci-foreground sm:text-xl">
          Mismo rigor. Dos dominios. Una visión.
        </p>
        <div className="mx-auto mt-3 h-px max-w-sm bg-gradient-to-r from-fci-earth/0 via-fci-gold/60 to-fci-space/0" />
      </div>
    </section>
  );
}
