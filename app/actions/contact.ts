"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { getPayload } from "../lib/payload";
import { getPathname } from "@/i18n/navigation";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export type ContactState = {
  status: "idle" | "error";
  message?: string;
  fields?: {
    name?: string;
    email?: string;
    organization?: string;
    subject?: string;
    message?: string;
  };
};

const MAX = {
  name: 120,
  email: 200,
  organization: 160,
  subject: 200,
  message: 5000,
};

/**
 * Recibe un mensaje del formulario público de contacto y lo guarda en la
 * colección `contacts`. Si todo va bien redirige a `/contacto/gracias`.
 *
 * Decisión: usamos `redirect` en server action en lugar de un componente
 * "thank you" inline para evitar que un refresh del navegador re-envíe el
 * mensaje (patrón PRG — Post/Redirect/Get).
 *
 * Anti-spam:
 *  - Honeypot oculto (`website`).
 *  - Tiempo mínimo desde render (`renderedAt`): si llenan en <2s, probablemente
 *    bot. (No bloquea — marcamos como spam.)
 */
export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const organization = String(formData.get("organization") ?? "").trim();
  const subject = String(formData.get("subject") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const locale = (String(formData.get("locale") ?? "es") || "es") as "es" | "en";
  const honeypot = String(formData.get("website") ?? "");
  const renderedAt = Number(formData.get("renderedAt") ?? 0);

  const fields = { name, email, organization, subject, message };

  if (!name || name.length > MAX.name) {
    return { status: "error", message: "invalid_name", fields };
  }
  if (!email || !EMAIL_REGEX.test(email) || email.length > MAX.email) {
    return { status: "error", message: "invalid_email", fields };
  }
  if (organization.length > MAX.organization) {
    return { status: "error", message: "invalid_organization", fields };
  }
  if (!subject || subject.length > MAX.subject) {
    return { status: "error", message: "invalid_subject", fields };
  }
  if (!message || message.length > MAX.message || message.length < 10) {
    return { status: "error", message: "invalid_message", fields };
  }

  const isLikelyBot =
    Boolean(honeypot) ||
    (renderedAt > 0 && Date.now() - renderedAt < 2000);

  try {
    const payload = await getPayload();
    const hdrs = await headers();
    const userAgent = hdrs.get("user-agent") ?? "";
    const forwardedFor = hdrs.get("x-forwarded-for") ?? "";
    const ipAddress = forwardedFor.split(",")[0]?.trim() || "";

    await payload.create({
      collection: "contacts",
      data: {
        name,
        email,
        organization: organization || undefined,
        subject,
        message,
        locale,
        status: isLikelyBot ? "spam" : "new",
        userAgent,
        ipAddress,
      },
    });
  } catch (err) {
    console.error("[contact] submit failed:", err);
    return { status: "error", message: "server_error", fields };
  }

  /* Redirige fuera del try/catch porque `redirect` lanza una excepción
     interna para finalizar el RSC; no debemos capturarla. */
  const thanksPath = getPathname({
    href: "/contacto/gracias",
    locale,
  });
  redirect(thanksPath);
}
