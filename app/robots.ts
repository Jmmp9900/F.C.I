import type { MetadataRoute } from "next";

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/$/, "");

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
