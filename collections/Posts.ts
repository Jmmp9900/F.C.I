import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, CollectionConfig } from "payload";
import { revalidatePath, revalidateTag } from "next/cache";

/** Invalida los listados cacheados y la página específica del post. */
const revalidateAfterChange: CollectionAfterChangeHook = ({ doc, previousDoc }) => {
  try {
    revalidateTag("posts:list", { expire: 0 });
    revalidateTag("posts:featured", { expire: 0 });
    if (doc?.slug) {
      revalidateTag(`post:${doc.slug}`, { expire: 0 });
      /* `revalidatePath` necesita un patrón de ruta; usamos la versión con
         el path canónico que cubre /[locale]/blog/[slug] para ambos idiomas. */
      revalidatePath(`/[locale]/blog/${doc.slug}`, "page");
    }
    if (previousDoc?.slug && previousDoc.slug !== doc?.slug) {
      revalidateTag(`post:${previousDoc.slug}`, { expire: 0 });
    }
    revalidatePath("/[locale]/blog", "page");
    revalidatePath("/[locale]", "page");
  } catch (err) {
    /* En `payload generate:importmap` o scripts CLI, revalidate falla porque
       no hay request context. No queremos romper el guardado por eso. */
    console.warn("[Posts] revalidate skipped:", (err as Error).message);
  }
};

const revalidateAfterDelete: CollectionAfterDeleteHook = ({ doc }) => {
  try {
    revalidateTag("posts:list", { expire: 0 });
    revalidateTag("posts:featured", { expire: 0 });
    if (doc?.slug) revalidateTag(`post:${doc.slug}`, { expire: 0 });
    revalidatePath("/[locale]/blog", "page");
    revalidatePath("/[locale]", "page");
  } catch (err) {
    console.warn("[Posts] revalidate (delete) skipped:", (err as Error).message);
  }
};

export const Posts: CollectionConfig = {
  slug: "posts",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "status", "featured", "publishedAt", "updatedAt"],
  },
  access: {
    /** Los borradores solo los ven usuarios autenticados. */
    read: ({ req }) => {
      if (req.user) return true;
      return {
        status: { equals: "published" },
      };
    },
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => req.user?.role === "admin",
  },
  versions: {
    drafts: true,
  },
  fields: [
    {
      name: "title",
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
      admin: {
        description: "URL del post. Ej: 'inteligencia-espacial'.",
      },
    },
    {
      name: "excerpt",
      type: "textarea",
      localized: true,
      admin: {
        description: "Resumen corto (1-2 líneas) usado en listados y meta-description.",
      },
    },
    {
      name: "cover",
      type: "upload",
      relationTo: "media",
      required: true,
    },
    {
      name: "body",
      type: "richText",
      required: true,
      localized: true,
    },
    {
      type: "row",
      fields: [
        {
          name: "categories",
          type: "relationship",
          relationTo: "categories",
          hasMany: true,
          admin: { width: "50%" },
        },
        {
          name: "tags",
          type: "relationship",
          relationTo: "tags",
          hasMany: true,
          admin: { width: "50%" },
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "status",
          type: "select",
          required: true,
          defaultValue: "draft",
          options: [
            { label: "Borrador", value: "draft" },
            { label: "Publicado", value: "published" },
          ],
          admin: { width: "50%" },
        },
        {
          name: "featured",
          type: "checkbox",
          label: "Destacado en el home",
          defaultValue: false,
          admin: { width: "50%" },
        },
      ],
    },
    {
      name: "publishedAt",
      type: "date",
      admin: {
        date: { pickerAppearance: "dayAndTime" },
        description: "Fecha visible en el sitio. Se autocompleta al publicar.",
      },
    },
    {
      type: "collapsible",
      label: "SEO (opcional)",
      admin: { initCollapsed: true },
      fields: [
        {
          name: "seoTitle",
          type: "text",
          localized: true,
          admin: {
            description: "Sobrescribe el <title> en buscadores. Si vacío, usa el título.",
          },
        },
        {
          name: "seoDescription",
          type: "textarea",
          localized: true,
          admin: {
            description: "Sobrescribe la meta-description. Si vacío, usa el excerpt.",
          },
        },
      ],
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, operation }) => {
        if (
          (operation === "create" || operation === "update") &&
          data?.status === "published" &&
          !data?.publishedAt
        ) {
          data.publishedAt = new Date().toISOString();
        }
        return data;
      },
    ],
    afterChange: [revalidateAfterChange],
    afterDelete: [revalidateAfterDelete],
  },
};
