import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { BrandImageDrift, type BrandImageDriftVariant } from "./BrandImageDrift";
import { getFeaturedPosts } from "../lib/blog";
import {
  type Locale,
  getMediaAlt,
  getMediaUrl,
  isCategoryDoc,
  isMediaDoc,
} from "../lib/blog-types";
import type { BrandImageKey } from "../lib/brand-assets";

/**
 * Sección "Publicaciones" del home.
 *
 * Estrategia: muestra los posts marcados como **featured** desde la BD.
 * Si todavía no hay posts featured (sitio recién instalado o sin contenido
 * promovido), cae a un placeholder con los items hardcodeados de los archivos
 * `messages/*.json` para que el home no quede vacío.
 *
 * Mantiene el mismo lenguaje visual del componente original (cards con cover,
 * borde por dominio, hover oro). Cuando todos los posts vienen de la BD,
 * los chips usan las categorías reales en lugar de tags estáticos.
 */

const pubDriftVariants: BrandImageDriftVariant[] = ["pub1", "pub2", "pub3"];
const fallbackImages: BrandImageKey[] = [
  "publicacion1",
  "publicacion2",
  "publicacion3",
];

type FallbackItem = {
  title: string;
  tag: string;
  kind: "tierra" | "espacio";
  author: string;
  date: string;
};

export async function PublicationsTeaser() {
  const t = await getTranslations("Publications");
  const locale = (await getLocale()) as Locale;
  const featured = await getFeaturedPosts(locale, 3);

  return (
    <section
      id="publicaciones"
      className="scroll-mt-24 border-t border-white/5 bg-fci-void/30 py-16 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.25em] text-fci-gold">
          {t("eyebrow")}
        </p>
        <h2 className="mt-2 text-center font-serif text-2xl text-fci-foreground sm:text-3xl">
          {t("title")}
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-center text-sm text-fci-muted text-balance">
          {t("intro")}
        </p>

        {featured.length > 0 ? (
          <FeaturedGrid posts={featured} t={t} locale={locale} />
        ) : (
          <FallbackGrid t={t} />
        )}

        <p className="mt-8 text-center">
          <Link
            href="/blog"
            className="text-sm font-medium text-fci-gold underline-offset-4 hover:underline"
          >
            {t("viewAll")}
          </Link>
        </p>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Grid con datos REALES de la BD                                            */
/* -------------------------------------------------------------------------- */

type Translator = Awaited<ReturnType<typeof getTranslations<"Publications">>>;

function FeaturedGrid({
  posts,
  t,
  locale,
}: {
  posts: Awaited<ReturnType<typeof getFeaturedPosts>>;
  t: Translator;
  locale: Locale;
}) {
  return (
    <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((p) => {
        const cover = isMediaDoc(p.cover) ? p.cover : null;
        const coverUrl = cover ? getMediaUrl(cover, "card") : null;
        const coverAlt = cover ? getMediaAlt(cover) : "";
        const firstCategory = (p.categories ?? []).find(isCategoryDoc);
        const dateLabel = p.publishedAt
          ? new Intl.DateTimeFormat(locale === "es" ? "es-CO" : "en-US", {
              year: "numeric",
              month: "short",
            }).format(new Date(p.publishedAt))
          : null;

        return (
          <article
            key={String(p.id)}
            className="group relative flex flex-col overflow-hidden rounded-lg border border-fci-earth/40 bg-fci-surface/40 transition hover:border-fci-gold/30"
          >
            <Link
              href={{ pathname: "/blog/[slug]", params: { slug: p.slug } }}
              className="absolute inset-0 z-10"
              aria-label={p.title}
            />
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-fci-void">
              {coverUrl ? (
                <Image
                  src={coverUrl}
                  alt={coverAlt}
                  fill
                  sizes="(min-width: 1024px) 33vw, 100vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
              ) : (
                <div className="grid h-full place-items-center font-serif text-3xl text-fci-muted/40">
                  FCI
                </div>
              )}
              <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-fci-base/90 to-transparent" />
            </div>
            <div className="flex flex-1 flex-col p-4">
              {firstCategory ? (
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-fci-muted">
                  <span
                    className="size-1.5 rounded-full border bg-fci-gold border-fci-gold/50"
                    aria-hidden
                  />
                  {firstCategory.name}
                </p>
              ) : null}
              <h3 className="mt-1 font-serif text-lg text-fci-foreground">
                {p.title}
              </h3>
              {p.excerpt ? (
                <p className="mt-2 line-clamp-2 text-sm text-fci-muted">
                  {p.excerpt}
                </p>
              ) : null}
              <div className="mt-auto flex items-center justify-end gap-2 pt-4 text-xs text-fci-muted">
                {dateLabel ? <span>{dateLabel}</span> : null}
              </div>
              <span className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-fci-gold">
                {t("detail")}
                <ArrowRight className="size-4" />
              </span>
            </div>
          </article>
        );
      })}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Grid de respaldo (sin posts en BD aún)                                    */
/* -------------------------------------------------------------------------- */

function FallbackGrid({ t }: { t: Translator }) {
  const items = t.raw("items") as FallbackItem[];

  return (
    <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((p, i) => {
        const dot =
          p.kind === "tierra"
            ? "bg-fci-earth border-fci-earth/50"
            : "bg-fci-violet border-fci-violet/40";
        const border =
          p.kind === "tierra" ? "border-fci-earth/40" : "border-fci-space/40";
        const domainLabel =
          p.kind === "tierra" ? t("domainEarth") : t("domainSpace");
        return (
          <article
            key={p.title}
            className={`group flex flex-col overflow-hidden rounded-lg border ${border} bg-fci-surface/40 transition hover:border-fci-gold/30`}
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden">
              <BrandImageDrift
                k={fallbackImages[i]!}
                alt=""
                sizes="(min-width: 1024px) 33vw, 100vw"
                variant={pubDriftVariants[i]}
                imageClassName="transition-transform duration-500 ease-out group-hover:scale-105"
              />
              <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-fci-base/90 to-transparent" />
            </div>
            <div className="flex flex-1 flex-col p-4">
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-fci-muted">
                <span
                  className={`size-1.5 rounded-full border ${dot}`}
                  aria-hidden
                />
                {domainLabel} · {p.tag}
              </p>
              <h3 className="mt-1 font-serif text-lg text-fci-foreground">
                {p.title}
              </h3>
              <div className="mt-auto flex items-center justify-between gap-2 pt-4 text-xs text-fci-muted">
                <span>{p.author}</span>
                <span>{p.date}</span>
              </div>
              <span className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-fci-gold/60">
                {t("detail")}
                <ArrowRight className="size-4" />
              </span>
            </div>
          </article>
        );
      })}
    </div>
  );
}
