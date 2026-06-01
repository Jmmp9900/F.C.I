import "server-only";
import { unstable_cache as cache } from "next/cache";
import type { Where } from "payload";

import { getPayload } from "./payload";
import type {
  CategoryDoc,
  Locale,
  PaginatedResult,
  PostDoc,
  TagDoc,
} from "./blog-types";

/* -------------------------------------------------------------------------- */
/*  Tags de caché                                                              */
/* -------------------------------------------------------------------------- */

/**
 * Tags usados por `unstable_cache` y por las llamadas a `revalidateTag` desde
 * los hooks de Payload (ver `collections/Posts.ts`). Tener nombres explícitos
 * facilita invalidar grupos enteros tras una publicación.
 */
export const BLOG_TAGS = {
  postsList: "posts:list",
  postsFeatured: "posts:featured",
  post: (slug: string) => `post:${slug}`,
  categories: "categories:list",
  tags: "tags:list",
} as const;

/* -------------------------------------------------------------------------- */
/*  Consultas                                                                  */
/* -------------------------------------------------------------------------- */

type GetPostsOptions = {
  locale: Locale;
  page?: number;
  limit?: number;
  featured?: boolean;
  categorySlug?: string;
  tagSlug?: string;
  search?: string;
};

async function rawGetPosts({
  locale,
  page = 1,
  limit = 9,
  featured,
  categorySlug,
  tagSlug,
  search,
}: GetPostsOptions): Promise<PaginatedResult<PostDoc>> {
  try {
    const payload = await getPayload();

  const whereClauses: Where[] = [{ status: { equals: "published" } }];

  if (featured) {
    whereClauses.push({ featured: { equals: true } });
  }

  if (categorySlug) {
    const cat = await payload.find({
      collection: "categories",
      where: { slug: { equals: categorySlug } },
      locale,
      limit: 1,
      depth: 0,
    });
    const categoryId = cat.docs[0]?.id;
    if (!categoryId) {
      return emptyPage(page, limit);
    }
    whereClauses.push({ categories: { in: [categoryId] } });
  }

  if (tagSlug) {
    const tag = await payload.find({
      collection: "tags",
      where: { slug: { equals: tagSlug } },
      locale,
      limit: 1,
      depth: 0,
    });
    const tagId = tag.docs[0]?.id;
    if (!tagId) {
      return emptyPage(page, limit);
    }
    whereClauses.push({ tags: { in: [tagId] } });
  }

  if (search && search.trim().length > 0) {
    const term = search.trim();
    whereClauses.push({
      or: [
        { title: { like: term } },
        { excerpt: { like: term } },
      ],
    });
  }

  const where: Where =
    whereClauses.length === 1 ? whereClauses[0] : { and: whereClauses };

  const result = await payload.find({
    collection: "posts",
    locale,
    fallbackLocale: "es",
    depth: 2,
    page,
    limit,
    sort: "-publishedAt",
    where,
  });

  return result as unknown as PaginatedResult<PostDoc>;
  } catch (err) {
    console.error("[blog] getPosts failed:", (err as Error).message);
    return emptyPage(page, limit);
  }
}

/** Lista paginada de posts publicados con filtros opcionales. Cacheada por tag. */
export const getPosts = cache(rawGetPosts, ["blog:getPosts"], {
  tags: [BLOG_TAGS.postsList],
  revalidate: 60,
});

/** Posts destacados (para el home). */
export const getFeaturedPosts = cache(
  async (locale: Locale, limit = 3): Promise<PostDoc[]> => {
    const result = await rawGetPosts({ locale, featured: true, limit });
    return result.docs;
  },
  ["blog:getFeaturedPosts"],
  { tags: [BLOG_TAGS.postsFeatured], revalidate: 60 },
);

/** Detalle de un post por slug. Devuelve `null` si no existe o no está publicado. */
export async function getPostBySlug(
  slug: string,
  locale: Locale,
): Promise<PostDoc | null> {
  const payload = await getPayload();
  const result = await payload.find({
    collection: "posts",
    where: {
      and: [
        { slug: { equals: slug } },
        { status: { equals: "published" } },
      ],
    },
    locale,
    fallbackLocale: "es",
    depth: 2,
    limit: 1,
  });
  return (result.docs[0] as unknown as PostDoc) ?? null;
}

