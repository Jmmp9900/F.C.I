/**
 * Seed inicial para arrancar contenido en Payload sin tener que poblar todo
 * desde el admin a mano. Es idempotente: si las categorías, tags o posts ya
 * existen (mismo slug), las salta. Útil para tener algo de muestra en demo
 * local y como punto de partida del contenido real en producción.
 *
 * Ejecución:
 *   npm run seed
 *
 * Por debajo usa `payload run` para que el CLI de Payload cargue
 * `payload.config.ts` y exponga `import config from "@payload-config"`.
 *
 * Nota sobre el `body`: el editor Lexical guarda JSON estructurado. Aquí
 * usamos un helper que construye un documento mínimo con párrafos y headings.
 * No reemplaza al editor visual del admin; sirve para demo.
 */
import { getPayload } from "payload";
import config from "../payload.config";
import { PAYLOAD_ADMIN_ROUTE } from "../lib/payload-admin-route";

/* -------------------------------------------------------------------------- */
/*  Datos                                                                      */
/* -------------------------------------------------------------------------- */

const categoriesSeed = [
  {
    slug: "geopolitica",
    name: { es: "Geopolítica", en: "Geopolitics" },
    description: {
      es: "Análisis del orden global, alianzas y conflictos.",
      en: "Analysis of the global order, alliances, and conflicts.",
    },
  },
  {
    slug: "astropolitica",
    name: { es: "Astropolítica", en: "Astropolitics" },
    description: {
      es: "Gobernanza espacial, normas orbitales y operadores emergentes.",
      en: "Space governance, orbital norms, and emerging operators.",
    },
  },
  {
    slug: "economia",
    name: { es: "Economía", en: "Economy" },
    description: {
      es: "Economía global, mercados emergentes y economía espacial.",
      en: "Global economy, emerging markets, and the space economy.",
    },
  },
];

const tagsSeed = [
  {
    slug: "new-space",
    name: { es: "New Space", en: "New Space" },
  },
  {
    slug: "seguridad-internacional",
    name: { es: "Seguridad internacional", en: "International security" },
  },
  {
    slug: "america-latina",
    name: { es: "América Latina", en: "Latin America" },
  },
];

/** Pequeño helper para construir un cuerpo Lexical con párrafos y H2. */
function makeBody(blocks: Array<{ type: "h2"; text: string } | { type: "p"; text: string }>) {
  return {
    root: {
      type: "root",
      direction: "ltr",
      format: "",
      indent: 0,
      version: 1,
      children: blocks.map((b) => {
        if (b.type === "h2") {
          return {
            type: "heading",
            tag: "h2",
            direction: "ltr",
            format: "",
            indent: 0,
            version: 1,
            children: [
              { type: "text", text: b.text, format: 0, mode: "normal", style: "", detail: 0, version: 1 },
            ],
          };
        }
        return {
          type: "paragraph",
          direction: "ltr",
          format: "",
          indent: 0,
          version: 1,
          textFormat: 0,
          children: [
            { type: "text", text: b.text, format: 0, mode: "normal", style: "", detail: 0, version: 1 },
          ],
        };
      }),
    },
  };
}

type PostSeed = {
  slug: string;
  title: Record<"es" | "en", string>;
  excerpt: Record<"es" | "en", string>;
  bodyBlocks: Record<"es" | "en", Array<{ type: "h2"; text: string } | { type: "p"; text: string }>>;
  categorySlugs: string[];
  tagSlugs: string[];
  featured: boolean;
  daysAgo: number;
};

