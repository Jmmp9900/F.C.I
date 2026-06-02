import type { MetadataRoute } from "next";

import { getPublicSiteUrl } from "./lib/site-url";

const SITE_URL = getPublicSiteUrl();

/**
 * `robots.txt` (servido en `/robots.txt`).
 *
 * Vive en `app/robots.ts`, no dentro de un route group (`app/(frontend)/...`),
 * porque Next.js solo registra archivos de Metadata API cuando están
 * directamente en `app/`.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
