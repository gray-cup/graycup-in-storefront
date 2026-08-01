import { retailProducts, filterCoffeeProducts, type Product } from "@/data/products";

const groundCoffeeSlugs = new Set(filterCoffeeProducts.map((p) => p.slug));

export type LocationTopicSlug = "coffee-products" | "black-coffee" | "ground-coffee" | "filter-coffee";

export type LocationTopic = {
  slug: LocationTopicSlug;
  label: string;
  /** Short phrase used in on-page copy, e.g. "coffee", "black coffee" */
  copyLabel: string;
  filter: (product: Product) => boolean;
};

export const LOCATION_TOPICS: Record<LocationTopicSlug, LocationTopic> = {
  "coffee-products": {
    slug: "coffee-products",
    label: "Coffee Products",
    copyLabel: "coffee",
    filter: (p) => p.category === "Coffee",
  },
  "black-coffee": {
    slug: "black-coffee",
    label: "Black Coffee",
    copyLabel: "black coffee",
    filter: (p) => p.category === "Coffee" && (p.brewStyle === "Black" || p.brewStyle === "Both"),
  },
  "ground-coffee": {
    slug: "ground-coffee",
    label: "Ground Coffee",
    copyLabel: "ground coffee",
    filter: (p) => groundCoffeeSlugs.has(p.slug),
  },
  "filter-coffee": {
    slug: "filter-coffee",
    label: "Filter Coffee",
    copyLabel: "South Indian filter coffee",
    filter: (p) => p.slug.startsWith("filter-coffee-"),
  },
};

export const LOCATION_TOPIC_SLUGS = Object.keys(LOCATION_TOPICS) as LocationTopicSlug[];

export function getLocationTopic(slug: string): LocationTopic | undefined {
  return LOCATION_TOPICS[slug as LocationTopicSlug];
}

export function getProductsForTopic(slug: LocationTopicSlug): Product[] {
  return retailProducts.filter(LOCATION_TOPICS[slug].filter);
}
