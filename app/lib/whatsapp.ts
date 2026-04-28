/**
 * Enlace directo al chat de WhatsApp (`wa.me`).
 *
 * En `.env.local` define:
 * - `NEXT_PUBLIC_WHATSAPP_PHONE`: solo dígitos con código de país (ej. Colombia `573001234567`).
 * - Opcional `NEXT_PUBLIC_WHATSAPP_MESSAGE`: texto inicial del mensaje.
 *
 * Sin número configurado, el href cae en `#contacto` como respaldo.
 */
export function getWhatsAppChatHref(): string {
  const raw = process.env.NEXT_PUBLIC_WHATSAPP_PHONE ?? "";
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
