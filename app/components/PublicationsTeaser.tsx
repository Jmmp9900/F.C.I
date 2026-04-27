import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BrandImageDrift, type BrandImageDriftVariant } from "./BrandImageDrift";
import type { BrandImageKey } from "../lib/brand-assets";

const pubDriftVariants: BrandImageDriftVariant[] = ["pub1", "pub2", "pub3"];

const items: {
  title: string;
  tag: string;
  kind: "tierra" | "espacio";
  img: BrandImageKey;
  author: string;
  date: string;
}[] = [
  {
    title: "Informe estratégico: riesgo país y conectividad regional",
    tag: "Informe estratégico",
    kind: "tierra",
    img: "publicacion1",
    author: "Equipo F.C.I.",
    date: "Mar 2026",
  },
  {
    title: "Policy paper: economía New Space y operadores emergentes",
    tag: "Policy paper",
    kind: "espacio",
    img: "publicacion2",
    author: "Equipo F.C.I.",
    date: "Feb 2026",
  },
  {
    title: "Diagnóstico: gobernanza y normas en órbita baja",
    tag: "Diagnóstico",
    kind: "espacio",
    img: "publicacion3",
    author: "Equipo F.C.I.",
    date: "Ene 2026",
  },
];

export function PublicationsTeaser() {
  return (
    <section
      id="publicaciones"
      className="scroll-mt-24 border-t border-white/5 bg-fci-void/30 py-16 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.25em] text-fci-gold">
          Publicaciones
        </p>
        <h2 className="mt-2 text-center font-serif text-2xl text-fci-foreground sm:text-3xl">
          Análisis e inteligencia estratégica
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-center text-sm text-fci-muted text-balance">
          Documentos para los dos dominios del poder global: Tierra y Espacio.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p, i) => {
            const dot =
              p.kind === "tierra"
                ? "bg-fci-earth border-fci-earth/50"
                : "bg-fci-violet border-fci-violet/40";
            const border =
              p.kind === "tierra"
                ? "border-fci-earth/40"
                : "border-fci-space/40";
            return (
              <article
                key={p.title}
                className={`group flex flex-col overflow-hidden rounded-lg border ${border} bg-fci-surface/40 transition hover:border-fci-gold/30`}
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                  <BrandImageDrift
                    k={p.img}
                    alt=""
                    sizes="(min-width: 1024px) 33vw, 100vw"
                    variant={pubDriftVariants[i]}
                    imageClassName="transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                  <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-fci-base/90 to-transparent" />
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-fci-muted">
                    <span
                      className={`size-1.5 rounded-full border ${dot}`}
                      aria-hidden
                    />
                    {p.kind === "tierra" ? "Tierra" : "Espacio"} · {p.tag}
                  </p>
                  <h3 className="mt-1 font-serif text-lg text-fci-foreground">
                    {p.title}
                  </h3>
                  <div className="mt-auto flex items-center justify-between gap-2 pt-4 text-xs text-fci-muted">
                    <span>{p.author}</span>
                    <span>{p.date}</span>
                  </div>
                  <Link
                    href="#"
                    className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-fci-gold"
                  >
                    Ver detalle
                    <ArrowRight className="size-4" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        <p className="mt-8 text-center">
          <a
            href="#publicaciones"
            className="text-sm font-medium text-fci-gold underline-offset-4 hover:underline"
          >
            Ver todas las publicaciones
          </a>
        </p>
      </div>
    </section>
  );
}
