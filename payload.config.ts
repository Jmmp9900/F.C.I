import path from "path";
import { fileURLToPath } from "url";

import { postgresAdapter } from "@payloadcms/db-postgres";
import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { s3Storage } from "@payloadcms/storage-s3";
import { buildConfig } from "payload";
import sharp from "sharp";

import { Categories } from "./collections/Categories";
import { Contacts } from "./collections/Contacts";
import { Media } from "./collections/Media";
import { NewsletterSubscribers } from "./collections/NewsletterSubscribers";
import { Posts } from "./collections/Posts";
import { Tags } from "./collections/Tags";
import { Users } from "./collections/Users";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

/* -------------------------------------------------------------------------- */
/*  Database adapter dual                                                      */
/* -------------------------------------------------------------------------- */
/**
 * En desarrollo, sin `DATABASE_URI`, usamos SQLite (`./payload.db`): sin
 * instalaciones extra, cero fricción.
 *
 * En producción (Netlify + Neon), `DATABASE_URI` empieza con `postgres://`
 * y usamos el adapter de PostgreSQL. Drizzle es la capa común — las
 * colecciones y migraciones no cambian al alternar el adapter.
 */
const dbUri = process.env.DATABASE_URI ?? "file:./payload.db";
const isPostgres =
  dbUri.startsWith("postgres://") || dbUri.startsWith("postgresql://");

const db = isPostgres
  ? postgresAdapter({
      pool: {
        connectionString: dbUri,
        /* Neon, Supabase y la mayoría de Postgres gestionados requieren SSL.
           Si se conecta a un Postgres local sin SSL, override con `?sslmode=disable`
           en la propia URI o seteando `DATABASE_NO_SSL=1` aquí. */
        ssl: process.env.DATABASE_NO_SSL === "1"
          ? false
          : { rejectUnauthorized: false },
      },
    })
  : sqliteAdapter({
      client: { url: dbUri },
    });

/* -------------------------------------------------------------------------- */
/*  Storage de Media                                                           */
/* -------------------------------------------------------------------------- */
/**
 * Usamos Cloudflare R2 vía API S3 (`@payloadcms/storage-s3`). El adapter se
 * activa SOLO cuando hay `R2_BUCKET` definido:
 *  - Local dev: variable ausente → Media se sirve desde `public/uploads/`
 *    (filesystem local; cero configuración).
 *  - Producción (Netlify): variables definidas → Media va a R2 y se sirve
 *    desde `R2_PUBLIC_URL` (dominio público de R2 o custom domain).
 *
 * Por qué R2 y no Vercel Blob: Cloudflare R2 tiene 10 GB free + 0 egress fees,
 * y al ser S3-compatible es portable a cualquier hosting (Netlify, Railway,
 * VPS, etc.) sin atarse a un proveedor concreto.
 */
const hasR2 = Boolean(process.env.R2_BUCKET);

/* -------------------------------------------------------------------------- */
/*  CORS                                                                       */
/* -------------------------------------------------------------------------- */
/**
 * En producción restringimos CORS al dominio público para evitar que otros
 * sitios consuman la API REST/GraphQL del cliente. En dev quedan abiertas
 * para no estorbar (ngrok, IPs LAN, etc.).
 */
function corsOrigins(): string[] | "*" {
  if (process.env.NODE_ENV !== "production") return "*";
  const site = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  const extras = process.env.PAYLOAD_CORS_EXTRA?.split(",")
    .map((s) => s.trim())
    .filter(Boolean) ?? [];
  return [site, ...extras].filter((v): v is string => Boolean(v));
}

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: " · FCI Admin",
    },
  },
  editor: lexicalEditor(),
  collections: [
    Users,
    Media,
    Categories,
    Tags,
    Posts,
    NewsletterSubscribers,
    Contacts,
  ],
  secret: process.env.PAYLOAD_SECRET || "CHANGE-ME-IN-PRODUCTION",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db,
  sharp,
  localization: {
    locales: [
      { label: "Español", code: "es" },
      { label: "English", code: "en" },
    ],
    defaultLocale: "es",
    fallback: true,
  },
  upload: {
    limits: {
      fileSize: 10_000_000,
    },
  },
  cors: corsOrigins(),
  plugins: [
    s3Storage({
      enabled: hasR2,
      collections: {
        /* `media` es el slug de la colección Media. `disablePayloadAccessControl`
           hace que las URLs apunten directo al CDN público de R2 (sin pasar
           por la función serverless), lo que evita timeouts en imágenes
           pesadas y descarga el ancho de banda hacia Cloudflare. */
        media: {
          disablePayloadAccessControl: true,
          generateFileURL: ({ filename, prefix }) => {
            const base = process.env.R2_PUBLIC_URL?.replace(/\/$/, "") ?? "";
            const key = prefix ? `${prefix}/${filename}` : filename;
            return `${base}/${key}`;
          },
        },
      },
      bucket: process.env.R2_BUCKET ?? "",
      config: {
        credentials: {
          accessKeyId: process.env.R2_ACCESS_KEY_ID ?? "",
          secretAccessKey: process.env.R2_SECRET_ACCESS_KEY ?? "",
        },
        /* R2 ignora la región pero exige `auto`. */
        region: "auto",
        /* Endpoint de R2 con protocolo: https://<accountId>.r2.cloudflarestorage.com */
        endpoint: process.env.R2_ENDPOINT,
        /* Obligatorio en R2: usar URLs path-style en lugar de host-style. */
        forcePathStyle: true,
      },
    }),
  ],
});
