import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { SitePageLayout } from "../../../../../components/SitePageLayout";
import { BlogPagination } from "../../../../../components/blog/BlogPagination";
import { EmptyState } from "../../../../../components/blog/EmptyState";
import { PostCard } from "../../../../../components/blog/PostCard";
import { getPosts, getTagBySlug } from "../../../../../lib/blog";
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

  const tag = await getTagBySlug(slug, locale);
  if (!tag) notFound();

  const t = await getTranslations({ locale, namespace: "Blog" });
  return {
    title: t("filtered.byTag", { name: tag.name }),
    description: t("metaDescription"),
  };
}

export default async function TagPage({ params, searchParams }: Props) {
  const { locale: localeParam, slug } = await params;
  const locale = localeParam as Locale;
  setRequestLocale(locale);

  if (!isValidSlug(slug)) notFound();

  const tag = await getTagBySlug(slug, locale);
  if (!tag) notFound();

  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page ?? "1", 10) || 1);

  const t = await getTranslations("Blog");
  const postsResult = await getPosts({
    locale,
    page,
    limit: 9,
    tagSlug: slug,
  });

  return (
    <SitePageLayout>
      <section className="border-b border-white/10 bg-fci-void/30 py-12 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="fci-section-label text-center">
            {t("tagLabel")}
          </p>
          <h1 className="fci-section-subtitle mt-3 text-center">
            {t("filtered.byTag", { name: tag.name })}
          </h1>
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
                pathname="/blog/tag/[slug]"
                params={{ slug }}
              />
            </>
          )}
        </div>
      </section>
    </SitePageLayout>
  );
}