/** Categoría por slug. */
export async function getCategoryBySlug(
  slug: string,
  locale: Locale,
): Promise<CategoryDoc | null> {
  const payload = await getPayload();
  const result = await payload.find({
    collection: "categories",
    where: { slug: { equals: slug } },
    locale,
    fallbackLocale: "es",
    limit: 1,
  });
  return (result.docs[0] as unknown as CategoryDoc) ?? null;
}

/** Tag por slug. */
export async function getTagBySlug(
  slug: string,
  locale: Locale,
): Promise<TagDoc | null> {
  const payload = await getPayload();
  const result = await payload.find({
    collection: "tags",
    where: { slug: { equals: slug } },
    locale,
    fallbackLocale: "es",
    limit: 1,
  });
  return (result.docs[0] as unknown as TagDoc) ?? null;
}

/** Lista de todas las categorías (para selects y filtros). */
export const getAllCategories = cache(
  async (locale: Locale): Promise<CategoryDoc[]> => {
    const payload = await getPayload();
    const result = await payload.find({
      collection: "categories",
      locale,
      fallbackLocale: "es",
      limit: 100,
      sort: "name",
      depth: 0,
    });
    return result.docs as unknown as CategoryDoc[];
  },
  ["blog:getAllCategories"],
  { tags: [BLOG_TAGS.categories], revalidate: 300 },
);

/** Lista de todas las tags. */
export const getAllTags = cache(
  async (locale: Locale): Promise<TagDoc[]> => {
    const payload = await getPayload();
    const result = await payload.find({
      collection: "tags",
      locale,
      fallbackLocale: "es",
      limit: 200,
      sort: "name",
      depth: 0,
    });
    return result.docs as unknown as TagDoc[];
  },
  ["blog:getAllTags"],
  { tags: [BLOG_TAGS.tags], revalidate: 300 },
);

/** Posts relacionados: comparten categoría o tag con el actual. */
export async function getRelatedPosts(
  currentPost: PostDoc,
  locale: Locale,
  limit = 3,
): Promise<PostDoc[]> {
  const payload = await getPayload();

  const categoryIds = (currentPost.categories ?? [])
    .map((c) => (typeof c === "object" && c !== null ? c.id : c))
    .filter(Boolean);
  const tagIds = (currentPost.tags ?? [])
    .map((t) => (typeof t === "object" && t !== null ? t.id : t))
    .filter(Boolean);

  if (categoryIds.length === 0 && tagIds.length === 0) {
    return [];
  }

  const orClauses: Where[] = [];
  if (categoryIds.length) orClauses.push({ categories: { in: categoryIds } });
  if (tagIds.length) orClauses.push({ tags: { in: tagIds } });

  const result = await payload.find({
    collection: "posts",
    locale,
    fallbackLocale: "es",
    depth: 1,
    limit,
    sort: "-publishedAt",
    where: {
      and: [
        { id: { not_equals: currentPost.id } },
        { status: { equals: "published" } },
        { or: orClauses },
      ],
    },
  });

  return result.docs as unknown as PostDoc[];
}

/** Todos los slugs publicados (para sitemap / generateStaticParams). */
export async function getAllPostSlugs(locale: Locale): Promise<string[]> {
  const payload = await getPayload();
  const result = await payload.find({
    collection: "posts",
    where: { status: { equals: "published" } },
    locale,
    depth: 0,
    limit: 1000,
    pagination: false,
  });
  return (result.docs as unknown as PostDoc[]).map((d) => d.slug);
}

/* -------------------------------------------------------------------------- */
/*  Util                                                                       */
/* -------------------------------------------------------------------------- */

function emptyPage<T>(page: number, limit: number): PaginatedResult<T> {
  return {
    docs: [],
    totalDocs: 0,
    totalPages: 0,
    page,
    limit,
    hasPrevPage: false,
    hasNextPage: false,
  };
}

/**
 * Estima el tiempo de lectura a partir del cuerpo Lexical contando palabras
 * en los nodos `text`. Heurística: 220 palabras/minuto. Mínimo 1 minuto.
 */
export function estimateReadingMinutes(body: unknown): number {
  let words = 0;
  const visit = (node: unknown): void => {
    if (!node || typeof node !== "object") return;
    const n = node as { type?: string; text?: string; children?: unknown[] };
    if (n.type === "text" && typeof n.text === "string") {
      words += n.text.trim().split(/\s+/).filter(Boolean).length;
    }
    if (Array.isArray(n.children)) {
      n.children.forEach(visit);
    }
  };
  visit((body as { root?: unknown })?.root ?? body);
  return Math.max(1, Math.round(words / 220));
}
