import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowLeft } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { SitePageLayout } from "../../../../components/SitePageLayout";
import { PostBody } from "../../../../components/blog/PostBody";
import { PostMeta } from "../../../../components/blog/PostMeta";
import { RelatedPosts } from "../../../../components/blog/RelatedPosts";
import {
  estimateReadingMinutes,
  getAllPostSlugs,
  getPostBySlug,
  getRelatedPosts,
} from "../../../../lib/blog";
import { isValidSlug } from "../../../../lib/blog-slug";
import { getPublicSiteUrl } from "../../../../lib/site-url";
import {
  type Locale,
  getMediaAlt,
  getMediaUrl,
  isMediaDoc,
} from "../../../../lib/blog-types";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

/** Siempre render dinámico: consulta Payload en runtime (Neon). */
export const dynamic = "force-dynamic";

export const dynamicParams = true;

/**
 * Pre-genera las rutas estáticas para todos los posts publicados en ambos
 * idiomas. Con esto Next 16 las sirve como ISR (build-time + revalidate via
 * tags al publicar). Importante: si la BD no responde durante el build (por
 * ejemplo al construir sin SQLite local), devolvemos `[]` para que falle suave.
 */
export async function generateStaticParams() {
  try {
    const [esSlugs, enSlugs] = await Promise.all([
      getAllPostSlugs("es"),
      getAllPostSlugs("en"),
    ]);
    const out: Array<{ locale: "es" | "en"; slug: string }> = [];
    for (const slug of esSlugs) out.push({ locale: "es", slug });
    for (const slug of enSlugs) out.push({ locale: "en", slug });
    return out;
  } catch (err) {
    console.warn("[blog/[slug]] generateStaticParams skipped:", (err as Error).message);
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: localeParam, slug } = await params;
  const locale = localeParam as Locale;

  if (!isValidSlug(slug)) notFound();

  const post = await getPostBySlug(slug, locale);
  if (!post) notFound();

  const SITE_URL = getPublicSiteUrl();

  const cover = isMediaDoc(post.cover) ? post.cover : null;
  const ogImage = cover ? getMediaUrl(cover, "hero") : null;

  const title = post.seoTitle?.trim() || post.title;
  const description = post.seoDescription?.trim() || post.excerpt || undefined;

  const esUrl = `/es/publicaciones/${post.slug}`;
  const enUrl = `/en/posts/${post.slug}`;
  const canonical = locale === "en" ? enUrl : esUrl;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      locale: locale === "en" ? "en_US" : "es_ES",
      url: `${SITE_URL}${canonical}`,
      publishedTime: post.publishedAt ?? undefined,
      modifiedTime: post.updatedAt,
      images: ogImage ? [{ url: ogImage, alt: getMediaAlt(cover) }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage ? [ogImage] : [],
    },
    alternates: {
      canonical,
      languages: {
        "es-ES": esUrl,
        "en-US": enUrl,
        "x-default": esUrl,
      },
    },
  };
}

export default async function PostDetailPage({ params }: Props) {
  const { locale: localeParam, slug } = await params;
  const locale = localeParam as Locale;
  setRequestLocale(locale);

  if (!isValidSlug(slug)) notFound();

  const post = await getPostBySlug(slug, locale);
  if (!post) notFound();

  const SITE_URL = getPublicSiteUrl();
  const t = await getTranslations("Blog");

  const cover = isMediaDoc(post.cover) ? post.cover : null;
  const coverUrl = cover ? getMediaUrl(cover, "hero") : null;
  const coverAlt = cover ? getMediaAlt(cover) : "";
  const readingMinutes = estimateReadingMinutes(post.body);

  const related = await getRelatedPosts(post, locale, 3);

  const blogPublicPath =
    locale === "en" ? "/posts" : "/publicaciones";
  const postPublicUrl = `${SITE_URL}/${locale}${blogPublicPath}/${post.slug}`;

  /* JSON-LD Article + BreadcrumbList para SEO estructurado (Rich Results). */
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${postPublicUrl}#article`,
        headline: post.title,
        description: post.excerpt ?? undefined,
        image: coverUrl ?? undefined,
        datePublished: post.publishedAt ?? undefined,
        dateModified: post.updatedAt,
        inLanguage: locale === "en" ? "en-US" : "es-ES",
        mainEntityOfPage: { "@id": postPublicUrl },
        publisher: {
          "@type": "Organization",
          name: "Fundación Consultores Internacionales",
          url: SITE_URL,
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: t("breadcrumbHome"),
            item: `${SITE_URL}/${locale}`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: t("breadcrumbBlog"),
            item: `${SITE_URL}/${locale}${blogPublicPath}`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: post.title,
            item: postPublicUrl,
          },
        ],
      },
    ],
  };

  return (
    <SitePageLayout>
      <article className="pb-16 pt-10 sm:pb-24 sm:pt-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-fci-muted transition hover:text-fci-gold"
          >
            <ArrowLeft className="size-4" aria-hidden />
            {t("back")}
          </Link>

          <header className="mt-6">
            <h1 className="font-serif text-3xl leading-tight text-fci-foreground sm:text-5xl">
              {post.title}
            </h1>
            {post.excerpt ? (
              <p className="mt-4 text-lg text-fci-muted">{post.excerpt}</p>
            ) : null}

            <div className="mt-6 flex items-center justify-between gap-4 border-t border-white/10 pt-5">
              <PostMeta post={post} locale={locale} />
              <p className="shrink-0 text-xs uppercase tracking-wider text-fci-muted">
                {t("minRead", { minutes: readingMinutes })}
              </p>
            </div>
          </header>

          {coverUrl ? (
            <figure className="relative mt-10 aspect-[16/9] w-full overflow-hidden rounded-lg border border-white/10 bg-fci-void">
              <Image
                src={coverUrl}
                alt={coverAlt}
                fill
                sizes="(min-width: 1024px) 768px, 100vw"
                priority
                className="object-cover"
              />
              {cover?.caption ? (
                <figcaption className="absolute inset-x-0 bottom-0 bg-fci-base/80 px-4 py-2 text-xs text-fci-muted">
                  {cover.caption}
                  {cover.credit ? (
                    <span className="ml-2 text-fci-muted/70">— {cover.credit}</span>
                  ) : null}
                </figcaption>
              ) : null}
            </figure>
          ) : null}

          <div className="mt-10">
            <PostBody data={post.body} />
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <RelatedPosts posts={related} locale={locale} />
        </div>
      </article>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </SitePageLayout>
  );
}
