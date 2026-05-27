import { defineRouting } from "next-intl/routing";

/**
 * Rutas canónicas (lo que existe en `app/(frontend)/[locale]/...`) y su
 * traducción pública por idioma. Visitar `/es/publicaciones` o `/en/posts`
 * sirve el mismo `app/.../blog/page.tsx` por debajo.
 *
 * Cuando añadas rutas físicas nuevas (ej. `/contacto`), regístralas aquí.
 */
export const routing = defineRouting({
  locales: ["es", "en"],
  defaultLocale: "es",
  localePrefix: "always",
  pathnames: {
    "/": "/",
    "/blog": {
      es: "/publicaciones",
      en: "/posts",
    },
    "/blog/[slug]": {
      es: "/publicaciones/[slug]",
      en: "/posts/[slug]",
    },
    "/blog/categoria/[slug]": {
      es: "/publicaciones/categoria/[slug]",
      en: "/posts/category/[slug]",
    },
    "/blog/tag/[slug]": {
      es: "/publicaciones/etiqueta/[slug]",
      en: "/posts/tag/[slug]",
    },
    "/contacto": {
      es: "/contacto",
      en: "/contact",
    },
    "/contacto/gracias": {
      es: "/contacto/gracias",
      en: "/contact/thanks",
    },
  },
});

export type AppPathnames = keyof typeof routing.pathnames;
