import type { CollectionConfig } from "payload";

import { adminOnly, staffOnlyFieldAccess } from "./access";

/**
 * Mensajes recibidos desde el formulario público de contacto.
 *
 * - `create` cerrado en REST/GraphQL: solo la server action `submitContact`
 *   crea registros con `overrideAccess: true`.
 * - `read`/`update`/`delete` restringidos al equipo (`req.user`).
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
    create: () => false,
    update: adminOnly,
    delete: adminOnly,
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
      access: staffOnlyFieldAccess,
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "internalNotes",
      type: "textarea",
      access: staffOnlyFieldAccess,
      admin: {
        description: "Notas internas (no visibles para el remitente).",
      },
    },
    {
      name: "userAgent",
      type: "text",
      access: staffOnlyFieldAccess,
      admin: { readOnly: true, hidden: true },
    },
    {
      name: "ipAddress",
      type: "text",
      access: staffOnlyFieldAccess,
      admin: { readOnly: true, hidden: true },
    },
  ],
};
