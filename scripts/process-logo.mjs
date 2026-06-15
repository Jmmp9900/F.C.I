import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const input = path.join(root, "assets", "brand", "fci-logo-source.png");
const output = path.join(root, "public", "images", "brand", "fci-logo.png");

if (!fs.existsSync(input)) {
  throw new Error(`No se encontró el logo original: ${input}`);
}

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

const outMeta = await sharp(output).metadata();
console.log(
  `Logo regenerado desde WhatsApp original → ${output} (${outMeta.width}x${outMeta.height}, ${fs.statSync(output).size} bytes)`,
);
