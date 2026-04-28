import Link from "next/link";
import { Images, Mail, Newspaper, Share2 } from "lucide-react";

const links = [
  {
    href: "#contacto",
    label: "Contacto",
    icon: Mail,
    hint: "Escríbenos o WhatsApp",
  },
  {
    href: "#publicaciones",
    label: "Blog / Publicaciones",
    icon: Newspaper,
    hint: "Análisis y documentos",
  },
  {
    href: "#contacto",
    label: "Redes",
    icon: Share2,
    hint: "Próximamente enlaces",
  },
  {
    href: "#contacto",
    label: "Galería",
    icon: Images,
    hint: "Próximamente",
  },
] as const;

export function FciConnectTeaser() {
  return (
    <section
      id="connect"
      className="scroll-mt-24 border-t border-white/5 py-14 sm:py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.25em] text-fci-gold">
          Comunidad · Presencia digital
        </p>
        <h2 className="mt-2 text-center font-serif text-2xl text-fci-foreground sm:text-3xl">
          FCI Connect
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-fci-muted text-balance">
          Punto de encuentro para redes, contenidos y contacto —estructura lista
          para cuando defináis enlaces y material multimedia.
        </p>
        <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {links.map(({ href, label, icon: Icon, hint }) => (
            <li key={label}>
              <Link
                href={href}
                className="flex flex-col gap-2 rounded-xl border border-white/10 bg-fci-surface/40 p-4 transition hover:border-fci-gold/35 hover:bg-fci-surface/60"
              >
                <span className="flex items-center gap-2 font-medium text-fci-foreground">
                  <Icon className="size-5 text-fci-gold" strokeWidth={1.25} />
                  {label}
                </span>
                <span className="text-xs text-fci-muted">{hint}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
