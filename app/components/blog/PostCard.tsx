import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";

import { Link } from "@/i18n/navigation";
import {
  type Locale,
  type PostDoc,
  getMediaAlt,
  getMediaUrl,
  isMediaDoc,
} from "../../lib/blog-types";

type Props = {
  post: PostDoc;
  locale: Locale;
  /** En layouts donde se pueda priorizar la imagen LCP (1er post del listado). */
  priority?: boolean;
};

export async function PostCard({ post, locale, priority = false }: Props) {
  const t = await getTranslations("Blog");

  const cover = isMediaDoc(post.cover) ? post.cover : null;
  const coverUrl = cover ? getMediaUrl(cover, "card") : null;
  const coverAlt = cover ? getMediaAlt(cover) : "";

  const dateLabel = post.publishedAt
    ? new Intl.DateTimeFormat(locale === "es" ? "es-CO" : "en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(new Date(post.publishedAt))
    : null;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-lg border border-white/10 bg-fci-surface/40 transition hover:border-fci-gold/40">
      <Link
        href={{ pathname: "/blog/[slug]", params: { slug: post.slug } }}
        className="absolute inset-0 z-10"
        aria-label={post.title}
      />

      <div className="relative aspect-[16/10] w-full overflow-hidden bg-fci-void">
        {coverUrl ? (
          <Image
            src={coverUrl}
            alt={coverAlt}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            priority={priority}
          />
        ) : (
          <div className="grid h-full place-items-center text-fci-muted/40">
            <span className="font-serif text-3xl">FCI</span>
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-fci-base/85 via-transparent to-transparent" />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        {dateLabel ? (
          <time
            dateTime={post.publishedAt ?? undefined}
            className="text-xs font-semibold uppercase tracking-[0.15em] text-fci-gold"
          >
            {dateLabel}
          </time>
        ) : null}

        <h3 className="font-serif text-xl leading-snug text-fci-foreground transition group-hover:text-fci-gold">
          {post.title}
        </h3>

        {post.excerpt ? (
          <p className="text-sm leading-relaxed text-fci-muted line-clamp-3">
            {post.excerpt}
          </p>
        ) : null}

        <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-sm font-medium text-fci-gold">
          {t("readMore")}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </article>
  );
}
