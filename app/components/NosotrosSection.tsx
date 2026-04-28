"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Globe, Mail } from "lucide-react";

type TeamDomain = "tierra" | "espacio" | "ambos";
type TeamFilter = "todos" | "tierra" | "espacio";

type TeamMember = {
  id: number;
  nombre: string;
  cargo: string;
  resumen: string;
  credencial: string;
  dominio: TeamDomain;
};

const teamMembers: TeamMember[] = [
  {
    id: 1,
    nombre: "Dra. Elena Vargas",
    cargo: "Presidente Ejecutiva",
    resumen: "Estrategia institucional y representación internacional.",
    credencial: "PhD LSE · Ex-Cancillería",
    dominio: "ambos",
  },
  {
    id: 2,
    nombre: "Dr. Marcus Chen",
    cargo: "Director de Geopolítica",
    resumen: "Riesgo político, escenarios y análisis regional.",
    credencial: "PhD Georgetown",
    dominio: "tierra",
  },
  {
    id: 3,
    nombre: "Dra. Sofía Aguilar",
    cargo: "Directora de Geoeconomía",
    resumen: "Comercio, cadenas de valor e inversión estratégica.",
    credencial: "PhD Sciences Po",
    dominio: "tierra",
  },
  {
    id: 4,
    nombre: "Gral. (r) Rafael Medina",
    cargo: "Asesor Senior de Seguridad",
    resumen: "Defensa, resiliencia y coordinación interinstitucional.",
    credencial: "Ex-Agregado Militar",
    dominio: "ambos",
  },
  {
    id: 5,
    nombre: "Dra. Amara Okonkwo",
    cargo: "Jefa de Gobernanza Multilateral",
    resumen: "Cooperación internacional y diplomacia técnica.",
    credencial: "PhD Oxford · Ex-ONU",
    dominio: "tierra",
  },
  {
    id: 6,
    nombre: "Dr. Thomas Berger",
    cargo: "Director de Astropolítica",
    resumen: "Normativa espacial, satélites y competencia orbital.",
    credencial: "PhD MIT · Ex-ESA",
    dominio: "espacio",
  },
  {
    id: 7,
    nombre: "Dra. Yuki Tanaka",
    cargo: "Líder Economía New Space",
    resumen: "Modelos de negocio y expansión del sector espacial.",
    credencial: "PhD Tokyo · Ex-JAXA",
    dominio: "espacio",
  },
  {
    id: 8,
    nombre: "Dr. Javier Restrepo",
    cargo: "Director de Investigación e Innovación",
    resumen: "Integración ciencia-política para decisiones públicas.",
    credencial: "PhD Harvard",
    dominio: "ambos",
  },
];

const filters: Array<{ key: TeamFilter; label: string }> = [
  { key: "todos", label: "Todos" },
  { key: "tierra", label: "Tierra" },
  { key: "espacio", label: "Espacio" },
];

const domainStyle: Record<TeamDomain, string> = {
  tierra: "border-fci-earth/45 text-emerald-300",
  espacio: "border-fci-space/60 text-violet-300",
  ambos: "border-fci-gold/50 text-fci-gold",
};

const domainText: Record<TeamDomain, string> = {
  tierra: "Tierra",
  espacio: "Espacio",
  ambos: "Ambos",
};

