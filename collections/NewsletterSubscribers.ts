import type { CollectionConfig } from "payload";

export const NewsletterSubscribers: CollectionConfig = {
  slug: "newsletter-subscribers",
  admin: {
    useAsTitle: "email",
    defaultColumns: ["email", "locale", "status", "subscribedAt"],
  },
  access: {
    read: ({ req }) => Boolean(req.user),
    /** Cualquiera puede suscribirse desde el sitio público. */
    create: () => true,
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => req.user?.role === "admin",
  },
  fields: [
    {
      name: "email",
      type: "email",
      required: true,
      unique: true,
      index: true,
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
      defaultValue: "pending",
      options: [
        { label: "Pendiente de confirmar", value: "pending" },
        { label: "Confirmado", value: "confirmed" },
        { label: "Cancelado", value: "unsubscribed" },
      ],
    },
    {
      name: "subscribedAt",
      type: "date",
      defaultValue: () => new Date(),
      admin: { readOnly: true },
    },
  ],
};
