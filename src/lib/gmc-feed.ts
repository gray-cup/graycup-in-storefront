import type { Product, ProductVariant } from "@/data/products/types";

/** Products excluded from every Google Merchant Center feed and Content API sync. */
export function isFeedEligible(product: Product): boolean {
  return !product.isFundraiser && !product.isWholesale && !product.comingSoon;
}

export function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function mapFeedAvailability(availability: string): string {
  const map: Record<string, string> = {
    in_stock: "in_stock",
    out_of_stock: "out_of_stock",
    preorder: "preorder",
  };
  return map[availability] || "in_stock";
}

/** Stable, unique per-variant identifier shared as the `offerId` / `g:id` and Content API offer ID. */
export function variantOfferId(product: Product, variant: ProductVariant): string {
  const slug = variant.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return `${product.sku}-${slug}`;
}

/** Google's recommended title length limit. */
const MAX_TITLE_LENGTH = 150;

export function variantTitle(product: Product, variant: ProductVariant): string {
  const title = `${product.name} - ${variant.name}`;
  return title.length > MAX_TITLE_LENGTH ? title.slice(0, MAX_TITLE_LENGTH) : title;
}

export function additionalImageLinks(product: Product, baseUrl: string): string[] {
  const extra = (product.images || []).filter((img) => img !== product.image);
  return extra.map((img) => (img.startsWith("http") ? img : `${baseUrl}${img}`));
}

/** Formats grams as a Merchant Center weight string, e.g. "500 g" or "1 kg". */
export function formatShippingWeight(weightGrams: number): string {
  return weightGrams >= 1000 ? `${weightGrams / 1000} kg` : `${weightGrams} g`;
}

export type FeedItemData = {
  offerId: string;
  itemGroupId: string;
  title: string;
  description: string;
  link: string;
  imageLink: string;
  additionalImageLinks: string[];
  availability: string;
  price: number;
  salePrice?: number;
  brand: string;
  condition: "new";
  googleProductCategory: string;
  productType: string;
  mpn: string;
  gtin?: string;
  color?: string;
  material?: string;
  shippingWeight?: string;
};

/** Builds one feed-item record per variant of a product, sharing `itemGroupId`. */
export function buildFeedItems(product: Product, baseUrl: string): FeedItemData[] {
  const productUrl = `${baseUrl}/products/${product.slug}`;
  const imageUrl = product.image.startsWith("http") ? product.image : `${baseUrl}${product.image}`;
  const images = additionalImageLinks(product, baseUrl);
  const productType = `${product.category}${product.categoryTwo ? ` > ${product.categoryTwo}` : ""}`;

  const variants = product.variants.length > 0 ? product.variants : [{ name: "Standard", price: product.priceRange.min }];

  return variants.map((variant) => ({
    offerId: variantOfferId(product, variant),
    itemGroupId: product.sku,
    title: variantTitle(product, variant),
    description: product.description,
    link: productUrl,
    imageLink: imageUrl,
    additionalImageLinks: images,
    availability: mapFeedAvailability(product.availability),
    price: variant.price,
    salePrice: variant.salePrice && variant.salePrice < variant.price ? variant.salePrice : undefined,
    brand: product.brand,
    condition: "new",
    googleProductCategory: product.googleProductCategory,
    productType,
    mpn: product.mpn || product.sku,
    gtin: variant.gtin,
    color: product.color,
    material: product.material,
    shippingWeight: variant.weightGrams ? formatShippingWeight(variant.weightGrams) : undefined,
  }));
}
