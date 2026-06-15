import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-postgres";

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "contacts"
      ADD COLUMN IF NOT EXISTS "phone" varchar,
      ADD COLUMN IF NOT EXISTS "country" varchar;
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "contacts"
      DROP COLUMN IF EXISTS "phone",
      DROP COLUMN IF EXISTS "country";
  `);
}
