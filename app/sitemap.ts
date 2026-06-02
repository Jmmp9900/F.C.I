import type { MetadataRoute } from "next";

import { routing } from "@/i18n/routing";
import { getAllCategories, getAllPostSlugs, getAllTags } from "./lib/blog";

import { getPublicSiteUrl } from "./lib/site-url";

export const dynamic = "force-dynamic";

const SITE_URL = getPublicSiteUrl();

type Url = MetadataRoute.Sitemap[number];

/**
 * Sitemap dinámico (servido en `/sitemap.xml`).
 *
 * Vive en `app/sitemap.ts`, no dentro de un route group (`app/(frontend)/...`),
 * porque Next.js solo registra archivos de Metadata API (`robots.ts`,
 * `sitemap.ts`) cuando están directamente en `app/`.
 *
 * Enumera home + listados + posts + categorías + tags en ambos idiomas con sus
 * URLs traducidas según `i18n/routing.ts`.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const urls: Url[] = [];
  const now = new Date();

  /* Home + listado por idioma */
  for (const locale of routing.locales) {
    urls.push({
      url: `${SITE_URL}/${locale}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    });

    const blogPublic =
      typeof routing.pathnames["/blog"] === "string"
        ? routing.pathnames["/blog"]
        : routing.pathnames["/blog"][locale];
    urls.push({
      url: `${SITE_URL}/${locale}${blogPublic}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    });
  }

  /* Posts publicados */
  for (const locale of routing.locales) {
    const slugs = await getAllPostSlugs(locale);
    const tpl = routing.pathnames["/blog/[slug]"];
    const path = typeof tpl === "string" ? tpl : tpl[locale];
    for (const slug of slugs) {
      urls.push({
        url: `${SITE_URL}/${locale}${path.replace("[slug]", slug)}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
  }

  /* Categorías */
  for (const locale of routing.locales) {
    const cats = await getAllCategories(locale);
    const tpl = routing.pathnames["/blog/categoria/[slug]"];
    const path = typeof tpl === "string" ? tpl : tpl[locale];
    for (const cat of cats) {
      urls.push({
        url: `${SITE_URL}/${locale}${path.replace("[slug]", cat.slug)}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.5,
      });
    }
  }

  /* Tags */
  for (const locale of routing.locales) {
    const tags = await getAllTags(locale);
    const tpl = routing.pathnames["/blog/tag/[slug]"];
    const path = typeof tpl === "string" ? tpl : tpl[locale];
    for (const tag of tags) {
      urls.push({
        url: `${SITE_URL}/${locale}${path.replace("[slug]", tag.slug)}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.4,
      });
    }
  }

  return urls;
}
