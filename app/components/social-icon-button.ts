const socialIconButtonBase =
  "inline-flex shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] text-fci-gold/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition hover:border-fci-gold/30 hover:bg-white/[0.08] hover:text-fci-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-fci-gold/45 focus-visible:outline-offset-2";

/** Botón homogéneo para iconos (pie y bloques amplios). */
export const socialIconButtonClass = `${socialIconButtonBase} size-9`;

/** Variante más pequeña para espacios ajustados. */
export const socialIconButtonCompactClass = `${socialIconButtonBase} size-8`;

/**
 * Cabecera: sin borde por icono (menos ancho, sin “cajas” recargadas).
 * Evita que la píldora compita con el menú en anchos medios.
 */
export const socialIconHeaderClass =
  "inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-fci-gold/85 transition hover:bg-white/[0.1] hover:text-fci-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-fci-gold/50 focus-visible:outline-offset-2 xl:size-9";
