import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { getPosts } from "../lib/blog";
import {
  type Locale,
  getMediaAlt,
  getMediaUrl,
  isCategoryDoc,
  isMediaDoc,
} from "../lib/blog-types";

/**
 * Sección "Publicaciones" del home.
 * Muestra las últimas publicaciones reales (más recientes primero).
 * Si no hay contenido publicado, muestra un mensaje de estado vacío.
 */

export async function PublicationsTeaser() {
  const t = await getTranslations("Publications");
  const locale = (await getLocale()) as Locale;
  const { docs: posts } = await getPosts({ locale, limit: 3 });

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

        {posts.length > 0 ? (
          <FeaturedGrid posts={posts} t={t} locale={locale} />
        ) : (
          <EmptyMessage message={t("empty")} />
        )}

        {posts.length > 0 ? (
          <p className="mt-8 text-center">
            <Link
              href="/blog"
              className="text-sm font-medium text-fci-gold underline-offset-4 hover:underline"
            >
              {t("viewAll")}
            </Link>
          </p>
        ) : null}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Grid con datos REALES de la BD                                            */
/* -------------------------------------------------------------------------- */

type Translator = Awaited<ReturnType<typeof getTranslations<"Publications">>>;

function EmptyMessage({ message }: { message: string }) {
  return (
    <p className="mx-auto mt-10 max-w-xl rounded-xl border border-white/10 bg-fci-surface/30 px-6 py-8 text-center text-sm leading-relaxed text-fci-muted sm:text-base">
      {message}
    </p>
  );
}

function FeaturedGrid({
  posts,
  t,
  locale,
}: {
  posts: Awaited<ReturnType<typeof getPosts>>["docs"];
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
