/**
 * Seed script: imports products from data/products.json into the SQLite database.
 * Run with: npx tsx scripts/seed.ts
 */
import path from "path";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import productsData from "../data/products.json";

const dbUrl = process.env.DATABASE_URL
  ? process.env.DATABASE_URL
  : `file:${path.resolve(process.cwd(), "prisma/dev.db")}`;

const adapter = new PrismaLibSql({ url: dbUrl });
const prisma = new PrismaClient({ adapter } as any);

async function main() {
  console.log("🌱 Seeding products...");

  let created = 0;
  let skipped = 0;

  for (const product of productsData) {
    const existing = await prisma.product.findUnique({
      where: { slug: product.slug },
    });

    if (existing) {
      console.log(`  ⏭  Skipping "${product.title}" (already exists)`);
      skipped++;
      continue;
    }

    await prisma.product.create({
      data: {
        slug: product.slug,
        title: product.title,
        shortDesc: product.shortDesc,
        longDesc: product.longDesc,
        price: product.price,
        category: product.category,
        tags: product.tags,
        fileFormat: product.fileFormat,
        filePath: product.filePath,
        imageUrl: product.imageUrl,
        featured: product.featured ?? false,
        active: true,
        aiGenNote: product.aiGenNote,
      },
    });

    console.log(`  ✅ Created "${product.title}"`);
    created++;
  }

  console.log(
    `\n✔ Seed complete. ${created} products created, ${skipped} skipped.`
  );
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
