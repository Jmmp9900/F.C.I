/** WhatsApp de la fundación (+57 320 8096446). */
export const FOUNDATION_WHATSAPP_PHONE = "573208096446";

/**
 * Enlace directo al chat de WhatsApp (`wa.me`).
 *
 * En `.env.local` puedes sobreescribir:
 * - `NEXT_PUBLIC_WHATSAPP_PHONE`: solo dígitos con código de país.
 * - Opcional `NEXT_PUBLIC_WHATSAPP_MESSAGE`: texto inicial del mensaje.
 */
export function getWhatsAppChatHref(): string {
  const raw =
    process.env.NEXT_PUBLIC_WHATSAPP_PHONE ?? FOUNDATION_WHATSAPP_PHONE;
  const digits = raw.replace(/\D/g, "");
  if (!digits) {
    return "#contacto";
  }

  let url = `https://wa.me/${digits}`;
  const preset = process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE?.trim();
  if (preset) {
    url += `?text=${encodeURIComponent(preset)}`;
  }
  return url;
}

export function isWhatsAppChatHref(href: string): boolean {
  return href.startsWith("https://wa.me/");
}
