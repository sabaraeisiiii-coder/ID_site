/* Integrity checks for the imported product seed and its local image mapping. */
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const seedPath = path.join(root, "apps/client/src/domains/catalog/data/products.seed.json");
const products = JSON.parse(fs.readFileSync(seedPath, "utf8"));
const storefrontSource = fs.readFileSync(path.join(root, "apps/client/src/domains/catalog/mock-data.ts"), "utf8");
const selectedCount = (storefrontSource.match(/\["selected-\d+/g) ?? []).length;
const categoryIds = new Set(products.map((product) => product.categoryId));
const ids = new Set();
const slugs = new Set();
const errors = [];

for (const product of products) {
  if (ids.has(product.id)) errors.push(`Duplicate id: ${product.id}`); else ids.add(product.id);
  if (slugs.has(product.slug)) errors.push(`Duplicate slug: ${product.slug}`); else slugs.add(product.slug);
  if (!product.categoryId || !product.images?.length) errors.push(`Incomplete product: ${product.id}`);
}

for (const app of ["client", "dashboard"]) {
  const catalogDir = path.join(root, `apps/${app}/public/images/products/catalog`);
  if (!fs.existsSync(catalogDir)) errors.push(`Missing local catalog image directory: ${app}`);
}
if (selectedCount !== 10) errors.push(`Expected 10 selected products, found ${selectedCount}.`);

if (errors.length) {
  console.error(errors.map((error) => `✖ ${error}`).join("\n"));
  process.exit(1);
}
console.log(`✓ Imported catalog valid: ${products.length} seed products across ${categoryIds.size} categories and ${selectedCount} selected products.`);
