import { Mail, Share2 } from "lucide-react";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer
      id="contacto"
      className="scroll-mt-24 border-t border-white/5 bg-gradient-to-b from-fci-void/40 to-fci-base"
    >
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row sm:items-start">
          <div className="text-center sm:text-left">
            <p className="font-serif text-xl text-fci-foreground">F.C.I.</p>
            <p className="text-xs text-fci-gold">
              Gobernanza · Geopolítica · Astropolítica
            </p>
          </div>
          <p className="max-w-sm text-center text-sm text-fci-muted sm:text-right">
            Decide con claridad en ambos dominios del poder.
          </p>
          <div className="flex gap-3 text-fci-gold">
            <Link href="#" aria-label="Redes y recursos">
              <Share2 className="size-5" strokeWidth={1.5} />
            </Link>
            <a href="#contacto" aria-label="Correo (ir al pie)">
              <Mail className="size-5" strokeWidth={1.5} />
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/5 py-6 text-center text-xs text-fci-muted">
        <p>© {new Date().getFullYear()} Fundación Consultores Internacionales</p>
      </div>
    </footer>
  );
}