const postsSeed: PostSeed[] = [
  {
    slug: "orbita-baja-nuevos-actores",
    title: {
      es: "Órbita baja: los nuevos actores y su impacto en la gobernanza",
      en: "Low Earth Orbit: New Actors and Their Impact on Governance",
    },
    excerpt: {
      es: "Operadores emergentes y constelaciones privadas reconfiguran las reglas de la órbita baja. Una mirada estratégica.",
      en: "Emerging operators and private constellations reshape the rules of low Earth orbit. A strategic view.",
    },
    bodyBlocks: {
      es: [
        { type: "h2", text: "Un nuevo mapa orbital" },
        {
          type: "p",
          text: "Durante la última década la órbita baja terrestre dejó de ser dominio exclusivo de un puñado de agencias estatales. Hoy convergen operadores comerciales con constelaciones de miles de satélites, agencias militares con misiones dedicadas y nuevos países que entran al ámbito espacial.",
        },
        {
          type: "p",
          text: "Esta diversificación abre oportunidades de cooperación y conectividad, pero también introduce nuevos vectores de competencia y riesgo. La pregunta clave es cómo gobernar un espacio cada vez más congestionado sin frenar la innovación.",
        },
        { type: "h2", text: "Tres tensiones en agenda" },
        {
          type: "p",
          text: "Primera: la sostenibilidad orbital frente al desorbitado, la basura espacial y las maniobras evasivas. Segunda: la transparencia en operaciones duales (civil-militar). Tercera: la capacidad de los Estados emergentes de participar como reguladores y no solo como usuarios.",
        },
      ],
      en: [
        { type: "h2", text: "A new orbital map" },
        {
          type: "p",
          text: "Over the last decade, low Earth orbit has stopped being the exclusive domain of a handful of state agencies. Today commercial operators with constellations of thousands of satellites, military agencies with dedicated missions, and new countries entering the space arena all converge.",
        },
        {
          type: "p",
          text: "This diversification opens cooperation and connectivity opportunities, but also introduces new vectors of competition and risk. The key question is how to govern an increasingly congested environment without halting innovation.",
        },
        { type: "h2", text: "Three tensions on the agenda" },
        {
          type: "p",
          text: "First: orbital sustainability against re-entry, space debris, and evasive maneuvers. Second: transparency in dual (civil-military) operations. Third: the capacity of emerging states to participate as regulators, not just as users.",
        },
      ],
    },
    categorySlugs: ["astropolitica"],
    tagSlugs: ["new-space"],
    featured: true,
    daysAgo: 3,
  },
  {
    slug: "riesgo-pais-y-conectividad-america-latina",
    title: {
      es: "Riesgo país y conectividad: el dilema latinoamericano",
      en: "Country Risk and Connectivity: The Latin American Dilemma",
    },
    excerpt: {
      es: "Cómo la geografía, las cadenas logísticas y las instituciones moldean el costo del capital en la región.",
      en: "How geography, logistics chains, and institutions shape the cost of capital across the region.",
    },
    bodyBlocks: {
      es: [
        {
          type: "p",
          text: "El riesgo país en América Latina no es solo financiero: es estructural. Conectividad portuaria deficiente, instituciones débiles y volatilidad regulatoria empujan al alza el costo de capital.",
        },
        { type: "h2", text: "Tres palancas de cambio" },
        {
          type: "p",
          text: "1) Mejorar la integración logística sub-regional. 2) Reglas claras y predecibles para inversión extranjera. 3) Mecanismos de cooperación financiera entre bancos centrales que reduzcan la dependencia del dólar en flujos comerciales.",
        },
      ],
      en: [
        {
          type: "p",
          text: "Country risk in Latin America is not just financial: it is structural. Poor port connectivity, weak institutions, and regulatory volatility push the cost of capital upward.",
        },
        { type: "h2", text: "Three levers for change" },
        {
          type: "p",
          text: "1) Improve sub-regional logistics integration. 2) Clear and predictable rules for foreign investment. 3) Financial cooperation mechanisms among central banks that reduce dollar dependency in trade flows.",
        },
      ],
    },
    categorySlugs: ["geopolitica", "economia"],
    tagSlugs: ["america-latina", "seguridad-internacional"],
    featured: true,
    daysAgo: 12,
  },
  {
    slug: "economia-new-space",
    title: {
      es: "Economía New Space: por qué importa para los reguladores",
      en: "New Space Economy: Why It Matters for Regulators",
    },
    excerpt: {
      es: "Una guía rápida sobre las cadenas de valor, los modelos de negocio y los riesgos sistémicos del sector espacial comercial.",
      en: "A quick guide to value chains, business models and systemic risks in the commercial space sector.",
    },
    bodyBlocks: {
      es: [
        {
          type: "p",
          text: "La economía espacial dejó de ser una curiosidad. En 2025 superó los 600 mil millones de dólares anuales en ingresos globales. Pero el grueso del valor no está en lanzadores ni satélites: está en los servicios que se construyen sobre los datos.",
        },
        {
          type: "p",
          text: "Los reguladores enfrentan un dilema: actuar tarde y perder la oportunidad de moldear el sector; o actuar pronto y arriesgarse a sofocar la innovación. La salida es regulación adaptativa, basada en principios y revisada con métricas.",
        },
      ],
      en: [
        {
          type: "p",
          text: "The space economy is no longer a curiosity. In 2025 it surpassed USD 600 billion in annual global revenue. But the bulk of value is not in launchers or satellites: it is in the services built on top of the data.",
        },
        {
          type: "p",
          text: "Regulators face a dilemma: act late and lose the chance to shape the sector; or act early and risk stifling innovation. The way out is adaptive, principle-based regulation, reviewed against metrics.",
        },
      ],
    },
    categorySlugs: ["astropolitica", "economia"],
    tagSlugs: ["new-space"],
    featured: false,
    daysAgo: 25,
  },
];

/* -------------------------------------------------------------------------- */
/*  Lógica                                                                     */
/* -------------------------------------------------------------------------- */

