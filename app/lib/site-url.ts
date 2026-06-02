/** URL pública del sitio (sitemap, OG, canonical). Netlify inyecta `URL` si falta NEXT_PUBLIC_SITE_URL. */
export function getPublicSiteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.URL ??
    process.env.DEPLOY_PRIME_URL ??
    "http://localhost:3000"
  ).replace(/\/$/, "");
}
