import { getTranslations } from "next-intl/server";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Link } from "@/i18n/navigation";

type Props = {
  currentPage: number;
  totalPages: number;
  /**
   * Pathname canónico al que volver con `?page=N`. Por defecto el listado.
   * Para categoría/tag, pasar `/blog/categoria/[slug]` o `/blog/tag/[slug]`
   * y `params: { slug }`.
   */
  pathname?:
    | "/blog"
    | "/blog/categoria/[slug]"
    | "/blog/tag/[slug]";
  params?: { slug: string };
  /** Otros query-params a preservar (search, category dropdown, etc.). */
  preserveQuery?: Record<string, string | undefined>;
};

export async function BlogPagination({
  currentPage,
  totalPages,
  pathname = "/blog",
  params,
  preserveQuery,
}: Props) {
  const t = await getTranslations("Blog");

  if (totalPages <= 1) return null;

  const baseQuery = Object.fromEntries(
    Object.entries(preserveQuery ?? {}).filter(([, v]) => v !== undefined && v !== ""),
  ) as Record<string, string>;

  const buildHref = (page: number) => ({
    pathname,
    params,
    query: { ...baseQuery, ...(page > 1 ? { page: String(page) } : {}) },
  });

  return (
    <nav
      aria-label={t("pagination.ariaLabel")}
      className="mt-12 flex items-center justify-between gap-4 border-t border-white/10 pt-6"
    >
      {currentPage > 1 ? (
        <Link
          /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
          href={buildHref(currentPage - 1) as any}
          rel="prev"
          className="inline-flex items-center gap-2 rounded-md border border-white/10 px-4 py-2 text-sm font-medium text-fci-foreground transition hover:border-fci-gold/50 hover:text-fci-gold"
        >
          <ChevronLeft className="size-4" aria-hidden />
          {t("pagination.previous")}
        </Link>
      ) : (
        <span aria-hidden />
      )}

      <p className="text-sm text-fci-muted" aria-current="page">
        {t("pagination.page", { page: currentPage, total: totalPages })}
      </p>

      {currentPage < totalPages ? (
        <Link
          /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
          href={buildHref(currentPage + 1) as any}
          rel="next"
          className="inline-flex items-center gap-2 rounded-md border border-white/10 px-4 py-2 text-sm font-medium text-fci-foreground transition hover:border-fci-gold/50 hover:text-fci-gold"
        >
          {t("pagination.next")}
          <ChevronRight className="size-4" aria-hidden />
        </Link>
      ) : (
        <span aria-hidden />
      )}
    </nav>
  );
}
