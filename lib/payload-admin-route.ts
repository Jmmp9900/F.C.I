/**
 * Ruta pública del panel de administración de Payload.
 * No usar `/admin` — es el primer path que escanean bots y atacantes.
 *
 * Si cambias `PAYLOAD_ADMIN_SEGMENT`, actualiza también el matcher en `proxy.ts`
 * (Next.js exige strings estáticos en la config del proxy).
 */
export const PAYLOAD_ADMIN_SEGMENT = "fci-cms-8k3m7q2x";

export const PAYLOAD_ADMIN_ROUTE = `/${PAYLOAD_ADMIN_SEGMENT}`;
