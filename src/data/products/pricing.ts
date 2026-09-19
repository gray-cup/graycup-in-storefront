import type { Product } from "./types";

// One-off retail price revision (2026): Speciality coffee +₹70 and always ships
// free; Commercial coffee (ground coffee + coffee blends) +₹90. Applied at module
// load so every surface — product pages, cart, checkout, GMC feed, JSON-LD — reads
// the same number. Wholesale and fundraiser SKUs are untouched.
export function reviseRetailCoffeePricing(products: Product[]): Product[] {
  return products.map((p) => {
    if (p.category !== "Coffee" || p.isWholesale || p.isFundraiser || p.skipPriceRevision)
      return p;
    const bump = p.quality === "Speciality" ? 70 : 90;
    return {
      ...p,
      freeShipping: p.quality === "Speciality" ? true : p.freeShipping,
      priceRange: {
        ...p.priceRange,
        min: p.priceRange.min + bump,
        max: p.priceRange.max + bump,
      },
      variants: p.variants.map((v) => ({
        ...v,
        price: v.price + bump,
        salePrice: v.salePrice != null ? v.salePrice + bump : v.salePrice,
      })),
    };
  });
}

// Small packs cost more per kg. Only the 250g and 500g packs carry a markup.
const BLEND_PACK_MARKUP: Record<number, number> = { 250: 1.15, 500: 1.1 };

/**
 * Pack price for a ratio-priced blend: the ratio's per-kg price scaled to the
 * pack weight, with the small-pack markup applied and rounded to the nearest ₹10.
 * The 1kg pack is exactly the per-kg price.
 */
export function blendPackPrice(perKg: number, weightGrams = 1000): number {
  const base = (perKg * weightGrams) / 1000;
  const markup = BLEND_PACK_MARKUP[weightGrams];
  return markup ? Math.round((base * markup) / 10) * 10 : Math.round(base);
}
