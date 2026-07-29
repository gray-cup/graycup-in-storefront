import type { Product } from "./types";

export const filterCoffeeProducts: Product[] = [
  {
    slug: "filter-coffee-robusta-arabica-chicory",
    name: "Filter Coffee (Robusta, Arabica & Chicory)",
    image: "/products/ground-coffee.png",
    images: ["/products/ground-coffee.png", "/products/roasted-coffee-beans.png", "/products/green-coffee-beans.png"],
    description:
      "Classic South Indian filter coffee blend of Robusta, Arabica, and chicory — strong, full-bodied, and smooth.",
    longDescription:
      "Our signature filter coffee blend combines Robusta for strength and crema, Arabica for aroma and sweetness, and roasted chicory for a smooth, mellow finish with reduced bitterness. Ground fine for traditional South Indian filter brewing, it delivers the classic strong, decoction-style cup.",
    details: [
      "Blend of Robusta, Arabica & chicory",
      "Strong, full-bodied, smooth",
      "Traditional South Indian filter grind",
      "Rich aroma, reduced bitterness",
      "Ideal for filter/decoction brewing",
    ],
    process: "Pending",
    varietal: "Pending",
    roast: "Pending",
    flavourNotes: ["Pending"],
    locations: ["Chikmagalur", "Coorg"],
    category: "Coffee",
    categoryTwo: "Blend",
    priceRange: {
      min: 550,
      max: 1799,
      unit: "",
    },
    minimumOrder: {
      quantity: 1,
      unit: "pack",
    },
    variants: [
      { name: "250g", price: 550, weightGrams: 250 },
      { name: "500g", price: 999, weightGrams: 500 },
      { name: "1kg", price: 1799, weightGrams: 1000 },
    ],
    packaging: ["250g pack", "500g pack", "1kg pack"],
    sku: "GC-COF-FLTRAC-001",
    brand: "Gray Cup",
    availability: "in_stock",
    googleProductCategory: "1868",
  },
  {
    slug: "filter-coffee-pure-arabica",
    name: "Filter Coffee (Pure Arabica)",
    image: "/products/ground-coffee.png",
    images: ["/products/ground-coffee.png", "/products/green-coffee-beans.png", "/products/koraput.webp"],
    description:
      "100% pure Arabica filter coffee, ground fine for traditional South Indian filter brewing — no chicory, no blends.",
    longDescription:
      "Our pure Arabica filter coffee is made entirely from Arabica beans, with no chicory or Robusta added. Ground fine for the traditional filter/decoction method, it produces a naturally sweet, aromatic cup with balanced acidity and none of the bitterness of chicory blends.",
    details: [
      "100% pure Arabica, no chicory",
      "Naturally sweet, aromatic cup",
      "Traditional South Indian filter grind",
      "Balanced acidity, smooth finish",
      "Ideal for filter/decoction brewing",
    ],
    process: "Pending",
    varietal: "Pending",
    roast: "Pending",
    flavourNotes: ["Pending"],
    locations: ["Chikmagalur", "Coorg"],
    category: "Coffee",
    categoryTwo: "Single Origin",
    priceRange: {
      min: 450,
      max: 1550,
      unit: "",
    },
    minimumOrder: {
      quantity: 1,
      unit: "pack",
    },
    variants: [
      { name: "250g", price: 450, weightGrams: 250 },
      { name: "500g", price: 800, weightGrams: 500 },
      { name: "1kg", price: 1550, weightGrams: 1000 },
    ],
    packaging: ["250g pack", "500g pack", "1kg pack"],
    sku: "GC-COF-FLTRPA-001",
    brand: "Gray Cup",
    availability: "in_stock",
    googleProductCategory: "1868",
  },
];
