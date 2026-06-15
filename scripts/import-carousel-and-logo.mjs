/**
 * Importa imágenes ES/EN del carrusel y procesa el logo (fondo transparente).
 * Uso: node scripts/import-carousel-and-logo.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = path.join(root, "public");
const sourceDir = "C:\\Users\\Roy\\OneDrive\\Desktop\\FCI\\CARRUSEL 1";

const logoCandidates = [
  path.join(root, "assets", "brand", "fci-logo-source.png"),
  path.join(
    process.env.USERPROFILE ?? "",
    ".cursor",
    "projects",
    "c-Users-Roy-Documents-PROYECTOS-sitio-institucional-sitio-institucional",
    "assets",
    "c__Users_Roy_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_WhatsApp_Image_2026-06-12_at_9.10.04_AM-3873ab14-dbe8-4bb8-a957-f184d4a927d6.png",
  ),
];

const IMAGE_MAX_WIDTH = 1280;
const WEBP_QUALITY = 78;

/** @type {Record<string, { locale: "es" | "en"; out: string }>} */
const FILE_MAP = {
  "Imagen1 - Consciencia.png": { locale: "es", out: "imagen1-consciencia.webp" },
  "Imagen2 - Educación.png": { locale: "es", out: "imagen2-educacion.webp" },
  "Imagen3 - Valores compartidos.png": {
    locale: "es",
    out: "imagen3-valores-compartidos.webp",
  },
  "Imagen4 - Ideas Políticas.png": {
    locale: "es",
    out: "imagen4-ideas-politicas.webp",
  },
  "Imagen5 Paradigmas sociales.png": {
    locale: "es",
    out: "imagen5-paradigmas-sociales.webp",
  },
  "Imagen6 - Vision Cultural.png": {
    locale: "es",
    out: "imagen6-vision-cultural.webp",
  },
  "Imagen7 - Acción y Legado.png": {
    locale: "es",
    out: "imagen7-accion-legado.webp",
  },
  "Imagen1- Awarenes.png": { locale: "en", out: "imagen1-awareness.webp" },
  "Imagen2 - Education.png": { locale: "en", out: "imagen2-education.webp" },
  "Imagen3 - Shared values.png": {
    locale: "en",
    out: "imagen3-shared-values.webp",
  },
  "Imagen4 - Political Ideas.png": {
    locale: "en",
    out: "imagen4-political-ideas.webp",
  },
  "Imagen5 - Social Paradigms.png": {
    locale: "en",
    out: "imagen5-social-paradigms.webp",
  },
  "Imagen6 - Cultural Vision.png": {
    locale: "en",
    out: "imagen6-cultural-vision.webp",
  },
  "Imagen7 - Action and Legacy.png": {
    locale: "en",
    out: "imagen7-action-legacy.webp",
  },
};

async function toWebp(input, output) {
  await sharp(input)
    .resize({ width: IMAGE_MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: WEBP_QUALITY, effort: 6 })
    .toFile(output);
}

async function removeWhiteBackground(input, output) {
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    if (r >= 245 && g >= 245 && b >= 245) {
      data[i + 3] = 0;
    }
  }

  await sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .trim()
    .png({ compressionLevel: 9 })
    .toFile(output);
}

function resolveSourceFile(name) {
  const direct = path.join(sourceDir, name);
  if (fs.existsSync(direct)) return direct;

  const normalized = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  for (const file of fs.readdirSync(sourceDir)) {
    const fileNorm = file.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (fileNorm.toLowerCase() === normalized.toLowerCase()) {
      return path.join(sourceDir, file);
    }
  }
  return null;
}

async function importCarousel() {
  for (const locale of ["es", "en"]) {
    fs.mkdirSync(path.join(publicDir, "images", "hero-carousel", locale), {
      recursive: true,
    });
  }

  for (const [fileName, { locale, out }] of Object.entries(FILE_MAP)) {
    const input = resolveSourceFile(fileName);
    if (!input) {
      console.warn(`  omitido (no encontrado): ${fileName}`);
      continue;
    }
    const output = path.join(publicDir, "images", "hero-carousel", locale, out);
    await toWebp(input, output);
    console.log(`  ${path.basename(input)} → ${locale}/${out}`);
  }
}

async function importLogo() {
  const brandDir = path.join(publicDir, "images", "brand");
  const assetsBrandDir = path.join(root, "assets", "brand");
  fs.mkdirSync(brandDir, { recursive: true });
  fs.mkdirSync(assetsBrandDir, { recursive: true });

  const input = logoCandidates.find((candidate) => fs.existsSync(candidate));
  if (!input) {
    throw new Error("No se encontró el archivo del logo.");
  }

  const archivedSource = path.join(assetsBrandDir, "fci-logo-source.png");
  if (input !== archivedSource) {
    fs.copyFileSync(input, archivedSource);
  }

  const output = path.join(brandDir, "fci-logo.png");
  await removeWhiteBackground(archivedSource, output);
  console.log(`  ${path.basename(archivedSource)} → images/brand/fci-logo.png (fondo transparente)`);
}

async function main() {
  if (!fs.existsSync(sourceDir)) {
    throw new Error(`No existe la carpeta de origen: ${sourceDir}`);
  }

  console.log("Importando carrusel ES/EN…");
  await importCarousel();

  console.log("\nProcesando logo…");
  await importLogo();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