async function findOrCreateCategory(payload: Awaited<ReturnType<typeof getPayload>>, c: (typeof categoriesSeed)[number]) {
  const existing = await payload.find({
    collection: "categories",
    where: { slug: { equals: c.slug } },
    limit: 1,
    locale: "es",
    depth: 0,
  });
  if (existing.docs[0]) {
    console.log(`  · categoría ${c.slug} ya existe, salto.`);
    return existing.docs[0].id;
  }

  const created = await payload.create({
    collection: "categories",
    locale: "es",
    data: {
      slug: c.slug,
      name: c.name.es,
      description: c.description.es,
    },
  });
  await payload.update({
    collection: "categories",
    id: created.id,
    locale: "en",
    data: {
      name: c.name.en,
      description: c.description.en,
    },
  });
  console.log(`  ✓ categoría ${c.slug} creada.`);
  return created.id;
}

async function findOrCreateTag(payload: Awaited<ReturnType<typeof getPayload>>, t: (typeof tagsSeed)[number]) {
  const existing = await payload.find({
    collection: "tags",
    where: { slug: { equals: t.slug } },
    limit: 1,
    locale: "es",
    depth: 0,
  });
  if (existing.docs[0]) {
    console.log(`  · tag ${t.slug} ya existe, salto.`);
    return existing.docs[0].id;
  }
  const created = await payload.create({
    collection: "tags",
    locale: "es",
    data: { slug: t.slug, name: t.name.es },
  });
  await payload.update({
    collection: "tags",
    id: created.id,
    locale: "en",
    data: { name: t.name.en },
  });
  console.log(`  ✓ tag ${t.slug} creada.`);
  return created.id;
}

async function findCover(payload: Awaited<ReturnType<typeof getPayload>>) {
  const existing = await payload.find({
    collection: "media",
    limit: 1,
    depth: 0,
  });
  return existing.docs[0]?.id ?? null;
}

async function findOrCreatePost(
  payload: Awaited<ReturnType<typeof getPayload>>,
  post: PostSeed,
  ctx: { categoriesById: Record<string, string | number>; tagsById: Record<string, string | number>; coverId: string | number | null },
) {
  const existing = await payload.find({
    collection: "posts",
    where: { slug: { equals: post.slug } },
    limit: 1,
    locale: "es",
    depth: 0,
  });
  if (existing.docs[0]) {
    console.log(`  · post ${post.slug} ya existe, salto.`);
    return;
  }

  if (!ctx.coverId) {
    console.log(`  ! post ${post.slug} OMITIDO: no hay imágenes en Media para usar como cover. Sube una en ${PAYLOAD_ADMIN_ROUTE} y vuelve a correr el seed.`);
    return;
  }

  const publishedAt = new Date(Date.now() - post.daysAgo * 86_400_000).toISOString();
  const categoryIds = post.categorySlugs
    .map((s) => ctx.categoriesById[s])
    .filter((v): v is string | number => v !== undefined);
  const tagIds = post.tagSlugs
    .map((s) => ctx.tagsById[s])
    .filter((v): v is string | number => v !== undefined);

  const coverId = ctx.coverId as number;

  const created = await payload.create({
    collection: "posts",
    locale: "es",
    data: {
      slug: post.slug,
      title: post.title.es,
      excerpt: post.excerpt.es,
      cover: coverId,
      body: makeBody(post.bodyBlocks.es),
      categories: categoryIds,
      tags: tagIds,
      status: "published",
      featured: post.featured,
      publishedAt,
    },
  });

  await payload.update({
    collection: "posts",
    id: created.id,
    locale: "en",
    data: {
      title: post.title.en,
      excerpt: post.excerpt.en,
      body: makeBody(post.bodyBlocks.en),
    },
  });

  console.log(`  ✓ post ${post.slug} creado y publicado.`);
}

async function run() {
  console.log("→ Inicializando Payload…");
  const payload = await getPayload({ config });

  console.log("→ Sembrando categorías…");
  const categoriesById: Record<string, string | number> = {};
  for (const c of categoriesSeed) {
    categoriesById[c.slug] = await findOrCreateCategory(payload, c);
  }

  console.log("→ Sembrando tags…");
  const tagsById: Record<string, string | number> = {};
  for (const t of tagsSeed) {
    tagsById[t.slug] = await findOrCreateTag(payload, t);
  }

  console.log("→ Buscando una imagen de Media para usar como cover…");
  const coverId = await findCover(payload);
  if (!coverId) {
    console.log(
      `  ! No hay imágenes en ${PAYLOAD_ADMIN_ROUTE}/collections/media. Sube al menos una imagen y vuelve a correr el seed para crear los posts de muestra.`,
    );
  }

  console.log("→ Sembrando posts…");
  for (const p of postsSeed) {
    await findOrCreatePost(payload, p, { categoriesById, tagsById, coverId });
  }

  console.log("✓ Seed completado.");
  process.exit(0);
}

run().catch((err) => {
  console.error("✗ Seed falló:", err);
  process.exit(1);
});
