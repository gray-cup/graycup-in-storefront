export type { Product, ProductVariant } from "./types";
export { COFFEE_GRIND_OPTIONS } from "./types";

export { dooarsAssamTeaProducts } from "./dooars-assam-tea";
export { giddapaharDarjeelingProducts } from "./giddapahar-darjeeling";
export { koraputCoffeeProducts } from "./koraput-coffee";
export { estateCoffeeProducts } from "./estate-coffees";
export { halflongAssamTeaProducts } from "./halflong-assam-tea";

import { dooarsAssamTeaProducts } from "./dooars-assam-tea";
import { giddapaharDarjeelingProducts } from "./giddapahar-darjeeling";
import { koraputCoffeeProducts } from "./koraput-coffee";
import { estateCoffeeProducts } from "./estate-coffees";
import { halflongAssamTeaProducts } from "./halflong-assam-tea";
import type { Product } from "./types";

// Combined array of all products
export const products: Product[] = [
  ...dooarsAssamTeaProducts,
  ...giddapaharDarjeelingProducts,
  ...koraputCoffeeProducts,
  ...estateCoffeeProducts,
  ...halflongAssamTeaProducts,
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

// Featured products for homepage (one from each category)
export function getFeaturedProducts(): Product[] {
  return [
    dooarsAssamTeaProducts[0],
    giddapaharDarjeelingProducts[0],
    koraputCoffeeProducts[0],
    estateCoffeeProducts[0],
    halflongAssamTeaProducts[0],
  ];
}
