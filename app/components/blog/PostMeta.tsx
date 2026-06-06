import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import {
  type CategoryDoc,
  type Locale,
  type PostDoc,
  type TagDoc,
  isCategoryDoc,
  isTagDoc,
} from "../../lib/blog-types";

type Props = {
  post: PostDoc;
  locale: Locale;
  /** Si `true`, los chips de categoría/tag enlazan a sus páginas filtradas. */
  linked?: boolean;
};

export async function PostMeta({ post, locale, linked = true }: Props) {
  const t = await getTranslations("Blog");

  const categories = (post.categories ?? []).filter(isCategoryDoc) as CategoryDoc[];
  const tags = (post.tags ?? []).filter(isTagDoc) as TagDoc[];

  const dateLabel = post.publishedAt
    ? new Intl.DateTimeFormat(locale === "es" ? "es-CO" : "en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(new Date(post.publishedAt))
    : null;

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-fci-muted">
      {dateLabel ? (
        <time dateTime={post.publishedAt ?? undefined} className="uppercase tracking-wider">
          {t("publishedOn", { date: dateLabel })}
        </time>
      ) : null}

      {categories.length > 0 ? (
        <>
          <span className="text-fci-muted/40" aria-hidden>
            ·
          </span>
          <ul className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <li key={String(cat.id)}>
                {linked ? (
                  <Link
                    href={{
                      pathname: "/blog/categoria/[slug]",
                      params: { slug: cat.slug },
                    }}
                    className="inline-flex items-center rounded-full border border-fci-gold/30 px-2.5 py-0.5 text-xs uppercase tracking-wider text-fci-gold transition hover:border-fci-gold hover:bg-fci-gold/10"
                  >
                    {cat.name}
                  </Link>
                ) : (
                  <span className="inline-flex items-center rounded-full border border-fci-gold/30 px-2.5 py-0.5 text-xs uppercase tracking-wider text-fci-gold">
                    {cat.name}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </>
      ) : null}

      {tags.length > 0 ? (
        <>
          <span className="text-fci-muted/40" aria-hidden>
            ·
          </span>
          <ul className="flex flex-wrap items-center gap-1.5">
            {tags.map((tag) => (
              <li key={String(tag.id)}>
                {linked ? (
                  <Link
                    href={{
                      pathname: "/blog/tag/[slug]",
                      params: { slug: tag.slug },
                    }}
                    className="text-fci-muted underline-offset-4 transition hover:text-fci-foreground hover:underline"
                  >
                    #{tag.name}
                  </Link>
                ) : (
                  <span className="text-fci-muted">#{tag.name}</span>
                )}
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </div>
  );
}
