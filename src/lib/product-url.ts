import { greenCoffeeProducts } from "@/data/products/green-coffee-beans";

/** Slugs served under /green-coffee/ instead of /products/. */
const GREEN_SLUGS = new Set(greenCoffeeProducts.map((p) => p.slug));

/** Renamed products: old slug -> current slug. Old URLs 301 to the new one. */
const SLUG_ALIASES: Record<string, string> = {
  "green-coffee-attikan-washed": "aaa-attikan-estate-washed",
};

export function resolveProductSlug(slug: string): string {
  return SLUG_ALIASES[slug] ?? slug;
}

export function isGreenCoffeeSlug(slug: string): boolean {
  return GREEN_SLUGS.has(slug);
}

/** Canonical in-app path for a product. */
export function productPath(product: { slug: string }): string {
  return GREEN_SLUGS.has(product.slug)
    ? `/green-coffee/${product.slug}`
    : `/products/${product.slug}`;
}

/** Absolute canonical URL (for feeds, JSON-LD, OG tags). */
export function productUrl(product: { slug: string }, baseUrl = "https://graycup.in"): string {
  return `${baseUrl}${productPath(product)}`;
}
