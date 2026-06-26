import { Images, Mail, Newspaper, Share2 } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import {
  getWhatsAppChatHref,
  isWhatsAppChatHref,
} from "../lib/whatsapp";

const linkDefs = [
  { key: "contact" as const, href: "#contacto", icon: Mail, external: false },
  { key: "blog" as const, href: "/blog", icon: Newspaper, external: false },
  { key: "social" as const, href: "#contacto", icon: Share2, external: false },
  { key: "gallery" as const, href: "#contacto", icon: Images, external: false },
] as const;

export async function FciConnectTeaser() {
  const t = await getTranslations("FciConnect");
  const whatsappHref = getWhatsAppChatHref();
  const whatsAppExternal = isWhatsAppChatHref(whatsappHref);

  return (
    <section
      id="comunidad"
      className="scroll-mt-24 border-t border-white/5 py-14 sm:py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="fci-section-label text-center">
          {t("eyebrow")}
        </p>
        <h2 className="mt-2 text-center font-serif text-2xl text-fci-foreground sm:text-3xl">
          {t("title")}
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-fci-muted text-balance">
          {t("intro")}
        </p>
        <ul className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:items-stretch lg:grid-cols-4">
          {linkDefs.map(({ href, key, icon: Icon }) => {
            const isExternal =
              key === "contact" && whatsAppExternal;
            const externalHref =
              key === "contact" && whatsAppExternal ? whatsappHref : null;

            const cardClass =
              "flex h-full min-h-[8.5rem] w-full flex-col rounded-xl border border-white/10 bg-fci-surface/40 p-4 transition hover:border-fci-gold/35 hover:bg-fci-surface/60";

            const content = (
              <>
                <span className="flex shrink-0 items-center gap-2 font-medium text-fci-foreground">
                  <Icon className="size-5 shrink-0 text-fci-gold" strokeWidth={1.25} />
                  {t(`links.${key}.label`)}
                </span>
                <span className="mt-3 flex flex-1 items-start text-left text-xs leading-relaxed text-fci-muted">
                  {t(`links.${key}.hint`)}
                </span>
              </>
            );

            return (
              <li key={key} className="flex">
                {isExternal && externalHref ? (
                  <a
                    href={externalHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cardClass}
                  >
                    {content}
                  </a>
                ) : href === "/blog" ? (
                  <Link href="/blog" className={cardClass}>
                    {content}
                  </Link>
                ) : (
                  <a href={href} className={cardClass}>
                    {content}
                  </a>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
