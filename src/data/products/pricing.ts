import type { Product } from "./types";

// One-off retail price revision (2026): Speciality coffee +₹70 and always ships
// free; Commercial coffee (ground coffee + coffee blends) +₹90. Applied at module
// load so every surface — product pages, cart, checkout, GMC feed, JSON-LD — reads
// the same number. Wholesale and fundraiser SKUs are untouched.
export function reviseRetailCoffeePricing(products: Product[]): Product[] {
  return products.map((p) => {
    if (p.category !== "Coffee" || p.isWholesale || p.isFundraiser) return p;
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
