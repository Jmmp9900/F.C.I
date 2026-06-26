import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { SitePageLayout } from "../../../../../components/SitePageLayout";
import { BlogPagination } from "../../../../../components/blog/BlogPagination";
import { EmptyState } from "../../../../../components/blog/EmptyState";
import { PostCard } from "../../../../../components/blog/PostCard";
import {
  getCategoryBySlug,
  getPosts,
} from "../../../../../lib/blog";
import { isValidSlug } from "../../../../../lib/blog-slug";
import type { Locale } from "../../../../../lib/blog-types";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<{ page?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: localeParam, slug } = await params;
  const locale = localeParam as Locale;
  if (!isValidSlug(slug)) notFound();

  const category = await getCategoryBySlug(slug, locale);
  if (!category) notFound();

  const t = await getTranslations({ locale, namespace: "Blog" });
  const title = t("filtered.byCategory", { name: category.name });

  return {
    title,
    description: category.description ?? t("metaDescription"),
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { locale: localeParam, slug } = await params;
  const locale = localeParam as Locale;
  setRequestLocale(locale);

  if (!isValidSlug(slug)) notFound();

  const category = await getCategoryBySlug(slug, locale);
  if (!category) notFound();

  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page ?? "1", 10) || 1);

  const t = await getTranslations("Blog");
  const postsResult = await getPosts({
    locale,
    page,
    limit: 9,
    categorySlug: slug,
  });

  return (
    <SitePageLayout>
      <section className="border-b border-white/10 bg-fci-void/30 py-12 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="fci-section-label text-center">
            {t("categoryLabel")}
          </p>
          <h1 className="mt-3 text-center font-serif text-3xl text-fci-foreground sm:text-4xl">
            {t("filtered.byCategory", { name: category.name })}
          </h1>
          {category.description ? (
            <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-fci-muted">
              {category.description}
            </p>
          ) : null}
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          {postsResult.docs.length === 0 ? (
            <EmptyState title={t("noResults")} hint={t("noResultsHint")} />
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {postsResult.docs.map((post, idx) => (
                  <PostCard
                    key={String(post.id)}
                    post={post}
                    locale={locale}
                    priority={idx === 0}
                  />
                ))}
              </div>
              <BlogPagination
                currentPage={postsResult.page}
                totalPages={postsResult.totalPages}
                pathname="/blog/categoria/[slug]"
                params={{ slug }}
              />
            </>
          )}
        </div>
      </section>
    </SitePageLayout>
  );
}
