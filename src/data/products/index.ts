export type { Product, ProductVariant, CoffeeProcess, ProductQuality, BrewStyle } from "./types";
export { COFFEE_GRIND_OPTIONS, COFFEE_ROAST_OPTIONS } from "./types";

export { dooarsAssamTeaProducts } from "./dooars-assam-tea";
export { giddapaharDarjeelingProducts } from "./giddapahar-darjeeling";
export { koraputCoffeeProducts } from "./koraput-coffee";
export { estateCoffeeProducts } from "./estate-coffees";
export { halflongAssamCoffeeProducts } from "./halflong-assam-coffee";
export { filterCoffeeProducts } from "./filter-coffee";
export { samplePackProducts } from "./sample-packs";
export { accessoryProducts } from "./accessories";
export { wholesaleCoffeeProducts } from "./wholesale-coffee";
export {
  wholesaleGroundCoffeeProducts,
  wholesaleRoastedBeansProducts,
} from "./wholesale-coffee";
export { greenCoffeeProducts } from "./green-coffee-beans";
export {
  fundraiserProducts,
  FUNDRAISER_GOAL_INR,
  FUNDRAISER_PRODUCT_SLUG,
  FUNDRAISER_SIZES,
  FUNDRAISER_BULK_MIN_GRAMS,
  FUNDRAISER_BULK_DISCOUNT,
} from "./fundraiser";

import { dooarsAssamTeaProducts } from "./dooars-assam-tea";
import { giddapaharDarjeelingProducts } from "./giddapahar-darjeeling";
import { koraputCoffeeProducts } from "./koraput-coffee";
import { estateCoffeeProducts } from "./estate-coffees";
import { halflongAssamCoffeeProducts } from "./halflong-assam-coffee";
import { filterCoffeeProducts } from "./filter-coffee";
import { samplePackProducts } from "./sample-packs";
import { accessoryProducts } from "./accessories";
import { wholesaleCoffeeProducts } from "./wholesale-coffee";
import { greenCoffeeProducts } from "./green-coffee-beans";
import {
  fundraiserProducts,
  FUNDRAISER_SIZES,
  FUNDRAISER_BULK_MIN_GRAMS,
  FUNDRAISER_BULK_DISCOUNT,
} from "./fundraiser";
import { comingSoonCoffeeProducts } from "./coming-soon-coffees";
import type { Product } from "./types";

// Combined array of all products
export const products: Product[] = [
  ...dooarsAssamTeaProducts,
  ...giddapaharDarjeelingProducts,
  ...koraputCoffeeProducts,
  ...estateCoffeeProducts,
  ...halflongAssamCoffeeProducts,
  ...filterCoffeeProducts,
  ...samplePackProducts,
  ...accessoryProducts,
  ...wholesaleCoffeeProducts,
  ...greenCoffeeProducts,
  ...fundraiserProducts,
  ...comingSoonCoffeeProducts,
];

// Regular retail catalog - excludes wholesale bulk SKUs and fundraiser reward
// packs, which only belong on /roasted-wholesale-coffee, /green-wholesale-coffee,
// and /fundraisers respectively. Coming-soon lots have pages but aren't orderable,
// so they stay out of every catalog list (home has its own Coming Soon section).
export const retailProducts: Product[] = products.filter(
  (product) => !product.isWholesale && !product.isFundraiser && !product.comingSoon,
);

export { comingSoonCoffeeProducts };

// Helper functions
export function getProductBySlug(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

// Roasted retail coffees a fundraiser buyer can pick their pack from.
export function getFundraiserBeans(): Product[] {
  return retailProducts.filter(
    (p) =>
      p.category === "Coffee" &&
      !p.isSamplePack &&
      !p.isGreenCoffee &&
      !p.blendPricing &&
      p.availability === "in_stock",
  );
}

// A fundraiser line costs the picked coffee's regular price for that size, 5% off
// once the line is over 1kg. null = that coffee doesn't come in that size.
export function fundraiserUnitPrice(
  coffee: string | undefined,
  size: string | undefined,
  quantity: number,
): number | null {
  const v = FUNDRAISER_SIZES.includes(size ?? "")
    ? getFundraiserBeans()
        .find((b) => b.name === coffee)
        ?.variants.find((x) => x.name === size)
    : undefined;
  if (!v) return null;
  return (v.weightGrams ?? 0) * quantity > FUNDRAISER_BULK_MIN_GRAMS
    ? Math.round(v.price * (1 - FUNDRAISER_BULK_DISCOUNT))
    : v.price;
}

export function getAllProductSlugs(): string[] {
  return products.map((product) => product.slug);
}

export function getProductsByCategory(category: "Tea" | "Coffee"): Product[] {
  return retailProducts.filter((product) => product.category === category);
}

export function getProductsByQuality(quality: "Speciality" | "Commercial"): Product[] {
  return retailProducts.filter((product) => product.quality === quality);
}

// Featured products for homepage (one from each category)
export function getFeaturedProducts(): Product[] {
  return [
    dooarsAssamTeaProducts[0],
    giddapaharDarjeelingProducts[0],
    koraputCoffeeProducts[0],
    estateCoffeeProducts[0],
    filterCoffeeProducts[0],
  ];
}
