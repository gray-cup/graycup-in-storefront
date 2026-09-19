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
  FUNDRAISER_PACK_PRICE_INR,
  FUNDRAISER_PACK_WEIGHT_GRAMS,
  FUNDRAISER_PRODUCT_SLUG,
  FUNDRAISER_PACKS_NEEDED,
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
import { fundraiserProducts } from "./fundraiser";
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
