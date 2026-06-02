"use server";

import { headers } from "next/headers";

import { getPayload } from "../lib/payload";
import { clientIpFromHeaders, rateLimit } from "../lib/rate-limit";

/**
 * Validación mínima de email sin dependencias externas (zod aún no instalado).
 * Sigue las reglas básicas RFC 5322 sin pretender ser perfecta:
 *  - hay un único `@`
 *  - parte local y dominio no vacíos
 *  - dominio tiene al menos un `.`
 *  - sin espacios
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export type NewsletterState = {
  status: "idle" | "ok" | "error";
  message?: string;
};

/**
 * Suscribe un email a `newsletter-subscribers`.
 *
 * - Sin envío de email (todavía no hay SMTP configurado): solo persiste con
 *   `status: "pending"`. Cuando integremos Resend añadimos hook `afterChange`
 *   que dispara el doble opt-in.
 * - Idempotente ante duplicados (Payload detecta `unique: true`).
 *
 * Se llama desde `<NewsletterForm />` (client) con `useActionState`.
 */
export async function subscribeNewsletter(
  _prev: NewsletterState,
  formData: FormData,
): Promise<NewsletterState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const locale = String(formData.get("locale") ?? "es") as "es" | "en";
  /* Honeypot anti-spam: si el bot llena `website` (campo oculto), descartamos. */
  const honeypot = String(formData.get("website") ?? "");

  if (honeypot) {
    /* No revelamos al bot que detectamos: devolvemos ok. */
    return { status: "ok" };
  }

  if (!email || !EMAIL_REGEX.test(email) || email.length > 200) {
    return { status: "error", message: "invalid_email" };
  }

  const hdrs = await headers();
  const ip = clientIpFromHeaders(hdrs);
  const { allowed } = rateLimit(`newsletter:${ip}`, {
    limit: 3,
    windowMs: 60_000,
  });
  if (!allowed) {
    return { status: "ok" };
  }

  try {
    const payload = await getPayload();

    const existing = await payload.find({
      collection: "newsletter-subscribers",
      where: { email: { equals: email } },
      limit: 1,
      depth: 0,
    });

    if (existing.docs.length > 0) {
      /* No revelar si el email ya existe (anti-enumeración). */
      return { status: "ok" };
    }

    await payload.create({
      collection: "newsletter-subscribers",
      overrideAccess: true,
      data: {
        email,
        locale,
        status: "pending",
        subscribedAt: new Date().toISOString(),
      },
    });

    return { status: "ok" };
  } catch (err) {
    console.error("[newsletter] subscribe failed:", err);
    return { status: "error", message: "server_error" };
  }
}
