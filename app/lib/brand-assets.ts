/**
 * Imágenes de marca: con USE_LOCAL_BRAND_IMAGES = true, coloca los mismos
 * nombres bajo public/images/brand/ (ver LOCAL).
 */
export const USE_LOCAL_BRAND_IMAGES = true;

/** Respaldo si se desactiva local; URLs anteriores (1516307367426, 1523961131990, 1457364559154) devolvían 404. */
/* URLs remotas: parámetros altos (w, q) para buena resolución si se usa REMOTE. */
const REMOTE = {
  hero: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=90&w=2560&auto=format&fit=crop",
  tierra: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=90&w=1920&auto=format&fit=crop",
  espacio: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?q=90&w=1920&auto=format&fit=crop",
  quienesSomos:
    "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?q=90&w=1920&auto=format&fit=crop",
  educacion:
    "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1920&q=90&auto=format&fit=crop",
  publicacion1:
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=90&w=1600&auto=format&fit=crop",
  publicacion2:
    "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1600&q=90&auto=format&fit=crop",
  publicacion3:
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1600&q=90&auto=format&fit=crop",
} as const;

const LOCAL: Record<keyof typeof REMOTE, string> = {
  hero: "/images/brand/hero-espacio.jpg",
  tierra: "/images/brand/tierra.jpg",
  espacio: "/images/brand/espacio.jpg",
  quienesSomos: "/images/brand/quienes-somos.jpg",
  educacion: "/images/brand/educacion.jpg",
  publicacion1: "/images/brand/publicacion-1.jpg",
  publicacion2: "/images/brand/publicacion-2.jpg",
  publicacion3: "/images/brand/publicacion-3.jpg",
};

export type BrandImageKey = keyof typeof REMOTE;

export function brandImage(key: BrandImageKey): string {
  return USE_LOCAL_BRAND_IMAGES ? LOCAL[key] : REMOTE[key];
}
