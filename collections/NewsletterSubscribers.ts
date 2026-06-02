import type { CollectionConfig } from "payload";

import { adminOnly, staffOnlyFieldAccess } from "./access";

export const NewsletterSubscribers: CollectionConfig = {
  slug: "newsletter-subscribers",
  admin: {
    useAsTitle: "email",
    defaultColumns: ["email", "locale", "status", "subscribedAt"],
  },
  access: {
    read: ({ req }) => Boolean(req.user),
    /** Solo la server action `subscribeNewsletter` (overrideAccess). */
    create: () => false,
    update: adminOnly,
    delete: adminOnly,
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
      access: staffOnlyFieldAccess,
    },
    {
      name: "subscribedAt",
      type: "date",
      defaultValue: () => new Date(),
      access: staffOnlyFieldAccess,
      admin: { readOnly: true },
    },
  ],
};
