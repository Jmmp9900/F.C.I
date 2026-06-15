export const HERO_CAROUSEL_IMAGES = {
  es: [
    "/images/hero-carousel/es/imagen1-consciencia.webp",
    "/images/hero-carousel/es/imagen2-educacion.webp",
    "/images/hero-carousel/es/imagen3-valores-compartidos.webp",
    "/images/hero-carousel/es/imagen4-ideas-politicas.webp",
    "/images/hero-carousel/es/imagen5-paradigmas-sociales.webp",
    "/images/hero-carousel/es/imagen6-vision-cultural.webp",
    "/images/hero-carousel/es/imagen7-accion-legado.webp",
  ],
  en: [
    "/images/hero-carousel/en/imagen1-awareness.webp",
    "/images/hero-carousel/en/imagen2-education.webp",
    "/images/hero-carousel/en/imagen3-shared-values.webp",
    "/images/hero-carousel/en/imagen4-political-ideas.webp",
    "/images/hero-carousel/en/imagen5-social-paradigms.webp",
    "/images/hero-carousel/en/imagen6-cultural-vision.webp",
    "/images/hero-carousel/en/imagen7-action-legacy.webp",
  ],
} as const;

export type HeroCarouselLocale = keyof typeof HERO_CAROUSEL_IMAGES;

export function getHeroCarouselImages(locale: string): readonly string[] {
  return locale === "en" ? HERO_CAROUSEL_IMAGES.en : HERO_CAROUSEL_IMAGES.es;
}
