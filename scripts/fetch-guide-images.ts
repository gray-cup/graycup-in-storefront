/**
 * Downloads each article's Unsplash hero once, converts to a compact WebP, and
 * writes it to public/guides/<slug>.webp so pages serve a local, optimised image
 * instead of hotlinking Unsplash. Commit the output.
 *
 *   npx tsx scripts/fetch-guide-images.ts          # only missing files
 *   npx tsx scripts/fetch-guide-images.ts --force   # re-fetch all
 */
import { existsSync, mkdirSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { GUIDES } from "../src/data/guides";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.resolve(__dirname, "..", "public", "guides");
const WIDTH = 1200;
const FORCE = process.argv.includes("--force");

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  let done = 0;

  for (const g of GUIDES) {
    const out = path.join(OUT_DIR, `${g.slug}.webp`);
    if (existsSync(out) && !FORCE) continue;

    const src = `https://images.unsplash.com/${g.unsplash}?auto=format&fit=crop&w=1600&q=80`;
    const res = await fetch(src);
    if (!res.ok) {
      console.error(`  ! ${g.slug}: ${res.status} for ${g.unsplash}`);
      continue;
    }

    const buf = Buffer.from(await res.arrayBuffer());
    const webp = await sharp(buf)
      .resize(WIDTH, Math.round((WIDTH * 9) / 16), { fit: "cover", position: "attention" })
      .webp({ quality: 72 })
      .toBuffer();

    await writeFile(out, webp);
    console.log(`  ✓ ${g.slug}.webp (${(webp.length / 1024).toFixed(0)} KB)`);
    done++;
  }

  console.log(`Done. ${done} image(s) written to public/guides/`);
}

main();
