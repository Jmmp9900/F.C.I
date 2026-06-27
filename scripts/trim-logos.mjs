import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const brandDir = path.join(root, "public", "images", "brand");
const files = ["fci-logo-es.png", "fci-logo-en.png", "fci-logo.png"];

async function trimLogo(filename) {
  const input = path.join(brandDir, filename);
  if (!fs.existsSync(input)) return;

  const trimmed = await sharp(input).trim({ threshold: 40 }).png().toBuffer();
  const meta = await sharp(trimmed).metadata();
  await fs.promises.writeFile(input, trimmed);
  console.log(`${filename}: ${meta.width}x${meta.height}`);
}

for (const file of files) {
  await trimLogo(file);
}
