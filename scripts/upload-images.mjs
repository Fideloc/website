/**
 * Upload product images from a local directory to Sanity.
 *
 * Usage:
 *   SANITY_API_TOKEN=sk... node scripts/upload-images.mjs /path/to/Officiel
 *
 * The local directory must mirror the Dropbox structure:
 *   MOB-M001-Table-Pliante-Multifonction/
 *     Image-1.jpg
 *     Image-2.jpeg
 *   IS-IS005-jbl-partybox-310/
 *     JBL PartyBox 310 1.png
 *     ...
 *
 * Each product is matched by its code (e.g. M001, IS005) extracted from
 * the folder name. Images are uploaded as Sanity assets and patched onto
 * the product document.
 */

import { createClient } from "@sanity/client";
import { readdir, readFile, stat } from "node:fs/promises";
import { join, extname } from "node:path";

const PROJECT_ID = process.env.PUBLIC_SANITY_PROJECT_ID || "sjagkr9a";
const DATASET = process.env.PUBLIC_SANITY_DATASET || "production";
const TOKEN = process.env.SANITY_API_TOKEN;

if (!TOKEN) {
  console.error(
    "Missing SANITY_API_TOKEN. Create one at https://www.sanity.io/manage/personal/project/sjagkr9a/api",
  );
  process.exit(1);
}

const baseDir = process.argv[2];
if (!baseDir) {
  console.error("Usage: node scripts/upload-images.mjs /path/to/Officiel");
  process.exit(1);
}

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  token: TOKEN,
  apiVersion: "2024-01-01",
  useCdn: false,
});

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"]);

/**
 * Extract the product code from a folder name.
 * Examples:
 *   "MOB-M001-Table-Pliante"  -> "M001"
 *   "IS-IS005-jbl-partybox"   -> "IS005"
 *   "VER-V003-flute-verre"    -> "V003-VER"  (VER codes overlap with VOY)
 *   "VOY-V001-chariot"        -> "V001"
 */
function extractCode(folderName) {
  // Category prefix is the first segment
  const parts = folderName.split("-");
  if (parts.length < 2) return null;

  const categoryPrefix = parts[0]; // MOB, IS, DIV, PA, GOU, KID, JAR, ER, VOY, VER

  // The code is the second segment (e.g. M001, IS005, PA001, etc.)
  const code = parts[1];
  if (!code) return null;

  // VER and VOY both use V-prefixed codes, so we disambiguate
  if (categoryPrefix === "VER") {
    return `${code}-VER`;
  }

  return code;
}

/**
 * Get MIME type from file extension.
 */
function getMimeType(filePath) {
  const ext = extname(filePath).toLowerCase();
  const mimeMap = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
  };
  return mimeMap[ext] || "application/octet-stream";
}

async function main() {
  // 1. Fetch all products from Sanity
  console.log("Fetching products from Sanity...");
  const products = await client.fetch(
    `*[_type == "product"]{ _id, code, name, "imageCount": count(images) }`,
  );
  console.log(`Found ${products.length} products in Sanity.`);

  // Build a map: code -> product
  const productByCode = new Map();
  for (const p of products) {
    if (p.code) {
      productByCode.set(p.code, p);
    }
  }

  // 2. Scan local directories
  console.log(`Scanning ${baseDir}...`);
  const entries = await readdir(baseDir);
  const folders = [];
  for (const entry of entries) {
    const fullPath = join(baseDir, entry);
    const s = await stat(fullPath);
    if (s.isDirectory()) {
      folders.push(entry);
    }
  }
  console.log(`Found ${folders.length} product folders.\n`);

  let uploaded = 0;
  let skipped = 0;
  let errors = 0;

  for (const folder of folders.sort()) {
    const code = extractCode(folder);
    if (!code) {
      console.log(`  ⏭  ${folder} — cannot extract product code, skipping`);
      skipped++;
      continue;
    }

    const product = productByCode.get(code);
    if (!product) {
      console.log(
        `  ⏭  ${folder} — no product found for code "${code}", skipping`,
      );
      skipped++;
      continue;
    }

    // Skip if product already has images
    if (product.imageCount > 0) {
      console.log(
        `  ✓  ${folder} — "${product.name}" already has ${product.imageCount} images`,
      );
      skipped++;
      continue;
    }

    // Find image files in the folder
    const folderPath = join(baseDir, folder);
    const files = await readdir(folderPath);
    const imageFiles = files
      .filter((f) => {
        const ext = extname(f).toLowerCase();
        // Handle double extensions like .jpg.webp
        if (ext === ".webp" && f.includes(".jpg.")) return true;
        return IMAGE_EXTENSIONS.has(ext);
      })
      .sort();

    if (imageFiles.length === 0) {
      console.log(`  ⏭  ${folder} — no image files found`);
      skipped++;
      continue;
    }

    console.log(
      `  📸 ${folder} — "${product.name}" — uploading ${imageFiles.length} images...`,
    );

    const imageRefs = [];

    for (const imageFile of imageFiles) {
      const filePath = join(folderPath, imageFile);
      try {
        const buffer = await readFile(filePath);
        const asset = await client.assets.upload("image", buffer, {
          filename: imageFile,
          contentType: getMimeType(filePath),
        });

        imageRefs.push({
          _type: "image",
          _key: `img${imageRefs.length}`,
          asset: {
            _type: "reference",
            _ref: asset._id,
          },
          alt: product.name,
        });

        console.log(
          `       ✓ ${imageFile} (${(buffer.length / 1024).toFixed(0)} KB)`,
        );
      } catch (err) {
        console.error(`       ✗ ${imageFile} — ${err.message}`);
        errors++;
      }
    }

    if (imageRefs.length > 0) {
      // Patch product with images
      await client.patch(product._id).set({ images: imageRefs }).commit();
      console.log(
        `       → patched "${product.name}" with ${imageRefs.length} images`,
      );
      uploaded++;
    }
  }

  console.log("\n--- Résumé ---");
  console.log(`Produits mis à jour : ${uploaded}`);
  console.log(`Ignorés             : ${skipped}`);
  console.log(`Erreurs             : ${errors}`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
