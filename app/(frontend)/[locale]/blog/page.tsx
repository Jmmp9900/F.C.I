import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { SitePageLayout } from "../../../components/SitePageLayout";
import { BlogFilters } from "../../../components/blog/BlogFilters";
import { BlogPagination } from "../../../components/blog/BlogPagination";
import { EmptyState } from "../../../components/blog/EmptyState";
import { PostCard } from "../../../components/blog/PostCard";
import { getAllCategories, getPosts } from "../../../lib/blog";
import type { Locale } from "../../../lib/blog-types";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    page?: string;
    q?: string;
    categoria?: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Blog" });
  const canonical = locale === "en" ? "/en/posts" : "/es/publicaciones";
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    openGraph: {
      title: t("metaTitle"),
      description: t("metaDescription"),
      type: "website",
      locale: locale === "en" ? "en_US" : "es_ES",
    },
    alternates: {
      canonical,
      languages: {
        "es-ES": "/es/publicaciones",
        "en-US": "/en/posts",
        "x-default": "/es/publicaciones",
      },
    },
  };
}

export default async function BlogIndexPage({ params, searchParams }: Props) {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  setRequestLocale(locale);

  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page ?? "1", 10) || 1);
  const search = sp.q?.trim() || undefined;
  const categorySlug = sp.categoria?.trim() || undefined;

  const t = await getTranslations("Blog");

  const [postsResult, categories] = await Promise.all([
    getPosts({ locale, page, limit: 9, search, categorySlug }),
    getAllCategories(locale),
  ]);

  const hasFilters = Boolean(search) || Boolean(categorySlug);
  const isEmpty = postsResult.docs.length === 0;

  return (
    <SitePageLayout>
      <section className="border-b border-white/10 bg-fci-void/30 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.25em] text-fci-gold">
            {t("breadcrumbBlog")}
          </p>
          <h1 className="mt-3 text-center font-serif text-3xl text-fci-foreground sm:text-5xl">
            {t("pageTitle")}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-center text-base text-fci-muted text-balance">
            {t("pageSubtitle")}
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <BlogFilters
            categories={categories}
            initialSearch={search ?? ""}
            initialCategory={categorySlug ?? ""}
          />

          {isEmpty ? (
            <EmptyState
              title={hasFilters ? t("noResults") : t("noPostsYet")}
              hint={hasFilters ? t("noResultsHint") : undefined}
            />
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
                pathname="/blog"
                preserveQuery={{ q: search, categoria: categorySlug }}
              />
            </>
          )}
        </div>
      </section>
    </SitePageLayout>
  );
}
