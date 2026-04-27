import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BrandImageDrift } from "./BrandImageDrift";

export function AboutTeaser() {
  return (
    <section
      id="nosotros"
      className="scroll-mt-24 py-16 sm:py-24"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:grid-cols-2 sm:px-6">
        <div>
          <h2 className="font-serif text-3xl leading-tight text-fci-foreground sm:text-4xl">
            Quiénes somos
          </h2>
          <div className="mt-3 h-px w-20 bg-fci-gold" />
          <p className="mt-6 text-sm leading-relaxed text-fci-muted sm:text-base">
            Un equipo de internacionalistas y profesionales técnicos que
            aplica el conocimiento de la globalización y las relaciones
            internacionales a proyectos con impacto social, integrando sector
            público y privado.{" "}
            <span className="text-fci-gold/90">
              Piensa globalmente, actúa localmente.
            </span>
          </p>
          <ul className="mt-6 space-y-2 text-sm text-fci-foreground/90">
            <li className="flex gap-2">
              <span className="text-fci-gold">·</span>
              <span>Prospectiva y pensamiento estratégico</span>
            </li>
            <li className="flex gap-2">
              <span className="text-fci-gold">·</span>
              <span>Cooperación e internacionalización</span>
            </li>
            <li className="flex gap-2">
              <span className="text-fci-gold">·</span>
              <span>Seguridad, gobernanza y análisis de política exterior</span>
            </li>
          </ul>
          <Link
            href="#"
            className="mt-8 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-fci-gold transition hover:brightness-110"
          >
            Nuestra historia
            <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-fci-gold/20 bg-fci-surface">
          <BrandImageDrift
            k="quienesSomos"
            alt="Planeta Tierra y contexto internacional"
            sizes="(min-width: 640px) 50vw, 100vw"
            variant="about"
          />
          <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-tr from-fci-violet/20 via-transparent to-fci-earth/20" />
        </div>
      </div>
    </section>
  );
}
