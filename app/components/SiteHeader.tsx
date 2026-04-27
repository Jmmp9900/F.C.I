import { Globe, Menu } from "lucide-react";

const nav = [
  { href: "#inicio", label: "Inicio" },
  { href: "#nosotros", label: "Nosotros" },
  { href: "#servicios", label: "Servicios" },
  { href: "#publicaciones", label: "Publicaciones" },
  { href: "#contacto", label: "Contacto" },
] as const;

const navLinkClass =
  "rounded-md px-3 py-2 text-xs font-medium uppercase tracking-wide text-fci-foreground/90 transition duration-200 hover:text-fci-gold";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-fci-void/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <div className="min-w-0">
          <a
            href="#inicio"
            className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-fci-gold/60 focus-visible:outline-offset-2"
          >
            <p className="font-serif text-xl font-semibold tracking-wide text-fci-foreground sm:text-2xl">
              F.C.I.
            </p>
            <p className="text-[10px] font-medium uppercase leading-tight tracking-wider text-fci-gold sm:text-xs">
              Gobernanza · Geopolítica · Astropolítica
            </p>
          </a>
        </div>

        <nav
          className="hidden items-center gap-1 md:flex"
          aria-label="Principal"
        >
          {nav.map((item) => (
            <a key={item.label} href={item.href} className={navLinkClass}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <span className="hidden items-center gap-1.5 text-fci-muted sm:flex">
            <Globe className="size-4 text-fci-gold" strokeWidth={1.5} />
            <span className="text-sm font-medium">ES</span>
          </span>
          <details className="group relative z-[60] md:hidden">
            <summary className="list-none cursor-pointer rounded-md p-2 text-fci-foreground marker:content-none [&::-webkit-details-marker]:hidden">
              <span className="sr-only">Abrir menú</span>
              <Menu className="size-6" aria-hidden />
            </summary>
            <div className="absolute right-0 top-full z-[60] mt-2 w-52 rounded-md border border-white/10 bg-fci-void/95 p-2 shadow-lg backdrop-blur-md">
              <ul className="flex flex-col gap-0.5" role="list">
                {nav.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      className="block rounded-sm px-3 py-2 text-xs font-medium uppercase tracking-wide text-fci-foreground/90 transition hover:bg-white/5 hover:text-fci-gold"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
