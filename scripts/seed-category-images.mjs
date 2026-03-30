/**
 * Seed category images from Unsplash into Sanity.
 *
 * Usage:
 *   node scripts/seed-category-images.mjs
 */

import { createClient } from "@sanity/client";

const PROJECT_ID = process.env.PUBLIC_SANITY_PROJECT_ID || "sjagkr9a";
const DATASET = process.env.PUBLIC_SANITY_DATASET || "production";
const TOKEN = process.env.SANITY_API_TOKEN;

if (!TOKEN) {
  console.error("Missing SANITY_API_TOKEN env var.");
  process.exit(1);
}

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  token: TOKEN,
  apiVersion: "2024-01-01",
  useCdn: false,
});

const CATEGORY_IMAGES = {
  mobilier: {
    url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&h=900&fit=crop&q=80",
    alt: "Mobilier d'événement élégant",
  },
  "plein-air": {
    url: "https://images.unsplash.com/photo-1530023367847-a683933f4172?w=1200&h=900&fit=crop&q=80",
    alt: "Événement en plein air",
  },
  "image-et-son": {
    url: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&h=900&fit=crop&q=80",
    alt: "Équipement audio et son",
  },
  gourmand: {
    url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&h=900&fit=crop&q=80",
    alt: "Buffet gourmand",
  },
  divertissement: {
    url: "https://images.unsplash.com/photo-1511882150382-421056c89033?w=1200&h=900&fit=crop&q=80",
    alt: "Divertissement et jeux",
  },
  kids: {
    url: "https://images.unsplash.com/photo-1472162072942-cd5147eb3902?w=1200&h=900&fit=crop&q=80",
    alt: "Enfants qui jouent",
  },
  jardinage: {
    url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200&h=900&fit=crop&q=80",
    alt: "Jardin verdoyant",
  },
  "entretien-et-renovation": {
    url: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=1200&h=900&fit=crop&q=80",
    alt: "Outils de rénovation",
  },
  voyage: {
    url: "https://images.unsplash.com/photo-1553531384-411a247ccd73?w=1200&h=900&fit=crop&q=80",
    alt: "Valises de voyage",
  },
  "verres-et-boissons": {
    url: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=1200&h=900&fit=crop&q=80",
    alt: "Cocktails et verres",
  },
};

async function main() {
  const categories = await client.fetch(
    '*[_type == "category"]{ _id, name, "slug": slug.current, "hasImage": defined(image.asset) }'
  );

  console.log(`Found ${categories.length} categories.\n`);

  let success = 0;
  let skipped = 0;

  for (const cat of categories) {
    if (cat.hasImage) {
      console.log(`  ✓  ${cat.name} — already has an image`);
      skipped++;
      continue;
    }

    const mapping = CATEGORY_IMAGES[cat.slug];
    if (!mapping) {
      console.log(`  ⏭  ${cat.name} — no image mapped for slug "${cat.slug}"`);
      skipped++;
      continue;
    }

    try {
      console.log(`  📸 ${cat.name} — downloading from Unsplash...`);
      const res = await fetch(mapping.url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const buffer = Buffer.from(await res.arrayBuffer());
      console.log(`     downloaded ${(buffer.length / 1024).toFixed(0)} KB`);

      const asset = await client.assets.upload("image", buffer, {
        filename: `${cat.slug}.jpg`,
        contentType: "image/jpeg",
      });

      await client
        .patch(cat._id)
        .set({
          image: {
            _type: "image",
            asset: { _type: "reference", _ref: asset._id },
            alt: mapping.alt,
          },
        })
        .commit();

      console.log(`     ✓ patched "${cat.name}"\n`);
      success++;
    } catch (err) {
      console.error(`     ✗ ${cat.name} — ${err.message}\n`);
    }
  }

  console.log("--- Done ---");
  console.log(`Updated: ${success}  |  Skipped: ${skipped}`);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
