import Link from "next/link";
import { Images, Mail, Newspaper, Share2 } from "lucide-react";
import { getTranslations } from "next-intl/server";

const linkDefs = [
  { key: "contact" as const, href: "#contacto", icon: Mail },
  { key: "blog" as const, href: "#publicaciones", icon: Newspaper },
  { key: "social" as const, href: "#contacto", icon: Share2 },
  { key: "gallery" as const, href: "#contacto", icon: Images },
];

export async function FciConnectTeaser() {
  const t = await getTranslations("FciConnect");

  return (
    <section
      id="comunidad"
      className="scroll-mt-24 border-t border-white/5 py-14 sm:py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.25em] text-fci-gold">
          {t("eyebrow")}
        </p>
        <h2 className="mt-2 text-center font-serif text-2xl text-fci-foreground sm:text-3xl">
          {t("title")}
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-fci-muted text-balance">
          {t("intro")}
        </p>
        <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {linkDefs.map(({ href, key, icon: Icon }) => (
            <li key={key}>
              <Link
                href={href}
                className="flex flex-col gap-2 rounded-xl border border-white/10 bg-fci-surface/40 p-4 transition hover:border-fci-gold/35 hover:bg-fci-surface/60"
              >
                <span className="flex items-center gap-2 font-medium text-fci-foreground">
                  <Icon className="size-5 text-fci-gold" strokeWidth={1.25} />
                  {t(`links.${key}.label`)}
                </span>
                <span className="text-xs text-fci-muted">
                  {t(`links.${key}.hint`)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
