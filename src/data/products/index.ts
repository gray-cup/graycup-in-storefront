export type { Product, ProductVariant } from "./types";

export { coffeeProducts } from "./coffee";
export { ctcTeaProducts } from "./ctc-tea";
export { looseLeafTeaProducts } from "./loose-leaf-tea";
export { instantCoffeeProducts } from "./instant-coffee";
export { dooarsAssamTeaProducts } from "./dooars-assam-tea";
export { giddapaharDarjeelingProducts } from "./giddapahar-darjeeling";
export { koraputCoffeeProducts } from "./koraput-coffee";

import { coffeeProducts } from "./coffee";
import { ctcTeaProducts } from "./ctc-tea";
import { looseLeafTeaProducts } from "./loose-leaf-tea";
import { instantCoffeeProducts } from "./instant-coffee";
import { dooarsAssamTeaProducts } from "./dooars-assam-tea";
import { giddapaharDarjeelingProducts } from "./giddapahar-darjeeling";
import { koraputCoffeeProducts } from "./koraput-coffee";
import type { Product } from "./types";

// Combined array of all products
export const products: Product[] = [
  ...dooarsAssamTeaProducts,
  ...giddapaharDarjeelingProducts,
  ...ctcTeaProducts,
  ...looseLeafTeaProducts,
  ...coffeeProducts,
  ...koraputCoffeeProducts,
  ...instantCoffeeProducts,
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
    ctcTeaProducts[0],
    looseLeafTeaProducts[0],
    coffeeProducts[0],
    instantCoffeeProducts[0],
  ];
}
