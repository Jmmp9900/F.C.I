"use client";

import { useState, useTransition } from "react";
import { Search, X } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

import { useRouter } from "@/i18n/navigation";
import type { CategoryDoc } from "../../lib/blog-types";

type Props = {
  categories: CategoryDoc[];
  /** Estado actual (viene de los searchParams en la página server). */
  initialSearch?: string;
  initialCategory?: string;
};

/**
 * Filtros del listado de blog: input de búsqueda + select de categoría.
 * Al cambiar, hace un `router.push` que actualiza los searchParams,
 * preservando los demás (excepto `page`, que vuelve a 1).
 */
export function BlogFilters({
  categories,
  initialSearch = "",
  initialCategory = "",
}: Props) {
  const t = useTranslations("Blog");
  const locale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);

  const apply = (next: { search?: string; category?: string }) => {
    const params = new URLSearchParams();
    const finalSearch = next.search ?? search;
    const finalCategory = next.category ?? category;
    if (finalSearch.trim()) params.set("q", finalSearch.trim());
    if (finalCategory) params.set("categoria", finalCategory);
    const query = params.toString();

    startTransition(() => {
      router.push(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ({ pathname: "/blog", query: Object.fromEntries(params) } as any),
        { locale: locale as "es" | "en" },
      );
    });
    // Devuelve algo para que el linter no se queje
    return query;
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    apply({});
  };

  const onClear = () => {
    setSearch("");
    setCategory("");
    apply({ search: "", category: "" });
  };

  const hasFilter = Boolean(search.trim()) || Boolean(category);

  return (
    <form
      onSubmit={onSubmit}
      className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end"
      role="search"
      aria-busy={isPending}
    >
      <div className="flex-1">
        <label htmlFor="blog-search" className="sr-only">
          {t("searchPlaceholder")}
        </label>
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-fci-muted"
            aria-hidden
          />
          <input
            id="blog-search"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="w-full rounded-md border border-white/10 bg-fci-surface/40 py-2.5 pl-10 pr-3 text-sm text-fci-foreground placeholder:text-fci-muted/70 focus:border-fci-gold/60 focus:outline-none focus:ring-1 focus:ring-fci-gold/40"
          />
        </div>
      </div>

      <div className="sm:w-64">
        <label htmlFor="blog-category" className="sr-only">
          {t("filterByCategory")}
        </label>
        <select
          id="blog-category"
          value={category}
          onChange={(e) => {
            const value = e.target.value;
            setCategory(value);
            apply({ category: value });
          }}
          className="w-full rounded-md border border-white/10 bg-fci-surface/40 px-3 py-2.5 text-sm text-fci-foreground focus:border-fci-gold/60 focus:outline-none focus:ring-1 focus:ring-fci-gold/40"
        >
          <option value="">{t("allCategories")}</option>
          {categories.map((cat) => (
            <option key={String(cat.id)} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center justify-center rounded-md bg-fci-gold px-4 py-2.5 text-sm font-semibold text-fci-base transition hover:bg-fci-gold-hover disabled:opacity-50"
        >
          {t("searchSubmit")}
        </button>
        {hasFilter ? (
          <button
            type="button"
            onClick={onClear}
            disabled={isPending}
            className="inline-flex items-center gap-1.5 rounded-md border border-white/10 px-3 py-2.5 text-sm text-fci-muted transition hover:border-white/30 hover:text-fci-foreground disabled:opacity-50"
            aria-label={t("clearFilters")}
          >
            <X className="size-4" aria-hidden />
            <span className="hidden sm:inline">{t("clearFilters")}</span>
          </button>
        ) : null}
      </div>
    </form>
  );
}
