import type { CollectionConfig } from "payload";
import { revalidateTag } from "next/cache";

const safeRevalidate = () => {
  try {
    revalidateTag("tags:list");
    revalidateTag("posts:list");
  } catch (err) {
    console.warn("[Tags] revalidate skipped:", (err as Error).message);
  }
};

export const Tags: CollectionConfig = {
  slug: "tags",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "slug"],
  },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => req.user?.role === "admin",
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      localized: true,
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
    },
  ],
  hooks: {
    afterChange: [safeRevalidate],
    afterDelete: [safeRevalidate],
  },
};
