import type { CollectionConfig } from "payload";

/**
 * Mensajes recibidos desde el formulario público de contacto.
 *
 * - `create` abierto para que cualquier visitante pueda escribir desde
 *   la página `/contacto` (sin necesidad de cuenta).
 * - `read`/`update`/`delete` restringidos al equipo (`req.user`).
 *
 * Cuando integremos SMTP (Resend, SendGrid, etc.) añadiremos un hook
 * `afterChange` que envíe el aviso al admin con los datos del mensaje.
 */
export const Contacts: CollectionConfig = {
  slug: "contacts",
  admin: {
    useAsTitle: "subject",
    defaultColumns: ["name", "email", "subject", "status", "createdAt"],
    description:
      "Mensajes enviados desde el formulario público en /contacto.",
  },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: () => true,
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => req.user?.role === "admin",
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      maxLength: 120,
    },
    {
      name: "email",
      type: "email",
      required: true,
      index: true,
    },
    {
      name: "organization",
      type: "text",
      maxLength: 160,
    },
    {
      name: "subject",
      type: "text",
      required: true,
      maxLength: 200,
    },
    {
      name: "message",
      type: "textarea",
      required: true,
      maxLength: 5000,
    },
    {
      name: "locale",
      type: "select",
      required: true,
      defaultValue: "es",
      options: [
        { label: "Español", value: "es" },
        { label: "English", value: "en" },
      ],
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "new",
      options: [
        { label: "Nuevo", value: "new" },
        { label: "En revisión", value: "in_review" },
        { label: "Respondido", value: "answered" },
        { label: "Spam", value: "spam" },
        { label: "Archivado", value: "archived" },
      ],
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "internalNotes",
      type: "textarea",
      admin: {
        description: "Notas internas (no visibles para el remitente).",
      },
    },
    {
      name: "userAgent",
      type: "text",
      admin: { readOnly: true, hidden: true },
    },
    {
      name: "ipAddress",
      type: "text",
      admin: { readOnly: true, hidden: true },
    },
  ],
};
