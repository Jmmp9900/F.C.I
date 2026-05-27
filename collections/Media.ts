import path from "path";
import { fileURLToPath } from "url";

import type { CollectionConfig } from "payload";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export const Media: CollectionConfig = {
  slug: "media",
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => req.user?.role === "admin",
  },
  upload: {
    staticDir: path.resolve(dirname, "../public/uploads"),
    mimeTypes: ["image/*", "application/pdf"],
    imageSizes: [
      { name: "thumbnail", width: 400, height: 300, position: "centre" },
      { name: "card", width: 768, height: 576, position: "centre" },
      { name: "hero", width: 1920, height: 1080, position: "centre" },
    ],
    adminThumbnail: "thumbnail",
    formatOptions: {
      format: "webp",
      options: { quality: 85 },
    },
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
      localized: true,
      admin: {
        description: "Texto alternativo accesible (lo lee un lector de pantalla).",
      },
    },
    {
      name: "caption",
      type: "text",
      localized: true,
    },
    {
      name: "credit",
      type: "text",
      admin: {
        description: "Crédito del autor / fuente (opcional).",
      },
    },
  ],
};
