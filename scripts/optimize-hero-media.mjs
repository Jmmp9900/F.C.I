/**
 * Comprime imágenes del carrusel hero (WebP) y videos .mov (MP4 H.264).
 * Uso: node scripts/optimize-hero-media.mjs
 */
import { execFile } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import ffmpegPath from "ffmpeg-static";
import sharp from "sharp";

const execFileAsync = promisify(execFile);
const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = path.join(root, "public");

const IMAGE_MAX_WIDTH = 1280;
const WEBP_QUALITY = 78;

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

async function optimizeCarouselImages() {
  const dir = path.join(publicDir, "images", "hero-carousel");
  const pngs = fs.readdirSync(dir).filter((f) => f.endsWith(".png"));
  let saved = 0;

  for (const file of pngs) {
    const input = path.join(dir, file);
    const output = path.join(dir, file.replace(/\.png$/i, ".webp"));
    const before = fs.statSync(input).size;

    await sharp(input)
      .resize({ width: IMAGE_MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY, effort: 6 })
      .toFile(output);

    const after = fs.statSync(output).size;
    saved += before - after;
    console.log(`  ${file} → ${path.basename(output)}: ${formatBytes(before)} → ${formatBytes(after)}`);
    fs.unlinkSync(input);
  }

  return saved;
}

async function optimizeVideo(inputRel, outputRel) {
  const input = path.join(publicDir, inputRel);
  const output = path.join(publicDir, outputRel);

  if (!fs.existsSync(input)) {
    console.log(`  omitido (no existe): ${inputRel}`);
    return 0;
  }

  const before = fs.statSync(input).size;

  await execFileAsync(ffmpegPath, [
    "-y",
    "-i",
    input,
    "-an",
    "-c:v",
    "libx264",
    "-crf",
    "28",
    "-preset",
    "medium",
    "-movflags",
    "+faststart",
    "-pix_fmt",
    "yuv420p",
    "-vf",
    "scale='min(1920,iw)':-2",
    output,
  ]);

  const after = fs.statSync(output).size;
  console.log(`  ${inputRel} → ${outputRel}: ${formatBytes(before)} → ${formatBytes(after)}`);
  fs.unlinkSync(input);
  return before - after;
}

async function main() {
  if (!ffmpegPath) {
    throw new Error("ffmpeg-static no encontró binario para esta plataforma.");
  }

  console.log("Optimizando imágenes del carrusel…");
  const imageSaved = await optimizeCarouselImages();

  console.log("\nOptimizando videos…");
  const videoJobs = [
    ["videos/sistema-internacional.mov", "videos/sistema-internacional.mp4"],
    ["videos/tierra-relaciones-sociales.mov", "videos/tierra-relaciones-sociales.mp4"],
    ["videos/espacio-transicion.mov", "videos/tierra-espacio.mp4"],
  ];

  let videoSaved = 0;
  for (const [input, output] of videoJobs) {
    videoSaved += await optimizeVideo(input, output);
  }

  const heroDup = path.join(publicDir, "videos", "hero-tierra-espacio.mov");
  if (fs.existsSync(heroDup)) {
    const dupSize = fs.statSync(heroDup).size;
    fs.unlinkSync(heroDup);
    videoSaved += dupSize;
    console.log(`  hero-tierra-espacio.mov eliminado (duplicado de espacio-transicion)`);
  }

  console.log(`\nAhorro total aproximado: ${formatBytes(imageSaved + videoSaved)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
