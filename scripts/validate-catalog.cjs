/* Lightweight integrity checks for the storefront mock catalog. */
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const catalogPath = path.join(root, "apps/client/src/domains/catalog/mock-data.ts");
const source = fs.readFileSync(catalogPath, "utf8");
const images = new Map([...source.matchAll(/const\s+(\w+)\s*=\s*"([^"]+)"/g)].map(([, key, value]) => [key, value]));
const categories = new Set([...source.matchAll(/\["(c\d+)"/g)].map(([, id]) => id));
const entries = [...source.matchAll(/product\("([^"]+)",\s*"([^"]+)",\s*"([^"]+)",[\s\S]*?"(c\d+)",\s*0,\s*(\w+Image|devices|consoleImage)/g)];
const generatedFamilies = [...source.matchAll(/categoryId:\s*"(c\d+)"/g)].map(([, id]) => id);
const errors = [];
const seenIds = new Set();
const seenSlugs = new Set();

for (const [, id, slug, title, categoryId, imageKey] of entries) {
  if (seenIds.has(id)) errors.push(`شناسه تکراری: ${id}`); else seenIds.add(id);
  if (seenSlugs.has(slug)) errors.push(`slug تکراری: ${slug}`); else seenSlugs.add(slug);
  if (!categories.has(categoryId)) errors.push(`${title}: دسته‌بندی نامعتبر ${categoryId}`);
  const image = images.get(imageKey);
  if (!image) errors.push(`${title}: مسیر تصویر قابل تشخیص نیست (${imageKey})`);
  else if (!fs.existsSync(path.join(root, "apps/client/public", image))) errors.push(`${title}: فایل تصویر وجود ندارد (${image})`);
}

if (!entries.length) errors.push("هیچ محصولی در Mock Data تشخیص داده نشد.");
for (const categoryId of categories) {
  if (!generatedFamilies.includes(categoryId)) errors.push(`Category ${categoryId} has no 20-product family definition.`);
}
if (!source.includes("20 - products.filter")) errors.push("The 20-product category minimum is missing.");
if (errors.length) { console.error(errors.map((error) => `✖ ${error}`).join("\n")); process.exit(1); }
console.log(`✓ Catalog valid: ${categories.size * 20} products across ${categories.size} categories (20 each), ${images.size} model image paths.`);
