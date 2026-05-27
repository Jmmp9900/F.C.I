/**
 * Tipos "ligeros" del blog para el frontend. Se usan hasta que Payload genere
 * los tipos completos con `npm run generate:types` (creará `payload-types.ts`).
 * Después podemos importar `Post` y `Category` directamente de allí; mientras,
 * estos hacen de contrato mínimo entre el helper `blog.ts` y los componentes.
 */

export type Locale = "es" | "en";

export type MediaSize = {
  url?: string | null;
  width?: number | null;
  height?: number | null;
  mimeType?: string | null;
  filesize?: number | null;
  filename?: string | null;
};

export type MediaDoc = {
  id: string | number;
  url?: string | null;
  thumbnailURL?: string | null;
  width?: number | null;
  height?: number | null;
  filename?: string | null;
  mimeType?: string | null;
  alt?: string | null;
  caption?: string | null;
  credit?: string | null;
  sizes?: {
    thumbnail?: MediaSize;
    card?: MediaSize;
    hero?: MediaSize;
  } | null;
};

export type CategoryDoc = {
  id: string | number;
  name: string;
  slug: string;
  description?: string | null;
};

export type TagDoc = {
  id: string | number;
  name: string;
  slug: string;
};

export type PostStatus = "draft" | "published";

export type PostDoc = {
  id: string | number;
  title: string;
  slug: string;
  excerpt?: string | null;
  cover: MediaDoc | string | number;
  /** Lexical rich text (objeto JSON). El renderizado vive en `PostBody`. */
  body: unknown;
  categories?: (CategoryDoc | string | number)[] | null;
  tags?: (TagDoc | string | number)[] | null;
  status: PostStatus;
  featured?: boolean | null;
  publishedAt?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type PaginatedResult<T> = {
  docs: T[];
  totalDocs: number;
  totalPages: number;
  page: number;
  limit: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
};

/** Helpers para tratar relaciones que pueden venir como ID o como doc poblado. */

export function isMediaDoc(value: unknown): value is MediaDoc {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    ("url" in value || "filename" in value)
  );
}

export function isCategoryDoc(value: unknown): value is CategoryDoc {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    "slug" in value &&
    "name" in value
  );
}

export function isTagDoc(value: unknown): value is TagDoc {
  return isCategoryDoc(value);
}

export function getMediaUrl(media: MediaDoc | string | number | null | undefined, size: "thumbnail" | "card" | "hero" | "original" = "card"): string | null {
  if (!media || typeof media !== "object") return null;
  if (size === "original") return media.url ?? null;
  return media.sizes?.[size]?.url ?? media.url ?? null;
}

export function getMediaAlt(media: MediaDoc | string | number | null | undefined): string {
  if (!media || typeof media !== "object") return "";
  return media.alt ?? "";
}
