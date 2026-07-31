export type { Product, ProductVariant, CoffeeProcess, ProductQuality, BrewStyle } from "./types";
export { COFFEE_GRIND_OPTIONS } from "./types";

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
import { fundraiserProducts } from "./fundraiser";
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
  ...fundraiserProducts,
];

// Helper functions
export function getProductBySlug(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

export function getAllProductSlugs(): string[] {
  return products.map((product) => product.slug);
}

export function getProductsByCategory(category: "Tea" | "Coffee"): Product[] {
  return products.filter((product) => product.category === category);
}

export function getProductsByQuality(quality: "Speciality" | "Commercial"): Product[] {
  return products.filter((product) => product.quality === quality);
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