function initialsFromName(name: string): string {
  return name
    .replaceAll(".", "")
    .split(" ")
    .filter((part) => part.length > 0 && !part.toLowerCase().startsWith("dr"))
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function NosotrosSection() {
  const [activeFilter, setActiveFilter] = useState<TeamFilter>("todos");

  const filteredMembers = useMemo(() => {
    if (activeFilter === "todos") {
      return teamMembers;
    }
    return teamMembers.filter(
      (member) => member.dominio === activeFilter || member.dominio === "ambos"
    );
  }, [activeFilter]);

  return (
    <section id="nosotros" className="scroll-mt-24 border-y border-white/5 bg-fci-void">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="relative overflow-hidden rounded-2xl border border-fci-gold/20 bg-gradient-to-r from-[#061022] via-[#091633] to-[#0b1f3f] p-5 sm:p-7">
          <div className="fci-nosotros-stars pointer-events-none absolute inset-0" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(212,181,110,0.07),transparent_35%)]" />

          <div className="relative grid items-center gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="pr-2">
              <p className="font-serif text-4xl leading-tight text-fci-foreground sm:text-5xl">
                QUIÉNES SOMOS
              </p>
              <div className="mt-3 h-px w-28 bg-fci-gold/80" />
              <p className="mt-5 max-w-xl text-sm leading-relaxed text-fci-muted sm:text-base">
                Somos la Fundación Consultores Internacionales: más de{" "}
                <span className="text-fci-foreground/95">15 años</span>{" "}
                acompañando a actores públicos, privados y académicos ante los
                cambios del sistema planetario, con ciencia, tecnología e
                innovación. Somos pioneros en abordar la exploración y
                economía del espacio exterior como nueva frontera estratégica.
              </p>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-fci-muted sm:text-base">
                Desde <span className="text-fci-foreground/95">2012</span>{" "}
                facilitamos internacionalización y alianzas; hoy integramos la
                dimensión espacial para posicionar a nuestros aliados en un
                sistema global más tecnológico y en expansión.{" "}
                <span className="italic text-fci-gold/90">
                  Ideas, iniciativas y proyectos spin-in / spin-off.
                </span>
              </p>

              <div className="mt-6 grid grid-cols-3 gap-3 text-center">
                <article className="fci-nosotros-stat rounded-xl border border-fci-gold/35 bg-fci-navy/70 p-4">
                  <p className="font-serif text-4xl text-fci-gold">15+</p>
                  <p className="text-xs uppercase tracking-wider text-fci-muted">
                    Años
                  </p>
                </article>
                <article className="fci-nosotros-stat rounded-xl border border-fci-gold/35 bg-fci-navy/70 p-4">
                  <p className="font-serif text-4xl text-fci-gold">40+</p>
                  <p className="text-xs uppercase tracking-wider text-fci-muted">
                    Países
                  </p>
                </article>
                <article className="fci-nosotros-stat rounded-xl border border-fci-gold/35 bg-fci-navy/70 p-4">
                  <p className="font-serif text-4xl text-fci-gold">200+</p>
                  <p className="text-xs uppercase tracking-wider text-fci-muted">
                    Proyectos
                  </p>
                </article>
              </div>
            </div>

            <div className="relative hidden h-full min-h-[14rem] items-center justify-center lg:flex">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-fci-base/20" />
              <div className="fci-orbit-ring fci-orbit-ring--earth pointer-events-none absolute right-3 top-2 h-[23rem] w-[23rem] rounded-full border border-emerald-300/25" />
              <div className="fci-orbit-ring fci-orbit-ring--space pointer-events-none absolute right-0 top-[-1.4rem] h-[25rem] w-[25rem] rounded-full border border-violet-300/30" />
              <div className="fci-orbit-ring fci-orbit-ring--inner pointer-events-none absolute right-6 top-8 h-[21rem] w-[21rem] rounded-full border border-violet-200/25" />

              <div className="fci-planet-wrap relative right-[-2.2rem] h-[17rem] w-[17rem] overflow-hidden rounded-full border border-violet-200/30 shadow-[0_0_45px_rgba(120,141,255,0.35)]">
                <Image
                  src="https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?q=90&w=1600&auto=format&fit=crop"
                  alt="Planeta Tierra desde el espacio"
                  fill
                  className="fci-brand-drift fci-planet-img object-cover opacity-85 saturate-125"
                  sizes="17rem"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-7">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-serif text-3xl text-fci-foreground">EQUIPO</span>
            {filters.map((filter) => {
              const isActive = activeFilter === filter.key;
              return (
                <button
                  key={filter.key}
                  type="button"
                  onClick={() => setActiveFilter(filter.key)}
                  className={`rounded-full border px-4 py-1.5 text-sm transition ${
                    isActive
                      ? "border-fci-gold/70 bg-fci-gold/20 text-fci-gold"
                      : "border-white/20 text-fci-muted hover:border-fci-gold/45 hover:text-fci-foreground"
                  }`}
                  aria-pressed={isActive}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>

          <h3 className="mt-5 text-center font-serif text-4xl text-fci-foreground">
            NUESTRO EQUIPO
          </h3>
          <div className="mx-auto mt-2 h-px w-40 bg-fci-gold/75" />

          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {filteredMembers.map((member) => (
              <article
                key={member.id}
                className="rounded-2xl border border-white/10 bg-fci-navy/80 p-4 shadow-[0_6px_24px_rgba(0,0,0,0.25)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-fci-gold/35 bg-gradient-to-br from-[#233d6a] to-[#14233e] font-serif text-lg text-fci-foreground">
                    {initialsFromName(member.nombre)}
                  </span>
                  <span
                    className={`rounded-full border px-2 py-0.5 text-[11px] uppercase tracking-wide ${domainStyle[member.dominio]}`}
                  >
                    {domainText[member.dominio]}
                  </span>
                </div>

                <div className="mt-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-fci-gold/80">
                    {member.id}. Integrante
                  </p>
                  <h4 className="mt-1 font-serif text-2xl text-fci-foreground">
                    {member.nombre}
                  </h4>
                  <p className="mt-1 text-sm italic text-fci-gold/90">{member.cargo}</p>
                  <p className="mt-2 text-sm text-fci-muted">{member.resumen}</p>
                  <p className="mt-2 text-xs text-fci-muted/90">{member.credencial}</p>
                </div>

                <div className="mt-3 flex gap-3">
                  <a
                    href="#"
                    aria-label={`LinkedIn de ${member.nombre}`}
                    className="rounded-md border border-white/10 p-1.5 text-fci-gold transition hover:border-fci-gold/60 hover:text-fci-gold-hover"
                  >
                    <Globe className="size-4" />
                  </a>
                  <a
                    href="#"
                    aria-label={`Correo de ${member.nombre}`}
                    className="rounded-md border border-white/10 p-1.5 text-fci-gold transition hover:border-fci-gold/60 hover:text-fci-gold-hover"
                  >
                    <Mail className="size-4" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
