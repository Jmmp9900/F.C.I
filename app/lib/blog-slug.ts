/**
 * Slugs permitidos en rutas del blog (letras, números, guiones).
 * Rechaza payloads de inyección en la URL antes de consultar Payload.
 */
export function isValidSlug(slug: string): boolean {
  return (
    slug.length > 0 &&
    slug.length <= 200 &&
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/i.test(slug)
  );
}
