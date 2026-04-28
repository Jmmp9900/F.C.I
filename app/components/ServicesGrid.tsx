import type { LucideIcon } from "lucide-react";
import { BookOpen, Briefcase, LineChart, Orbit, Satellite, Search } from "lucide-react";
import Link from "next/link";

const tierra = [
  {
    n: "01",
    title: "Consultoría estratégica",
    text: "Decisiones en entornos internacionales complejos; geopolítica, geoeconomía y la dimensión espacio como escenario emergente.",
    icon: Briefcase,
  },
  {
    n: "02",
    title: "Capacitación y sensibilización",
    text: "Cursos y talleres para interpretar el sistema global y tomar decisiones en Tierra y en el espacio exterior.",
    icon: BookOpen,
  },
  {
    n: "03",
    title: "Investigación e innovación",
    text: "Informes estratégicos, policy papers, diagnósticos institucionales y estudios sobre tendencias globales y economía del espacio.",
    icon: LineChart,
  },
  {
    n: "04",
    title: "Gestión de proyectos",
    text: "Formulación con metodologías internacionales, planes de internacionalización y apoyo en implementación y cooperación.",
    icon: Search,
  },
] as const;

const espacio = [
  {
    n: "01",
    title: "Consultoría estratégica",
    text: "Astropolítica, New Space y dinámicas competitivas del sector espacial integradas al análisis global.",
    icon: Satellite,
  },
  {
    n: "02",
    title: "Capacitación y sensibilización",
    text: "Programas formativos sobre gobernanza espacial, diplomacia y economía del espacio.",
    icon: BookOpen,
  },
  {
    n: "03",
    title: "Investigación e innovación",
    text: "Prospectiva orbital, economía New Space e iniciativas aplicadas a políticas y sector privado.",
    icon: Orbit,
  },
  {
    n: "04",
    title: "Gestión de proyectos",
    text: "Iniciativas en tecnología y sector espacial, acceso a cooperación y financiamiento internacional.",
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
        href="#contacto"
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
          Cuatro líneas de servicio alineadas al documento institucional:
          consultoría, formación, investigación y proyectos —aplicadas en Tierra
          y en el espacio con una misma lógica estratégica.
        </p>

        <div className="relative mt-12 grid gap-8 md:grid-cols-2">
          <div
            className="pointer-events-none absolute left-1/2 top-0 z-0 hidden w-px -translate-x-1/2 bg-gradient-to-b from-fci-gold/0 via-fci-gold/40 to-fci-gold/0 md:block"
            style={{ height: "100%" }}
            aria-hidden
          />
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-fci-earth/50 bg-fci-earth/15 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-fci-foreground">
              Tierra — Gobernanza · Geopolítica · Geoeconomía
            </div>
            <ul className="space-y-3">
              {tierra.map((c) => (
                <ServiceCard key={`e-${c.n}`} {...c} variant="earth" />
              ))}
            </ul>
          </div>
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-fci-violet/40 bg-fci-space/20 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-fci-foreground">
              Espacio — Gobernanza espacial · Astropolítica · New Space
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
